"use client";
// TODO: fix problems with duplicate image in S3
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as generateUniqueId } from "uuid";

interface UploadableFile {
  uniqueId: string;
  originalFile: File;
  isCurrentlyUploading: boolean;
  currentUploadProgress: number;
  cloudStorageKey?: string;
  isDeletionInProgress: boolean;
  hasUploadFailed: boolean;
  temporaryPreviewUrl?: string;
}

function EnhancedFileUploadDropzone() {
  const [managedFileCollection, setManagedFileCollection] = useState<
    UploadableFile[]
  >([]);

  useEffect(() => {
    return () => {
      managedFileCollection.forEach((managedFile) => {
        if (managedFile.temporaryPreviewUrl) {
          URL.revokeObjectURL(managedFile.temporaryPreviewUrl);
        }
      });
    };
  }, [managedFileCollection]);

  const processRejectedFileUploads = useCallback(
    (rejectedFileCollection: FileRejection[]) => {
      if (rejectedFileCollection.length === 0) return;

      const exceedsFileCountLimit = rejectedFileCollection.find(
        (rejectedFileAttempt) =>
          rejectedFileAttempt.errors[0].code === "too-many-files",
      );

      const exceedsFileSizeLimit = rejectedFileCollection.find(
        (rejectedFileAttempt) =>
          rejectedFileAttempt.errors[0].code === "file-too-large",
      );

      if (exceedsFileCountLimit) {
        toast.error("Maximum of 5 files allowed per upload session.");
      }

      if (exceedsFileSizeLimit) {
        toast.error("File size exceeds the 10MB limit.");
      }
    },
    [],
  );

  const executeFileUploadToCloudStorage = async (targetFileForUpload: File) => {
    setManagedFileCollection((currentFileCollection) =>
      currentFileCollection.map((managedFile) =>
        managedFile.originalFile === targetFileForUpload
          ? { ...managedFile, isCurrentlyUploading: true }
          : managedFile,
      ),
    );

    try {
      const presignedUrlApiResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: targetFileForUpload.name,
          contentType: targetFileForUpload.type,
          size: targetFileForUpload.size,
        }),
      });

      if (!presignedUrlApiResponse.ok) {
        toast.error("Failed to obtain upload authorization");
        setManagedFileCollection((currentFileCollection) =>
          currentFileCollection.map((managedFile) =>
            managedFile.originalFile === targetFileForUpload
              ? {
                  ...managedFile,
                  isCurrentlyUploading: false,
                  currentUploadProgress: 0,
                  hasUploadFailed: true,
                }
              : managedFile,
          ),
        );
        return;
      }

      const {
        presignedUrl: authorizedUploadUrl,
        key: assignedCloudStorageKey,
      } = await presignedUrlApiResponse.json();

      await new Promise<void>((resolveUpload, rejectUpload) => {
        const httpUploadRequest = new XMLHttpRequest();

        httpUploadRequest.upload.onprogress = (uploadProgressEvent) => {
          if (uploadProgressEvent.lengthComputable) {
            const calculatedProgressPercentage =
              (uploadProgressEvent.loaded / uploadProgressEvent.total) * 100;
            setManagedFileCollection((currentFileCollection) =>
              currentFileCollection.map((managedFile) =>
                managedFile.originalFile === targetFileForUpload
                  ? {
                      ...managedFile,
                      currentUploadProgress: Math.round(
                        calculatedProgressPercentage,
                      ),
                      cloudStorageKey: assignedCloudStorageKey,
                    }
                  : managedFile,
              ),
            );
          }
        };

        httpUploadRequest.onload = () => {
          if (
            httpUploadRequest.status === 200 ||
            httpUploadRequest.status === 204
          ) {
            setManagedFileCollection((currentFileCollection) =>
              currentFileCollection.map((managedFile) =>
                managedFile.originalFile === targetFileForUpload
                  ? {
                      ...managedFile,
                      currentUploadProgress: 100,
                      isCurrentlyUploading: false,
                      hasUploadFailed: false,
                    }
                  : managedFile,
              ),
            );
            toast.success("File uploaded successfully");
            resolveUpload();
          } else {
            rejectUpload(
              new Error(
                `Upload failed with HTTP status: ${httpUploadRequest.status}`,
              ),
            );
          }
        };

        httpUploadRequest.onerror = () => {
          rejectUpload(new Error("Network error during upload"));
        };

        httpUploadRequest.open("PUT", authorizedUploadUrl);
        httpUploadRequest.setRequestHeader(
          "Content-Type",
          targetFileForUpload.type,
        );
        httpUploadRequest.send(targetFileForUpload);
      });
    } catch (uploadError) {
      console.log(uploadError);
      toast.error("Upload process encountered an error");
      setManagedFileCollection((currentFileCollection) =>
        currentFileCollection.map((managedFile) =>
          managedFile.originalFile === targetFileForUpload
            ? {
                ...managedFile,
                isCurrentlyUploading: false,
                currentUploadProgress: 0,
                hasUploadFailed: true,
              }
            : managedFile,
        ),
      );
    }
  };

  const processSuccessfulFileDrop = useCallback(
    (acceptedFileCollection: File[]) => {
      if (acceptedFileCollection.length === 0) return;

      setManagedFileCollection((currentFileCollection) => [
        ...currentFileCollection,
        ...acceptedFileCollection.map(
          (newlyDroppedFile) =>
            ({
              uniqueId: generateUniqueId(),
              originalFile: newlyDroppedFile,
              isCurrentlyUploading: false,
              currentUploadProgress: 0,
              isDeletionInProgress: false,
              hasUploadFailed: false,
              temporaryPreviewUrl: URL.createObjectURL(newlyDroppedFile),
            }) as UploadableFile,
        ),
      ]);

      acceptedFileCollection.forEach(executeFileUploadToCloudStorage);
    },
    [],
  );

  const removeFileFromManagedCollection = (targetFileId: string) => {
    setManagedFileCollection((currentFileCollection) => {
      const fileScheduledForRemoval = currentFileCollection.find(
        (managedFile) => managedFile.uniqueId === targetFileId,
      );
      if (fileScheduledForRemoval?.temporaryPreviewUrl) {
        URL.revokeObjectURL(fileScheduledForRemoval.temporaryPreviewUrl);
      }
      return currentFileCollection.filter(
        (managedFile) => managedFile.uniqueId !== targetFileId,
      );
    });
  };

  const convertBytesToReadableFormat = (totalSizeInBytes: number) => {
    if (totalSizeInBytes === 0) return "0 Bytes";

    const bytesPerKilobyte = 1024;
    const availableSizeUnits = ["Bytes", "KB", "MB", "GB"];
    const appropriateUnitIndex = Math.floor(
      Math.log(totalSizeInBytes) / Math.log(bytesPerKilobyte),
    );

    return (
      Number.parseFloat(
        (
          totalSizeInBytes / Math.pow(bytesPerKilobyte, appropriateUnitIndex)
        ).toFixed(2),
      ) +
      " " +
      availableSizeUnits[appropriateUnitIndex]
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: processSuccessfulFileDrop,
    onDropRejected: processRejectedFileUploads,
    maxFiles: 5,
    maxSize: 1024 * 1024 * 10, // 10MB
    accept: {
      "image/*": [],
    },
  });

  const getUploadStatusIcon = (managedFile: UploadableFile) => {
    if (managedFile.isCurrentlyUploading) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (managedFile.hasUploadFailed) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (managedFile.currentUploadProgress === 100) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Upload Your Files
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Drag and drop your files or click to browse
          </p>
        </div>

        <Card
          {...getRootProps()}
          className={cn(
            "group relative w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/50 transition-all duration-200 ease-in-out hover:border-muted-foreground/70",
            isDragActive && "border-green-500 bg-green-50 dark:bg-green-950/20",
          )}
        >
          <div className="flex flex-col items-center justify-center px-8 py-16">
            <div
              className={cn(
                "bg-muted/50 p-6 mb-6 rounded-full transition-all duration-300",
                isDragActive ? "" : "",
              )}
            >
              <Upload
                className={cn(
                  "text-muted-foreground h-10 w-10 transition-colors duration-300",
                  isDragActive ? "" : "",
                )}
              />
            </div>

            {isDragActive ? (
              <div className="text-center">
                <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                  Drop the files here...
                </p>
                <p className="mt-2 text-sm text-green-600/80 dark:text-green-400/80">
                  Release to upload
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Upload files
                </p>
                <p className="mb-6 text-slate-600 dark:text-slate-400">
                  Drag and drop your files here or click to browse
                </p>
                <Button variant="outline" type="button" className="">
                  Choose Files
                </Button>
              </div>
            )}

            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              Maximum 5 files • Up to 10MB each • Images only
            </p>
          </div>
          <input {...getInputProps()} />
        </Card>

        {managedFileCollection.length > 0 && (
          <div className="mt-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Files ({managedFileCollection.length})
              </h3>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {
                  managedFileCollection.filter(
                    (f) => f.currentUploadProgress === 100,
                  ).length
                }{" "}
                completed
              </div>
            </div>

            <div className="space-y-4">
              {managedFileCollection.map((managedFile) => (
                <Card
                  key={managedFile.uniqueId}
                  className={cn(
                    "group relative overflow-hidden border p-4 transition-all duration-200",
                    managedFile.hasUploadFailed
                      ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
                      : managedFile.currentUploadProgress === 100
                        ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                        : "border-slate-200 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {managedFile.temporaryPreviewUrl && (
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                          <Image
                            src={
                              managedFile.temporaryPreviewUrl ||
                              "/placeholder.svg"
                            }
                            fill
                            alt={managedFile.originalFile.name}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                          {managedFile.originalFile.name.length > 30
                            ? `${managedFile.originalFile.name.substring(0, 30)}...`
                            : managedFile.originalFile.name}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>
                            {convertBytesToReadableFormat(
                              managedFile.originalFile.size,
                            )}
                          </span>
                          {managedFile.isCurrentlyUploading && (
                            <span>• {managedFile.currentUploadProgress}%</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getUploadStatusIcon(managedFile)}

                      {managedFile.isCurrentlyUploading && (
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300 ease-out"
                            style={{
                              width: `${managedFile.currentUploadProgress}%`,
                            }}
                          />
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          removeFileFromManagedCollection(managedFile.uniqueId);
                        }}
                        className="h-8 w-8 p-0 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500"
                        disabled={managedFile.isDeletionInProgress}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {managedFile.hasUploadFailed && (
                    <div className="mt-3 flex items-center space-x-2 text-xs text-red-600 dark:text-red-400">
                      <AlertCircle className="h-3 w-3" />
                      <span>Upload failed. Please try again.</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnhancedFileUploadDropzone;

"use client";

import { createWallpaper } from "@/app/(root)/server/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tag } from "@/db/schema";
import {
  calculateFileHash,
  cn,
  uploadWallpaperFromSchema,
  type UploadWallpaperFromData,
} from "@/lib/utils";
import { UploadFile } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import TagsInput from "./tags-input";

interface FileUploadDropzoneProps {
  avalibaleTags: Tag[];
}

export default function FileUploadDropzone({
  avalibaleTags,
}: FileUploadDropzoneProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UploadWallpaperFromData>({
    resolver: zodResolver(uploadWallpaperFromSchema),
    defaultValues: {
      tags: [],
    },
  });

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        URL.revokeObjectURL(file.previewUrl);
      });
    };
  }, [files]);

  const handleRejectedFiles = useCallback((rejectedFiles: FileRejection[]) => {
    const hasLargeFile = rejectedFiles.some(
      (rejection) => rejection.errors[0]?.code === "file-too-large",
    );
    const hasTooManyFiles = rejectedFiles.some(
      (rejection) => rejection.errors[0]?.code === "too-many-files",
    );
    const hasInvalidType = rejectedFiles.some(
      (rejection) => rejection.errors[0]?.code === "file-invalid-type",
    );

    if (hasLargeFile) {
      toast.error("File size exceeds the 10MB limit.");
    }
    if (hasTooManyFiles) {
      toast.error("You can only upload one file at a time.");
    }
    if (hasInvalidType) {
      toast.error("Please upload only image files.");
    }
  }, []);

  const uploadFile = async (targetFile: File, title: string, tags: Tag[]) => {
    setFiles((prev) =>
      prev.map((f) => (f.file === targetFile ? { ...f, uploading: true } : f)),
    );

    try {
      const hash = await calculateFileHash(targetFile);
      const response = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: targetFile.name,
          contentType: targetFile.type,
          size: targetFile.size,
          hash: hash,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to get upload URL");
      }

      const data = await response.json();
      const { presignedUrl, key }: { key: string; presignedUrl: string } = data;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setFiles((prev) =>
              prev.map((f) => (f.file === targetFile ? { ...f, progress } : f)),
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFiles((prev) =>
              prev.map((f) =>
                f.file === targetFile
                  ? { ...f, uploading: false, uploaded: true, progress: 100 }
                  : f,
              ),
            );
            resolve();
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.ontimeout = () => reject(new Error("Upload timeout"));

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", targetFile.type);
        xhr.timeout = 60000;
        xhr.send(targetFile);
      });

      const wallpaper = await createWallpaper(
        {
          id: key,
          title: title,
          size: targetFile.size,
          imageUrl: `https://t3.storage.dev/wallart/${key}`,
          hashSha256: hash,
        },
        tags.map((t) => t.id),
      );

      toast.success("Wallpaper saved to database successfully!");
      return wallpaper;
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      toast.error(errorMessage);

      setFiles((prev) =>
        prev.map((f) =>
          f.file === targetFile
            ? { ...f, uploading: false, error: true, progress: 0 }
            : f,
        ),
      );
      throw error;
    }
  };

  const handleAcceptedFiles = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setFiles((prev) => {
      prev.forEach((file) => {
        URL.revokeObjectURL(file.previewUrl);
      });
      return [];
    });

    const file = acceptedFiles[0];
    const newFile: UploadFile = {
      id: uuid(),
      file,
      uploading: false,
      progress: 0,
      uploaded: false,
      error: false,
      previewUrl: URL.createObjectURL(file),
    };

    setFiles([newFile]);
  }, []);

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleAcceptedFiles,
    onDropRejected: handleRejectedFiles,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
  });

  const getStatusIcon = (file: UploadFile) => {
    if (file.uploading) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (file.error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (file.uploaded) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  const onSubmit = async (data: UploadWallpaperFromData) => {
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const filesToUpload = files.filter((file) => !file.uploaded && !file.error);

    if (filesToUpload.length === 0) {
      toast.error("No files to upload");
      return;
    }

    try {
      const uploadPromises = filesToUpload.map((file) =>
        uploadFile(file.file, data.title, data.tags),
      );

      await Promise.all(uploadPromises);
      reset();
      setFiles([]);
    } catch (error) {
      console.error("Error submitting wallpaper:", error);
      toast.error("Failed to submit wallpaper. Please try again.");
    }
  };

  const isUploading = files.some((file) => file.uploading);
  const hasFiles = files.length > 0;

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <h1 className="text-lg font-bold">Upload New Wallpaper</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-sm font-semibold">
                Title
              </Label>
              <Input
                id="title"
                type="text"
                variant="ghost"
                {...register("title")}
                placeholder="Enter wallpaper title"
                className="font-semibold"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-semibold">Tags</Label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagsInput
                    tags={avalibaleTags}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                )}
              />
              {errors.tags && (
                <p className="text-sm text-red-500">{errors.tags.message}</p>
              )}
            </div>
            <Card
              {...getRootProps()}
              className={cn(
                "cursor-pointer border-2 border-dashed transition-colors",
                isDragActive
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-muted-foreground/50 hover:border-muted-foreground/70",
              )}
            >
              <div className="flex flex-col items-center justify-center p-8">
                <div
                  className={cn(
                    "mb-4 rounded-full bg-muted/50 p-4",
                    isDragActive && "bg-green-100 dark:bg-green-900/30",
                  )}
                >
                  <Upload
                    className={cn(
                      "h-8 w-8 text-muted-foreground",
                      isDragActive && "text-green-600 dark:text-green-400",
                    )}
                  />
                </div>

                {isDragActive ? (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      Drop the files here...
                    </p>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80">
                      Release to upload
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <p className="text-lg font-semibold">Select Image</p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      Drag and drop your image here or click to browse.
                      Supported formats: JPG, PNG, WebP, GIF (max 10MB)
                    </p>
                    <Button variant="outline" type="button">
                      Choose Image
                    </Button>
                  </div>
                )}
              </div>
              <input {...getInputProps()} />
            </Card>

            {files.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Selected File</h3>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                    >
                      <div className="flex min-w-0 flex-1 items-center space-x-3">
                        <Image
                          src={file.previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {file.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.file.size)}
                          </p>
                          {file.uploading && (
                            <div className="mt-1">
                              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {file.progress}% uploaded
                              </p>
                            </div>
                          )}
                          {file.error && (
                            <p className="mt-1 text-xs text-red-500">
                              Upload failed. Please try again.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="ml-2 flex items-center space-x-2">
                        {getStatusIcon(file)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="h-8 w-8 p-0"
                          type="button"
                          disabled={file.uploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isUploading || isSubmitting || !hasFiles}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Submit Wallpaper"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

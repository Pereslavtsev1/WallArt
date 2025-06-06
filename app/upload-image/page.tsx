"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import {
  calculateFileHash,
  cn,
  WallpaperFormData,
  wallpaperFormSchema,
} from "@/lib/utils";

interface UploadFile {
  id: string;
  file: File;
  uploading: boolean;
  progress: number;
  uploaded: boolean;
  error: boolean;
  previewUrl: string;
}

interface FormErrors {
  title?: string[];
  author?: string[];
  tags?: string[];
}

export default function FileUploadDropzone() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [formData, setFormData] = useState<WallpaperFormData>({
    title: "",
    author: "",
    tags: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (hasLargeFile) {
      toast.error("File size exceeds the 10MB limit.");
    }
    if (hasTooManyFiles) {
      toast.error("You can only upload one file at a time.");
    }
  }, []);

  const uploadFile = async (targetFile: File) => {
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
        throw new Error("Failed to get upload URL");
      }

      const { presignedUrl } = await response.json();

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
            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", targetFile.type);
        xhr.send(targetFile);
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
      setFiles((prev) =>
        prev.map((f) =>
          f.file === targetFile
            ? { ...f, uploading: false, error: true, progress: 0 }
            : f,
        ),
      );
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
    accept: { "image/*": [] },
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

  const handleInputChange = (field: keyof WallpaperFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const hasFiles = files.length > 0;
    if (!hasFiles) {
      toast.error("Please select at least one image");
      return;
    }

    const result = wallpaperFormSchema.safeParse(formData);
    if (!result.success) {
      setFormErrors(result.error.flatten().fieldErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadPromises = files
        .filter((file) => !file.uploaded && !file.error)
        .map((file) => uploadFile(file.file));

      await Promise.all(uploadPromises);

      const allFilesUploaded = files.every(
        (file) => file.uploaded || file.error,
      );
      const hasFailedUploads = files.some((file) => file.error);

      if (hasFailedUploads) {
        toast.error("Some files failed to upload. Please try again.");
        return;
      }

      const { title, author, tags } = result.data;
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      console.log("Submitting wallpaper:", {
        title,
        author,
        tags: tagArray,
        files: files.filter((f) => f.uploaded),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Wallpaper submitted successfully!");

      setFormData({ title: "", author: "", tags: "" });
      setFiles([]);
      setFormErrors({});
    } catch (error) {
      console.error("Error submitting wallpaper:", error);
      toast.error("Failed to submit wallpaper. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  variant="ghost"
                  placeholder="Enter wallpaper title"
                  value={formData.title}
                  className="font-semibold"
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
                {formErrors.title && (
                  <p className="flex items-center gap-1 text-sm text-red-600">
                    {formErrors.title[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="author" className="text-sm font-semibold">
                  Author
                </Label>
                <Input
                  id="author"
                  type="text"
                  variant="ghost"
                  placeholder="Enter author name"
                  className="font-semibold"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  required
                />
                {formErrors.author && (
                  <p className="flex items-center gap-1 text-sm text-red-600">
                    {formErrors.author[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="tags" className="text-sm font-semibold">
                  Tags
                </Label>
                <Input
                  id="tags"
                  type="text"
                  variant="ghost"
                  placeholder="Enter tags separated by commas"
                  className="font-semibold"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  required
                />
                {formErrors.tags && (
                  <p className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.tags[0]}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Separate tags with commas (e.g., nature, landscape, sunset)
                </p>
              </div>
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
                    <p className="text-lg font-semibold">Select file</p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      Drag and drop your file here or click to browse. File will
                      be uploaded when you submit the form.
                    </p>
                    <Button variant="outline" type="button">
                      Choose Files
                    </Button>
                  </div>
                )}
              </div>
              <input {...getInputProps()} />
            </Card>

            {files.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Uploaded Files</h3>
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
                              <div className="h-2 w-full rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-blue-600 transition-all"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {file.progress}%
                              </p>
                            </div>
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

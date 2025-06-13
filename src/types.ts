export interface UploadFile {
  id: string;
  file: File;
  uploading: boolean;
  progress: number;
  uploaded: boolean;
  error: boolean;
  previewUrl: string;
}

export interface FormErrors {
  title?: string[];
}

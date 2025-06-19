import { getTags } from "@/app/server/actions";
import FileUploadDropzone from "@/components/general/file-dropzone";

export default async function UploadImagePage() {
  const tags = await getTags();
  return <FileUploadDropzone avalibaleTags={tags} />;
}

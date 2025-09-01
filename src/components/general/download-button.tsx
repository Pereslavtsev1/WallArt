'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { DownloadIcon } from 'lucide-react';

interface DownloadButtonProps {
  fileKey: string;
  fileName: string;
}

const DownloadButton = ({ fileKey, fileName }: DownloadButtonProps) => {
  const [loading, setLoading] = useState(false);

  async function downloadFile() {
    try {
      setLoading(true);

      const res = await fetch(`/api/s3?key=${encodeURIComponent(fileKey)}`);
      const { presignedUrl } = await res.json();
      console.log(presignedUrl);
      if (!presignedUrl) throw new Error('Failed to get URL');

      const fileRes = await fetch(presignedUrl);
      if (!fileRes.ok) throw new Error('Error downloading file');

      const blob = await fileRes.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);

      const filename = fileName || fileKey.split('/').pop() || 'file';
      link.download = filename;

      link.click();
      URL.revokeObjectURL(link.href);
      toast.success('Success', {
        description: 'File downloaded successfully.',
      });
    } catch (err) {
      console.error(err);
      toast.error('Error', {
        description: 'Failed to download file. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button className='font-semibold' onClick={downloadFile} disabled={loading}>
      <DownloadIcon />
      {loading ? 'Loading...' : 'Download'}
    </Button>
  );
};

export default DownloadButton;

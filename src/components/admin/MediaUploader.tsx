import { useCallback, useState, type DragEvent } from 'react';
import { UploadCloud, CheckCircle2, XCircle } from 'lucide-react';
import { uploadToCloudinary, isCloudinaryConfigured, type CloudinaryUploadResult } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  result?: CloudinaryUploadResult;
  error?: string;
}

export function MediaUploader({ onUploaded }: { onUploaded?: (r: CloudinaryUploadResult) => void }) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList) => {
      Array.from(files).forEach((file) => {
        const id = `${file.name}-${Date.now()}-${Math.random()}`;
        setItems((prev) => [...prev, { id, file, progress: 0, status: 'uploading' }]);

        uploadToCloudinary(file, (progress) => {
          setItems((prev) => prev.map((it) => (it.id === id ? { ...it, progress } : it)));
        })
          .then((result) => {
            setItems((prev) =>
              prev.map((it) => (it.id === id ? { ...it, status: 'done', result, progress: 100 } : it)),
            );
            onUploaded?.(result);
          })
          .catch((err: Error) => {
            setItems((prev) =>
              prev.map((it) => (it.id === id ? { ...it, status: 'error', error: err.message } : it)),
            );
          });
      });
    },
    [onUploaded],
  );

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-[18px] border border-dashed p-10 text-center transition-colors cursor-pointer',
          dragOver ? 'border-accent bg-accent/5' : 'border-border bg-white/[0.02]',
        )}
      >
        <UploadCloud size={28} className="text-secondary" />
        <p className="text-[14px] text-primary">Drag & drop photos or videos here</p>
        <p className="text-[12px] text-secondary">or click to browse</p>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </label>

      {!isCloudinaryConfigured && (
        <p className="mt-3 text-[12px] text-secondary">
          Cloudinary isn't configured — uploads will fail until you add
          <span className="font-mono-num"> VITE_CLOUDINARY_CLOUD_NAME</span> and
          <span className="font-mono-num"> VITE_CLOUDINARY_UPLOAD_PRESET</span> to
          <span className="font-mono-num"> .env</span>.
        </p>
      )}

      {items.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="glass flex items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-[13px] text-primary">{item.file.name}</p>
                  {item.status === 'done' && <CheckCircle2 size={16} className="shrink-0 text-accent" />}
                  {item.status === 'error' && <XCircle size={16} className="shrink-0 text-red-400" />}
                </div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      item.status === 'error' ? 'bg-red-400' : 'bg-accent',
                    )}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                {item.error && <p className="mt-1 text-[11px] text-red-400">{item.error}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

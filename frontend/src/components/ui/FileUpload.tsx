import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export interface FileUploadProps {
  onChange?: (url: string) => void;
  value?: string;
  label?: string;
  error?: string;
}

export function FileUpload({ onChange, value, label, error }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(value || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setIsUploading(true);
      
      // Simulate API file upload
      setTimeout(() => {
        setIsUploading(false);
        const mockUrl = `https://ecosphere-evidence.s3.amazonaws.com/proofs/${Date.now()}_${file.name}`;
        setCurrentFile(file.name);
        if (onChange) {
          onChange(mockUrl);
        }
      }, 1000);
    }
  };

  const handleRemove = () => {
    setCurrentFile(null);
    if (onChange) {
      onChange('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      
      <div className={cn(
        "border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-card text-center hover:border-primary/50 transition-colors cursor-pointer",
        { "border-red-500 hover:border-red-500": !!error }
      )}
      onClick={() => !currentFile && !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf"
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm text-muted-foreground">Uploading evidence...</span>
          </div>
        ) : currentFile ? (
          <div className="flex items-center justify-between w-full bg-secondary/30 border border-border/80 rounded-md p-3">
            <div className="flex items-center space-x-3 text-left">
              <div className="bg-emerald-500/10 text-emerald-600 p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="truncate max-w-[200px]">
                <p className="text-sm font-medium text-foreground truncate">{currentFile}</p>
                <p className="text-xs text-muted-foreground">Uploaded successfully</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 p-1 h-auto"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-primary/5 text-primary p-3 rounded-full">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">Click to upload evidence</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
export default FileUpload;

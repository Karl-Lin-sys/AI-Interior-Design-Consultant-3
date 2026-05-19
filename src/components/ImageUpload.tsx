/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { Upload, X, Camera } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  className?: string;
}

export default function ImageUpload({ onImageSelect, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl border-2 border-dashed transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center p-8",
        preview ? "border-solid border-neutral-100 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-900 group",
        isHovering ? "border-neutral-900 bg-neutral-50" : "",
        className
      )}
      onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
      onDragLeave={() => setIsHovering(false)}
      onDrop={onDrop}
      onClick={() => !preview && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileChange}
      />

      {preview ? (
        <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group">
          <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center transition-all">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                onImageSelect("");
              }}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all transform hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-neutral-100 transition-colors">
            <Camera className="w-8 h-8 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
          </div>
          <h3 className="text-xl font-medium text-neutral-900 mb-2">Upload your space</h3>
          <p className="text-sm text-neutral-400 max-w-[240px] leading-relaxed">
            Drag and drop your room photo or click to browse
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase">JPEG</span>
            <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase">PNG</span>
            <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase">HEIC</span>
          </div>
        </div>
      )}
    </div>
  );
}

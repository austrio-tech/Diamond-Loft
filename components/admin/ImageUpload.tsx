"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function handleRemove(index: number) {
    const next = images.filter((_, i) => i !== index);
    onChange(next);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = (await res.json()) as { url: string };
      onChange([...images, data.url]);
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={url + i} className="relative">
              <img
                src={url}
                alt={`Product image ${i + 1}`}
                className={`w-20 h-20 object-cover rounded border ${
                  i === 0 ? "border-gold" : "border-line"
                }`}
              />
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-gold/80 text-white rounded-b py-0.5">
                  Primary
                </span>
              )}
              <button
                type="button"
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors leading-none"
                onClick={() => handleRemove(i)}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-dashed border-line rounded text-sm text-muted hover:border-gold hover:text-gold transition-colors disabled:opacity-50 self-start"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading…" : "+ Upload Image"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

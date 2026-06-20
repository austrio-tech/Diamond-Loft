"use client";

import { useRef, useState } from "react";
import styles from "./ImageUpload.module.css";

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
    <div className={styles.container}>
      {images.length > 0 && (
        <div className={styles.thumbnails}>
          {images.map((url, i) => (
            <div key={url + i} className={styles.thumbWrap}>
              <img
                src={url}
                alt={`Product image ${i + 1}`}
                className={`${styles.thumb}${i === 0 ? ` ${styles.primary}` : ""}`}
              />
              {i === 0 && (
                <span className={styles.primaryLabel}>Primary</span>
              )}
              <button
                type="button"
                className={styles.removeBtn}
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
        className={styles.uploadBtn}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading…" : "+ Upload Image"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}

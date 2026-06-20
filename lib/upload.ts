import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const ALLOWED = ["jpg", "jpeg", "png", "webp", "gif", "avif"];

export async function saveUpload(
  file: File,
  subfolder?: string
): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  if (!ALLOWED.includes(ext)) {
    throw new Error("Unsupported file type");
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${randomUUID()}.${ext}`;
  const rel = subfolder ? `uploads/${subfolder}` : "uploads";
  const uploadDir = join(process.cwd(), "public", rel);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), buffer);
  return `/${rel}/${filename}`;
}

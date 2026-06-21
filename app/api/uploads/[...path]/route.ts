import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, normalize } from "path";

// Serve runtime-uploaded files. Next.js does NOT serve files added to /public
// after the build, so uploads are streamed through this route instead.
const ROOT = join(process.cwd(), "public", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const rel = path.join("/");

  // Block path traversal — resolved path must stay inside ROOT.
  const safe = normalize(rel);
  const file = join(ROOT, safe);
  if (!file.startsWith(ROOT) || safe.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = (safe.split(".").pop() ?? "").toLowerCase();
  const type = CONTENT_TYPES[ext];
  if (!type) return new NextResponse("Not found", { status: 404 });

  try {
    const data = await readFile(file);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

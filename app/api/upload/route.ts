import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/upload";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    const url = await saveUpload(file);
    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof Response) return err;
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

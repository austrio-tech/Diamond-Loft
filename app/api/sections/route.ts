import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const sections = await prisma.section.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(
    sections.map((s) => ({ ...s, config: JSON.parse(s.config) }))
  );
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const sections: Array<{
      id: string;
      enabled: boolean;
      sortOrder: number;
      config: unknown;
    }> = await req.json();
    await Promise.all(
      sections.map((s) =>
        prisma.section.update({
          where: { id: s.id },
          data: {
            enabled: s.enabled,
            sortOrder: s.sortOrder,
            config: JSON.stringify(s.config),
          },
        })
      )
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

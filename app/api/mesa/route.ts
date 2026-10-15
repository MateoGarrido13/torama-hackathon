import { connection } from "next/server";
import { listMesaCards } from "@/lib/connections";

export async function GET() {
  await connection();
  try {
    const tarjetas = await listMesaCards();
    return Response.json({ tarjetas }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { error: "No pudimos cargar la mesa." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

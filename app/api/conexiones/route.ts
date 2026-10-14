import { connection } from "next/server";
import { createConnection, listPublicConnections } from "@/lib/connections";

export async function GET() {
  await connection();
  return Response.json(
    { nodos: listPublicConnections() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  await connection();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Revisá los datos. La URL de LinkedIn tiene que ser válida." },
      { status: 400 },
    );
  }

  const result = createConnection(body);
  if (result.status === 201) {
    return Response.json({ nodo: result.person }, { status: 201 });
  }

  return Response.json({ error: result.error }, { status: result.status });
}

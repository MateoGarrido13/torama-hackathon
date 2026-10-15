import { connection } from "next/server";
import { createConnection, listPublicConnections } from "@/lib/connections";
import { saveErrorMessage } from "@/lib/mesa";

export async function GET() {
  await connection();
  try {
    const nodos = await listPublicConnections();
    return Response.json({ nodos }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { error: "No pudimos actualizar la red" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(request: Request) {
  await connection();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        errores: {
          linkedinUrl:
            "Usá un link https://www.linkedin.com/in/... o https://www.linkedin.com/company/...",
        },
      },
      { status: 400 },
    );
  }

  let result: Awaited<ReturnType<typeof createConnection>>;
  try {
    result = await createConnection(body);
  } catch {
    return Response.json({ error: saveErrorMessage }, { status: 500 });
  }
  if (result.status === 200) return Response.json({ confirmado: true });
  if (result.status === 201) {
    return Response.json(
      { tarjeta: result.tarjeta, publicarEnRed: result.publicarEnRed },
      { status: 201 },
    );
  }
  if (result.status === 400) return Response.json({ errores: result.errores }, { status: 400 });
  if (result.status === 409) {
    return Response.json({ error: result.error, campo: result.campo }, { status: 409 });
  }
  return Response.json({ error: saveErrorMessage }, { status: 500 });
}

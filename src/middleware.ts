import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Backend y frontend están en dominios distintos; no validamos cookies aquí.
// La protección se hará en el backend y client-side (localStorage).
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// Sin matcher: no interceptamos rutas.

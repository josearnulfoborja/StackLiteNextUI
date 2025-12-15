import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Verificar conexión a la base de datos
    await db.query('SELECT 1');
    
    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'StackLite API',
      version: '1.0.0',
      database: 'Connected',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        service: 'StackLite API',
        version: '1.0.0',
        database: 'Disconnected',
        error: 'Database connection failed',
      },
      { status: 503 }
    );
  }
}

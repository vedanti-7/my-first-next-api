import { NextResponse } from 'next/server';
import { logRepository } from '../repository/db';

// 1. GET: Fetches all logs from our database layer
export async function GET() {
  try {
    const logs = await logRepository.getAllLogs();
    return NextResponse.json({ 
      status: "Running smoothly", 
      framework: "Next.js (App Router)",
      language: "TypeScript",
      timestamp: new Date().toISOString(),
      data: logs 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

// 2. POST: Creates a new log entry in our database layer
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

    const newLog = await logRepository.createLog(body.name, body.email);
    return NextResponse.json({ success: true, log: newLog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data format or database error" }, { status: 400 });
  }
}

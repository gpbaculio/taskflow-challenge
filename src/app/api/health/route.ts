import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Simple query to test DB connection
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "Healthy", database: "Connected" });
  } catch (error: any) {
    console.error("Database Health Check Failed:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    return NextResponse.json(
      { status: "Unhealthy", error: error.message },
      { status: 500 },
    );
  }
}

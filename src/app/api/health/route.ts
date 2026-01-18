import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "NOT SET";
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":****@");

  console.log("Health Check - DB URL Format:", maskedUrl);
  console.log("Health Check - Node Env:", process.env.NODE_ENV);

  try {
    // Simple query to test DB connection
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "Healthy",
      database: "Connected",
      env: process.env.NODE_ENV,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Database Health Check Failed:", error);
    return NextResponse.json(
      {
        status: "Unhealthy",
        error: errorMsg,
        diagnostics: {
          urlFormat: maskedUrl,
          message: "Check Vercel Logs for full Prisma error details",
        },
      },
      { status: 500 },
    );
  }
}

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
  } catch (error: any) {
    console.error("Database Health Check Failed:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      maskedUrl: maskedUrl,
    });
    return NextResponse.json(
      {
        status: "Unhealthy",
        error: error.message,
        diagnostics: {
          urlFormat: maskedUrl,
          message: "Check Vercel Logs for full Prisma error details",
        },
      },
      { status: 500 },
    );
  }
}

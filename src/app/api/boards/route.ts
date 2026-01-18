import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(boards);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Prisma Error (GET /api/boards):", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, color } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const board = await prisma.board.create({
      data: {
        name,
        description,
        color,
      },
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Prisma Error (POST /api/boards):", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 },
    );
  }
}


import { prisma } from "../../../lib/prisma";



export async function GET() {
  try {
    const count = await prisma.application.count();

    return Response.json({
      success: true,
      message: "Neon database connected!",
      totalApplications: count,
    });
  } catch (error) {
    console.error("Database test failed:", error);

    return Response.json(
      {
        success: false,
        message: "Database query failed. Check the server terminal.",
      },
      { status: 500 }
    );
  }
}

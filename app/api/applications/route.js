
import { prisma } from "../../../lib/prisma";

const ALLOWED_STATUSES = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(applications);
  } catch (error) {
    console.error("Fetch applications failed:", error);
    return Response.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (
  body.status !== undefined &&
  !ALLOWED_STATUSES.includes(body.status)
) {
  return Response.json(
    { error: "Invalid application status" },
    { status: 400 }
  );
}
    if (!body.company?.trim() || !body.role?.trim()) {
      return Response.json(
        { error: "Company and role are required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        company: body.company.trim(),
        role: body.role.trim(),
        status: body.status || "Applied",
        date: body.date ? new Date(body.date) : new Date(),
        link: body.link?.trim() || null,
        notes: body.notes?.trim() || null,
        interviewDate: body.interviewDate
          ? new Date(body.interviewDate)
          : null,
      },
    });

    return Response.json(application, { status: 201 });
  } catch (error) {
    console.error("Create application failed:", error);
    return Response.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

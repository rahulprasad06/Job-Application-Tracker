
import { prisma } from "../../../../lib/prisma";

const ALLOWED_STATUSES = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];



export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
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

    const data = {};
    const allowedStatuses = [
      "Applied",
      "Interview",
      "Offer",
      "Rejected",
    ];

    if ("company" in body) {
      if (
        typeof body.company !== "string" ||
        !body.company.trim()
      ) {
        return Response.json(
          { error: "Company is required" },
          { status: 400 }
        );
      }
      data.company = body.company.trim();
    }

    if ("role" in body) {
      if (
        typeof body.role !== "string" ||
        !body.role.trim()
      ) {
        return Response.json(
          { error: "Role is required" },
          { status: 400 }
        );
      }
      data.role = body.role.trim();
    }

    if ("status" in body) {
      if (!allowedStatuses.includes(body.status)) {
        return Response.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      data.status = body.status;
    }

    if ("date" in body) {
      const parsedDate = new Date(body.date);

      if (
        typeof body.date !== "string" ||
        !body.date ||
        Number.isNaN(parsedDate.getTime())
      ) {
        return Response.json(
          { error: "Invalid application date" },
          { status: 400 }
        );
      }

      data.date = parsedDate;
    }
    
    if ("interviewDate" in body) {
      if (body.interviewDate === null || body.interviewDate === "") {
        data.interviewDate = null;
      } else {
        const parsedInterviewDate = new Date(body.interviewDate);

        if (
          typeof body.interviewDate !== "string" ||
          Number.isNaN(parsedInterviewDate.getTime())
        ) {
          return Response.json(
            { error: "Invalid interview date" },
            { status: 400 }
          );
        }

        data.interviewDate = parsedInterviewDate;
      }
    }


    if ("link" in body) {
      data.link =
        typeof body.link === "string" && body.link.trim()
          ? body.link.trim()
          : null;
    }

    if ("notes" in body) {
      data.notes =
        typeof body.notes === "string" && body.notes.trim()
          ? body.notes.trim()
          : null;
    }

    if (Object.keys(data).length === 0) {
      return Response.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    const application = await prisma.application.update({
      where: { id },
      data,
    });

    return Response.json(application);
  } catch (error) {
    console.error("Update application failed:", error);

    if (error.code === "P2025") {
      return Response.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.application.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete application failed:", error);
    return Response.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}

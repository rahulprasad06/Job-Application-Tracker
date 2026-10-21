
import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.REMINDER_EMAIL;
  const secret = process.env.REMINDER_CRON_SECRET;

if (
  !secret ||
  request.headers.get("authorization") !== `Bearer ${secret}`
) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

  if (!apiKey || !recipient) {
    return NextResponse.json(
      { error: "Missing Resend environment variables." },
      { status: 500 }
    );
  }

  try {
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "CareerTrack <onboarding@resend.dev>",
      to: [recipient],
      subject: "CareerTrack reminder test",
      html: `
        <div style="font-family: Arial, sans-serif; color: #334155;">
          <h2 style="color: #4f46e5;">CareerTrack</h2>
          <p>Your email notifications are connected successfully!</p>
          <p>CareerTrack will use email alerts to remind you about upcoming interviews and follow-ups.</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent.",
      id: data?.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to send the test email." },
      { status: 500 }
    );
  }
}

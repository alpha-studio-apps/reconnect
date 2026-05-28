import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY ?? "");
  const { email, name } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Reconnect <hello@reconnect.app>",
    to: email,
    subject: "Your 14-day practice begins.",
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 48px 32px; background: #FAFAF8; color: #1a1a1a;">
        <h1 style="font-size: 28px; font-weight: 300; margin-bottom: 8px; letter-spacing: -0.02em;">
          Welcome, ${name ?? "friend"}.
        </h1>
        <p style="font-size: 16px; line-height: 1.7; color: #555; margin-bottom: 32px;">
          Your 14-day practice is ready. There's no rush. Start when you feel ready.
        </p>
        <a
          href="${process.env.NEXT_PUBLIC_APP_URL}/day/1"
          style="display: inline-block; background: #00C896; color: #080808; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-family: system-ui, sans-serif; font-size: 15px; font-weight: 700;"
        >
          Begin day 1 →
        </a>
        <p style="margin-top: 48px; font-size: 13px; color: #aaa; font-family: system-ui, sans-serif;">
          Reconnect · A quiet practice for reconnection.
        </p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

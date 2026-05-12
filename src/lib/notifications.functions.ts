import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  bookingCode: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email().optional().nullable(),
  customerMobile: z.string().min(5).max(20),
  tripSummary: z.string().max(2000),
});

const GATEWAY = "https://connector-gateway.lovable.dev";

async function sendSms(to: string, body: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const twilioKey = process.env.TWILIO_API_KEY;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!lovableKey || !twilioKey || !from) {
    console.warn("[notifications] SMS skipped — missing Twilio config");
    return { skipped: true };
  }
  const res = await fetch(`${GATEWAY}/twilio/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": twilioKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  });
  if (!res.ok) {
    console.error("[notifications] Twilio error", res.status, await res.text());
    return { error: `Twilio ${res.status}` };
  }
  return { sent: true };
}

async function sendEmail(to: string, subject: string, html: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovableKey || !resendKey) {
    console.warn("[notifications] Email skipped — missing Resend config");
    return { skipped: true };
  }
  const res = await fetch(`${GATEWAY}/resend/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Road Mate Tours <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    console.error("[notifications] Resend error", res.status, await res.text());
    return { error: `Resend ${res.status}` };
  }
  return { sent: true };
}

export const sendBookingConfirmation = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    const smsBody = `Road Mate Tours: Hi ${data.customerName}, your booking ${data.bookingCode} is confirmed. ${data.tripSummary}`;
    const emailHtml = `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:auto;padding:24px;background:#FFFFFF;color:#2D2D2D">
        <h2 style="font-family:'Playfair Display',serif;color:#FF5733;margin:0 0 8px">Road Mate Tours</h2>
        <p>Hi ${data.customerName},</p>
        <p>Your booking <strong style="color:#FF5733">${data.bookingCode}</strong> is confirmed.</p>
        <div style="background:#FFF4F0;border:1px solid #FF5733;border-radius:8px;padding:16px;margin:16px 0;white-space:pre-wrap">${data.tripSummary}</div>
        <p>We'll notify you as soon as a driver accepts your trip.</p>
        <p style="color:#888;font-size:12px;margin-top:24px">— Road Mate Tours</p>
      </div>
    `;
    const [sms, email] = await Promise.all([
      sendSms(data.customerMobile, smsBody),
      data.customerEmail ? sendEmail(data.customerEmail, `Booking ${data.bookingCode} confirmed`, emailHtml) : Promise.resolve({ skipped: true }),
    ]);
    return { sms, email };
  });

const AssignedInput = z.object({
  customerMobile: z.string().min(5).max(20),
  customerEmail: z.string().email().optional().nullable(),
  customerName: z.string(),
  bookingCode: z.string(),
  driverName: z.string(),
  driverContact: z.string(),
});

export const sendDriverAssigned = createServerFn({ method: "POST" })
  .inputValidator((d) => AssignedInput.parse(d))
  .handler(async ({ data }) => {
    const smsBody = `Road Mate Tours: Driver ${data.driverName} (${data.driverContact}) accepted your trip ${data.bookingCode}. Safe travels!`;
    const emailHtml = `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:auto;padding:24px;background:#FFFFFF;color:#2D2D2D">
        <h2 style="font-family:'Playfair Display',serif;color:#FF5733;margin:0 0 8px">Driver assigned</h2>
        <p>Hi ${data.customerName}, great news — <strong>${data.driverName}</strong> has accepted your trip <strong style="color:#FF5733">${data.bookingCode}</strong>.</p>
        <p>You can reach them on <strong>${data.driverContact}</strong>.</p>
      </div>
    `;
    const [sms, email] = await Promise.all([
      sendSms(data.customerMobile, smsBody),
      data.customerEmail ? sendEmail(data.customerEmail, `Driver assigned for ${data.bookingCode}`, emailHtml) : Promise.resolve({ skipped: true }),
    ]);
    return { sms, email };
  });

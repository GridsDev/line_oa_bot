import { NextRequest, NextResponse } from "next/server";
import { WebhookEvent, MessageEvent, TextMessage, messagingApi, validateSignature } from "@line/bot-sdk";
import { matchReply, QUICK_REPLY_ITEMS } from "@/lib/auto-reply";

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.CHANNEL_SECRET || "",
};

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken,
});

function isTextEvent(event: WebhookEvent): event is MessageEvent & { message: TextMessage } {
  return (
    event.type === "message" &&
    (event as MessageEvent).message?.type === "text"
  );
}

// LINE Webhook verification (challenge)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const challenge = searchParams.get("challenge");
  
  if (challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  
  return NextResponse.json({ message: "OK" }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-line-signature");

    // Signature validation — HMAC-SHA256 (แก้จุดอ่อนเดิมที่เป็น no-op)
    if (!config.channelSecret) {
      // ไม่มี secret: dev ให้รันต่อได้ แต่ production ต้อง fail-closed
      if (process.env.NODE_ENV === "production") {
        console.error("CHANNEL_SECRET is not set — rejecting webhook in production");
        return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
      }
      console.warn("[line-webhook] CHANNEL_SECRET not set — signature check skipped (dev mode only)");
    } else {
      if (!signature || !validateSignature(body, config.channelSecret, signature)) {
        console.warn("[line-webhook] invalid signature — 401");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const events: WebhookEvent[] = JSON.parse(body).events || [];

    for (const event of events) {
      try {
        if (isTextEvent(event)) {
          const replyToken = event.replyToken;
          const text = event.message.text;
          const matched = matchReply(text);

          await client.replyMessage({
            replyToken,
            messages: [
              {
                type: "text",
                text: matched.reply,
                quickReply: { items: QUICK_REPLY_ITEMS },
              },
            ],
          });
        } else if (event.type === "follow") {
          const replyToken = (event as any).replyToken;
          await client.replyMessage({
            replyToken,
            messages: [
              {
                type: "text",
                text: "สวัสดีจ้า~ หนูฟ้าต้อนรับนะคะ มีอะไรให้ช่วยไหมคะ?",
              },
            ],
          });
        } else if (event.type === "join") {
          const replyToken = (event as any).replyToken;
          await client.replyMessage({
            replyToken,
            messages: [
              {
                type: "text",
                text: "สวัสดีจ้า~ หนูฟ้ามาแล้วนะคะ",
              },
            ],
          });
        }
      } catch (err) {
        console.error("Error handling event:", err);
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

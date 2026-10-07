import type { messagingApi } from "@line/bot-sdk";

export type Intent = "price" | "service" | "quote" | "portfolio" | "support" | "other";

export interface QuickReplyItem {
  type: "action";
  action: messagingApi.MessageAction;
}

export interface ReplyRule {
  intent: Intent;
  keywords: string[];
  reply: string;
}

export const QUICK_REPLY_ITEMS: QuickReplyItem[] = [
  { type: "action", action: { type: "message", label: "สอบถามราคา", text: "ขอราคาค่ะ" } },
  { type: "action", action: { type: "message", label: "ดูผลงาน", text: "ขอดูผลงานค่ะ" } },
  { type: "action", action: { type: "message", label: "บริการทั้งหมด", text: "มีบริการอะไรบ้างคะ" } },
  { type: "action", action: { type: "message", label: "ต่อเลขา", text: "ขอคุยกับเลขาค่ะ" } },
  { type: "action", action: { type: "message", label: "นัดคุยฟรี", text: "นัดคุยฟรี 30 นาทีค่ะ" } },
];

export const RULES: ReplyRule[] = [
  {
    intent: "price",
    keywords: ["ราคา", "quote", "เท่าไหร่", "ประมาณการ", "ประเมิน"],
    reply:
      "รับทราบค่ะ 🙏 ราคาขึ้นอยู่กับขอบเขตงานนะคะ เช่น เว็บไซต์บริษัท 5 หน้า เริ่มต้นที่ประมาณ 45,000 บาท (ยังไม่รวม VAT) ถ้าบอกความต้องการคร่าวๆ มาได้ Nexus ประเมินให้เป๊ะๆ เลยนะคะ ✨",
  },
  {
    intent: "service",
    keywords: ["บริการ", "ทำอะไรได้บ้าง", "รับทำ", "service"],
    reply:
      "รับงาน 3 สายหลักค่ะ 🛠 1) ทำเว็บ Next.js/TypeScript 2) ระบบอัตโนมัติ + AI (n8n, Chatbot) 3) ดูแลระบบ/เซิร์ฟเวอร์ สนใจสายไหน บอกได้เลยนะคะ Nexus ส่งรายละเอียดให้ค่ะ",
  },
  {
    intent: "portfolio",
    keywords: ["ผลงาน", "case", "ตัวอย่าง", "thoth"],
    reply:
      "ยินดีค่ะ 📁 ผลงานเด่นคือ THOTH Platform ระบบบริหารจัดการครบวงจร ดูรายละเอียดเต็มๆ ได้ที่ microtronic.biz/#work เลยนะคะ หรือจะให้ Nexus ส่งลิงก์ตัวอย่างเพิ่มก็บอกได้เลยค่ะ",
  },
  {
    intent: "support",
    keywords: ["ติดต่อ", "เลขา", "โทร", "นัด", "คุย"],
    reply:
      "รับทราบค่ะ 👩‍💼 Nexus เป็นเลขาดูแลโดยตรง สะดวกคุยทางนี้ โทร 065-541-9166 หรือจะนัดคุยฟรี 30 นาที วันไหนบอกมาได้เลยนะคะ Nexus จัดคิวให้ค่ะ",
  },
];

export const FALLBACK: ReplyRule = {
  intent: "other",
  keywords: [],
  reply:
    "รับทราบข้อความแล้วค่ะ 🙏 Nexus อ่านทุกข้อความเลย — ถ้าต้องการเร็วขึ้น เลือกจากปุ่มด้านล่างได้นะคะ",
};

export function matchReply(text: string): ReplyRule {
  const normalized = text.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))) {
      return rule;
    }
  }
  return FALLBACK;
}

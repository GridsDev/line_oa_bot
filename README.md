# LINE OA Bot (ฟ้า)

LINE Official Account Webhook สำหรับ vessuyan/Next.js App Router

## Setup

1. คัดลอก `.env.example` เป็น `.env.local`
```bash
cp .env.example .env.local
```

2. ใส่ค่า LINE Channel (จาก LINE Developers Console)
- `CHANNEL_ACCESS_TOKEN`
- `CHANNEL_SECRET`

3. ติดตั้ง dependencies
```bash
npm i
```

4. รัน dev
```bash
npm run dev
```

## Webhook URL

Deploy บน Vercel แล้วตั้ง URL ใน LINE Developers Console:
```
https://<your-vercel-domain>/api/line-webhook
```

## API Routes

- `GET /api/line-webhook` — LINE challenge verification
- `POST /api/line-webhook` — รับ events (follow/message) และตอบกลับ

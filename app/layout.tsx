import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LINE OA Bot",
  description: "LINE Official Account Bot by Nexus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}

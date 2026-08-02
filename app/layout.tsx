import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Балканы 2026 - дорожный журнал",
    description: "Одиннадцать дней на автомобиле через Сербию и Черногорию: Златибор, Проклетие, Бока и Тара.",
    openGraph: {
      title: "Между вершинами и морем",
      description: "Сербия и Черногория, 6-16 августа 2026",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "Между вершинами и морем" }],
    },
    twitter: { card: "summary_large_image", images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

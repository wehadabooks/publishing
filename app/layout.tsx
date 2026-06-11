import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "위하다 출판사 — 당신의 이야기를 세상에",
  description: "위하다는 문학과 에세이를 중심으로 진심 어린 이야기를 세상에 전하는 출판사입니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Noto+Serif+KR:wght@300;400;500&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

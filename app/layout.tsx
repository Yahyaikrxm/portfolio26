import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yahya Ikram | Portfolio",
  description: "A dark minimalist portfolio for Yahya Ikram.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
try {
  var savedTheme = window.localStorage.getItem("portfolio-theme");
  document.documentElement.dataset.theme = savedTheme === "light" ? "light" : "dark";
} catch (_) {
  document.documentElement.dataset.theme = "dark";
}
            `.trim(),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

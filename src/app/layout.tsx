import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackLite - Plataforma de Posts",
  description: "Plataforma web para compartir posts y comentarios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}

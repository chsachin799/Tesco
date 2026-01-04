import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Retail Media Creative Tool - AI-Powered Creative Builder",
    description: "Generative AI-powered creative builder empowering advertisers to create guideline-compliant, multi-format creatives.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}

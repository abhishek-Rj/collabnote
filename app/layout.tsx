import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import getServerSession from "./auth/auth";
import { SessionProvider } from "./context/session";

const googleSans = Plus_Jakarta_Sans({
    variable: "--font-google-sans",
    subsets: ["latin"],
    display: "swap",
});

const ppSupplyMono = localFont({
    src: "../public/fonts/PPSupplyMono-Regular.otf",
    variable: "--font-custom-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "CollabNote — Write Together. Everyone in Sync.",
    description:
        "An editorial, real-time collaborative writing application built with CRDT state synchronization, pixel geometry aesthetics, and minimal noise.",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();
    return (
        <html
            lang="en"
            className={`${googleSans.variable} ${ppSupplyMono.variable} h-full antialiased dark`}
        >
            <body className="min-h-full flex flex-col bg-[#121212] text-[#F5F5F5] selection:bg-[#F97316] selection:text-white">
                <SessionProvider session={session}>{children}</SessionProvider>
            </body>
        </html>
    );
}

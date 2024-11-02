import type { Metadata } from "next";
import ClerkProviderContext from "@/context/ClerkProvider";

import { Inter } from "next/font/google";
import { GeistSans } from 'geist/font/sans';
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Link Scribe",
    description: "HomePage",
};

export default function WebVviewLayout({ children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en" className={inter.className}>
            <body className="dark" id="app">
                {children}
            </body>
        </html>
    );
}

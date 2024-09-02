import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "./components/Navbar";

export const metadata: Metadata = {
    title: "Blackdream",
    description: "HomePage",
};

export default function RootLayout({ children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en">
            <body id="app">
                <Navbar/>
                {children}
            </body>
        </html>
    );
}

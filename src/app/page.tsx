"use client"

import { useEffect } from "react";
import { getSections } from "./actions/action";
import Webview from "./(pages)/web/Webview";

export const dynamic = 'force-dynamic';

export default function HomePage()
{
    return (
        <div className='dark:bg-black min-h-screen max-h-auto no-scrollbar overflow-y-auto'>
            <Webview/>
        </div>
    )
}

"use client"

import { useEffect } from "react";
import { getSections } from "./actions/action";

export const dynamic = 'force-dynamic';

export default function HomePage()
{
    return (
        <div className='dark:bg-black min-h-screen max-h-auto no-scrollbar overflow-y-auto'>
            <h1 className="text-center text-4xl mt-10">CRUD</h1>
        </div>
    )
}

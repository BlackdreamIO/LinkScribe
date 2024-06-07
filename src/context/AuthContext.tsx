'use client'

import { SessionProvider } from 'next-auth/react';
import { getSession } from 'next-auth/react';

export default async function AuthProvider({ children }: {
    children: React.ReactNode
}) {
    const session = await getSession();

    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}
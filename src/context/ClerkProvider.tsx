import { ClerkProvider } from '@clerk/nextjs';

export default function ClerkProviderContext({ children, } : { children: React.ReactNode }) 
{
    return (
        <ClerkProvider>
            {children}
        </ClerkProvider>
    )
  }
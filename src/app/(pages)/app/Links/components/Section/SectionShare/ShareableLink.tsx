"use client"

import { useSectionContext } from "@/context/SectionContextProvider";
import { useCopyToClipboard } from "@/hook/useCopyToClipboard";
import { Box } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import { Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ShareableLink = () => {

    // tmeperory
    const [defined, setDefinedLink] = useState("https://linkscribe/share?id=2a3e90c3-fa21-4bde-b919-35c17e92de2c?from=mdh560354@gmail.com");

    const { user, isSignedIn } = useUser();
    const { currentSection } = useSectionContext();
    const [ CopyToClipboard ] = useCopyToClipboard();


    const BuildURL = async () => {
        if(user && user?.primaryEmailAddress && user.primaryEmailAddress?.emailAddress) {
            const baseUrl = window.location.origin;
            setDefinedLink(`${baseUrl}/share?id=${currentSection.id}?from=${user.primaryEmailAddress.emailAddress}`);
        }
    }

    useEffect(() => {
        BuildURL();
    }, [user, currentSection, isSignedIn])
    

    if(!isSignedIn) {
        return <></>;
    }

    return (
        <Box className="w-full p-4 dark:bg-theme-bgFourth rounded-lg border border-neutral-700 flex flex-row items-center justify-between">
            <Link
                href={"#"}
                className="text-theme-textLink border-b border-spacing-y-4 border-transparent hover:border-theme-borderNavigation">
                    {defined}
            </Link>
            <Copy className="cursor-pointer" onClick={() => CopyToClipboard(defined)} />
        </Box>
    )
}

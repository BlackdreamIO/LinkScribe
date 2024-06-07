"use client"

import { useState } from "react";
import { useUser, useClerk, useSignIn } from "@clerk/nextjs";
import { CircleUserRound, LogOut, Moon, SunMoon, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Box } from "@chakra-ui/react";

export const FooterList = () => {

    const [currentTheme, setCurrentTheme] = useState<"DARK" | "LIGHT">('DARK');

    const { openUserProfile, signOut, openSignIn } = useClerk();
    const { isSignedIn, user } = useUser();

    const handleAccountProfile = () => {
        openUserProfile();
    }

    const handleSignIn = () => {
        openSignIn({
            forceRedirectUrl : `${window.location.origin}/app/Links`
        });
    }

    const handleSignOut = () => {
        signOut({
            redirectUrl : `${window.location.origin}/app/Links`
        });
    }

    const buttonStyle = `w-full text-neutral-500 text-sm hover:text-white hover:bg-theme-bgThird/20 flex flex-row items-center justify-start h-14 gap-4 cursor-default !ring-0 focus-visible:!outline-blue-500`;
    
    return (
        <Box className="w-full flex flex-col items-start justify-center gap-2 px-4 py-4">
            {
                isSignedIn ? 
                    <>
                        <Button variant={'ghost'} className={buttonStyle} onClick={handleAccountProfile}>
                            <CircleUserRound className="text-theme-textSecondary"/>
                            Account Profile
                        </Button>
                        <Button variant={'ghost'} className={buttonStyle} onClick={handleSignOut}>
                            <LogOut className="text-theme-textSecondary"/>
                            Log Out
                        </Button>
                    </>
                :
                <>
                    <Button variant={'ghost'} className={buttonStyle} onClick={handleSignIn}>
                        <UserPlus className="text-theme-textSecondary"/>
                        Sign In
                    </Button>
                </>
            }
            <DropdownMenu>
                <DropdownMenuTrigger className={`${buttonStyle} px-4 !ring-0 !outline-none !border-none rounded-lg`}>
                    <Moon className="text-theme-textSecondary"/>
                    Theme {`(${currentTheme})`}
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" className="bg-theme-bgSecondary border border-neutral-700 w-[250px] ml-5 flex flex-col gap-2">
                    <DropdownMenuItem 
                        onClick={() => setCurrentTheme("DARK")}
                        className={`flex flex-row items-center gap-2 bg-black outline-none h-10 text-sm`}> 
                            <Moon /> 
                            Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => setCurrentTheme("LIGHT")}
                        className={`flex flex-row items-center gap-2 bg-black outline-none h-10 text-sm`}> 
                            <SunMoon /> 
                            Light
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Box>
    )
}

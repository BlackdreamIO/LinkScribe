"use client"

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import useTheme from "@/hook/useTheme";

import { LogOut, Moon, SunMoon, UserPlus } from "lucide-react";

import { Box } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const FooterList = ({ minimizeMode } : { minimizeMode : boolean }) => {

    const [currentTheme, setCurrentTheme] = useState<"DARK" | "LIGHT">('DARK');
    const [theme, setTheme] = useTheme()

    const { signOut, openSignIn } = useClerk();
    const { isSignedIn, isLoaded } = useUser();

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

    const buttonStyle = `w-full dark:text-neutral-500 text-md dark:hover:text-white dark:hover:bg-theme-bgThird/20 
        flex flex-row items-center gap-4 cursor-default !ring-0 focus-visible:!outline-blue-500
        ${minimizeMode ? "h-8" : "h-14"}
        ${minimizeMode ? "justify-center" : "justify-start"}`;
    
    return (
        <Box className="w-full flex flex-col items-start justify-center gap-2 px-4 py-4">
            {
                isSignedIn ? 
                    <>
                        <Button variant={'ghost'} className={buttonStyle} onClick={handleSignOut}>
                            <LogOut className="text-theme-textSecondary"/>
                            {!minimizeMode && "Log Out"}
                        </Button>
                    </>
                :
                <>
                    <Button disabled={!isLoaded} variant={'ghost'} className={buttonStyle} onClick={handleSignIn}>
                        <UserPlus className="text-theme-textSecondary"/>
                        {!minimizeMode && "Sign In"}
                    </Button>
                </>
            }
            <DropdownMenu>
                <DropdownMenuTrigger 
                    className={`${buttonStyle} 
                        dark:text-neutral-500 text-sm dark:hover:text-white dark:hover:bg-theme-bgThird/20 
                        hover:bg-neutral-100 px-4 !ring-0 !outline-none !border-none rounded-lg transition-all duration-150
                    `}>
                    <Moon className="text-theme-textSecondary"/>
                    {!minimizeMode && `Theme (${currentTheme})`}
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" className="dark:bg-theme-bgSecondary !bg-opacity-60 backdrop-filter !backdrop-blur-sm py-2 border-2 dark:border-neutral-700 w-[250px] ml-5 flex flex-col gap-2">
                    <DropdownMenuItem 
                        onClick={() => setTheme("dark")}
                        className={`flex flex-row items-center gap-2 dark:bg-theme-bgSecondary dark:hover:bg-theme-bgFifth !bg-opacity-60 backdrop-filter !backdrop-blur-sm outline-none h-10 text-sm`}> 
                            <Moon /> 
                            Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => setTheme("light")}
                        className={`flex flex-row items-center gap-2 dark:bg-theme-bgSecondary dark:hover:bg-theme-bgFifth !bg-opacity-60 backdrop-filter !backdrop-blur-sm outline-none h-10 text-sm`}> 
                            <SunMoon /> 
                            Light
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Box>
    )
}

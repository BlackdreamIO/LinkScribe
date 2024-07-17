"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { PanelRightOpen, StepBack } from "lucide-react";
import { Box, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

import { Account } from "./Account";
import { ListItems } from "./ListItems";
import { FooterList } from "./FooterList";
import { useWindowResize } from "@/hook/useWindowResize";
import { KeyboardNavigationProvider } from "@/context/KeyboardNavigationContext";
import { useKeyPress } from "@/hook/useKeyPress";
import { useSettingContext } from "@/context/SettingContextProvider";

const varients = {
    show : {
        left : 0
    },
    minimize : {
        left : '-24rem'
    }
}

export const Sidebar = () => {

    const [computerMinimize, setComputerMinimize] = useState(false);
    const [mobileMinimize, seMobiletMinimize] = useState(false);

    const { keyboardShortcutStatus, sidebarDefaultOpen } = useSettingContext()!;

    useWindowResize({
        thresholdWidth : 1024, //px
        onTriggerEnter() {
            setComputerMinimize(false);
        },
        onTriggerOut() {
            if(mobileMinimize) {
                seMobiletMinimize(false);
            }
        }
    })

    useKeyPress({
        caseSensitive : false,
        preventElementFocus : true,
        mode : "Multi Key",
        enable : keyboardShortcutStatus == "Full Controll",
        key : ['Control', "Shift", "l"],
        preventDefault : true,
        callback() {
            setComputerMinimize(!computerMinimize);
        },
    })

    useEffect(() => {
        if (!mobileMinimize) {
            setComputerMinimize(sidebarDefaultOpen);
        }
    }, [mobileMinimize, sidebarDefaultOpen]);    
    
    
    return (
        <Box onContextMenu={(e) => e.preventDefault()} className={`relative dark:bg-theme-bgSecondary duration-150 max-lg:absolute z-20 transition-all group
            ${mobileMinimize ? 'w-[0vw]' : computerMinimize ? 'w-20' : 'w-[18vw]'} select-none`}
        >
            <Box as={motion.div} variants={varients} animate={mobileMinimize ? "minimize" : "show"} className="relative">
                <Box className={`dark:bg-theme-bgSecondary min-h-screen max-h-auto flex flex-col justify-between max-lg:absolute max-lg:left-1`}>
                    <VStack className="w-full py-4 px-4 space-y-8">
                        <Account minimizeMode={computerMinimize} />
                        <KeyboardNavigationProvider>
                            <ListItems minimizeMode={computerMinimize} />
                        </KeyboardNavigationProvider>
                    </VStack>
                    <KeyboardNavigationProvider>
                        <FooterList minimizeMode={computerMinimize} />
                    </KeyboardNavigationProvider>
                </Box>
            </Box>
            <Button 
                onClick={() => seMobiletMinimize(!mobileMinimize)}
                className="max-lg:flex hidden fixed top-1/2 -left-4 transform -translate-y-1/2 !bg-theme-textSecondary backdrop-filter backdrop-blur-md !bg-opacity-90 !text-black py-2 px-4 rounded-lg rotate-180 items-center justify-center">
                <StepBack />
            </Button>
            <Button 
                onClick={() => setComputerMinimize(!computerMinimize)}
                className="max-lg:hidden max-lg:group-hover:hidden group-hover:flex hidden absolute top-1/2 -right-4 transform -translate-y-1/2 dark:bg-theme-bgSecondary dark:text-neutral-500 dark:hover:text-white py-2 px-2 rounded-full rotate-180 items-center justify-center">
                <PanelRightOpen />
            </Button>
        </Box>
    )
}

"use client"

import { useState } from "react";
import { motion } from "framer-motion";

import { StepBack } from "lucide-react";
import { Box, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

import { Account } from "./Account";
import { ListItems } from "./ListItems";
import { FooterList } from "./FooterList";
import { useWindowResize } from "@/hook/useWindowResize";

const varients = {
    show : {
        left : 0
    },
    minimize : {
        left : '-24rem'
    }
}

export const Sidebar = () => {

    const [minimize, setMinimize] = useState(false);

    useWindowResize({
        thresholdWidth : 1024, //px
        onTriggerEnter() {
            
        },
        onTriggerOut() {
            if(minimize) {
                setMinimize(false);
            }
        }
    })
    

    return (
        <Box className={`relative dark:bg-theme-bgSecondary ${minimize ? 'w-[0vw]' : 'w-[18vw]'} transition-all duration-150 max-lg:absolute z-20`}>
            <Box as={motion.div} variants={varients} animate={minimize ? "minimize" : "show"} className="relative">
                <Box className="dark:bg-theme-bgSecondary min-w-[18vw] min-h-screen max-h-auto flex flex-col justify-between max-lg:absolute max-lg:left-1">
                    <VStack className="w-full py-4 px-4 space-y-8">
                        <Account />
                        <ListItems/>
                    </VStack>
                    <FooterList />
                </Box>
            </Box>
            <Button 
                onClick={() => setMinimize(!minimize)}
                className="max-lg:flex hidden fixed top-1/2 -left-4 transform -translate-y-1/2 !bg-theme-textSecondary backdrop-filter backdrop-blur-md !bg-opacity-90 !text-black py-2 px-4 rounded-lg rotate-180 items-center justify-center">
                <StepBack />
            </Button>
        </Box>
    )
}

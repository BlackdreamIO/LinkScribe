'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Box, HStack, Text } from "@chakra-ui/react";

import { SectionHeader } from "./SectionHeader";
import { LinkComponent } from "../Link/Link";
import { useSectionContext } from "@/context/SectionContextProvider";

export const Section = () => {

    const [minimize, setMinimize] = useState(false);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const { highlightContexts } = useSectionContext()!;

    return (
        <Box className={`w-full dark:bg-theme-bgFifth border-2 ${contextMenuOpen && !highlightContexts ? "border-indigo-400" : highlightContexts ? "border-white" : ""} rounded-2xl flex flex-col justify-center space-y-4 transition-all duration-300`}>
            
            <SectionHeader
                linkCount={0}
                isMinimzied={minimize}

                onContextMenu={(v) => setContextMenuOpen(v)}
                onMinimize={() => setMinimize(!minimize)}
                onRename={() => {}}
                onDelete={() => {}}
            />
            {
                !minimize && (
                    <motion.div className="w-full p-2 overflow-hidden transition-all duration-200 flex flex-col items-center justify-center space-y-4 select-none">
                        <LinkComponent/>
                        <LinkComponent/>
                    </motion.div>
                )
            }
        </Box>
    )
}

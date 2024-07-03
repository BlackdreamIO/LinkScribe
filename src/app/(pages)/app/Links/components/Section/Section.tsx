'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Box, HStack, Text } from "@chakra-ui/react";

import { SectionHeader } from "./SectionHeader";
import { LinkComponent } from "../Link/Link";
import { useSectionContext } from "@/context/SectionContextProvider";
import { SectionScheme } from "@/scheme/Section";
import { useSectionController } from "@/context/SectionControllerProviders";

export const Section = ({ currrentSection } : {currrentSection : SectionScheme}) => {

    const { id, links, title, totalLinksCount, created_at } = currrentSection;

    const [minimize, setMinimize] = useState(false);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);

    const { highlightContexts } = useSectionContext()!;
    const { UpdateSection } = useSectionController()!;

    return (
        <Box className={`w-full dark:bg-theme-bgFifth border-2 ${contextMenuOpen && !highlightContexts ? "border-indigo-400" : highlightContexts ? "border-white" : ""} rounded-2xl flex flex-col justify-center space-y-4 transition-all duration-300`}>
            
            <SectionHeader
                sectionTitle={title}
                linkCount={0}
                isMinimzied={minimize}

                onContextMenu={(v) => setContextMenuOpen(v)}
                onMinimize={() => setMinimize(!minimize)}
                onRename={(newTitle) => {
                    UpdateSection({ 
                        currentSection : currrentSection, 
                        updatedSection : {
                            id : id, 
                            links : links, 
                            created_at : created_at, 
                            totalLinksCount : totalLinksCount, 
                            title : newTitle
                        }
                    })}}
                onDelete={() => {}}
            />
            {
                !minimize && (
                    <motion.div className="w-full p-2 overflow-hidden transition-all duration-200 flex flex-col items-center justify-center space-y-4 select-none">
                        {
                            (links ?? []).map((link, i) => (
                                <LinkComponent key={i}/>
                            ))
                        }
                    </motion.div>
                )
            }
        </Box>
    )
}

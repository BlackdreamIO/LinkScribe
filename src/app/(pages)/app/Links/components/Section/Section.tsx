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

    const [minimize, setMinimize] = useState(true);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);

    const { highlightContexts, collapseContexts } = useSectionContext()!;
    const { UpdateSection, DeleteSections } = useSectionController()!;

    useEffect(() => {
        setMinimize(collapseContexts);
    }, [collapseContexts])

    return (
        <Box className={`w-full dark:bg-theme-bgFourth border-[2px] rounded-2xl flex flex-col justify-center space-y-4 transition-all duration-300
            ${contextMenuOpen && !highlightContexts ? "border-indigo-300" : highlightContexts ? "border-white" : "dark:border-neutral-900"}
            ${highlightContexts ? "pointer-events-none" : "pointer-events-auto"}`}
        >
            
            <SectionHeader
                sectionTitle={title}
                linkCount={links?.length || 0}
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
                onDelete={() => DeleteSections(id)}
            />
            {
                !minimize && (
                    <motion.div className="w-full p-2 overflow-hidden transition-all duration-200 flex flex-col items-center justify-center space-y-4 select-none">
                        {
                            (links ?? []).length > 0 ? (
                                links ?? []).map((link, i) => (
                                    <LinkComponent key={i}/>
                                )
                            )
                            : (
                                <Text className="text-lg text-center mb-4">EMPTY</Text>
                            )
                        }
                    </motion.div>
                )
            }
        </Box>
    )
}

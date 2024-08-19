'use client'

import { useState, useEffect } from "react";
import { SectionScheme } from "@/scheme/Section";

import { useSettingContext } from "@/context/SettingContextProvider";
import { useSectionContext } from "@/context/SectionContextProvider";

import { Box } from "@chakra-ui/react";

import { ConditionalRender } from "@/components/ui/conditionalRender";

import { SectionHeader } from "./SectionHeader";
import { LinksLayout } from "../Link/LinksLayout";
import ErrorManager from "../../../components/ErrorHandler/ErrorManager";

export const Section = ({ currentSection } : {currentSection : SectionScheme}) => {

    const { id, links } = currentSection;

    const [minimize, setMinimize] = useState(false);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);

    const { highlightContexts, setCurrentSection } = useSectionContext();
    const { showLinkCount, sectionsDefaultOpen } = useSettingContext();

    useEffect(() => {
        setCurrentSection(currentSection)
    }, [currentSection])
    

    // dark:bg-theme-bgFourth
    return (
        <Box onContextMenu={(e) => e.preventDefault()}  id="section-element" className={`w-full dark:bg-theme-bgFourth bg-white border-[2px] rounded-2xl flex flex-col justify-center space-y-4 transition-all duration-300
            ${contextMenuOpen && !highlightContexts ? "border-indigo-300" : highlightContexts ? "dark:border-white border-black " : "dark:border-neutral-900 "}
            ${highlightContexts ? "pointer-events-none" : "pointer-events-auto"} dark:shadow-none shadow-sm shadow-black`}
        >  

            <ErrorManager>
                <SectionHeader
                    section={currentSection}
                    showLinkCount={showLinkCount}
                    isMinimzied={minimize}
                    onContextMenu={(v) => setContextMenuOpen(v)}
                    onMinimize={() => setMinimize(!minimize)}
                />
            </ErrorManager>

            <ConditionalRender render={!minimize}>
                <ErrorManager>
                    <LinksLayout id={id} links={links} layout={currentSection.links_layout} />
                </ErrorManager>
            </ConditionalRender>
        </Box>
    )
}

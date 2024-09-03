'use client'

import { useState, useEffect, memo } from "react";
import { SectionScheme } from "@/scheme/Section";

import { useSettingContext } from "@/context/SettingContextProvider";
import { useSectionContext } from "@/context/SectionContextProvider";
import { useSectionContainerContext } from "@/context/SectionContainerContext";

import { Box } from "@chakra-ui/react";

import { ConditionalRender } from "@/components/ui/conditionalRender";

import { SectionHeader } from "./SectionHeader";
import { LinksLayout } from "../Link/LinksLayout";
import ErrorManager from "../../../components/ErrorHandler/ErrorManager";

const NonMemSection = ({ section } : {section : SectionScheme}) => {

    const [minimize, setMinimize] = useState(section.minimized || false);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);

    const { setCurrentSection, currentSection, setOriginalSection } = useSectionContext();
    const { sectionHighlighted } = useSectionContainerContext();
    const { showLinkCount, sectionsDefaultOpen } = useSettingContext();

    useEffect(() => {
        if(currentSection !== section) {
            setCurrentSection(section);
            setOriginalSection(section);
        }
    }, [section])
    

    // dark:bg-theme-bgFourth
    return (
        <Box onContextMenu={(e) => e.preventDefault()}  id="section" className={`w-full dark:bg-theme-bgFourth bg-white border-[2px] rounded-2xl flex flex-col justify-center space-y-4 transition-all duration-300
            ${contextMenuOpen && !sectionHighlighted ? "border-indigo-300" : sectionHighlighted ? "dark:border-white border-black " : "dark:border-neutral-900 "}
            ${sectionHighlighted ? "pointer-events-none" : "pointer-events-auto"} dark:shadow-none shadow-sm shadow-black`}
        >  

            <ErrorManager>
                <SectionHeader
                    section={section}
                    showLinkCount={showLinkCount}
                    isMinimzied={minimize}
                    onContextMenu={(v) => setContextMenuOpen(v)}
                    onMinimize={() => setMinimize(!minimize)}
                />
            </ErrorManager>

            <ConditionalRender render={!minimize}>
                <ErrorManager>
                    <LinksLayout id={currentSection.id} links={currentSection.links} layout={section.links_layout} />
                </ErrorManager>
            </ConditionalRender>
        </Box>
    )
}


export const Section = memo(NonMemSection, (prevProps, nextProps) => {
    return (
        prevProps.section === nextProps.section
    );
});
'use client'

import { useState, useEffect } from "react";
import { SectionScheme } from "@/scheme/Section";
import { LinkLayout } from "@/scheme/Link";
import dynamic from 'next/dynamic';

import { useSectionController } from "@/context/SectionControllerProviders";
import { useSectionContext } from "@/context/SectionContextProvider";
import { useLinkController } from "@/context/LinkControllerProviders";
import { useSettingContext } from "@/context/SettingContextProvider";

import { Box } from "@chakra-ui/react";

import { ConditionalRender } from "@/components/ui/conditionalRender";

import { SectionHeader } from "./SectionHeader";
import { LinksLayout } from "../Link/LinksLayout";
import ErrorManager from "../../../components/ErrorHandler/ErrorManager";

export const Section = ({ currentSection } : {currentSection : SectionScheme}) => {

    const { id, links, title, totalLinksCount, created_at, _deleted, linksLayout, section_ref, selfLayout } = currentSection;

    const [layout, setLayout] = useState<LinkLayout>({ layout : "Grid Detailed", size : 1 });

    const [minimize, setMinimize] = useState(true);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);

    const { CreateLink } = useLinkController()!;
    const { UpdateSection, DeleteSections } = useSectionController()!;
    const { highlightContexts, collapseContexts } = useSectionContext()!;
    const { showLinkCount, sectionsDefaultOpen } = useSettingContext()!;

    useEffect(() => {
        setMinimize(collapseContexts);
    }, [collapseContexts])

    useEffect(() => {
        const currentTomout = setTimeout(() => {
            //setMinimize(!sectionsDefaultOpen);
        }, 50);

        return () => clearTimeout(currentTomout);
    }, [sectionsDefaultOpen])

    // dark:bg-theme-bgFourth
    return (
        <Box onContextMenu={(e) => e.preventDefault()}  id="section-element" className={`w-full dark:bg-theme-bgFourth bg-white border-[2px] rounded-2xl flex flex-col justify-center space-y-4 transition-all duration-300
            ${contextMenuOpen && !highlightContexts ? "border-indigo-300" : highlightContexts ? "border-white " : "dark:border-neutral-900 "}
            ${highlightContexts ? "pointer-events-none" : "pointer-events-auto"}`}
        >  
            <ErrorManager>
                <SectionHeader
                    id={id}
                    sectionTitle={title}
                    linkCount={links?.length || 0}
                    showLinkCount={showLinkCount}
                    isMinimzied={minimize}
                    onLinkLayoutChange={(layt) => setLayout(layt)}
                    onContextMenu={(v) => setContextMenuOpen(v)}
                    onMinimize={() => setMinimize(!minimize)}
                    onRename={(newTitle) => {
                        UpdateSection({ 
                            currentSection : currentSection,
                            updatedSection : {...currentSection, title : newTitle}
                        })}}
                    onDelete={() => DeleteSections(id)}
                    onCreateLink={(link) => CreateLink({
                        sectionID : id,
                        linkData :link
                    })}
                />
            </ErrorManager>

            <ConditionalRender render={!minimize}>
                <ErrorManager>
                    <LinksLayout id={id} links={links} layout={layout} />
                </ErrorManager>
            </ConditionalRender>
        </Box>
    )
}

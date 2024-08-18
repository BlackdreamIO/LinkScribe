'use client'

import { useState, useEffect, useRef } from "react";
import { SectionScheme } from "@/scheme/Section";

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

    const { id, links } = currentSection;

    const [minimize, setMinimize] = useState(true);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);

    const { UpdateSection, DeleteSections } = useSectionController()!;
    const { highlightContexts, collapseContexts, linksLayout } = useSectionContext()!;
    const { CreateLink } = useLinkController()!;
    const { showLinkCount, sectionsDefaultOpen } = useSettingContext()!;

    const prevLinksLayout = useRef(linksLayout);
    const prevCurrentSection = useRef(currentSection);

    useEffect(() => {
        setMinimize(collapseContexts);
    }, [collapseContexts])

    useEffect(() => {
        const currentTomout = setTimeout(() => {
            //setMinimize(!sectionsDefaultOpen);
        }, 50);

        return () => clearTimeout(currentTomout);
    }, [sectionsDefaultOpen])

    useEffect(() => {
        if (prevLinksLayout.current !== linksLayout || prevCurrentSection.current !== currentSection) {
            const currentTimeout = setTimeout(() => {
                UpdateSection({
                    currentSection: currentSection,
                    updatedSection: { ...currentSection, links_layout: linksLayout }
                });
            }, 50);

            prevLinksLayout.current = linksLayout;
            prevCurrentSection.current = currentSection;

            console.log(linksLayout)

            return () => clearTimeout(currentTimeout);
        }
        console.log("f")
    }, [linksLayout, currentSection]);
    

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
                    onRename={(newTitle) => {
                        UpdateSection({ 
                            currentSection : currentSection,
                            updatedSection : {...currentSection, title : newTitle}
                        })}}
                    onDelete={() => DeleteSections(id)}
                    onDeleteAllLinks={() => {
                        UpdateSection({
                            currentSection : currentSection,
                            updatedSection : {...currentSection, links : []}
                        })
                    }}
                    onCreateLink={(link) => CreateLink({
                        sectionID : id,
                        linkData :link
                    })}
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

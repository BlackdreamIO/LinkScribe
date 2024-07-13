'use client'

import { useState, useEffect, useMemo } from "react";
import dynamic from 'next/dynamic';

import { useSectionController } from "@/context/SectionControllerProviders";
import { useSectionContext } from "@/context/SectionContextProvider";
import { useLinkController } from "@/context/LinkControllerProviders";

import { SectionScheme } from "@/scheme/Section";

import { Box, Text } from "@chakra-ui/react";

import { ConditionalRender } from "@/components/ui/conditionalRender";

import { SectionHeader } from "./SectionHeader";
import { useSettingContext } from "@/context/SettingContextProvider";

const LinkComponent = dynamic(() => import('../Link/Link').then((mod) => mod.LinkComponent), {
    ssr: false,
    loading: () => <p>Loading link...</p>,
})
  
const ErrorManager = dynamic(() => import('../../../components/ErrorHandler/ErrorManager'), {
    ssr: false,
    loading: () => <p>Loading error manager...</p>,
})

export const Section = ({ currrentSection } : {currrentSection : SectionScheme}) => {

    const { id, links, title, totalLinksCount, created_at } = currrentSection;

    const [minimize, setMinimize] = useState(true);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);

    const { UpdateSection, DeleteSections } = useSectionController()!;
    const { highlightContexts, collapseContexts } = useSectionContext()!;
    const { CreateLink } = useLinkController()!;
    const { showLinkCount, sectionsDefaultOpen } = useSettingContext()!;

    console.count("Rendering");

    useEffect(() => {
        setMinimize(collapseContexts);
    }, [collapseContexts])

    useEffect(() => {
        const currentTomout = setTimeout(() => {
            setMinimize(!sectionsDefaultOpen);
        }, 50);

        return () => clearTimeout(currentTomout);
    }, [sectionsDefaultOpen])

    const MemoizedContentDisplay = useMemo(() => {
        if ((links ?? []).length > 0) {
            return links!.map((link, i) => (
                <LinkComponent link={link} sectionID={id} key={i} />
            ));
        } else {
            return <Text className="text-lg text-center mb-4">EMPTY</Text>;
        }
    }, [links, id]);
    
    return (
        <Box id="section-element" className={`w-full dark:bg-theme-bgFourth border-[2px] rounded-2xl flex flex-col justify-center space-y-4 transition-all duration-300
            ${contextMenuOpen && !highlightContexts ? "border-indigo-300" : highlightContexts ? "border-white " : "dark:border-neutral-900 "}
            ${highlightContexts ? "pointer-events-none" : "pointer-events-auto"}`}
        >   
            <SectionHeader
                sectionTitle={title}
                linkCount={links?.length || 0}
                showLinkCount={showLinkCount}
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
                onCreateLink={(link) => CreateLink({
                    sectionID : id,
                    linkData :link
                })}
            />

            <ConditionalRender render={!minimize}>
                <Box className="w-full p-2 overflow-hidden transition-all duration-200 flex flex-col items-center justify-center space-y-4 select-none">
                    <ErrorManager>
                        {MemoizedContentDisplay}
                    </ErrorManager>
                </Box>
            </ConditionalRender>
        </Box>
    )
}

'use client'

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

import { useSectionController } from "@/context/SectionControllerProviders";
import { useSectionContext } from "@/context/SectionContextProvider";
import { useLinkController } from "@/context/LinkControllerProviders";

import { SectionScheme } from "@/scheme/Section";

import { Box, Text } from "@chakra-ui/react";

import { ConditionalRender } from "@/components/ui/conditionalRender";

import { SectionHeader } from "./SectionHeader";

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

    useEffect(() => {
        setMinimize(collapseContexts);
    }, [collapseContexts])

    return (
        <Box className={`w-full dark:bg-theme-bgFourth border-[2px] rounded-2xl flex flex-col justify-center space-y-4 transition-all duration-300
            ${contextMenuOpen && !highlightContexts ? "border-indigo-300" : highlightContexts ? "border-white " : "dark:border-neutral-900 "}
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
                onCreateLink={(link) => CreateLink({
                    sectionID : id,
                    linkData :link
                })}
            />

            <ConditionalRender render={!minimize}>
                <Box className="w-full p-2 overflow-hidden transition-all duration-200 flex flex-col items-center justify-center space-y-4 select-none">
                    <ErrorManager>
                        {
                            (links ?? []).length > 0 ? (
                                links ?? []).map((link, i) => (
                                    <LinkComponent link={link} sectionID={id} key={i}/>
                                )
                            )
                            : (
                                <Text className="text-lg text-center mb-4">EMPTY</Text>
                            )
                        }
                    </ErrorManager>
                </Box>
            </ConditionalRender>
        </Box>
    )
}

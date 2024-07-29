'use client'

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

import { useSectionController } from "@/context/SectionControllerProviders";
import { useSectionContext } from "@/context/SectionContextProvider";
import { useLinkController } from "@/context/LinkControllerProviders";
import { useSettingContext } from "@/context/SettingContextProvider";

import { SectionScheme } from "@/scheme/Section";

import { Box } from "@chakra-ui/react";

import { ConditionalRender } from "@/components/ui/conditionalRender";

import { SectionHeader } from "./SectionHeader";
import { LinksLayout } from "../Link/LinksLayout";
import { LinkLayout } from "@/scheme/Link";
  
const ErrorManager = dynamic(() => import('../../../components/ErrorHandler/ErrorManager'), {
    ssr: true,
    loading: () => <h1 className="text-center font-bold">Loading...</h1>,
})

export const Section = ({ currrentSection } : {currrentSection : SectionScheme}) => {

    const { id, links, title, totalLinksCount, created_at, _deleted, linksLayout, timestamp } = currrentSection;

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
            setMinimize(!sectionsDefaultOpen);
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
                            currentSection : currrentSection,
                            updatedSection : {
                                id : id,
                                links : links,
                                created_at : created_at,
                                totalLinksCount : totalLinksCount,
                                title : newTitle,
                                _deleted : _deleted,
                                linksLayout : linksLayout,
                                timestamp : timestamp
                            }
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

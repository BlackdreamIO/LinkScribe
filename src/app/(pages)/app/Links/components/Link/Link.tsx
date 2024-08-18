"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import { useLinkController } from "@/context/LinkControllerProviders";
import { useWindowResize } from "@/hook/useWindowResize";
import { LinkLayout, LinkScheme } from "@/scheme/Link";

import { Box } from "@chakra-ui/react";

import { LinkContextMenuWrapper } from "./LinkContextMenuWrapper";
import { LinkQuickLook } from "./LinkQuickLook";

const LinkPrimarySide = dynamic(() => import('./LinkPrimarySide').then((mod) => mod.LinkPrimarySide), { ssr: true });
const LinkSecondarySide = dynamic(() => import('./LinkSecondarySide').then((mod) => mod.LinkSecondarySide), { ssr: true });
const LinkMobileDropdown = dynamic(() => import('./LinkMobileDropdown').then((mod) => mod.LinkMobileDropdown), { ssr: true });

export const LinkComponent = ( { link, sectionID, layout } : { link : LinkScheme, layout : LinkLayout, sectionID : string }) => {

    const { url, id } = link;

    const [showContextMenuOutline, setShowContextMenuOutline] = useState(false);
    const [openQL, setOpenQL] = useState(false);

    const [titleEditMode, setTitleEditMode] = useState(false);
    const [urlEditMode, setUrlEditMode] = useState(false);

    const [showMobileOptions, setShowMobileOptions] = useState(false);

    const { DeleteLink } = useLinkController()!;

    const handleDeleteLink = async () => {
        DeleteLink({
            sectionID : sectionID,
            linkId : id
        })
    }

    useWindowResize({
        thresholdWidth : 640, // PX
        onToggle : setShowMobileOptions
    })

    const handleEsacapeOutline = (e : KeyboardEvent | any) => {
        if (e.key == "Enter" && !titleEditMode && !urlEditMode) {
            window.open(url);
        }
        if(e.key == "Escape") {
            (document.activeElement as HTMLElement)?.blur();
        }
    }


    // dark:bg-black/10 !backdrop-filter !backdrop-blur-xl
    return (
        <LinkContextMenuWrapper
            onContextMenu={setShowContextMenuOutline}
            onTitleRename={() => setTitleEditMode(true)}
            onUrlUpdate={() => setUrlEditMode(true)}
            onDelete={() => handleDeleteLink()}
        >
            <Box
                tabIndex={1}
                role="tab"
                onKeyDown={handleEsacapeOutline}
                className={`w-full dark:bg-theme-bgFourth flex flex-col items-center justify-center py-2 px-4 rounded-xl
                shadow-sm shadow-black transition-all duration-150 !outline-none !ring-0 pointer-events-auto
                ${layout.layout == "Grid Detailed" || layout.layout == "List Detailed" ? "space-y-4" : "space-y-0"}
                ${showContextMenuOutline ? "border-2 !border-indigo-300" : "border-[1px] dark:border-neutral-700 focus:outline-none focus-visible:!outline-4 focus-visible:!outline-theme-borderNavigation"}`
            }>

                <LinkPrimarySide
                    layout={layout}
                    link={link}
                    sectionID={sectionID}
                    showMobileOptions={showMobileOptions}
                    titleEditMode={titleEditMode}
                    onTitleEditMode={setTitleEditMode}
                />

                <LinkSecondarySide
                    layout={layout}
                    link={link}
                    sectionID={sectionID}
                    urlEditMode={urlEditMode}
                    showMobileOptions={showMobileOptions}
                    onTitleEditMode={setTitleEditMode}
                    onUrlEditMode={setUrlEditMode}
                    onDelete={handleDeleteLink}
                    onQuickLook={() => setOpenQL(true)}
                />

                <LinkMobileDropdown
                    layout={layout}
                    link={link}
                    onTitleEditMode={setTitleEditMode}
                    onLinkEditMode={setUrlEditMode}
                    showMobileOptions={showMobileOptions}
                    handleDeleteLink={handleDeleteLink}
                />

                <LinkQuickLook
                    link={link}
                    open={openQL}
                    onClose={setOpenQL}
                />

            </Box>
        </LinkContextMenuWrapper>
    )
}


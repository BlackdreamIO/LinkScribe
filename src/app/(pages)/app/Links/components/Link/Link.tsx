"use client";

import { useRef, useState } from "react";
import { useThemeContext } from "@/context/ThemeContextProvider";
import { useLinkController } from "@/context/LinkControllerProviders";
import { useWindowResize } from "@/hook/useWindowResize";
import { LinkLayout, LinkScheme } from "@/scheme/Link";

import dynamic from 'next/dynamic';

import { Box } from "@chakra-ui/react";

import { LinkContextMenuWrapper } from "./LinkContextMenuWrapper";
import ErrorManager from "../../../components/ErrorHandler/ErrorManager";

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

    const { linkGlassmorphismEnabled } = useThemeContext();
    const { DeleteLink } = useLinkController()!;
    const linkRef = useRef<HTMLDivElement>(null);

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
                id="link"
                ref={linkRef}
                className={`w-full ${linkGlassmorphismEnabled ? "backdrop-filter backdrop-blur-md dark:bg-black/50" : "dark:bg-theme-bgFourth"} flex flex-col items-center justify-center py-2 px-4 rounded-xl
                shadow-sm shadow-black transition-all duration-150 !outline-none !ring-0
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
                
                <ErrorManager>
                    <LinkQuickLook
                        link={link}
                        open={openQL}
                        onClose={setOpenQL}
                    />
                </ErrorManager>

            </Box>
        </LinkContextMenuWrapper>
    )
}


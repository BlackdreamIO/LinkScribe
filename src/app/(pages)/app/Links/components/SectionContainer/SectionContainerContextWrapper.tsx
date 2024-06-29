"use client"

import { ChangeEvent, useEffect, useRef } from "react";
import { useSectionContext } from "@/context/SectionContextProvider";
import { useKeyPress } from "@/hook/useKeyPress";
import { useOutsideClick } from "@chakra-ui/react";

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@radix-ui/react-context-menu";

type SectionContainerContextWrapperProps = {
    children : React.ReactNode;
}

const dropdownMenuItemStyle = `text-xs py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary`;

export const SectionContainerContextWrapper = (props : SectionContainerContextWrapperProps) => {

    const { children } = props;

    const contextMenuRef = useRef<HTMLDivElement>(null);
    const { highlightContexts, setHighlightContexts } = useSectionContext()!;

    useKeyPress({
        mode :"Multi Key",
        key : ["Control","a"],
        callback() {
            setHighlightContexts(!highlightContexts);
        },
    })
    useKeyPress({
        mode :"Single key",
        key : "Escape",
        callback() {
            if(highlightContexts) {
                setHighlightContexts(false);
            }
        },
    })

    useOutsideClick({
        ref : contextMenuRef,
        handler(e) {
            if(highlightContexts) {
                setHighlightContexts(false);
            }
        },
    })

    return (
        <ContextMenu>
            <ContextMenuTrigger ref={contextMenuRef} className="w-full"> {children} </ContextMenuTrigger>
            <ContextMenuContent sticky="partial" className="w-60 space-y-2 rounded-md p-2 shadow-lg dark:bg-theme-bgFourth dark:shadow-black border dark:border-neutral-700">
                <ContextMenuItem className={dropdownMenuItemStyle}>New Section</ContextMenuItem>
                <ContextMenuItem className={dropdownMenuItemStyle}>Refresh</ContextMenuItem>
                <ContextMenuItem className={dropdownMenuItemStyle}>Layout</ContextMenuItem>
                <ContextMenuItem onClick={() => setHighlightContexts(!highlightContexts)} className={dropdownMenuItemStyle}>Select All</ContextMenuItem>
                <ContextMenuItem className={dropdownMenuItemStyle}>Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

"use client"

import { useRef } from "react";
import { useSectionContext } from "@/context/SectionContextProvider";
import { useKeyPress } from "@/hook/useKeyPress";
import { useOutsideClick } from "@chakra-ui/react";

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@radix-ui/react-context-menu";
import { Separator } from "@/components/ui/separator";
import { Labelkey } from "@/components/ui/key";
import { ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@/components/ui/context-menu";

type SectionContainerContextWrapperProps = {
    children : React.ReactNode;
}

const dropdownMenuItemStyle = `text-sm py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-neutral-900 dark:text-neutral-300
    data-[highlighted]:dark:bg-neutral-900 data-[disabled]:dark:bg-neutral-900 data-[disabled]:dark:text-neutral-500 outline-none
    w-full flex flex-row items-center justify-between`;

export const SectionContainerContextWrapper = (props : SectionContainerContextWrapperProps) => {

    const { children } = props;
    const { 
        highlightContexts,
        setHighlightContexts,
        openCreatorDialog,
        setOpenCreatorDialog,
        collapseContexts,
        setCollapseContexts 
    } = useSectionContext()!;

    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Win64
    useKeyPress({
        mode :"Multi Key",
        key : ["Control","a"],
        callback : () => setHighlightContexts(!highlightContexts)
    })
    // Mac
    useKeyPress({
        mode :"Multi Key",
        key : ["Meta","a"],
        callback : () => setHighlightContexts(!highlightContexts)
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

    // Win64
    useKeyPress({
        mode :"Multi Key",
        key : ["Control", "Shift", "c"],
        preventDefault : false,
        preventElementFocus : false,
        callback: () => setOpenCreatorDialog(!openCreatorDialog)
    })

    // Mac
    useKeyPress({
        mode :"Multi Key",
        key : ["Meta", "Shift"],
        preventDefault : true,
        callback() {
            setOpenCreatorDialog(true);
        },
    })

    useKeyPress({
        mode :"Multi Key",
        key : ["Control", "m"],
        preventDefault : true,
        preventElementFocus : false,
        callback: () => setCollapseContexts(!collapseContexts)
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
            <ContextMenuTrigger ref={contextMenuRef} className="w-full">
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent sticky="partial" className="w-80 space-y-2 rounded-md p-2 shadow-lg dark:bg-theme-bgFourth/30 !backdrop-blur-3xl !backdrop-filter dark:shadow-black border dark:border-neutral-700">
                <ContextMenuItem onClick={() => setOpenCreatorDialog(true)} className={dropdownMenuItemStyle}>
                    New Section <Labelkey label="CTRL + SHIFT + C"/>
                </ContextMenuItem>
                <ContextMenuItem className={dropdownMenuItemStyle}>
                    Refresh <Labelkey label="LSHIFT + R"/>
                </ContextMenuItem>
                <ContextMenuItem className={dropdownMenuItemStyle}>
                    Sort By <Labelkey label=""/>
                </ContextMenuItem>
                <Separator/>
                <ContextMenuItem onClick={() => setCollapseContexts(!collapseContexts)} className={dropdownMenuItemStyle}>
                    {collapseContexts ? "Expand All" : "Collapse All"} <Labelkey label="CTRL + M"/>
                </ContextMenuItem>
                <ContextMenuSub>
                    <ContextMenuSubTrigger className={dropdownMenuItemStyle}>
                        Layout
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-40 space-y-2 rounded-md p-2 shadow-lg dark:bg-theme-bgFourth ml-5 dark:shadow-black border dark:border-neutral-400">
                        <ContextMenuItem className={dropdownMenuItemStyle}>Grid</ContextMenuItem>
                        <ContextMenuItem className={dropdownMenuItemStyle}>List</ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuItem onClick={() => setHighlightContexts(!highlightContexts)} className={dropdownMenuItemStyle}>
                    {!highlightContexts ? <>Select All <Labelkey label="CTRL + A"/></> : <>Deselect All <Labelkey label="CTRL + A"/></>}
                </ContextMenuItem>
                <Separator/>
                <ContextMenuItem disabled={!highlightContexts} className={dropdownMenuItemStyle}>
                    Delete <Labelkey label="CTRL + DEL"/>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

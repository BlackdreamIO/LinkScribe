"use client"

import { useRef } from "react";
import { useSectionController } from "@/context/SectionControllerProviders";
import { useSettingContext } from "@/context/SettingContextProvider";
import { useKeyPress } from "@/hook/useKeyPress";
import { useOutsideClick } from "@chakra-ui/react";
import { useWindowResize } from "@/hook/useWindowResize";

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@radix-ui/react-context-menu";
import { Separator } from "@/components/ui/separator";
import { Labelkey } from "@/components/ui/key";
import { useSectionContainerContext } from "@/context/SectionContainerContext";
//import { ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@/components/ui/context-menu";

type SectionContainerContextWrapperProps = {
    children : React.ReactNode;
}

const dropdownMenuItemStyle = `text-sm py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-neutral-300/10 dark:text-neutral-300
    hover:bg-neutral-300/40 data-[highlighted]:bg-neutral-300/40 data-[disabled]:bg-neutral-300/80
    data-[highlighted]:dark:bg-neutral-300/10 data-[disabled]:dark:bg-transparent data-[disabled]:dark:text-neutral-500 outline-none
    w-full flex flex-row items-center justify-between`;

export const SectionContainerContextWrapper = (props : SectionContainerContextWrapperProps) => {

    const { children } = props;

    const { setOpenCreatorDialog, sectionHighlighted, setSectionHighlighted, SelectAllSection, DselectAllSection, setMinimizeAllSections, minimizeAllSections } = useSectionContainerContext();

    // const {
    //     contextSections,
    //     DeleteSections
    // } = useSectionController()!;

    const { keyboardShortcutStatus } = useSettingContext()!;

    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Win64
    useKeyPress({
        mode :"Multi Key",
        key : ["Control","a"],
        enable : keyboardShortcutStatus == "Full Controll",
        callback : () => {}
    })
    // Mac
    useKeyPress({
        mode :"Multi Key",
        key : ["Meta","a"],
        enable : keyboardShortcutStatus == "Full Controll",
        callback : () => {}
    })

    useKeyPress({
        mode :"Single key",
        key : "Escape",
        enable : keyboardShortcutStatus != "Disabled",
        callback() {
            
        },
    })

    // Win64
    useKeyPress({
        mode :"Multi Key",
        key : ["Control", "Shift", "c"],
        preventDefault : true,
        preventElementFocus : false,
        enable : keyboardShortcutStatus == "Full Controll",
        callback: () => {

        }
    })

    // Mac
    useKeyPress({
        mode :"Multi Key",
        key : ["Meta", "Shift"],
        preventDefault : true,
        enable : keyboardShortcutStatus == "Full Controll",
        callback() {
            {}
        },
    })

    useKeyPress({
        mode :"Multi Key",
        key : ["Control", "m"],
        preventDefault : true,
        preventElementFocus : false,
        enable : keyboardShortcutStatus == "Full Controll",
        callback: () => {
            if(sectionHighlighted) {
                setMinimizeAllSections(!minimizeAllSections);
            }
        }
    })

    useOutsideClick({
        ref : contextMenuRef,
        handler(e) {
            // if(highlightContexts) {
            //     setHighlightContexts(false);
            // }
        },
    })

    useWindowResize({
        thresholdWidth : 640,
        onTriggerEnter() {
            
        },
        onTriggerOut() {
            
        },
    })

    const handleDelete = async () => {
        //const updatedSections = contextSections.filter((section) => section !== contextSections.at(0));
        //console.log(updatedSections); 
    }

    return (
        <ContextMenu modal={false}>
            <ContextMenuTrigger ref={contextMenuRef} className="w-full">
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent sticky="partial" className="w-80 space-y-2 rounded-md p-2 dark:bg-theme-bgFourth/30 !backdrop-blur-xl !backdrop-filter dark:shadow-black border dark:border-neutral-700">
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
                <ContextMenuItem onClick={() => setSectionHighlighted(!sectionHighlighted)} className={dropdownMenuItemStyle}>
                    {!sectionHighlighted ? <>Select All <Labelkey label="CTRL + A"/></> : <>Deselect All <Labelkey label="ESC"/></>}
                </ContextMenuItem>
                <ContextMenuItem disabled={!sectionHighlighted} onClick={(e) => {
                        e.preventDefault();
                        setMinimizeAllSections(!minimizeAllSections);
                    }}
                    className={dropdownMenuItemStyle}>
                    {!minimizeAllSections && sectionHighlighted ? "Expand All" : "Collapse All"} <Labelkey label="CTRL + M"/>
                </ContextMenuItem>
                <ContextMenuSub>
                    <ContextMenuSubTrigger className={dropdownMenuItemStyle}>
                        Layout
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-40 space-y-2 rounded-md p-2 shadow-lg dark:bg-theme-bgFourth/80 bg-neutral-100 !backdrop-blur-3xl !backdrop-filter ml-5 dark:shadow-black border dark:border-neutral-400">
                        <ContextMenuItem className={dropdownMenuItemStyle}>Grid</ContextMenuItem>
                        <ContextMenuItem className={dropdownMenuItemStyle}>List</ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                <Separator/>
                <ContextMenuItem onClick={() => handleDelete()} disabled={!true} className={dropdownMenuItemStyle}>
                    Delete <Labelkey label="CTRL + DEL"/>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

"use client"

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import ErrorManager from "../../../components/ErrorHandler/ErrorManager";

type LinkContextMenuWrapperProps = {
    onContextMenu : (open : boolean) => void;
    
    onTitleRename : () => void;
    onUrlUpdate : () => void;
    onDelete : () => void;

    children : React.ReactNode;
}

const dropdownMenuItemStyle = `text-md max-sm:text-xs py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:!bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary`;

export const LinkContextMenuWrapper = (props : LinkContextMenuWrapperProps) => {

    const { children, onTitleRename, onUrlUpdate, onDelete, onContextMenu } = props;

    const CONTEXT_MENU_ACTIONS = [
        { label : "Rename Title", executeAction : () => onTitleRename(), additionalStyle : "" },
        { label : "Update Url", executeAction : () => onUrlUpdate(), additionalStyle : "" },
        { label : "Quick Look", executeAction : () => onUrlUpdate(), additionalStyle : "" },
        { label : "Delete", executeAction : () => onDelete(), additionalStyle : "dark:hover:!bg-red-500 dark:hover:!text-white" },
    ]

    return (
        <ContextMenu modal={false} onOpenChange={onContextMenu}>
            <ContextMenuTrigger className="w-full">
                <ErrorManager>
                    {children}
                </ErrorManager>
            </ContextMenuTrigger>
            <ContextMenuContent sticky="partial" className="w-60 space-y-2 rounded-xl p-2 shadow-lg dark:bg-theme-bgFourth dark:shadow-black border dark:border-neutral-700 z-50">
                {
                    CONTEXT_MENU_ACTIONS.map((item, index) => {
                        return (
                            <ContextMenuItem
                                key={index}
                                className={`${dropdownMenuItemStyle} ${item.additionalStyle}`}
                                onClick={() => item.executeAction()}
                            >
                                {item.label}
                            </ContextMenuItem>
                        )
                    })
                }
            </ContextMenuContent>
        </ContextMenu>
    )
}

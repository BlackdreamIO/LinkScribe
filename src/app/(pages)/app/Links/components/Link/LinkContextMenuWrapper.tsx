"use client"

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

type LinkContextMenuWrapperProps = {
    onContextMenu : (open : boolean) => void;
    
    onTitleRename : () => void;
    onUrlUpdate : () => void;
    onDelete : () => void;

    children : React.ReactNode;
}

const dropdownMenuItemStyle = `text-md py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary`;

export const LinkContextMenuWrapper = (props : LinkContextMenuWrapperProps) => {

    const { children, onTitleRename, onUrlUpdate, onDelete, onContextMenu } = props;

    return (
        <ContextMenu onOpenChange={onContextMenu}>
            <ContextMenuTrigger className="w-full"> {children} </ContextMenuTrigger>
            <ContextMenuContent className="w-60 space-y-2 rounded-xl p-2 shadow-lg dark:bg-theme-bgFourth/40 !backdrop-filter !backdrop-blur-3xl dark:shadow-black border dark:border-neutral-700">
                <ContextMenuItem onClick={() => onTitleRename()} className={dropdownMenuItemStyle}>Rename Title</ContextMenuItem>
                <ContextMenuItem onClick={() => onUrlUpdate()} className={dropdownMenuItemStyle}>Update Url</ContextMenuItem>
                <ContextMenuItem onClick={() => onDelete()} className={`${dropdownMenuItemStyle} dark:hover:!bg-red-500 dark:hover:!text-white`}>Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

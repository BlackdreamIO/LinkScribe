"use client"

import { useState } from "react";

import { Box } from "@chakra-ui/react";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LinkScheme } from "@/scheme/Link";

type SectionHeaderLinkDrawerProps = {
    openLinkCreateDrawer : boolean; 
    onOpenChange : (open : boolean) => void;
    onCreate : (link : LinkScheme ) => void;
    onClose : () => void;
}

export const SectionHeaderLinkDrawer = ({ openLinkCreateDrawer, onOpenChange, onClose, onCreate } : SectionHeaderLinkDrawerProps) => {

    const [linkTitle, setLinkTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    const handleCreateLink = () => {
        if(linkTitle.length > 3 && linkUrl.length > 5) {
            onCreate({
                id : crypto.randomUUID().slice(0, 4),
                title : linkTitle,
                url : linkUrl,
                visitCount : 0,
                created_at : new Date().toString()
            });
            onClose();
        }
    }

    return (
        <div>
            <Drawer open={openLinkCreateDrawer} onOpenChange={onOpenChange}>
                <DrawerContent className="dark:bg-theme-bgFourth space-y-4 !border-none focus:border-none focus-visible:border-none">
                    <DrawerHeader>
                        <DrawerTitle className="text-xl">Add New Link</DrawerTitle>
                    </DrawerHeader>
                    <Box className="h-[150px] px-4 space-y-4">
                        <Input 
                            className="w-full h-12 dark:bg-theme-bgFifth !ring-0 focus-within:!outline-theme-borderNavigation"
                            placeholder="Title"
                            value={linkTitle}
                            onChange={(e) => setLinkTitle(e.target.value)}
                        />
                        <Input 
                            className="w-full h-12 dark:bg-theme-bgFifth !ring-0 focus-within:!outline-theme-borderNavigation"
                            placeholder="Url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                        />
                    </Box>
                    <DrawerFooter className="flex flex-row items-start justify-end space-x-4">
                        <Button 
                            onClick={() => handleCreateLink()}
                            variant={"secondary"} 
                            className="w-48 dark:bg-theme-bgFifth dark:hover:bg-neutral-950 dark:hover:text-theme-textSecondary rounded-lg border-2 dark:border-neutral-900 h-11 transition-none !ring-0 focus-within:!outline-theme-borderNavigation"
                        >
                            Submit
                        </Button>
                        <DrawerClose 
                            onClick={() => onClose()}
                            className="w-48 dark:bg-theme-bgFifth dark:hover:bg-neutral-950 dark:hover:text-theme-textSecondary rounded-lg border-2 dark:border-neutral-900 py-2 !ring-0 focus-visible:!border-theme-borderNavigation focus-visible:!outline-none"
                        >
                            Cancell
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

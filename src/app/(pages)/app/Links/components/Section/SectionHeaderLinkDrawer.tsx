"use client"

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from 'uuid';

import { useLinkController } from "@/context/LinkControllerProviders";
import { useSectionContext } from "@/context/SectionContextProvider";

import { Box } from "@chakra-ui/react";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import ErrorManager from "../../../components/ErrorHandler/ErrorManager";

export const SectionHeaderLinkDrawer = () => {

    const [linkTitle, setLinkTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    const { user } = useUser();

    const { CreateLink, isloading } = useLinkController();
    const { currentSection, openLinkCreateDrawer, setOpenLinkCreateDrawer } = useSectionContext();

    const handleCreateLink = async () => {
        if(user && user.primaryEmailAddress) {
            if(linkTitle.length > 3 && linkUrl.length > 5) {
                await CreateLink({
                    sectionID : currentSection.id,
                    linkData : {
                        id : uuidv4().slice(0, 16),
                        title : linkTitle,
                        url : linkUrl,
                        visitCount : 0,
                        created_at : new Date(),
                        ref : currentSection.id,
                        image : ""
                    }
                });
                setOpenLinkCreateDrawer(false);
            }
        }
    }

    return (
        <Box>
            <ErrorManager>
                <Drawer open={openLinkCreateDrawer} onOpenChange={setOpenLinkCreateDrawer}>
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
                                onClick={() => setOpenLinkCreateDrawer(false)}
                                className="w-48 dark:bg-theme-bgFifth dark:hover:bg-neutral-950 dark:hover:text-theme-textSecondary rounded-lg border-2 dark:border-neutral-900 py-2 !ring-0 focus-visible:!border-theme-borderNavigation focus-visible:!outline-none"
                            >
                                Cancell
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </ErrorManager>
        </Box>
    )
}

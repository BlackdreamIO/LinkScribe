"use client"

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSectionController } from "@/context/SectionControllerProviders";
import { v5 as uuidv5 } from "uuid";

import { Box } from "@chakra-ui/react";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { RefineEmail } from "@/helpers";
import { useSectionContainerContext } from "@/context/SectionContainerContext";

export const SectionCreator = () => {

    const [sectionTitle, setSectionTitle] = useState("");

    const { CreateSection } = useSectionController()!;
    const { user } = useUser();
    const { openCreatorDialog, setOpenCreatorDialog } = useSectionContainerContext();

    const handleCreateSection = () => {
        //setOpenCreatorDialog(false);
        if(user && user.primaryEmailAddress && sectionTitle) {
            CreateSection({
                newSection : {
                    id : crypto.randomUUID(), // gen 16 character long random string
                    title : sectionTitle,
                    links : [],
                    totalLinksCount : 0,
                    created_at : new Date().toString(),
                    _deleted : false,
                    links_layout : {
                        layout : "List Detailed",
                        size : 1
                    },
                    selfLayout : "Grid",
                    section_ref : RefineEmail(user.primaryEmailAddress.emailAddress),
                }
            });
        }
    }

    return (
        <Dialog open={openCreatorDialog} onOpenChange={setOpenCreatorDialog}>
            <DialogContent className="dark:bg-theme-bgFourth rounded-xl p-4 space-y-4">
                <Box className="w-full space-y-4">
                    <DialogTitle className="text-2xl">Enter Section Name</DialogTitle>
                    <Input
                        value={sectionTitle}
                        className="w-full h-12 !outline-none !ring-0 rounded-xl dark:border-theme-textSecondary"
                        onChange={(e) => setSectionTitle(e.target.value)}
                    /> 
                </Box>
                <DialogFooter className="w-full flex flex-row items-center justify-end gap-4">
                    <Button 
                        variant={"ghost"}
                        className="w-56 dark:bg-theme-bgFifth dark:hover:bg-theme-bgThird border-[1px] dark:border-neutral-800 rounded-lg"
                        onClick={() => handleCreateSection()}>
                            Create
                    </Button>
                    <Button
                        variant={"ghost"}
                        className="w-56 dark:bg-theme-bgFifth dark:hover:bg-theme-bgThird border-[1px] dark:border-neutral-800 rounded-lg"
                        onClick={() => {}}>
                            Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

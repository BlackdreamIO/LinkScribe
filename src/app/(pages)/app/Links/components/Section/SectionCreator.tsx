"use client"

import { useState } from "react";
import { useSectionContext } from "@/context/SectionContextProvider";
import { useSectionController } from "@/context/SectionControllerProviders";

import { Box } from "@chakra-ui/react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { RefineEmail } from "@/helpers/NormalizeEmail";

export const SectionCreator = () => {

    const [sectionTitle, setSectionTitle] = useState("");

    const { CreateSection } = useSectionController()!;
    const { user } = useUser();
    const { openCreatorDialog, setOpenCreatorDialog } = useSectionContext()!;

    const handleCreateSection = () => {
        setOpenCreatorDialog(false);
        if(user && user.primaryEmailAddress && sectionTitle) {
            const uniqID = crypto.randomUUID().slice(0, 12);
            CreateSection({
                newSection : {
                    id : uniqID, // gen 8 character long random string
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
        <Dialog open={openCreatorDialog} onOpenChange={() => setOpenCreatorDialog(false)}>
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
                        onClick={() => setOpenCreatorDialog(false)}>
                            Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

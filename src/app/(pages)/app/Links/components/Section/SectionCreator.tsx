"use client"

import { useState } from "react";
import { useSectionContext } from "@/context/SectionContextProvider";
import { useSectionController } from "@/context/SectionControllerProviders";

import { Box, Text } from "@chakra-ui/react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

export const SectionCreator = () => {

    const [sectionTitle, setSectionTitle] = useState("");

    const { CreateSection } = useSectionController()!;
    const { openCreatorDialog, setOpenCreatorDialog } = useSectionContext()!;

    const handleCreateSection = async () => {
        setOpenCreatorDialog(false);
        await CreateSection({
            newSection : {
                id : crypto.randomUUID(),
                title : sectionTitle,
                links : [],
                totalLinksCount : 0,
                created_at : new Date()
            }
        });
    }

    return (
        <Dialog open={openCreatorDialog} onOpenChange={() => setOpenCreatorDialog(false)}>
            <DialogContent className="dark:bg-theme-bgFourth rounded-xl p-4 space-y-4">
                <Box className="w-full space-y-4">
                    <Text className="text-2xl">Enter Section Name</Text>
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

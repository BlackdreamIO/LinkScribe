import { Box, HStack } from "@chakra-ui/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { AppWindow, X } from "lucide-react";
import { ThemeTabManager } from "./Tabs/ThemeTabManager";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type ThemeCustomizerDialogProps = {
    open : boolean;
    onClose : () => void;
}


export const ThemeCustomizerDialog = (props : ThemeCustomizerDialogProps) => {

    const { open, onClose } = props

    const [previewMode, setPreviewMode] = useState(false);

    return (
        <Box className="w-full select-none">
            { open &&!previewMode && <Box className="fixed inset-0 bg-transparent z-50"></Box>}
            <Dialog open={open} onOpenChange={() => { if(!previewMode) onClose(); }} modal={false}>
                <DialogContent className={`select-none
                    ${ previewMode ? 'w-96 max-sm:w-52 !fixed !top-14 h-[80px] border-4 dark:border-theme-primaryAccent overflow-hidden dark:bg-theme-bgFourth' : 'h-[90%] overflow-scroll dark:bg-theme-bgSecondary w-8/12'}
                    max-w-none  rounded-xl !ring-0 !outline-none space-y-4 no-scrollbar
                `}
                >
                    <HStack className="flex flex-row justify-between items-center">
                        <DialogTitle className="text-xl font-bold">{previewMode ? "Preview " : "Select Theme"}</DialogTitle>
                        <Box className="flex flex-row space-x-4 items-center justify-center">
                            <Button onClick={() => setPreviewMode(!previewMode)} className="!bg-transparent p-0 m-0 flex flex-col items-center justify-center h-auto !border-none">
                                <AppWindow className="w-6 h-6 text-neutral-500 dark:hover:text-white"/>
                            </Button>
                            <Button onClick={onClose} className="!bg-transparent p-0 m-0 flex flex-col items-center justify-center h-auto !border-none">
                                <X className="w-6 h-6 text-neutral-500 dark:hover:text-white"/>
                            </Button>
                        </Box>
                    </HStack>
                    {
                        !previewMode && <ThemeTabManager/>
                    }
                </DialogContent>
            </Dialog>
        </Box>
    )
}

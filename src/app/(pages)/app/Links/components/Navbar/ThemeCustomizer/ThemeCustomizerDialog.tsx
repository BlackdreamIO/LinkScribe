import { Box, HStack } from "@chakra-ui/react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { X } from "lucide-react";
import { ThemeTabManager } from "./Tabs/ThemeTabManager";

type ThemeCustomizerDialogProps = {
    open : boolean;
    onClose : () => void;
}


export const ThemeCustomizerDialog = (props : ThemeCustomizerDialogProps) => {

    const { open, onClose } = props

    return (
        <Box className="w-full">
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="w-8/12 max-w-none dark:bg-theme-bgSecondary rounded-xl !ring-0 !outline-none space-y-4 h-[90%] overflow-scroll no-scrollbar">
                    
                    <HStack className="justify-between">
                        <DialogTitle className="text-xl font-bold">Select Theme</DialogTitle>
                        <X className="w-4 h-4"/>
                    </HStack>
                    <ThemeTabManager/>
                </DialogContent>
            </Dialog>
        </Box>
    )
}

"use client"

import { LinkScheme } from "@/scheme/Link";

import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Box, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

type LinkQuickLookProps = {
    link : LinkScheme;
    open : boolean;
    onClose : (value : boolean) => void;
}

export const LinkQuickLook = (props : LinkQuickLookProps) => {
    
    const { link, open, onClose } = props;

    return (
        <Dialog open={open} onOpenChange={onClose} modal>
            <DialogContent className="dark:bg-theme-bgSecondary rounded-xl p-4 space-y-4">
                <Box className="w-full space-y-4">
                    <Text className="text-2xl">{link.title}</Text>

                    
                </Box>
                <DialogFooter className="w-full flex flex-row items-center justify-end gap-4">
                    <Button
                        variant={"ghost"}
                        className="w-56 dark:bg-theme-bgFifth dark:hover:bg-theme-bgThird border-[1px] dark:border-neutral-800 rounded-lg"
                    >
                            Visit
                    </Button>
                    <Button
                        variant={"ghost"}
                        className="w-56 dark:bg-theme-bgFifth dark:hover:bg-theme-bgThird border-[1px] dark:border-neutral-800 rounded-lg"
                        >
                            Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

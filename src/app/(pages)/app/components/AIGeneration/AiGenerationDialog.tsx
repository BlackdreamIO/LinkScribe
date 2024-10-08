"use client"

import { useAGContextWrapper } from "./AGContextWrapper";

import { Box, Heading } from "@chakra-ui/react";
import { AudioLines } from "lucide-react";

import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogContentStyle, DialogFooterButtonStyle } from "@/styles/componentStyles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AGPromtInput } from "./AGPromtInput";
import { AGOutput } from "./AGOutput";
import { Button } from "@/components/ui/button";
import { AGGenarationSettings } from "./AGGenarationSettings";


const TooltipTriggerStyle = "!ring-0 rounded-full outline-4 outline outline-transparent focus-visible:!outline-theme-borderNavigation";

export const AiGenerationDialog = () => {

    const { loading, selectedSectionID, generatedLinks } = useAGContextWrapper();

    return (
        <Dialog>
            <DialogTrigger
                role="tab"
                className={`flex flex-row items-center space-x-2 ${TooltipTriggerStyle} rounded-sm`}>
                <AudioLines className="hover:text-cyan-300 text-sm" />
            </DialogTrigger>
            <DialogContent hideClose={false} className={`${DialogContentStyle} ${loading ? "border-4 border-theme-secondaryAccent" : "border-4 border-theme-primaryAccent"} !blur-none !backdrop-blur-none !backdrop-filter-none !filter-none !p-0 select-none min-w-[60%] !outline-none max-h-[90%] dark:scrollbar-dark space-y-2`}>
                <Tabs defaultValue="generation" className="w-full px-4 py-2 space-y-2">
                    <TabsList className="w-full dark:bg-theme-bgFifth border py-2">
                        <TabsTrigger value="generation">Generation</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent key={"generation"} value="generation" className="space-y-2 !outline-none !ring-0">
                        <Box className="w-full space-y-2">
                            <AGPromtInput/>
                            <AGOutput/>
                        </Box>
                        <DialogFooter className="flex flex-row justify-end space-x-2">
                            <Button
                                disabled={selectedSectionID == '' || loading || generatedLinks.length < 1}
                                className={`${DialogFooterButtonStyle} dark:bg-theme-primaryAccent dark:text-black font-bold `}>
                                    {selectedSectionID == "" ? "Select A Section" : "Add"}
                            </Button>
                            <Button variant="outline" className={DialogFooterButtonStyle}>Cancel</Button>
                        </DialogFooter>
                    </TabsContent>
                    <TabsContent key={"settings"} className="!outline-none !ring-0" value="settings">
                        <AGGenarationSettings/>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

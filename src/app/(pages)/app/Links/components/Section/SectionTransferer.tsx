"use client"

import { useState } from "react";

//import { useSectionController } from "@/context/SectionControllerProviders";
import { useSectionContext } from "@/context/SectionContextProvider";

import { LinkScheme } from "@/scheme/Link";

import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { ConditionalRender } from "@/components/ui/conditionalRender";
import ErrorManager from "../../../components/ErrorHandler/ErrorManager";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ShareableLink } from "./SectionShare/ShareableLink";
import { CustomLinkSelector } from "./SectionShare/CustomLinkSelector";
import { TransferEmailSelector } from "./SectionShare/TransferEmailSelector";
//import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ShareGeneralHeader } from "./SectionShare/ShareGeneralHeader";


const ButtonStyle = "dark:bg-neutral-900 dark:hover:bg-neutral-800 border dark:text-white dark:hover:text-theme-textSecondary rounded-lg h-11";

export const SectionTransferer = () => {

    const [selectedEmail, setSelectedEmail] = useState("");

    const [makePublic, setMakePublic] = useState(true);
    const [shareToOtherProfiles, setShareToOtherProfiles] = useState(false);

    const [customLinkImportMode, setCustomLinkImportMode] = useState(false);
    const [selectedLinks, setSelectedLinks] = useState<LinkScheme[]>([]);

    const [importSectionData, setImportSectionData] = useState(true);
    const [importLinksData, setImportLinksData] = useState(true);

    //const { TransferSection } = useSectionController()!;
    const { currentSection, openSectionTransferer, setOpenSectionTransferer } = useSectionContext();

    
    const handleTransfer = async () => {
        // TransferSection({
        //     email : selectedEmail,
        //     sectionToTransfer : currentSection,
        //     importCustomLinks : true,
        //     importLinks : false,
        //     links : selectedLinks
        // })
        setOpenSectionTransferer(false);
    }

    return (
        <ErrorManager>
            <Dialog open={openSectionTransferer} onOpenChange={setOpenSectionTransferer}>
                <DialogContent onContextMenu={(e) => e.preventDefault()} className="dark:bg-theme-bgSecondary rounded-xl p-4 max-h-[80%] overflow-y-scroll no-scrollbar">
                    <HStack className="space-x-2 max-md:!flex-col transiution-all duration-200">
                        <Box className="w-full space-y-6">
                            <Box className="w-full space-y-6">
                                <DialogTitle className="text-xl">Share With</DialogTitle>
                                <ShareGeneralHeader />
                                {/* <HStack className="justify-between">
                                    <Text> Enable Public Share </Text>
                                    <Switch
                                        checked={makePublic && !shareToOtherProfiles}
                                        onClick={() => {
                                            setMakePublic(!makePublic);
                                            if(shareToOtherProfiles) { 
                                                setShareToOtherProfiles(false);
                                            }
                                        }}
                                    />
                                </HStack>
                                <HStack className="justify-between">
                                    <Text> Share To Other Profiles </Text>
                                    <Switch
                                        checked={shareToOtherProfiles && !makePublic}
                                        onClick={() => {
                                            setShareToOtherProfiles(!shareToOtherProfiles);
                                            if(makePublic) { 
                                                setMakePublic(false);
                                            }
                                        }}
                                    />
                                </HStack> */}
                            </Box>
                            <ConditionalRender render={makePublic}>
                                <ErrorManager>
                                    <ShareableLink />
                                </ErrorManager>
                            </ConditionalRender>
                            <ConditionalRender render={!makePublic && !shareToOtherProfiles}>
                                <Box className="w-full space-y-4">
                                    <Input placeholder="Enter Target User Email To Share With" className="w-full h-12 border border-theme-primaryAccent rounded-lg" />
                                </Box>
                            </ConditionalRender>
                            <ConditionalRender render={shareToOtherProfiles && !makePublic}>
                                <TransferEmailSelector selectedEmail={selectedEmail} setSelectedEmail={setSelectedEmail} />
                            </ConditionalRender>

                            <Text className="text-xl">Import Settings</Text>
                            <VStack className="w-full">
                                <Box className="w-full flex flex-row items-center justify-between px-4 py-2">
                                    <Text>Import Section</Text>
                                    <Checkbox tabIndex={1} checked={importSectionData} onClick={() => setImportSectionData(!importSectionData)} />
                                </Box>
                                <Box className="w-full flex flex-row items-center justify-between px-4 py-2">
                                    <Text>Import All Links</Text>
                                    <Checkbox tabIndex={1} checked={importLinksData} onClick={() => setImportLinksData(!importLinksData)} />
                                </Box>
                                <Box className="w-full flex flex-row items-center justify-between px-4 py-2">
                                    <Text>Import Custom Links</Text>
                                    <Checkbox tabIndex={1} checked={customLinkImportMode} onClick={() => setCustomLinkImportMode(!customLinkImportMode)} />
                                </Box>
                            </VStack>
                        </Box>
                            
                        <ConditionalRender render={customLinkImportMode}>
                            <CustomLinkSelector
                                links={currentSection.links}
                                selectedLinks={selectedLinks}
                                setSelectedLinks={setSelectedLinks}
                            />
                        </ConditionalRender>
                    </HStack>
                    <DialogFooter className="items-end justify-end flex flex-row space-x-4">
                        <Button onClick={() => handleTransfer()} className={ButtonStyle}>Share</Button>
                        <Button onClick={() => setOpenSectionTransferer(false)} className={ButtonStyle}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ErrorManager>
    )
}

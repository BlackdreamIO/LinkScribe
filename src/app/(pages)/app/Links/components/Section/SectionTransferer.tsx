"use client"

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { useSectionController } from "@/context/SectionControllerProviders";
import { useSectionContext } from "@/context/SectionContextProvider";

import { LinkScheme } from "@/scheme/Link";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { ConditionalRender } from "@/components/ui/conditionalRender";
import ErrorManager from "../../../components/ErrorHandler/ErrorManager";


const ButtonStyle = "dark:bg-neutral-900 dark:hover:bg-neutral-800 border dark:text-white dark:hover:text-theme-textSecondary rounded-lg h-11";

export const SectionTransferer = () => {

    const [userEmails, setUserEmails] = useState<string[]>([]);
    const [selectedEmail, setSelectedEmail] = useState("");

    const [customLinkImportMode, setCustomLinkImportMode] = useState(false);
    const [selectedLinks, setSelectedLinks] = useState<LinkScheme[]>([]);

    const [importSectionData, setImportSectionData] = useState(true);
    const [importLinksData, setImportLinksData] = useState(true);

    const { user, isSignedIn, isLoaded } = useUser();

    const { TransferSection } = useSectionController()!;
    const { currentSection, openSectionTransferer, setOpenSectionTransferer } = useSectionContext();


    const handleTransfer = async () => {
        TransferSection({
            email : selectedEmail,
            sectionToTransfer : currentSection,
            importCustomLinks : true,
            importLinks : false,
            links : selectedLinks
        })
        setOpenSectionTransferer(false);
    }

    useEffect(() => {
        if(user && isLoaded && isSignedIn && user.primaryEmailAddress) {
            const varifiedEmailAddresses = user.emailAddresses.filter(email => email.verification.status == "verified");
            setUserEmails(varifiedEmailAddresses.map((email) => email.emailAddress))
        }
    }, [user, isLoaded, isSignedIn]);

    return (
        <ErrorManager>
            <Dialog open={openSectionTransferer} onOpenChange={setOpenSectionTransferer}>
                <DialogContent onContextMenu={(e) => e.preventDefault()} className="dark:bg-theme-bgSecondary rounded-xl p-4 max-h-[80%] overflow-y-scroll no-scrollbar">
                    <HStack className="space-x-2 max-md:!flex-col transiution-all duration-200">
                        <Box className="w-full space-y-6">
                            <DialogTitle className="text-xl">Select Email</DialogTitle>
                            <VStack className="w-full space-y-4" >
                                {
                                    userEmails.map((email, i) => (
                                        <Box
                                            key={email}
                                            tabIndex={1}
                                            role="tab"
                                            className={`w-full flex flex-row items-center justify-between py-2 px-4 rounded-lg outline-1 outline-double
                                            dark:outline-neutral-700 focus-visible:outline-theme-borderNavigation
                                            transition-all duration-100
                                            ${email == selectedEmail ? "dark:bg-neutral-300 dark:text-black" : "dark:hover:bg-neutral-300 dark:hover:text-black focus-visible:text-black focus-visible:bg-neutral-300"}`}
                                        >
                                            <Text className="truncate">{email}</Text>
                                            <Button
                                                disabled={email !== selectedEmail && selectedEmail !== ""}
                                                onClick={() => setSelectedEmail(email == selectedEmail ? "" : email)}
                                                tabIndex={1}
                                                className="dark:bg-theme-bgFifth dark:hover:bg-theme-textSecondary dark:hover:text-black dark:text-white px-4
                                                focus-visible:!bg-theme-textSecondary focus-visible:!text-black">
                                                    { selectedEmail == email ? "Remove" : "Select" }
                                            </Button>
                                        </Box>
                                    ))
                                }
                            </VStack>
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
                            <Box className="w-8/12 max-md:w-full max-md:border-none border-l-2 dark:border-neutral-700 h-full">
                                <Text className="text-lg text-center">Select Link</Text>
                                <VStack className="p-4 h-96 space-y-4 scrollbar-dark overflow-y-scroll">
                                    {
                                        (currentSection?.links ?? []).map((link, i) => (
                                            <Box
                                                onClick={() => setSelectedLinks(selectedLinks.includes(link) ? selectedLinks.filter(x => x !== link) : prev => [...prev, link])}
                                                key={i}
                                                className="w-full py-2 group border dark:bg-neutral-900 dark:hover:bg-neutral-800 flex flex-row items-center justify-start px-4 space-x-4"
                                            >
                                                <Checkbox tabIndex={1} checked={selectedLinks.includes(link)} />
                                                <Text
                                                    className={`truncate cursor-default ${selectedLinks.includes(link) ? "dark:text-white" : "dark:text-neutral-400 dark:group-hover:text-white"}  max-lg:text-sm`}>
                                                        {link.title}
                                                </Text>
                                            </Box>       
                                        ))
                                    }
                                </VStack>
                            </Box>
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

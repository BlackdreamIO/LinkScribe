"use client"

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { SectionScheme } from "@/scheme/Section";
import { LinkScheme } from "@/scheme/Link";
import { ConditionalRender } from "@/components/ui/conditionalRender";
import { CreateSection } from "@/database/functions/supabase/sections/createSections";
import { RefineEmail } from "@/helpers/NormalizeEmail";
import { CreateLink } from "@/database/functions/supabase/links/createLink";
import { useSectionController } from "@/context/SectionControllerProviders";

type SectionTransfererProps = {
    sectionToTransfer : SectionScheme;
    open : boolean;
    onchange : (open : boolean) => void;
}

const ButtonStyle = "dark:bg-neutral-900 dark:hover:bg-neutral-800 border dark:text-white dark:hover:text-theme-textSecondary rounded-lg h-11";

export const SectionTransferer = ({ open, onchange, sectionToTransfer } : SectionTransfererProps) => {

    const [userEmails, setUserEmails] = useState<string[]>([]);
    const [selectedEmail, setSelectedEmail] = useState("");

    const [customLinkImportMode, setCustomLinkImportMode] = useState(false);
    const [selectedLinks, setSelectedLinks] = useState<LinkScheme[]>([]);

    const [importSectionData, setImportSectionData] = useState(true);
    const [importLinksData, setImportLinksData] = useState(true);

    const { user, isSignedIn, isLoaded } = useUser();
    const { getToken } = useAuth();

    const { TransferSection } = useSectionController()!;


    const handleTransfer = async () => {
        // const token = await getToken({ template : "linkscribe-supabase" });

        // if(!token || !isSignedIn) return;

        // console.log(token);

        // if(customLinkImportMode) {
        //     const newSection : SectionScheme = {...sectionToTransfer, links : selectedLinks};
        //     await CreateSection({email : RefineEmail(selectedEmail), sectionData : newSection, token : token})
        // }
        // else {
        //     const randomUniqeSectionID = crypto.randomUUID().slice(0, 12);

        //     const newSection : SectionScheme = {
        //         ...sectionToTransfer,
        //         id: randomUniqeSectionID,
        //         section_ref : RefineEmail(selectedEmail),
        //         links : importLinksData ? sectionToTransfer.links : []
        //     };
        //     const updatedSection : LinkScheme[] = newSection.links.map((link) => ({...link, id : crypto.randomUUID().slice(0, 8), ref : randomUniqeSectionID}));

        //     await CreateSection({email : RefineEmail(selectedEmail), sectionData : newSection, token : token});

        //     for(const link of updatedSection) {
        //         await CreateLink({linkData : link, token : token});
        //     }
        //     // console.log({
        //     //     transferSection : newSection,
        //     //     transferLinks : updatedSection
        //     // })
        // }

        await TransferSection({
            email : selectedEmail,
            sectionToTransfer : sectionToTransfer,
            importCustomLinks : true,
            importLinks : false,
            links : selectedLinks
        })
    }

    useEffect(() => {
        if(user && isLoaded && isSignedIn && user.primaryEmailAddress) {
            const varifiedEmailAddresses = user.emailAddresses.filter(email => email.verification.status == "verified");
            setUserEmails(varifiedEmailAddresses.map((email) => email.emailAddress))
        }
    }, [user, isLoaded, isSignedIn]);

    return (
        <Dialog open={open} onOpenChange={onchange}>
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
                                    (sectionToTransfer?.links ?? []).map((link, i) => (
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
                    <Button onClick={() => onchange(false)} className={ButtonStyle}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

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
import { useSectionController } from "@/context/SectionControllerProviders";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { updateSection } from "@/redux/features/section";


const TooltipTriggerStyle = "!ring-0 rounded-full outline-4 outline outline-transparent focus-visible:!outline-theme-borderNavigation";

export const AiGenerationDialog = () => {

    const { loading, selectedSectionID, selectedLinks } = useAGContextWrapper();
    //const { UpdateSection, contextSections } = useSectionController();

    const sections = useAppSelector((state : RootState) => state.sectionSlice.sections);
    const dispatch = useAppDispatch();

    const handleAddLinks = () => {
        if (selectedSectionID != "") {
            const currentSection = sections.find(section => section.id == selectedSectionID);
            if(currentSection) {
                const filteredLinks = selectedLinks
                    .filter(link => link.selected == true)
                    .map(({selected, ...link}) => ({...link, ref : selectedSectionID, visitCount : 0, image : '', id : crypto.randomUUID()}))
                    .filter(link => !currentSection.links.some(existingLink => existingLink.id === link.id));
                const updatedSection = {...currentSection, links : [...currentSection.links, ...filteredLinks]};
                
                // UpdateSection({
                //     currentSection : currentSection,
                //     updatedSection : updatedSection
                // });

                dispatch(updateSection({ ...currentSection, links : [...currentSection.links, ...filteredLinks]}));
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger
                role="tab"
                className={`flex flex-row items-center space-x-2 ${TooltipTriggerStyle} rounded-sm`}>
                <AudioLines className="hover:text-cyan-300 text-sm" />
            </DialogTrigger>
            <DialogContent hideClose={true} className={`${DialogContentStyle} ${loading ? "border-4 border-theme-secondaryAccent" : "border-2 border-neutral-700"}
                !blur-none !backdrop-blur-none !backdrop-filter-none !filter-none !p-0 select-none min-w-[70%] !outline-none max-h-[90%]
                dark:scrollbar-dark space-y-2 overflow-y-scroll`}
            >
                <Tabs defaultValue="generation" className="w-full px-4 py-2 space-y-2">
                    <TabsList className="w-full dark:bg-theme-bgFifth border py-2">
                        <TabsTrigger value="generation">Generation</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent key={"generation"} value="generation" className="w-full space-y-2 !outline-none !ring-0">
                        <Box className="w-full space-y-2">
                            <AGPromtInput/>
                            <AGOutput/>
                        </Box>
                        <DialogFooter className="flex flex-row justify-end space-x-2">
                            <Button
                                disabled={selectedSectionID == '' || loading || selectedLinks.length < 1}
                                className={`${DialogFooterButtonStyle} dark:bg-theme-primaryAccent dark:text-black font-bold `}
                                onClick={() => handleAddLinks()}>
                                    {selectedSectionID == "" ? "Select A Section" : "Add"}
                            </Button>
                            <Button variant="outline" className={DialogFooterButtonStyle}>Cancel</Button>
                        </DialogFooter>
                    </TabsContent>
                    <TabsContent key={"settings"} className="!outline-none !ring-0 h-full" value="settings">
                        <AGGenarationSettings/>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

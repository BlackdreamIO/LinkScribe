import { useEffect, useRef, useState } from "react";
import { useSectionController } from "@/context/SectionControllerProviders";

import { Box, HStack } from "@chakra-ui/react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionScheme } from "@/scheme/Section";
import { DialogFooterButtonStyle } from "@/styles/componentStyles";
import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";
import { useAGContextWrapper } from "./AGContextWrapper";


export const AGSectionSelect = () => {

    const [openSheet, setOpenSheet] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredContextSections, setFilteredContextSections] = useState<SectionScheme[]>([]);
    
    const { selectedSectionID, setSelectedSectionID } = useAGContextWrapper();
    const { contextSections } = useSectionController();
    const parentRef = useRef<HTMLDivElement>(null);
    
    useKeyboardNavigation({
        parentRef : parentRef,
        role : "tab",
        enable : true,
        direction : "vertical"
    })

    useEffect(() => {
        if(searchQuery.length > 2) {
            setFilteredContextSections((contextSections ?? []).filter((section) => section.title.toLowerCase().includes(searchQuery.toLowerCase())));
        }
        else {
            setFilteredContextSections(contextSections);
        }
    }, [searchQuery])
    

    return (
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <HStack className="p-0 max-md:w-full">
                <SheetTrigger className="dark:bg-theme-bgThird border border-transparent hover:border-neutral-700 px-4 py-1 rounded-lg max-md:!text-xs max-md:w-full">
                    To : {contextSections.find(section => section.id == selectedSectionID)?.title ?? "Select Section"}
                </SheetTrigger>
            </HStack>
            <SheetContent className="w-96 dark:bg-theme-bgSecondary space-y-2">
                <SheetHeader>
                    <SheetTitle>Select Existing Section</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <Box className="w-full h-full space-y-2 flex flex-col relative">

                    <Input
                        placeholder="Search For Section"
                        className="w-full h-10 dark:bg-theme-bgFifth !ring-0 !outline-none"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <Box className="w-full overflow-hidden flex flex-col space-y-2">
                        <Box
                            ref={parentRef}
                            role="tablist"
                            tabIndex={0}
                            className={`h-[85%] overflow-y-auto min-h-96 max-sm:min-h-56 rounded-xl p-2 dark:bg-theme-bgFifth space-y-2 dark:scrollbar-dark border border-neutral-700 shadow-md shadow-black
                                focus-visible:!outline-2 focus-visible:!outline-theme-borderKeyboardParentNavigation`}
                        >
                            {
                                (filteredContextSections ?? []).map((section, index) => (
                                    <Button
                                        role="tab"
                                        className={`w-full ${section.id == selectedSectionID ? "!bg-theme-primaryAccent !text-black" : "dark:bg-theme-bgThird dark:hover:bg-theme-bgSecondary"} 
                                            dark:text-white min-h-12 text-wrap text-left cursor-pointer px-2 rounded-lg transition-none !outline-4 !outline-theme-borderNavigation !border-none !ring-0`}
                                        key={section.id}
                                        onClick={() => setSelectedSectionID(section.id)}
                                    >
                                        {section.title}
                                    </Button>
                                ))
                            }
                        </Box>

                        <SheetFooter className="flex flex-row items-center justify-center space-x-2 absolute bottom-16 w-full">
                            <Button onClick={() => {
                                    setSelectedSectionID(selectedSectionID);
                                    setOpenSheet(false);
                                }}
                            disabled={selectedSectionID == ""}
                            className={`${DialogFooterButtonStyle} w-full disabled:pointer-events-none`}>
                                Select
                            </Button>
                        </SheetFooter>
                    </Box>
                </Box>
            </SheetContent>
        </Sheet>
    ) 
}

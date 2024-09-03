import { useState, useEffect } from "react";
import { useSectionContext } from "@/context/SectionContextProvider";
import dynamic from "next/dynamic";

import { AdvancedQueryTextSearch, FilterByTitle, FilterByDate, FilterByOrigin, FilterByView } from "@/lib/Filters/AdvanceSearchQueryManager";
import { ExtractDomain, ParseSearchQuery, RemoveQueryFromText } from "@/helpers";
import { FILTER_QUERIES } from "@/utils/filterQueries";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Box, HStack, Text } from "@chakra-ui/react";

import { ChevronRight, Filter, Search, SquareChevronRight, X } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTitle, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { format } from "date-fns";

const Switch = dynamic(() => import("@/components/ui/switch").then((mod) => mod.Switch), {ssr: false});
const Label = dynamic(() => import("@/components/ui/label").then((mod) => mod.Label), {ssr: false});

const CalendarIcon = dynamic(() => import("lucide-react").then((mod) => mod.Calendar), {ssr: false});
 
const Calendar = dynamic(() => import("@/components/ui/calendar").then((mod) => mod.Calendar), {ssr: false});
const Popover = dynamic(() => import("@/components/ui/popover").then((mod) => mod.Popover), {ssr: false});
const PopoverContent = dynamic(() => import("@/components/ui/popover").then((mod) => mod.PopoverContent), {ssr: false});
const PopoverTrigger = dynamic(() => import("@/components/ui/popover").then((mod) => mod.PopoverTrigger), {ssr: false});

import ErrorManager from "../../../components/ErrorHandler/ErrorManager";
import { DialogFooterButtonStyle } from "@/styles/componentStyles";
import { ConditionalRender } from "@/components/ui/conditionalRender";
import { useUser } from "@clerk/nextjs";

const DropdownMenuCommandItemStyle = `dark:text-neutral-300 text-base font-mono hover:!bg-theme-primaryAccent data-[highlighted]:bg-theme-primaryAccent data-[highlighted]:!text-black data-[highlighted]:!font-bold hover:!text-black hover:font-bold py-1
    transition-none`;


export const SectionLinkSearch = () => {
    const [searchText, setSearchText] = useState("");
    
    const { openLinkSearch, currentSection, originalSection, setCurrentSection } = useSectionContext();

    const [date, setDate] = useState<Date>();
    const [selectedOrigin, setSelectedOrigin] = useState<string>("");
    const [selectedViewSortMethod, setSelectedViewSortMethod] = useState<"ascending" | "descending" | "disabled">("disabled");
    const [sortByValidity, setSortByValidity] = useState<boolean>(false);

    useEffect(() => {

        const query_from = ParseSearchQuery(searchText, "from");
        const query_date = ParseSearchQuery(searchText, "date");
        const query_view = ParseSearchQuery(searchText, "view");

        const title = RemoveQueryFromText(searchText, ["from", "date", "view"]);

        //console.log(query_view)

        const filteredLinks = AdvancedQueryTextSearch(originalSection.links, [
            (V) => FilterByOrigin(V, query_from),
            (V) => FilterByDate(V, query_date),
            (V) => FilterByView(V, query_view),
            (V) => FilterByTitle(V, title),
        ]);

        setCurrentSection({
          ...currentSection,
          links: filteredLinks,
        });

        if(searchText.length < 1) {
            setCurrentSection(originalSection);
        }
    }, [searchText, openLinkSearch])
    
    const handleFilter = () => {

        const filteredLinks = AdvancedQueryTextSearch(originalSection.links, [
            (V) => FilterByOrigin(V, selectedOrigin.length > 0 ? selectedOrigin : null),
            (V) => FilterByDate(V, date !== undefined ? format(date, 'dd/MM/yyyy') : null),
            (V) => FilterByView(V, selectedViewSortMethod),
        ]);

        console.log(filteredLinks);
        setCurrentSection({
          ...currentSection,
          links: filteredLinks,
        })
    }

    return (
        <ErrorManager>
            <ConditionalRender render={openLinkSearch}>
                <Box className="w-full flex flex-row items-center justify-center rounded-xl shadow-md shadow-transparent hover:shadow-black transition-all duration-200
                border">
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        autoFocus
                        className="w-full font-bold text-theme-textSecondary !bg-transparent h-9 border-none !outline-none !ring-0 rounded-none"
                    />
                    <Button className="!bg-transparent !border-none !outline-none dark:hover:!bg-neutral-800 h-9 rounded-none">
                        <Search className="text-white w-5 h-5 rotate-90" />
                    </Button>

                    <Dialog modal>
                        <DialogTrigger className="!bg-transparent !border-none !outline-none dark:hover:!bg-neutral-800 h-9 rounded-none p-2">
                            <Filter className="text-white w-5 h-5" />
                        </DialogTrigger>
                        <DialogContent className="dark:bg-theme-bgSecondary rounded-xl p-4 max-h-[80%] overflow-y-scroll no-scrollbar">
                            <DialogTitle className="text-center text-lg">FILTER</DialogTitle>
                            <DropdownMenu>
                                <Box className="flex flex-row items-center justify-between">
                                    <Text className="text-base">From</Text>
                                    <DropdownMenuTrigger className="!bg-transparent dark:hover:!bg-neutral-800 h-9 rounded-none p-2">
                                        {selectedOrigin ? selectedOrigin : "Select"}
                                    </DropdownMenuTrigger>
                                </Box>
                                <DropdownMenuContent className="w-56 h-96 overflow-y-scroll space-y-2">
                                    <DropdownMenuItem disabled={selectedOrigin === "*"} onClick={() => setSelectedOrigin("*")}>
                                        All
                                    </DropdownMenuItem>
                                    {
                                        [...new Set(originalSection.links.map((link) => ExtractDomain(link.url) || "*"))].map((domain, index) => (
                                            domain !== "" && (
                                                <DropdownMenuItem disabled={selectedOrigin === domain} onClick={() => setSelectedOrigin(domain)} key={index}>
                                                    {domain}
                                                </DropdownMenuItem>
                                            )
                                        ))
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Separator/>

                            <Box className="w-full flex items-center justify-between space-x-2 !bg-transparent">
                                <Label htmlFor="airplane-mode" className="text-neutral-300 text-base">Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <HStack justifyContent={"space-between"}>
                                            <Button variant={"outline"} className="flex flex-row items-center justify-between space-x-2 !bg-transparent">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                            {
                                                date !== undefined && 
                                                    <Button onClick={() => setDate(undefined)} variant={"destructive"} className="!bg-transparent">
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                            }
                                        </HStack>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="dark:bg-theme-bgSecondary" />
                                    </PopoverContent>
                                </Popover>
                            </Box>

                            <Separator/>

                            <DropdownMenu>
                                <Box className="flex flex-row items-center justify-between">
                                    <Text className="text-base">View</Text>
                                    <DropdownMenuTrigger className="!bg-transparent dark:hover:!bg-neutral-800 h-9 rounded-none p-2">
                                        {selectedViewSortMethod ? selectedViewSortMethod : "Disabled"}
                                    </DropdownMenuTrigger>
                                </Box>
                                <DropdownMenuContent className="w-56 space-y-2">
                                    <DropdownMenuItem disabled={selectedViewSortMethod === "disabled"} onClick={() => setSelectedViewSortMethod("disabled")}>
                                        Disabled
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled={selectedViewSortMethod === "ascending"} onClick={() => setSelectedViewSortMethod("ascending")}>
                                        Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled={selectedViewSortMethod === "descending"} onClick={() => setSelectedViewSortMethod("descending")}>
                                        Descending
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Separator/>

                            <Box className="w-full flex items-center justify-between space-x-2 !bg-transparent">
                                <Label htmlFor="airplane-mode" className="text-neutral-300 text-base">By Valid</Label>
                                <Switch id="airplane-mode" onClick={() => setSortByValidity(!sortByValidity)} checked={sortByValidity}  />
                            </Box>

                            <DialogFooter className="flex flex-row items-center justify-end space-x-4 mt-5">
                                <Button onClick={handleFilter} className={DialogFooterButtonStyle}>Filter</Button>
                                <Button className={DialogFooterButtonStyle}>Cancel</Button>
                            </DialogFooter>
                        </DialogContent> 
                    </Dialog>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="!bg-transparent dark:hover:!bg-neutral-800 h-9 rounded-none p-2">
                            <SquareChevronRight className="text-white w-5 h-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-96 border-neutral-600">
                            <DropdownMenuLabel className="text-base px-2">Command</DropdownMenuLabel>
                            {
                                FILTER_QUERIES.map((query, index) => (
                                    <DropdownMenuItem
                                        onClick={() => setSearchText(searchText + " " + query.value)}
                                        className={DropdownMenuCommandItemStyle}
                                        key={index}>
                                            <ChevronRight /> {query.label}
                                    </DropdownMenuItem>
                                ))
                            }
                            <DropdownMenuItem onClick={(e) => e.preventDefault()} className="w-full flex items-center justify-between space-x-2 !bg-transparent">
                                <Label htmlFor="airplane-mode" className="text-neutral-300 text-base">Multiple Query Mode</Label>
                                <Switch id="airplane-mode"  />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Box>
            </ConditionalRender>
        </ErrorManager>
    )
}
import { useState, useEffect } from "react";
import { useSectionContext } from "@/context/SectionContextProvider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Box } from "@chakra-ui/react";

import { ChevronRight, ChevronsRight, Filter, Search } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { AdvancedQueryTextSearch, FilterByTitle, FilterByDate, FilterByOrigin } from "@/lib/Filters/AdvanceSearchQueryManager";
import { ParseSearchQuery, RemoveQueryFromText } from "@/helpers";
import { FILTER_QUERIES } from "@/utils/filterQueries";

const DropdownMenuItemStyle = `dark:text-neutral-300 text-base font-mono hover:!bg-theme-primaryAccent data-[highlighted]:bg-theme-primaryAccent hover:!text-black hover:font-bold py-1
    transition-none`;

export const SectionLinkSearch = () => {
    const [searchText, setSearchText] = useState("");
    
    const { openLinkSearch, currentSection, originalSection, setCurrentSection } = useSectionContext();

    useEffect(() => {
        const query_from = ParseSearchQuery(searchText, "from");
        const query_date = ParseSearchQuery(searchText, "date");
        const title = RemoveQueryFromText(searchText);

        const filteredLinks = AdvancedQueryTextSearch(originalSection.links, [
            (V) => FilterByOrigin(V, query_from),
            (V) => FilterByDate(V, query_date),
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
    
    return (
        openLinkSearch && (
            <Box className="w-full flex flex-row items-center justify-center rounded-xl shadow-md shadow-transparent hover:shadow-black transition-all duration-200
            border">
                <Input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    autoFocus
                    className="w-full font-bold text-theme-textSecondary !bg-transparent h-9 border-none !outline-none !ring-0 rounded-none"
                />
                <Button className="!bg-transparent !border-none !outline-none dark:hover:!bg-neutral-800 h-9 rounded-none">
                    <Search className="text-white w-4 h-4 rotate-90" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger className="!bg-transparent dark:hover:!bg-neutral-800 h-9 rounded-none p-2">
                        <Filter className="text-white w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-96 border-neutral-600">
                        <DropdownMenuLabel>Command</DropdownMenuLabel>
                        {
                            FILTER_QUERIES.map((query, index) => (
                                <DropdownMenuItem
                                    onClick={() => setSearchText(searchText + " " + query.value)}
                                    className={DropdownMenuItemStyle}
                                    key={index}>
                                        <ChevronRight /> {query.label}
                                </DropdownMenuItem>
                            ))
                        }
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={(e) => e.preventDefault()} className="w-full flex items-center justify-between space-x-2 !bg-transparent">
                            <Label htmlFor="airplane-mode" className="text-neutral-300">Multiple Query Mode</Label>
                            <Switch id="airplane-mode"  />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Box>
        )
    )
}
"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import { LinkLayout, LinkScheme } from "@/scheme/Link";

import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";
import { useSectionContext } from "@/context/SectionContextProvider";

import { Box, Text } from "@chakra-ui/react";
import { LinkComponent } from "./Link";
import ErrorManager from "../../../components/ErrorHandler/ErrorManager";

export const LinksLayout = ({ links, id, layout } : { links : LinkScheme[], layout : LinkLayout, id : string }) => {

    const parentRef = useRef<HTMLDivElement>(null);
    //useKeyboardNavigation({
    //    parentRef : parentRef,
    //    role : "tab",
    //    direction : "both"
    //})

    const MemoizedContentDisplay = useMemo(() => {
        if ((links ?? []).length > 0) {
            return links!.map((link, i) => (
                <ErrorManager key={link.id}>
                    <LinkComponent
                        layout={layout}
                        link={link}
                        sectionID={id}
                        key={link.id}
                    />
                </ErrorManager>
            ))
        }
        else {
            return <Text className="text-center mb-4 text-lg max-sm:text-xxs">EMPTY</Text>;
        }
    }, [links, id, layout]);

    const GenerateLayoutGrid = () => {
        switch (layout.size) {
            case 1:
                return "grid-cols-1";
            case 2:
                return "grid-cols-2 max-sm:!grid-cols-1";
            case 3:
                return "grid-cols-3 max-lg:grid-cols-2 max-sm:!grid-cols-1";
            case 4:
                return "grid-cols-4 max-lg:grid-cols-2 max-sm:!grid-cols-1";
            default:
                return "grid-cols-1";
        }
    }
    

    return (
        <Box
            role="tablist"
            tabIndex={0}
            ref={parentRef}
            className={`w-full p-2
                ${links?.length && links?.length > 0 ? `grid grid-rows-5 ${GenerateLayoutGrid()} gap-4` : ""} pointer-events-none
                overflow-hidden transition-all duration-200 select-none !border-none !ring-0 focus-visible:!outline-2 focus-visible:!outline-theme-borderKeyboardParentNavigation rounded-xl
            `}>
            {MemoizedContentDisplay}
        </Box>
    )
}

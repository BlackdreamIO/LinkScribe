import { Checkbox } from "@/components/ui/checkbox"
import { LinkScheme } from "@/scheme/Link";
import { Box, Text, VStack } from "@chakra-ui/react"
import { Dispatch, SetStateAction } from "react";

type CustomLinkSelectorProps = {
    links : LinkScheme[];
    setSelectedLinks : Dispatch<SetStateAction<LinkScheme[]>>;
    selectedLinks : LinkScheme[];
}

export const CustomLinkSelector = ({ links, setSelectedLinks, selectedLinks } : CustomLinkSelectorProps) => {

    return (
        <Box className="w-8/12 max-md:w-full max-md:border-none border-l-2 dark:border-neutral-700 h-full">
            <Text className="text-lg text-center">Select Link</Text>
            <VStack className="p-4 h-96 space-y-4 scrollbar-dark overflow-y-scroll">
                {
                    (links ?? []).map((link, i) => (
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
    )
}

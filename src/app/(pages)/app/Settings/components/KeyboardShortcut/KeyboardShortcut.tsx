import { Box, Flex, Text } from "@chakra-ui/react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";

export const KeyboardShortcutSetting = () => {

    const Shortcut = ({ label, keyName } : { label : string, keyName : string }) => {
        return (
            <Box className="w-full flex flex-row items-center justify-between dark:bg-neutral-900 px-4 py-2 border-[1px] dark:border-neutral-700 cursor-not-allowed">
                <Text>{label}</Text>
                <Text 
                    className="dark:text-neutral-900 dark:font-bold px-2 py-1 border-2 border-transparent dark:border-theme-borderNavigation dark:bg-neutral-300">
                        {keyName}
                </Text>
            </Box>
        )
    }

    return (
        <Box className="w-full">
            <Text className='text-2xl p-2 border-b-2 border-theme-borderSecondary'>Keyboard Shortcut</Text>
            <Flex className="dark:bg-theme-bgSecondary bg-neutral-100 p-4 w-full rounded-xl flex flex-col justify-start items-start space-y-4 border-2 border-neutral-900">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Do Not Open</AccordionTrigger>
                        <AccordionContent className="bg-black space-y-4 p-6">
                            <Text className="text-xl">Keyboard Shortcuts in Our Application</Text>
                            <Text className="text-base dark:text-neutral-300">
                                Our application includes various keyboard shortcuts to help you work more efficiently. However, please be aware:
                            </Text>
                            <ul className="space-y-2">
                                <li className="text-base !text-yellow-400">Browser Differences: Some shortcuts may not work in all browsers.</li>
                                <li className="text-base !text-yellow-400">Built-in Browser Shortcuts: Your browser might override some shortcuts with its own functions.</li>
                                <li className="text-base !text-yellow-400">OS Variations: Shortcuts might behave differently depending on your operating system.</li>
                                <li className="text-base !text-yellow-400">Custom Settings: Personal browser settings could also affect shortcut functionality.</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
                <Shortcut label="New Section" keyName="Ctrl + Shift + C" />
                <Shortcut label="Select All" keyName="Ctrl + A" />
                <Shortcut label="Delete" keyName="Ctrl + Del" />
                <Shortcut label="Collapse All Sections" keyName="Ctrl + M" />
                <Shortcut label="Minimize Sidebar" keyName="Ctrl + Shift + L" />
                <Shortcut label="Fast Reload" keyName="Ctrl + R" />
            </Flex>
        </Box>
    )
}

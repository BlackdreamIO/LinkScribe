"use client"

import { Box, Text, VStack } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export const AudioSettingOptions = () => {

    const [enableApplicationStartSound, setEnableApplicationStartSound] = useState(false);
    const [enableSectionCreateSound, setEnableSectionCreateSound] = useState(false);
    const [enableSectionDeleteSound, setEnableSectionDeleteSound] = useState(false);
    const [enableSystemNotificationsSound, setEnableSystemNotificationsSound] = useState(false);
    const [enableKeyboardNavigationSound, setEnableKeyboardNavigationSound] = useState(false);
    const [enableKeyboardShortcutSound, setEnableKeyboardShortcutSound] = useState(false);

    const Option = ({ label, onChange, value } : { label : string, value : boolean, onChange : () => void }) => {
        return (
            <Box onClick={onChange} className="w-full flex flex-row items-center justify-between dark:bg-neutral-800 dark:hover:bg-neutral-900 py-2 px-4 rounded-lg cursor-pointer">
                <Text>{label}</Text>
                <Checkbox checked={value} onChange={onChange} />
            </Box>
        )
    }

    return (
        <VStack className="w-full space-y-4 py-4">
            <Option label="Application Startup" value={enableApplicationStartSound} onChange={() => setEnableApplicationStartSound(!enableApplicationStartSound)} />
            <Option label="Section Create" value={enableSectionCreateSound} onChange={() => setEnableSectionCreateSound(!enableSectionCreateSound)} />
            <Option label="Section Delete" value={enableSectionDeleteSound} onChange={() => setEnableSectionDeleteSound(!enableSectionDeleteSound)} />
            <Option label="System Notifications" value={enableSystemNotificationsSound} onChange={() => setEnableSystemNotificationsSound(!enableSystemNotificationsSound)} />
            <Option label="Keyboard Navigations" value={enableKeyboardNavigationSound} onChange={() => setEnableKeyboardNavigationSound(!enableKeyboardNavigationSound)} />
            <Option label="Keyboard Shortcut" value={enableKeyboardShortcutSound} onChange={() => setEnableKeyboardShortcutSound(!enableKeyboardShortcutSound)} />
        </VStack>
    )
}

"use client"

import { Box, Text, VStack } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRef, useState } from "react";
import { useSettingContext } from "@/context/SettingContextProvider";
import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";

export const AudioSettingOptions = () => {

    const {
        applicationStartUpSound,
        sectionCreateSound,
        sectionDeleteSound,
        keyboardNavigationSound,
        setApplicationStartUpSound,
        setKeyboardNavigationSound,
        setSectionCreateSound,
        setSectionDeleteSound,
        setSystemsNotificationSound,
        systemsNotificationSound,
    } = useSettingContext()!;

    const [enableKeyboardShortcutSound, setEnableKeyboardShortcutSound] = useState(false);

    const parentRef = useRef<HTMLDivElement>(null);
    useKeyboardNavigation({ role: 'tab', parentRef : parentRef, direction : "vertical" });

    const Option = ({ label, onChange, value } : { label : string, value : boolean, onChange : () => void }) => {
        return (
            <Box
                role="tab"
                tabIndex={0}
                onClick={onChange}
                onKeyDown={(e) => {
                    if(e.key == "Enter") {
                        onChange();
                    }
                }}
                className="w-full flex flex-row items-center justify-between dark:hover:bg-neutral-900 py-2 px-4 rounded-lg cursor-pointer border-2 border-transparent focus-visible:!border-theme-borderNavigation !outline-none !ring-0"
            >
                <Text>{label}</Text>
                <Checkbox tabIndex={-1} checked={value} onChange={onChange} />
            </Box>
        )
    }

    return (
        <VStack ref={parentRef} role="tablist" tabIndex={0} className="w-full space-y-4 py-4 !outline-none !ring-0">
            <Option label="Application Startup" value={applicationStartUpSound} onChange={() => setApplicationStartUpSound(!applicationStartUpSound)} />
            <Option label="Section Create" value={sectionCreateSound} onChange={() => setSectionCreateSound(!sectionCreateSound)} />
            <Option label="Section Delete" value={sectionDeleteSound} onChange={() => setSectionDeleteSound(!sectionDeleteSound)} />
            <Option label="System Notifications" value={systemsNotificationSound} onChange={() => setSystemsNotificationSound(!systemsNotificationSound)} />
            <Option label="Keyboard Navigations" value={keyboardNavigationSound} onChange={() => setKeyboardNavigationSound(!keyboardNavigationSound)} />
            <Option label="Keyboard Shortcut" value={enableKeyboardShortcutSound} onChange={() => setEnableKeyboardShortcutSound(!enableKeyboardShortcutSound)} />
        </VStack>
    )
}

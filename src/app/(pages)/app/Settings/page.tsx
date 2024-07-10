"use client"

import { Box, Text, VStack } from "@chakra-ui/react";
import { AccountSetting } from "./components/AccountSettings/AccountSetting";
import { AudioSettings } from "./components/AudioSettings/AudioSettings";
import { KeyboardShortcutSetting } from "./components/KeyboardShortcut/KeyboardShortcut";
import { GeneralSettings } from "./components/General/GeneralSettings";
import { CustomizationSettings } from "./components/Customization/CustomizationSettings";


export default function SettingPage() 
{
    return (
        <Box className='w-full h-screen overflow-scroll !no-scrollbar overflow-x-hidden p-6 max-sm:p-0 dark:bg-theme-bgSecondary bg-neutral-100 space-y-8'>
            <Text className='text-4xl'>SETTING PAGE</Text>
            <VStack className="w-full p-0">
                <GeneralSettings />
                <AccountSetting/>
                <KeyboardShortcutSetting />
                <AudioSettings/>
                <CustomizationSettings/>
            </VStack>
        </Box>
    )
}

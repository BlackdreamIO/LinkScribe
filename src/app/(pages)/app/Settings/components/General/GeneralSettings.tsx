"use client"

import { useState } from "react";
import { AutoSyncTimeType, DefaultExportType, KeyboardShortcutStatusType, useSettingContext } from "@/context/SettingContextProvider";

import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Box, Flex, Text } from "@chakra-ui/react";


const LabelDropdown = ({ label, onChange, defaultValue, options } : { label : string, defaultValue : string, options : string[], onChange : (value : string) => void }) => {
    const [openDropdown, setOpenDropdown] = useState(false);

    return (
        <Box onClick={() => setOpenDropdown(true)} className={`w-full flex flex-row items-center justify-between py-2 px-4 ${openDropdown ? "dark:bg-neutral-900" : "dark:hover:bg-neutral-900"} cursor-pointer`}>
            <Text className="text-base">{label}</Text>
            <DropdownMenu open={openDropdown} onOpenChange={() => setOpenDropdown(false)}>
                <DropdownMenuTrigger className="text-base">
                    {defaultValue}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="left" className="dark:bg-theme-bgSecondary space-y-2 w-72 p-2 border dark:border-neutral-600">
                    {
                        options.map((option, index) => (
                            <DropdownMenuItem 
                                onClick={() => {
                                    onChange(option);
                                    //setOpenDropdown(false);
                                }}
                                key={index}
                                className="w-full dark:hover:text-theme-textSecondary dark:hover:bg-neutral-900 cursor-pointer text-base transition-none"
                            >
                                {option}
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </Box>
    )
}

const Option = ({ label, onChange, value } : { label : string, value : boolean, onChange : () => void }) => {
    return (
        <Box onClick={onChange} className="w-full flex flex-row items-center justify-between dark:hover:bg-neutral-900 py-2 px-4 rounded-lg cursor-pointer">
            <Text className="text-base">{label}</Text>
            <Checkbox checked={value} onChange={onChange} />
        </Box>
    )
}


const routes = ["Overview", "Search", "List", "Settings"];
const timeIntervals = ['5 Min', '10 Min', '15 Min', '30 Min', '1 Hour', '1 Day', 'Manual'];
const keyboardShortcutMode : string[] = ["Full Controll", "Minimume", "Disabled"];
const defaultExportMode : string[] = ["Png", "Json", "Txt"];

export const GeneralSettings = () => {

    const {
        homeView,
        setHomeView,
        autoSyncTime,
        setAutoSyncTime,
        defaultExportType,
        setDefaultExportType,
        sectionsDefaultOpen,
        setSectionsDefaultOpen,
        showLinkCount,
        setShowLinkCount,
        keyboardShortcutStatus,
        setKeyboardShortcutStatus,
        sidebarDefaultOpen,
        setSidebarDefaultOpen  
    } = useSettingContext()!;

    return (
        <Box className="w-full">
            <Text className='text-2xl p-2 border-b-2 border-theme-borderSecondary'>General</Text>
            <Box className="w-full border py-4 pt-8 px-4 space-y-4 rounded-xl">
                <LabelDropdown
                    label="Home View"
                    defaultValue={homeView}
                    onChange={setHomeView}
                    options={routes}
                />
                <Option
                    label="Experimental features"
                    value={true}
                    onChange={() => {}}
                />
                <Option
                    label="Show Link Count"
                    value={showLinkCount}
                    onChange={() => setShowLinkCount(!showLinkCount)}
                />
                <LabelDropdown
                    label="Auto Sync Time"
                    defaultValue={autoSyncTime}
                    onChange={(value : AutoSyncTimeType | any) => setAutoSyncTime(value)}
                    options={timeIntervals}
                />
                <Option
                    label="Sidebar Default"
                    value={sidebarDefaultOpen}
                    onChange={() => setSidebarDefaultOpen(!sidebarDefaultOpen)}
                />
                <Option
                    label="Sections Default"
                    value={sectionsDefaultOpen}
                    onChange={() => setSectionsDefaultOpen(!sectionsDefaultOpen)}
                />
                <LabelDropdown
                    label="Keyboard Shortcut"
                    defaultValue={keyboardShortcutStatus}
                    onChange={(value : KeyboardShortcutStatusType | any) => setKeyboardShortcutStatus(value)}
                    options={keyboardShortcutMode}
                />
                <LabelDropdown
                    label="Default Export"
                    defaultValue={defaultExportType}
                    onChange={(value : DefaultExportType | any) => setDefaultExportType(value)} options={defaultExportMode}
                />
            </Box>
        </Box>
    )
}

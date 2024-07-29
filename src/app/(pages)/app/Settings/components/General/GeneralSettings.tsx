"use client"

import { useRef, useState } from "react";
import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";
import { useSettingContext } from "@/context/SettingContextProvider";
import { AutoSyncTimeType, DefaultExportType, KeyboardShortcutStatusType, LinkLayoutType } from '@/types/SettingTypes';
import { ROUTES, DEFAULT_EXPORT_MODE, KEYBAORD_SHORTCUT_MODE, SYNC_INTERVAL, GRID_SIZES } from "@/lib/appSetting";

import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Box, Text } from "@chakra-ui/react";


const LabelDropdown = ({ label, onChange, defaultValue, options } : { label : string, defaultValue : string, options : string[], onChange : (value : string) => void }) => {
    const [openDropdown, setOpenDropdown] = useState(false);

    return (
        <Box
            role="tab"
            tabIndex={0}
            onClick={() => setOpenDropdown(true)}
            onKeyDown={(e) => {
                if(e.key == "Enter") {
                    setOpenDropdown(!openDropdown);
                }
            }}
            className={`w-full flex flex-row items-center justify-between py-2 px-4 
            ${openDropdown ? "dark:bg-neutral-900" : "dark:hover:bg-neutral-900"} 
            cursor-pointer border-2 border-transparent focus-visible:!border-theme-borderNavigation !outline-none !ring-0`}
        >
            <Text className="text-base">{label}</Text>
            <DropdownMenu open={openDropdown} onOpenChange={() => setOpenDropdown(false)}>
                <DropdownMenuTrigger tabIndex={-1} className="text-base">
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
        <Box
            role="tab"
            tabIndex={0}
            onKeyDown={(e) => {
                if(e.key == "Enter") {
                    onChange();
                }
            }}
            onClick={onChange}
            className="w-full flex flex-row items-center justify-between dark:hover:bg-neutral-900 py-2 px-4 rounded-lg cursor-pointer border-2 border-transparent focus-visible:!border-theme-borderNavigation !outline-none !ring-0"
        >
            <Text className="text-base">{label}</Text>
            <Checkbox tabIndex={-1} checked={value} onChange={onChange} />
        </Box>
    )
}

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
        setSidebarDefaultOpen,
        linkLayoutDefaultSize,
        setLinkLayoutDefaultSize
    } = useSettingContext()!;

    const parentRef = useRef<HTMLDivElement>(null);
    useKeyboardNavigation({ role: 'tab', parentRef : parentRef, direction : "vertical" })

    return (
        <Box className="w-full">
            <Text className='text-2xl p-2 dark:border-b-2 dark:border-theme-borderSecondary border-transparent'>General</Text>
            <Box role="tablist" ref={parentRef} tabIndex={0} className="w-full border py-4 pt-8 px-4 space-y-4 rounded-xl !outline-none !ring-0">
                <LabelDropdown
                    label="Home View"
                    defaultValue={homeView}
                    onChange={setHomeView}
                    options={ROUTES}
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
                    options={SYNC_INTERVAL}
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
                    options={KEYBAORD_SHORTCUT_MODE}
                />
                <LabelDropdown
                    label="Default Export"
                    defaultValue={defaultExportType}
                    onChange={(value : DefaultExportType | any) => setDefaultExportType(value)} options={DEFAULT_EXPORT_MODE}
                />
                <LabelDropdown
                    label="Default Grid Size"
                    defaultValue={linkLayoutDefaultSize.toLocaleString()}
                    onChange={(value) => setLinkLayoutDefaultSize(parseInt(value))}
                    options={GRID_SIZES}
                />
            </Box>
        </Box>
    )
}

'use client'

import { useState } from "react";
import { useSectionContext } from "@/context/SectionContextProvider";
import { useSectionController } from "@/context/SectionControllerProviders";

import useFullscreenToggle from "@/hook/useFulscreenToggle";
import useTheme from "@/hook/useTheme";

import { ConvertSectionToTxt } from "@/global/convertSectionsToTxt";
import { ConvertSectionToJSON } from "@/global/convertSectionToJSON";

import { Box } from "@chakra-ui/react";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar";


const MenubarTriggerStyle = `dark:bg-theme-bgSecondary dark:hover:bg-theme-bgThird dark:hover:text-theme-textSecondary 
data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:text-theme-textSecondary 
text-sm max-sm:text-xs max-xl:text-sm rounded-lg py-2`;

const MenuItemStyle = `dark:bg-theme-bgSecondary dark:hover:bg-theme-bgThird dark:hover:text-theme-textSecondary 
data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary
text-sm max-sm:text-xs max-xl:text-sm rounded-lg py-2`;

const MenubarContentStyle = `dark:bg-theme-bgSecondary dark:border-neutral-700 mt-3 min-w-80 max-sm:min-w-0 p-2 space-y-3`;

export default function LinksNavbarSettings()
{
    const [menubarOpen, setMenubarOpen] = useState(false);
    
    const [_, setTheme] = useTheme();
    const [fullscreen, setFullscreen] = useFullscreenToggle();
    const { GetSections, contextSections } = useSectionController()!;
    const { setOpenCreatorDialog } = useSectionContext()!;

    const handleMenubarOpen = (value : string) => setMenubarOpen(value != '');
    
    const handleNormalReload = () => {
        window.location.reload();
    }

    const handleForceReload = async () => {
        await GetSections(true);
    }

    const handleTheme = (theme : "dark" | "light") => {
        setTheme(theme);
    }

    const handleExportAsJson = () => ConvertSectionToJSON(contextSections); // export json file

    const handleExportAsTxt = () => ConvertSectionToTxt(contextSections); // export txt file

    return (
        <Box>
            <Menubar tabIndex={0} role="tablist" onValueChange={handleMenubarOpen} className="border-none !bg-transparent">
                <MenubarMenu>
                    <MenubarTrigger role="tab" className={MenubarTriggerStyle}>File</MenubarTrigger>
                    <MenubarContent className={MenubarContentStyle}>
                        <MenubarItem className={MenuItemStyle} onClick={() => setOpenCreatorDialog(true)}>
                            New Section
                        </MenubarItem>
                        <MenubarItem className={MenuItemStyle} onClick={() => setOpenCreatorDialog(true)}>
                            Save
                        </MenubarItem>
                        <MenubarSub>
                            <MenubarSubTrigger role="tab" className={MenubarTriggerStyle}>Export As</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem onClick={handleExportAsJson} className={MenuItemStyle}>Json</MenubarItem>
                                <MenubarItem onClick={handleExportAsTxt} className={MenuItemStyle}>Txt</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarItem className={MenuItemStyle}> Setting </MenubarItem>
                        <MenubarItem className={MenuItemStyle}> Keyboard Shortcut </MenubarItem>
                        <MenubarItem className={MenuItemStyle}> Check For Update </MenubarItem>
                        <MenubarItem className={MenuItemStyle}> About </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger role="tab" className={MenubarTriggerStyle}>View</MenubarTrigger>
                    <MenubarContent className={MenubarContentStyle}>
                        <MenubarItem className={MenuItemStyle}> Zoom In + </MenubarItem>
                        <MenubarItem className={MenuItemStyle}> Zoom Out - </MenubarItem>
                        <MenubarItem disabled className={MenubarTriggerStyle}>Search</MenubarItem>
                        <MenubarItem className={MenubarTriggerStyle} onClick={() => handleNormalReload()}>Reload</MenubarItem>
                        <MenubarItem className={MenubarTriggerStyle} onClick={() => handleForceReload()}>Force Reload {'(Fetch Again)'}</MenubarItem>
                        <MenubarItem className={MenubarTriggerStyle} onClick={() => setFullscreen(!fullscreen)}>Toggle Fullscreen</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger role="tab" className={MenubarTriggerStyle}>Preference</MenubarTrigger>
                    <MenubarContent className={MenubarContentStyle}>
                        <MenubarSub>
                            <MenubarSubTrigger className={MenubarTriggerStyle}>Theme</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem className={MenuItemStyle} onClick={() => handleTheme('dark')}>Dark</MenubarItem>
                                <MenubarItem className={MenuItemStyle} onClick={() => handleTheme('light')}>Light</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarItem className={MenubarTriggerStyle}>Clear Cache</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            <div className={`${menubarOpen ? 'opacity-60' : 'opacity-0  pointer-events-none'} fixed bg-black/60 w-full h-screen z-30 -top-0 transition-all duration-150`}></div>
            {/* <Setting onOpenChange={() => setOpenSettingDialog(false)} openSetting={openSettingDialog} /> */}
        </Box>
    )
}
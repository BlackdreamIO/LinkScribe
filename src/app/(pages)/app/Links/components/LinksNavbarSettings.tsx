'use client'

import { useState } from "react";
import dynamic from 'next/dynamic';
//import { useSectionContext } from "@/context/SectionContextAPI";
//import GenerateCryptoUUID from "@/globalFunction/GenerateCryptoUUID";
import useFullscreenToggle from "@/hook/useFulscreenToggle";
import useTheme from "@/hook/useTheme";
 
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

//const Setting = dynamic(() => import('../(Setting)/Setting'), { ssr: false })

export default function LinksNavbarSettings()
{
    const [openSettingDialog, setOpenSettingDialog] = useState(false);
    const [menubarOpen, setMenubarOpen] = useState(false);

    const [fullscreen, setFullscreen] = useFullscreenToggle();

    //const { CreateSection, GetSections } = useSectionContext()!;

    const CreateNewSection = async () => {
        // await CreateSection({
        //     id : GenerateCryptoUUID({ mode : 'randomUUID', length : 10 }),
        //     data : [],
        //     createdAt : new Date()
        // })
    }

    const handleMenubarOpen = (value : string) => setMenubarOpen(value != '');
    
    const handleNormalReload = () => {
        window.location.reload();
    }
    const handleForceReload = async () => {
        //await GetSections(true);
    }
    const handleTheme = (theme : "dark" | "light" | "system") => {
        //setTheme(theme);
    }
    
    const MenubarTriggerStyle = `dark:bg-theme-bgSecondary dark:hover:bg-theme-bgThird dark:hover:text-theme-textSecondary 
        data-[highlighted]:bg-theme-bgSecondary data-[highlighted]:text-theme-textSecondary 
        text-sm max-sm:text-xs max-xl:text-sm rounded-lg py-2`;
    
    const MenuItemStyle = `dark:bg-theme-bgSecondary dark:hover:bg-theme-bgThird dark:hover:text-theme-textSecondary 
        data-[highlighted]:bg-theme-bgSecondary data-[highlighted]:text-theme-textSecondary 
        text-sm max-sm:text-xs max-xl:text-sm rounded-lg py-2`;
    
    const MenubarContentStyle = `dark:bg-theme-bgSecondary dark:border-neutral-700 mt-3 min-w-80 max-sm:min-w-0 p-2 space-y-3`;

    return (
        <Box>
            <Menubar onValueChange={handleMenubarOpen} className="border-none !bg-transparent">
                <MenubarMenu>
                    <MenubarTrigger className={MenubarTriggerStyle}>File</MenubarTrigger>
                    <MenubarContent className={MenubarContentStyle}>
                        <MenubarItem className={MenuItemStyle} onClick={() => CreateNewSection()}>
                            New Section
                        </MenubarItem>
                        <MenubarItem className={MenuItemStyle} disabled>New Incognito Window</MenubarItem>
                        <MenubarSub>
                            <MenubarSubTrigger className={MenubarTriggerStyle}>Export</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem className={MenuItemStyle}>Json</MenubarItem>
                                <MenubarItem className={MenuItemStyle}>Txt</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarItem className={MenuItemStyle} onClick={() => setOpenSettingDialog(true)}> Setting </MenubarItem>
                        <MenubarItem className={MenuItemStyle}> Keyboard Shortcut </MenubarItem>
                        <MenubarItem className={MenuItemStyle}> Check For Update </MenubarItem>
                        <MenubarItem className={MenuItemStyle}> About </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger className={MenubarTriggerStyle}>View</MenubarTrigger>
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
                    <MenubarTrigger className={MenubarTriggerStyle}>Preference</MenubarTrigger>
                    <MenubarContent className={MenubarContentStyle}>
                        <MenubarSub>
                            <MenubarSubTrigger className={MenubarTriggerStyle}>Theme</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem className={MenuItemStyle} onClick={() => handleTheme('dark')}>Dark</MenubarItem>
                                <MenubarItem className={MenuItemStyle} onClick={() => handleTheme('light')}>Light</MenubarItem>
                                <MenubarItem className={MenuItemStyle} onClick={() => handleTheme('system')}>System</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarItem className={MenubarTriggerStyle}>Clear Cache</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            <div className={`${menubarOpen ? 'opacity-60' : 'opacity-0  pointer-events-none'} fixed bg-black/60 w-full h-screen z-30 -top-0 transition-all duration-150 !backdrop-blur-sm`}></div>
            {/* <Setting onOpenChange={() => setOpenSettingDialog(false)} openSetting={openSettingDialog} /> */}
        </Box>
    )
}
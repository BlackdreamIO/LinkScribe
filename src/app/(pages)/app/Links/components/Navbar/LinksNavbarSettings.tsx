'use client'

import { useEffect, useState } from "react";
import { useSectionContext } from "@/context/SectionContextProvider";
//import { useSectionController } from "@/context/SectionControllerProviders";
import { useUser } from "@clerk/nextjs";

import useFullscreenToggle from "@/hook/useFulscreenToggle";
import useTheme from "@/hook/useTheme";

import { ConvertSectionToTxt } from "@/global/convertSectionsToTxt";
import { ConvertSectionToJSON } from "@/global/convertSectionToJSON";

import { Box, HStack } from "@chakra-ui/react";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
    MenubarSeparator
} from "@/components/ui/menubar";
import { ConditionalRender } from "@/components/ui/conditionalRender";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeCustomizerDialog } from "./ThemeCustomizer/ThemeCustomizerDialog";
import { useSectionContainerContext } from "@/context/SectionContainerContext";


const MenubarTriggerStyle = `dark:bg-theme-bgSecondary dark:hover:bg-theme-bgThird dark:hover:text-theme-textSecondary 
data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:text-theme-textSecondary hover:bg-neutral-200
text-sm max-sm:text-xs max-xl:text-sm rounded-lg py-2`;

const MenuItemStyle = `dark:bg-theme-bgSecondary dark:hover:bg-theme-bgThird dark:hover:text-theme-textSecondary 
data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary hover:bg-neutral-900
text-sm max-sm:text-xs max-xl:text-sm rounded-lg py-2`;

const MenubarContentStyle = `dark:bg-theme-bgSecondary bg-neutral-50 border dark:border-neutral-600 border-black mt-3 min-w-80 max-sm:min-w-0 p-2 space-y-3 rounded-xl
                            shadow-md shadow-black`;

export default function LinksNavbarSettings()
{
    const [menubarOpen, setMenubarOpen] = useState(false);
    const [openThemeCustomizer, setOpenThemeCustomizer] = useState(false);

    const [_, setTheme] = useTheme();
    const [fullscreen, setFullscreen] = useFullscreenToggle();
    //const { GetSections, contextSections } = useSectionController()!;
    const { SelectAllSection, DselectAllSection, setMinimizeAllSections, sectionHighlighted } = useSectionContainerContext();
    const { isLoaded, isSignedIn } = useUser();

    const handleMenubarOpen = (value : string) => setMenubarOpen(value != '');
    
    const handleNormalReload = () => {
        window.location.reload();
    }

    const handleForceReload = async () => {
        //GetSections(true);
    }

    const handleTheme = (theme : "dark" | "light") => {
        setTheme(theme);
    }

    const handleExportAsJson = () => {} //ConvertSectionToJSON(contextSections); // export json file

    const handleExportAsTxt = () => {} //ConvertSectionToTxt(contextSections); // export txt file

    useEffect(() => {
        window.addEventListener("online", () => console.log("online"));
        window.addEventListener("offline", () => console.log("offline"));
        //console.log(navigator.onLine);
    }, [])
    

    return (
        <Box className="w-full">
            <ConditionalRender render={isLoaded && isSignedIn}>
                <Menubar tabIndex={0} role="tablist" onValueChange={handleMenubarOpen} className="border-none !bg-transparent">
                    <MenubarMenu>
                        <MenubarTrigger role="tab" className={MenubarTriggerStyle}>File</MenubarTrigger>
                        <MenubarContent className={MenubarContentStyle}>
                            <MenubarItem className={MenuItemStyle} onClick={() => {}}>
                                New Section
                            </MenubarItem>
                            <MenubarItem className={MenuItemStyle} onClick={() => {}}>
                                Save
                            </MenubarItem>
                            <MenubarSub>
                                <MenubarSubTrigger role="tab" className={MenubarTriggerStyle}>Export As</MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem onClick={handleExportAsJson} className={MenuItemStyle}>Json</MenubarItem>
                                    <MenubarItem onClick={handleExportAsTxt} className={MenuItemStyle}>Txt</MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                            <MenubarSeparator className="dark:bg-neutral-800 bg-neutral-400"/>
                            <MenubarItem className={MenuItemStyle}> Setting </MenubarItem>
                            <MenubarItem className={MenuItemStyle}> Keyboard Shortcut </MenubarItem>
                            <MenubarSeparator className="dark:bg-neutral-800 bg-neutral-400"/>
                            <MenubarItem className={MenuItemStyle}> Check For Update </MenubarItem>
                            <MenubarItem className={MenuItemStyle}> About </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger role="tab" className={MenubarTriggerStyle}>View</MenubarTrigger>
                        <MenubarContent className={MenubarContentStyle}>
                            <MenubarItem className={MenuItemStyle}> Zoom In + </MenubarItem>
                            <MenubarItem className={MenuItemStyle}> Zoom Out - </MenubarItem>
                            <MenubarSeparator className="dark:bg-neutral-800 bg-neutral-400"/>
                            <MenubarItem disabled className={MenubarTriggerStyle}>Search</MenubarItem>
                            <MenubarItem className={MenubarTriggerStyle} onClick={() => handleNormalReload()}>Reload</MenubarItem>
                            <MenubarItem className={MenubarTriggerStyle} onClick={() => handleForceReload()}>Force Reload {'(Fetch Again)'}</MenubarItem>
                            <MenubarSeparator className="dark:bg-neutral-800 bg-neutral-400"/>
                            <MenubarItem disabled={!sectionHighlighted} className={MenuItemStyle} onClick={() => setMinimizeAllSections((prev) => !prev)}>Minimize All</MenubarItem>
                            <MenubarItem className={MenuItemStyle} onClick={() => !sectionHighlighted ? SelectAllSection() : DselectAllSection()}>
                                {sectionHighlighted ? "Deselect All" : "Select All"}
                            </MenubarItem>
                            <MenubarSeparator className="dark:bg-neutral-800 bg-neutral-400"/>
                            <MenubarItem className={MenubarTriggerStyle} onClick={() => setFullscreen(!fullscreen)}>Toggle Fullscreen</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger role="tab" className={MenubarTriggerStyle}>Preference</MenubarTrigger>
                        <MenubarContent className={MenubarContentStyle}>
                            <MenubarItem onClick={() => setOpenThemeCustomizer(true)} className={MenuItemStyle}> Theme Maneger</MenubarItem>
                            <MenubarItem className={MenubarTriggerStyle}>Clear Cache</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </ConditionalRender>

            <ThemeCustomizerDialog open={openThemeCustomizer} onClose={() => setOpenThemeCustomizer(false)} />
            <div className={`${menubarOpen ? 'dark:opacity-100 opacity-0' : 'dark:opacity-0 opacity-0 pointer-events-none'} fixed bg-black/40 backdrop-filter backdrop-blur-sm w-[105%] h-screen z-30 -top-0 -left-5 transition-all duration-150`}></div>
            
            {
                !isLoaded && (
                    <HStack>
                        <Skeleton className="w-14 max-sm:w-1/2 h-5 dark:bg-neutral-800" />
                        <Skeleton className="w-14 max-sm:w-1/2 h-5 dark:bg-neutral-800" />
                        <Skeleton className="w-14 max-sm:w-1/2 h-5 dark:bg-neutral-800" />
                        <Skeleton className="w-14 max-sm:w-1/2 h-5 dark:bg-neutral-800" />
                    </HStack>
                )
            }
        </Box>
    )
}
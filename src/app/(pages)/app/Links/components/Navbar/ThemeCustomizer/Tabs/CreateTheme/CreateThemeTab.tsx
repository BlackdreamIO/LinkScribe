import { useEffect, useState } from "react";
import { useThemeContext } from "@/context/ThemeContextProvider";
import { hsvaToHex } from '@uiw/color-convert';

import Colorful from '@uiw/react-color-colorful';
import Circle from '@uiw/react-color-circle';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { Box, color, Grid, HStack, Text } from "@chakra-ui/react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ConditionalRender } from "@/components/ui/conditionalRender";
import { ColorSelection } from "./ColorSelection";

export const CreateThemeTab = ({ tabValue="createTab" } : { tabValue : string }) => {

    const [themeName, setThemeName] = useState('');

    const [currentBackgroundColor, setCurrentBackgroundColor] = useState('#F44E3B');
    const [currentSectionGlassmorphismEnabled, setCurrentSectionGlassmorphismEnabled] = useState(false);
    const [currentLinkGlassmorphismEnabled, setCurrentLinkGlassmorphismEnabled] = useState(false);
    const [currentDropdownGlassmorphismEnabled, setCurrentDropdownGlassmorphismEnabled] = useState(false);
    const [currentModalGlassmorphismEnabled, setCurrentModalGlassmorphismEnabled] = useState(false);

    const [colorSelectionMode, setColorSelectionMode] = useState<'rgb' | 'gradient'>('rgb');
    const [gradientColors, setGradientColors] = useState({a : "", b : ""});

    const { setAppBackgroundColor, setSectionGlassmorphismEnabled, setLinkGlassmorphismEnabled, themes, setThemes } = useThemeContext();
    
    const SectionStyle = currentSectionGlassmorphismEnabled ? "backdrop-filter backdrop-blur-md dark:bg-black/30" : "dark:bg-theme-bgFifth";
    const LinkStyle = currentLinkGlassmorphismEnabled ? "backdrop-filter backdrop-blur-md dark:bg-black/50" : "dark:bg-neutral-800";

    const handleCreateTheme = () => {
        setAppBackgroundColor(currentBackgroundColor);
        setThemes([...themes, {
            title : themeName,
            appBackground : currentBackgroundColor,
            sectionGlassmorphism : currentSectionGlassmorphismEnabled,
            dropdownGlassmorphism : currentDropdownGlassmorphismEnabled,
            linkGlassmorphism : currentLinkGlassmorphismEnabled,
            modalGlassmorphism : currentModalGlassmorphismEnabled,
            themeImg : ''
        }])
    }

    useEffect(() => {
        if(colorSelectionMode === 'gradient') {
            setCurrentBackgroundColor(`linear-gradient(90deg, ${gradientColors.a} 0%, ${gradientColors.b} 100%)`);
            setSectionGlassmorphismEnabled(currentSectionGlassmorphismEnabled);
            setLinkGlassmorphismEnabled(currentLinkGlassmorphismEnabled);
        }
    }, [gradientColors])

    const SwitchOption = ({ label, checked, onClick } : { label : string, checked : boolean, onClick : () => void }) => {
        return (
            <Box onClick={onClick} className="w-full flex flex-row items-center justify-between space-x-2 px-4 py-2 dark:bg-theme-bgFifth dark:hover:bg-theme-bgThird rounded-xl border">
                <Text className="text-sm dark:text-neutral-300">{label}</Text>
                <Switch checked={checked} onClick={onClick} />
            </Box>
        )
    }

    return (
        <TabsContent className="space-y-4 min-h-[700px]" value={tabValue}>
            <Box className="w-full flex flex-row items-center justify-between space-x-2">
                <Input
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    placeholder="Theme Name"
                    className="w-full dark:bg-theme-bgFifth px-4 h-10 rounded-lg !ring-0 !outline-none"
                />
                <Button
                    disabled={themeName.length < 3}
                    onClick={handleCreateTheme}
                    className="w-48 border dark:bg-theme-bgFifth dark:text-neutral-100 dark:hover:bg-theme-primaryAccent h-10 dark:hover:text-black">
                        Create
                </Button>
            </Box>

            <Box background={currentBackgroundColor} className={`w-full h-96 p-8 rounded-xl`}>
                <Box className={`w-full h-full rounded-xl p-4 space-y-4 flex flex-col items-center justify-center ${SectionStyle}`}>
                    {
                        Array(4).fill(0).map((_, index) => (
                            <Box
                                key={index}
                                className={`w-full h-14 px-4 py-2 rounded-xl ${LinkStyle} flex flex-row items-center justify-start font-sans`}>
                                    <Text> {index} : {crypto.randomUUID().slice(0, 8)}</Text> 
                            </Box>
                        ))
                    }
                </Box>
            </Box>

            <Box className="w-full p-2 dark:bg-theme-bgSecondary rounded-xl space-y-2">
                <Box className="w-full flex flex-row items-center justify-between space-x-2 px-4 py-2 dark:bg-theme-bgFifth border dark:hover:bg-theme-bgThird">
                    <Text className="text-sm dark:text-neutral-300">Color Mode</Text>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger className="text-neutral-500 dark:hover:text-white">
                            {colorSelectionMode}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 border-neutral-600 dark:bg-theme-bgFourth mr-5 space-y-2 rounded-xl p-2 shadow-lg dark:shadow-black">
                            <DropdownMenuItem onClick={() => setColorSelectionMode('rgb')}>RGB_COLORS</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setColorSelectionMode('gradient')}>LINIEAR_GRADIENT</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Box>
                <ColorSelection
                    currentBackgroundColor={currentBackgroundColor}
                    gradientColors={gradientColors}
                    setGradientColors={setGradientColors}
                    colorSelectionMode={colorSelectionMode}
                    setCurrentBackgroundColor={setCurrentBackgroundColor} 
                />
                <Box className="grid grid-cols-2 gap-2">
                    <SwitchOption checked={currentSectionGlassmorphismEnabled} label="Enable Section Glassmorphism" onClick={() => setCurrentSectionGlassmorphismEnabled(!currentSectionGlassmorphismEnabled)} />
                    <SwitchOption checked={currentLinkGlassmorphismEnabled} label="Enable Link Glassmorphism" onClick={() => setCurrentLinkGlassmorphismEnabled(!currentLinkGlassmorphismEnabled)} />
                    <SwitchOption checked={currentDropdownGlassmorphismEnabled} label="Enable Dropdown Glassmorphism" onClick={() => setCurrentDropdownGlassmorphismEnabled(!currentDropdownGlassmorphismEnabled)} />
                    <SwitchOption checked={currentModalGlassmorphismEnabled} label="Enable Modal Glassmorphism" onClick={() => setCurrentModalGlassmorphismEnabled(!currentModalGlassmorphismEnabled)} />
                </Box>
            </Box>
        </TabsContent>
    )
}

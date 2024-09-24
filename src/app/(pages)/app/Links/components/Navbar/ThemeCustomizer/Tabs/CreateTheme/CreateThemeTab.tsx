import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { Box, Grid, Text } from "@chakra-ui/react";

import Colorful from '@uiw/react-color-colorful';
import { hsvaToHex } from '@uiw/color-convert';
import { useState } from "react";
import Circle from '@uiw/react-color-circle';
import { useThemeContext } from "@/context/ThemeContextProvider";

export const CreateThemeTab = ({ tabValue="createTab" }) => {
    const [hex, setHex] = useState('#F44E3B');

    const { setAppBackgroundColor, sectionGlassmorphismEnabled, setSectionGlassmorphismEnabled, linkGlassmorphismEnabled, setLinkGlassmorphismEnabled } = useThemeContext();
    
    const SectionStyle = sectionGlassmorphismEnabled ? "backdrop-filter backdrop-blur-md dark:bg-black/30" : "dark:bg-theme-bgFifth";
    const LinkStyle = linkGlassmorphismEnabled ? "backdrop-filter backdrop-blur-md dark:bg-black/50" : "dark:bg-neutral-800"

    return (
        <TabsContent className="space-y-4 h-[660px]" value={tabValue}>
            <Box className="w-full flex flex-row items-center justify-between space-x-2">
                <Input placeholder="Theme Name" className="w-full dark:bg-theme-bgFifth px-4 h-10 rounded-lg !ring-0 !outline-none" />
                <Button className="w-48 border dark:bg-theme-bgFifth dark:text-neutral-100 dark:hover:bg-theme-primaryAccent h-10 dark:hover:text-black">Create</Button>
            </Box>

            <Box background={hex} className={`w-full h-96 p-8 rounded-xl`}>
                <Box className={`w-full h-full rounded-xl p-4 space-y-4 flex flex-col items-center justify-center ${SectionStyle}`}>
                    <Box className={`w-full h-14 px-4 py-2 rounded-xl ${LinkStyle} flex flex-row items-center justify-start font-sans`}> <Text>Example Text</Text> </Box>
                    <Box className={`w-full h-14 px-4 py-2 rounded-xl ${LinkStyle} flex flex-row items-center justify-start font-sans`}> <Text>Example Text</Text> </Box>
                    <Box className={`w-full h-14 px-4 py-2 rounded-xl ${LinkStyle} flex flex-row items-center justify-start font-sans`}> <Text>Example Text</Text> </Box>
                    <Box className={`w-full h-14 px-4 py-2 rounded-xl ${LinkStyle} flex flex-row items-center justify-start font-sans`}> <Text>Example Text</Text> </Box>
                </Box>
            </Box>

            <Box className="w-full p-2 dark:bg-neutral-900 rounded-xl space-y-2">
                <Box className="w-full flex flex-row items-center justify-between space-x-2 px-4 py-2 dark:bg-black">
                    <Text className="text-sm dark:text-neutral-300">Color Mode</Text>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-neutral-500 dark:hover:text-white">
                            RGB_COLORS
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 border-neutral-600 dark:bg-theme-bgFourth mr-5 space-y-2 rounded-xl p-2 shadow-lg dark:shadow-black">
                            <DropdownMenuItem>RGB_COLORS</DropdownMenuItem>
                            <DropdownMenuItem>LINIEAR_GRADIENT</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Box>
                <Box className="w-full flex flex-row items-center justify-between space-x-2 px-4 py-2 dark:bg-black">
                    <Text className="text-sm dark:text-neutral-300">Select Color</Text>
                    <Circle
                        colors={[ '#67e8f9', '#2563eb', '#4f46e5', '#7c3aed', '#10b981', '#4ade80', '#64748B', '#475569', '#334155', '#6B7280', '#4B5563', '#374151', '#737373', '#525252', '#404040', '#71717A', '#52525B', '#3F3F46', '#06B6D4', '#0891B2', '#0E7490', '#3B82F6', '#2563EB', '#1D4ED8', '#6366F1', '#4F46E5' ]}
                        color={hex}
                        onChange={(color) => {
                            setHex(color.hex);
                            setAppBackgroundColor(color.hex)
                        }}
                    />
                </Box>
                <Box className="w-full flex flex-row items-center justify-between space-x-2 px-4 py-2 dark:bg-black">
                    <Text className="text-sm dark:text-neutral-300">Enable Glassmorphism Section</Text>
                    <Switch checked={sectionGlassmorphismEnabled} onClick={() => setSectionGlassmorphismEnabled(!sectionGlassmorphismEnabled)} />
                </Box>
                <Box className="w-full flex flex-row items-center justify-between space-x-2 px-4 py-2 dark:bg-black">
                    <Text className="text-sm dark:text-neutral-300">Enable Glassmorphism Links</Text>
                    <Switch checked={linkGlassmorphismEnabled} onClick={() => setLinkGlassmorphismEnabled(!linkGlassmorphismEnabled)} />
                </Box>
                <Box className="w-full flex flex-row items-center justify-between space-x-2 px-4 py-2 dark:bg-black">
                    <Text className="text-sm dark:text-neutral-300">Enable Glassmorphism Dropdowns</Text>
                    <Switch checked={linkGlassmorphismEnabled} onClick={() => setLinkGlassmorphismEnabled(!linkGlassmorphismEnabled)} />
                </Box>
                <Box className="w-full flex flex-row items-center justify-between space-x-2 px-4 py-2 dark:bg-black">
                    <Text className="text-sm dark:text-neutral-300">Enable Glassmorphism Modal Pop Up</Text>
                    <Switch checked={linkGlassmorphismEnabled} onClick={() => setLinkGlassmorphismEnabled(!linkGlassmorphismEnabled)} />
                </Box>
                <Box className="w-full flex flex-row items-center justify-between space-x-2 px-4 py-2 dark:bg-black">
                    <Text className="text-sm dark:text-neutral-300">System Theme Ovveride</Text>
                    <Switch />
                </Box>
            </Box>
        </TabsContent>
    )
}

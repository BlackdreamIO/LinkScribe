import { useState } from 'react';
import { hsvaToHex } from '@uiw/color-convert';

import Colorful from '@uiw/react-color-colorful';
import Circle from '@uiw/react-color-circle';

import { Box, HStack, Text } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ConditionalRender } from "@/components/ui/conditionalRender";

type ColorSelectionTypes = {
    colorSelectionMode : 'rgb' | 'gradient',
    currentBackgroundColor : string,
    setCurrentBackgroundColor : React.Dispatch<React.SetStateAction<string>>,
    gradientColors : { a : string, b : string },
    setGradientColors : React.Dispatch<React.SetStateAction<{ a : string, b : string }>>
}

export const ColorSelection = (props : ColorSelectionTypes) => {

    const { colorSelectionMode, currentBackgroundColor, setCurrentBackgroundColor, gradientColors, setGradientColors } = props;

    return (
        <Box className="w-full flex flex-row items-center justify-between space-x-2 px-4 py-2 dark:bg-theme-bgFifth dark:hover:bg-theme-bgThird">
            <Text className="text-sm dark:text-neutral-300">Select Color</Text>
            <Circle
                colors={[ '#67e8f9', '#2563eb', '#4f46e5', '#7c3aed', '#10b981', '#4ade80', '#64748B', '#475569', '#334155', '#6B7280', '#4B5563', '#374151', '#737373', '#525252', '#404040', '#71717A', '#52525B', '#000', '#3F3F46', '#06B6D4', '#0891B2', '#0E7490', '#3B82F6', '#2563EB', '#1D4ED8', '#6366F1', '#4F46E5' ]}
                color={currentBackgroundColor}
                onChange={(color) => setCurrentBackgroundColor(color.hex)}
            />
            <Popover>
                <PopoverTrigger>
                    <Button className="w-32 border dark:bg-theme-bgFifth dark:text-neutral-100 dark:hover:bg-theme-bgThird h-10">
                        Custom
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="space-y-4 w-auto border-2 border-neutral-700 capitalize">
                    <Text>Select {colorSelectionMode} Color</Text>
                    <ConditionalRender render={colorSelectionMode === 'rgb'}>
                        <Colorful
                            color={currentBackgroundColor}
                            onChange={(color) => setCurrentBackgroundColor(hsvaToHex(color.hsva))}
                            disableAlpha
                        />
                    </ConditionalRender>
                    <ConditionalRender render={colorSelectionMode === 'gradient'}>
                        <HStack className="space-x-4">
                            <Colorful
                                color={gradientColors.a}
                                onChange={(color) => setGradientColors({a : hsvaToHex(color.hsva), b : gradientColors.b})}
                                disableAlpha
                            />
                            <Colorful
                                color={gradientColors.b}
                                onChange={(color) => setGradientColors({b : hsvaToHex(color.hsva), a : gradientColors.a})}
                                disableAlpha
                            />
                        </HStack>
                    </ConditionalRender>
                </PopoverContent>
            </Popover>
        </Box>
    )
}

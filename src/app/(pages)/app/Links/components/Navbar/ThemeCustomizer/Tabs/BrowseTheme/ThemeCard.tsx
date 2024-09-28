import { Button } from "@/components/ui/button";
import { ConditionalRender } from "@/components/ui/conditionalRender";
import { IAppTheme } from "@/interface/AppTheme";
import { Box, GridItem, Heading, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";

type ThemeCardProps = {
    isActive : boolean;
    theme : IAppTheme;
    onApply : () => void;
    onCustomize : () => void;
    onDelete : () => void;
}

export const ThemeCard = ({ onApply, onCustomize, onDelete, isActive, theme } : ThemeCardProps) => {

    const { title, themeImg, appBackground } = theme;

    const buttonStyle= `dark:hover:bg-neutral-300 dark:hover:text-black text-xs transition-none outline-4 outline-transparent focus-visible:!outline-theme-borderNavigation !ring-0 !border-none`;
    const SectionStyle = theme.sectionGlassmorphism ? "backdrop-filter backdrop-blur-md dark:bg-black/30" : "dark:bg-theme-bgFifth";
    const LinkStyle = theme.linkGlassmorphism ? "backdrop-filter backdrop-blur-md dark:bg-black/50" : "dark:bg-neutral-800";
    
    return (
        <GridItem className={`flex flex-col items-center justify-center space-y-8 p-2 dark:bg-theme-bgFifth dark:hover:bg-theme-bgThird rounded-xl
            shadow-md shadow-black ${isActive ? "border-2 border-theme-textSecondary" : "border"}`}>
            <Heading className="text-xl font-bold from-cyan-500 via-theme-primaryAccent to-indigo-300 bg-gradient-to-r bg-clip-text text-transparent">
                {title}
            </Heading>
            <ConditionalRender render={themeImg.length > 4}>
                <Image
                    src={themeImg}
                    width={100}
                    height={100}
                    alt="Light Theme"
                    unoptimized
                    className="w-full rounded-lg"
                />
            </ConditionalRender>
            <ConditionalRender render={themeImg.length <= 4}>
                <Box background={appBackground} className="w-full p-4">
                    <Box className={`w-full h-full rounded-xl p-4 space-y-4 flex flex-col items-center justify-center ${SectionStyle}`}>
                        {
                            Array(3).fill(0).map((_, index) => (
                                <Box
                                    key={index}
                                    className={`w-full h-10 px-4 py-2 rounded-xl ${LinkStyle} flex flex-row items-center justify-start text-xs font-sans`}>
                                        <Text> LINK </Text> 
                                </Box>
                            ))
                        }
                    </Box>
                </Box>
            </ConditionalRender>
            <HStack className="w-full justify-end dark:bg-theme-bgSecondary rounded-md border-[1px] border-neutral-600">
                <Button disabled={isActive} onClick={onApply} variant={"ghost"} className={buttonStyle}>Apply</Button>
                <Button onClick={onCustomize} variant={"ghost"} className={buttonStyle}>Customize</Button>
                <Button onClick={onDelete} variant={"destructive"} className={buttonStyle}>Delete</Button>
            </HStack>
        </GridItem>
    )
}

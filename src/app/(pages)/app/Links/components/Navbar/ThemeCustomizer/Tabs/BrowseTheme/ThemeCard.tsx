import { Button } from "@/components/ui/button";
import { GridItem, Heading, HStack } from "@chakra-ui/react";
import Image from "next/image";

type ThemeCardProps = {
    title : string;
    themeImg : string;
    onApply : () => void;
    onCustomize : () => void;
}

export const ThemeCard = ({ title, themeImg, onApply, onCustomize } : ThemeCardProps) => {

    const buttonStyle= `dark:hover:bg-neutral-300 dark:hover:text-black text-xs transition-none outline-4 outline-transparent focus-visible:!outline-theme-borderNavigation !ring-0 !border-none`;
    return (
        <GridItem className="flex flex-col items-center justify-center space-y-8 p-2 dark:bg-theme-bgFifth dark:hover:bg-theme-bgThird rounded-xl border
            shadow-md shadow-black">
            <Heading className="text-xl font-bold from-cyan-500 via-theme-primaryAccent to-indigo-300 bg-gradient-to-r bg-clip-text text-transparent">
                {title}
            </Heading>
            <Image
                src={themeImg}
                width={100}
                height={100}
                alt="Light Theme"
                unoptimized
                className="w-full rounded-lg"
            />
            <HStack className="w-full justify-end dark:bg-theme-bgSecondary rounded-md border-[1px] border-neutral-600">
                <Button onClick={onApply} variant={"ghost"} className={buttonStyle}>Apply</Button>
                <Button onClick={onCustomize} variant={"ghost"} className={buttonStyle}>Customize</Button>
            </HStack>
        </GridItem>
    )
}

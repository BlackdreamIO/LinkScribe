import { Box, Heading, Text, VStack } from "@chakra-ui/react";

import { Switch } from "@/components/ui/switch";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useUser } from "@clerk/nextjs";
  

const QualitySwitchWithTooltip = ({ label, tooltipContent, disabled=false } : { label: string, disabled?: boolean, tooltipContent: string }) => {
    return (
        <Box className="w-full flex flex-row items-center justify-between space-x-2">
            <Box className="flex flex-row items-center justify-center space-x-2">
                <Text>{label}</Text>
                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger disabled={disabled}>
                            <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent className="dark:bg-theme-bgFifth dark:text-white text-sm max-w-56 border border-neutral-700">
                            {tooltipContent}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </Box>
            <Switch />
        </Box>
    );
};

export const AGGenarationSettings = () => {

    const { user } = useUser();

    return (
        <Box className="w-full space-y-8">
            <Heading className="text-xl">Generation Settings</Heading>
            <VStack className="px-4 space-y-4 dark:text-neutral-300">
                <Box className="w-full flex flex-row items-center justify-between space-x-2">
                    <Text>Use Cached Response For Better Performance</Text>
                    <Switch/>
                </Box>
                <QualitySwitchWithTooltip
                    label="Remember Prevoius Session"
                    tooltipContent="If this is on, the next time you will use this cache and you can directly use this cache. It is not recommended to use this, but if you want to use this then you can."
                />
                <QualitySwitchWithTooltip
                    label="Prefere Quality Over Speed"
                    tooltipContent="If this is on, the AI will take a few more seconds to understand your prompt better and generate a better output. It is not recommended to use this, but if you want to generate a better output then you can."
                />
                <QualitySwitchWithTooltip
                    label="Avoid Slowdowns"
                    tooltipContent="If this is on, the AI will not generate a response that is too slow. It is not recommended to use this, but if you want to generate a better output then you can."
                />
                <QualitySwitchWithTooltip
                    label="Auto Fail While Generation Of Adult Links"
                    tooltipContent="By default, it is recommended that you turn on this option because some users might generate bad links from our app. If you turn this off, you might see some bad links in your result."
                />
            </VStack>

            <Box className="space-y-2 w-full">
                <Text className="text-xl font-semibold text-center text-yellow-400"> Warning : {user?.username} </Text> 
                <Text className="text-center text-neutral-400 font-sans">
                    The AI may not always be 100% accurate. Additionally, please note that generating excessive adult content links is 
                    strictly prohibited. Our system does not allow the storage of any adult links. If you do so, your account may be blocked.
                    It is important to clarify that this does not mean other users can view your links, nor does our system have access to them.
                    Our AI improves its performance based on the types of links you search for, which helps identify popular links among users.
                    This method of collecting data allows the AI to target specific areas for enhancement.
                    However, if you generate adult links and caching is enabled on our server,
                    other users who have also enabled caching may encounter issues. Therefore,
                    it is essential to adhere to our content guidelines to ensure a safe and reliable experience for all users.
                </Text>
            </Box>
        </Box>
    )
}

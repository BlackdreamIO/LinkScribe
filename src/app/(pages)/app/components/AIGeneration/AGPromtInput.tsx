import { useAuth, useUser } from "@clerk/nextjs";
import { useAGContextWrapper } from "./AGContextWrapper";
import { useSendToastMessage } from "@/hook/useSendToastMessage";
import { generateAILinks } from "@/app/actions/gpt/generateLinks";

import { Box, HStack, Text } from "@chakra-ui/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export const AGPromtInput = () => {

    const { prompt, setPrompt, setGeneratedLinks, loading, setLoading } = useAGContextWrapper();

    const { ToastMessage } = useSendToastMessage();

    const { user } = useUser();
    const { getToken } = useAuth();

    const handleGenerate = async () => {

        if(!user) return;

        setLoading(true);

        const token = await getToken({ template : "linkscribe-supabase"});

        if(!token) {
            console.log('Token Required');
            setLoading(false);
            return;
        }

        const { links, code, error, message, usages } = await generateAILinks({
            prompt : prompt,
            userId : token,
            maxGeneration : 5
        });

        if(code !== 200 || error != null) {
            ToastMessage({ message : "Error While Generating", description : message, type : 'Error', duration : 5000 });
            setLoading(false);
        }

        console.log(links);
        setGeneratedLinks(links);
        setLoading(false);
    }


    return (
        <Box className="w-full space-y-4">
            <HStack className="flex-wrap !gap-4 w-full">
                {
                    Array("Generate 5 Usefull Link", "Generate 5 Useful Link For Productivtiy", "Usefull Websites", "Free Software Links").map((title, index) => (
                        <Box onClick={() => setPrompt(title)} key={index} className="w-auto px-4 py-2 dark:bg-theme-bgFifth dark:hover:bg-theme-bgThird border border-neutral-700 rounded-lg cursor-default">
                            <Text className="text-sm max-md:text-xs">{title}</Text>
                        </Box>
                    ))
                }
            </HStack>
            <Box className="w-full space-y-2">
                <Textarea
                    placeholder="Example : Generate 5 Usefull Link or 5 Useful Link For Productivtiy"
                    className="w-full dark:bg-theme-bgFifth h-48 resize-none focus-visible:ring-theme-textSecondary"
                    onChange={(e) => setPrompt(e.target.value)}
                    value={prompt}
                />
                <HStack className="w-full flex flex-row items-center justify-center space-x-2">
                    <Button
                        disabled={loading}
                        onClick={handleGenerate}
                        className="w-full dark:bg-theme-bgFifth dark:hover:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white border h-10"
                    >
                        Generate
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Settings/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-auto dark:bg-theme-bgFifth border border-neutral-700 py-2">
                            <DropdownMenuLabel className="text-xl">Generation Mode</DropdownMenuLabel>
                            <DropdownMenuItem className="py-2 dark:hover:bg-theme-bgThird cursor-pointer">Skip Cache Always Generate Through AI</DropdownMenuItem>
                            <DropdownMenuItem className="py-2 dark:hover:bg-theme-bgThird cursor-pointer">Generate  Through Cache + AI (faster)</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </HStack>
            </Box>
        </Box>
    )
}

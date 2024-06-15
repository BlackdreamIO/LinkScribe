"use client"

import { useClerk, useUser } from "@clerk/nextjs";
import { EmailAddressResource } from "@clerk/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

import { ChevronRight, CircleCheck } from "lucide-react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ToastAction } from "@/components/ui/toast";
import { AccountSetting } from "./components/AccountSettings/AccountSetting";


export default function SettingPage() 
{
    const { session } = useClerk();
    const { isSignedIn, user } = useUser();

    const { toast } = useToast();
    const router = useRouter();

    const handleChangePrimaryEmail = async (email : EmailAddressResource, eIndex : number) => {
        if (!user) return;
        try 
        {
            await user.update({ primaryEmailAddressId: email.id });
            await session?.reload();
            router.refresh();
            toast({
                title: `Primary Email Has Beem Changed To : ${user.primaryEmailAddress?.emailAddress}`,
                description: "Swipe To Skipp",
                variant : "default",
                action : <ToastAction altText="Try again">Ok</ToastAction>,
                className : "fixed bottom-5 right-2 w-6/12 dark:bg-theme-bgFourth border-2 !border-theme-borderSecondary"
            })
        } 
        catch (error) 
        {
            console.error("Failed to update primary email address:", error);
            toast({
                title: "Failed to update primary email address: check console for more !",
                description: "AUTHENTICATION ERROR",
                action : <ToastAction altText="Try again">Try Again</ToastAction>,
            });
        }
    }

    const ProfileButtonStyle = `w-full h-10 rounded-xl border
        dark:bg-theme-bgPrimary dark:hover:bg-theme-bgThird
        dark:text-neutral-500 dark:hover:text-theme-textSecondary 
        dark:focus-visible:bg-theme-bgThird dark:focus-visible:text-theme-textSecondary 
        focus-visible:!outline-blue-500 !ring-0
    `;

    return (
        <Box className='w-full h-screen overflow-scroll !no-scrollbar overflow-x-hidden p-6 max-sm:p-0 dark:bg-theme-bgSecondary bg-neutral-100 space-y-8'>
            <Text className='text-4xl'>SETTING PAGE</Text>
            <VStack className="w-full p-0">
                <AccountSetting/>
            </VStack>
        </Box>
    )
}

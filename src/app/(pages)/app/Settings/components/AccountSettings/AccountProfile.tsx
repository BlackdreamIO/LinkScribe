"use client"

import { useClerk, useUser } from "@clerk/nextjs";
import { EmailAddressResource } from "@clerk/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

import { ToastAction } from "@/components/ui/toast";
import { AtSign, ChevronRight, CircleCheck, Clipboard } from "lucide-react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const AccountProfileSection = () => {
    
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
                className : "fixed bottom-5 right-2 w-6/12 dark:bg-theme-bgFourth border-2 !border-theme-borderSecondary rounded-xl"
            })
        } 
        catch (error) 
        {
            console.error("Failed to update primary email address:", error);
            toast({
                title: "Failed to update primary email address: check console for more !",
                description: "AUTHENTICATION ERROR",
                action : <ToastAction altText="Try again">Try Again</ToastAction>,
                className : "fixed bottom-5 right-2 w-6/12 rounded-xl"
            });
        }
    }

    return (
        <Box className="flex flex-row items-center justify-start space-x-8 max-sm:flex-col max-sm:justify-center max-sm:space-x-0 w-full max-sm:space-y-4  overflow-hidden">
            {
                isSignedIn ? (
                    <>
                        <Image
                            src={user.imageUrl ?? ''}
                            alt=""
                            width={100}
                            height={100}
                            className="w-36 h-36 rounded-full border-2 border-[mediumspringgreen]"
                        />
                        <Box className="flex flex-col items-start justify-center">
                            <Flex flexDir={"column"} justifyContent={"center"} alignItems={"start"} className="space-y-2 max-sm:!items-center">
                                <Text className="dark:text-neutral-300 text-2xl max-tiny:truncate">{user.firstName}</Text>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="dark:text-neutral-300 flex flex-row gap-2 items-center border-2 dark:border-transparent border-transparent focus-visible:!border-blue-500 !ring-0 !outline-none rounded-xl">
                                        {user.primaryEmailAddress?.emailAddress}
                                        <ChevronRight />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="start" className="w-80 dark:bg-theme-bgSecondary !bg-opacity-5 backdrop-filter !backdrop-blur-md space-y-2 py-2 border-2 dark:border-neutral-700">
                                        {
                                            user.emailAddresses.map((email, index) => (
                                                <DropdownMenuItem 
                                                    onClick={() => {
                                                        if(email.verification.status == "verified") {
                                                            handleChangePrimaryEmail(email, index);
                                                        }
                                                    }}
                                                    className={`${user.primaryEmailAddressId == email.id ? "text-theme-textSecondary" : "dark:text-neutral-500"} dark:hover:text-white dark:hover:bg-theme-bgFifth gap-2`}
                                                    key={index}
                                                >
                                                    {email.emailAddress}
                                                    {email.verification.status == "verified" && <CircleCheck />}
                                                </DropdownMenuItem>       
                                            ))
                                        }
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Text className="dark:text-neutral-600 flex flex-row items-center gap-2 max-tiny:truncate">
                                    {user.primaryEmailAddressId} 
                                    <Clipboard 
                                        className="cursor-pointer dark:hover:text-white"
                                        onClick={() => {
                                            navigator.clipboard.writeText(user.primaryEmailAddressId ?? "")
                                                .then((e) => {
                                                    toast({
                                                        title : "EMAIL ID HAS BEEN COPIED TO CLIPBOARD",
                                                        className : "fixed bottom-5 right-2 w-6/12 dark:bg-theme-bgFourth border-2 !border-theme-borderSecondary rounded-xl",
                                                        duration : 1200,
                                                        action : <ToastAction altText="Ok">Ok</ToastAction>,
                                                    })
                                                })
                                        }} 
                                    />
                                </Text>
                            </Flex>
                        </Box>
                    </>
                )
                :
                (
                    <Box className="dark:bg-theme-bgForuth p-4 w-full rounded-xl flex flex-row items-center justify-start space-x-8">
                        <Skeleton className="w-36 h-36 rounded-full" />
                        <Box className="flex flex-col items-start justify-center space-y-8">
                            <Flex flexDir={"column"} justifyContent={"center"} alignItems={"start"} className="space-y-2 flex-grow w-full">
                                <Skeleton className="animate-none w-9/12 h-5 rounded-full" />
                                <Skeleton className="animate-none w-9/12 h-5 rounded-full" />
                            </Flex>
                            <Flex flexDir={"row"} justifyContent={"center"} alignItems={"center"} className="space-x-4">
                                <Skeleton className="animate-none w-36 h-7 rounded-xl" />
                                <Skeleton className="animate-none w-36 h-7 rounded-xl" />
                                <Skeleton className="animate-none w-36 h-7 rounded-xl" />
                            </Flex>
                        </Box>
                    </Box>
                )
            }
        </Box>
    )
}

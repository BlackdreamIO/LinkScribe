"use client"

import { useEffect, useState } from 'react';
import { useClerk, useUser } from "@clerk/nextjs";
import { OAuthStrategy, ExternalAccountResource } from "@clerk/types";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from "@/components/ui/button";
import { DeleteIcon, Info, Plus } from "lucide-react";

import googlePNGIcon from '../../../../../../../public/icons/googleIcon.png';
import githubPNGIcon from '../../../../../../../public/icons/githubIcon.png';
import notionPNGIcon from '../../../../../../../public/icons/notion.png';
import Image from "next/image";
import { Skeleton } from '@/components/ui/skeleton';


type AvailableProvidersType = {
    name : string;
    strategy : OAuthStrategy;
}

const availableProviders : AvailableProvidersType[] = [
  { name: "Google", strategy: "oauth_google" },
  { name: "GitHub", strategy: "oauth_github" },
  { name: "Notion", strategy: "oauth_notion" },
];

const ButtonStyle = `w-full h-14 rounded-xl border
        dark:bg-theme-bgFourth dark:hover:bg-theme-bgThird
        dark:text-neutral-500 dark:hover:text-theme-textSecondary 
        dark:focus-visible:bg-theme-bgThird dark:focus-visible:text-theme-textSecondary 
        focus-visible:!outline-blue-500 !ring-0
        flex items-center justify-start gap-2 pointer-events-auto
`;

export const ConnectedProviderAccount = () => {
    
    const [currentProviderStrategies, setCurrentProviderStrategies] = useState<AvailableProvidersType[]>([]);

    const { toast } = useToast();

    const { isSignedIn, user } = useUser();
    const { navigate } = useClerk();

    useEffect(() => {
        if (user) {
            const connectedStrategies = user.verifiedExternalAccounts.map(a => `oauth_${a.provider}`) as OAuthStrategy[];
            const unconnectedStrategies = availableProviders.filter(provider => !connectedStrategies.includes(provider.strategy));
            setCurrentProviderStrategies(unconnectedStrategies);
        }
      }, [user, availableProviders]);

    const handleConnectAccount = async (strategy: OAuthStrategy) => {
        if (!user || !isSignedIn) return;
    
        const redirectUrl = window.location.href;
        const additionalScopes: any = [];
    
        try {
            const res = await user.createExternalAccount({
                strategy,
                redirectUrl,
                additionalScopes,
            });
    
            if (res.verification?.externalVerificationRedirectURL) {
                navigate(res.verification.externalVerificationRedirectURL.href);
            }
    
            // Update state after connecting a new account
            const connectedStrategies = user.verifiedExternalAccounts.map(a => `oauth_${a.provider}`) as OAuthStrategy[];
            const unconnectedStrategies = availableProviders.filter(provider => !connectedStrategies.includes(provider.strategy));
            setCurrentProviderStrategies(unconnectedStrategies);
    
            toast({
                title: 'Connected',
                description: `Connected to ${strategy}`,
                duration: 9000,
            })
        } 
        catch (err) {
            console.error(err);
            toast({
                title: 'Error',
                description: 'Failed to connect account',
                duration: 9000,
            })
        }
    }

    const handleRemoveExternalAccount = async (deleteEmail : ExternalAccountResource, eIndex : number) => {
        try 
        {
            if(!user) return;

            for (const currentExternalAccount of user.externalAccounts || []) {
                if (currentExternalAccount.id === deleteEmail.id) {
                    await currentExternalAccount.destroy();
                    break;
                }
            }
            toast({
                title: `Connected Account Has Been Destoryed`,
                action : <ToastAction altText="Ok">Ok</ToastAction>,
                className : "fixed bottom-5 right-2 w-6/12 rounded-xl border-2 border-theme-borderSecondary"
            });
        } 
        catch (error) 
        {
            console.error("Failed to delete external account:", error);
            toast({
                title: `Failed To Delete Connected Account`,
                action : <ToastAction altText="Ok">Ok</ToastAction>,
                variant : "destructive",
                className : "fixed bottom-5 right-2 w-6/12 rounded-xl border-2 border-theme-borderSecondary"
            });
        }
    }

    const GetDyanmicIconByProvider = ( { externalAccount } : { externalAccount : ExternalAccountResource }) => {
        return (
            <>
                {   
                    externalAccount.provider == "google" && 
                        <Image 
                            src={googlePNGIcon.src} 
                            alt="icon not found" 
                            width={100}
                            height={100}
                            loading="lazy"
                            className="w-7 h-7"
                        />
                }
                {
                    externalAccount.provider == "github" && 
                    <Image 
                        src={githubPNGIcon.src} 
                        alt="icon not found" 
                        width={100}
                        height={100}
                        loading="lazy"
                        className="w-7 h-7"
                    />
                }
                {
                    externalAccount.provider == "notion" && 
                    <Image 
                        src={notionPNGIcon.src} 
                        alt="icon not found" 
                        width={100}
                        height={100}
                        loading="lazy"
                        className="w-7 h-7"
                    />
                }
            </>
        )
    }

    const GetConnectedAccountWithProvider = () => {
        return (
            isSignedIn ? (
                user && user.externalAccounts && user.externalAccounts.length > 0 && (
                    user.externalAccounts.map((account, index) => (
                        account.emailAddress && account.provider && (
                            <HStack key={index} className="space-x-4 max-sm:space-x-0 px-4 py-2 flex flex-row items-center justify-between w-full max-sm:!flex-col max-sm:!justify-center max-sm:!items-start">
                                <Box className='flex flex-row items-center justify-start space-x-4'>
                                    <Text>
                                        <GetDyanmicIconByProvider externalAccount={account} />
                                    </Text>
                                    <Text className="flex-grow flex flex-row gap-2 space-x-4">
                                        <span className='max-[425px]:hidden'>
                                            {account.provider == "github" ? account.username : `${account.firstName} ${account.lastName}`}
                                        </span>
                                        <span className="dark:text-neutral-500">
                                            {account.emailAddress}
                                        </span>
                                    </Text>
                                </Box>
                                <Box className='max-sm:w-full max-sm:flex max-sm:justify-end max-sm:items-center'>
                                    <Button variant={"outline"} className={`${ButtonStyle} h-auto w-auto dark:text-white text-black !bg-red-900 max-sm:!bg-transparent`} onClick={() => handleRemoveExternalAccount(account, index)}>
                                        <DeleteIcon/>
                                    </Button>
                                </Box>
                            </HStack>
                        )
                    ))
                )
            )
            :
            (
                Array(3).fill('').map((x, i) => (
                    <Skeleton key={i} className='w-full h-10 rounded-lg animate-none' />
                ))
            )
        )
    }

    return (
        <Box className="w-full">
            <HStack className='w-full' justifyContent={"space-between"} alignItems={"center"}>
                <Text className="font-bold flex flow-row flex-grow w-full items-center gap-2">
                    Connected Accounts
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className={`${ButtonStyle} !bg-transparent h-auto w-auto !border-none`}>
                                    <Info />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="dark:bg-theme-bgPrimary max-w-96 border-2 border-theme-borderSecondary">
                                <Text className="dark:text-neutral-300 text-lg font-normal text-start">
                                    Connected accounts with the following providers:
                                </Text>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Text>
                <DropdownMenu>
                    <DropdownMenuTrigger className={`${ButtonStyle} !h-8 !w-8 rounded-lg flex justify-center items-center border-none mr-5`}>
                        <Plus />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 mr-5 dark:bg-theme-bgSecondary !bg-opacity-60 backdrop-filter !backdrop-blur-sm py-2 border-2 dark:border-neutral-700 p-4 space-y-4">
                        {
                            currentProviderStrategies.map((provider, index) => (
                                <DropdownMenuItem onClick={() => handleConnectAccount(provider.strategy)} key={index}>
                                    {provider.name}
                                </DropdownMenuItem>
                            ))   
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </HStack>
            <VStack justifyContent={"start"} alignItems={"start"} mt={8}>
                <GetConnectedAccountWithProvider />
            </VStack>
        </Box>
    )
}

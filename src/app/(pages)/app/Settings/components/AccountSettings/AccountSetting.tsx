
import dynamic from 'next/dynamic';

import { Box, Flex, Text } from "@chakra-ui/react";

import ErrorManager from "../../../components/ErrorHandler/ErrorManager";

import { SecurityReleated } from "./SecuretySite";

const AccountEmailVerificationManager = dynamic(() => import('./AccountEmailVerificationManager').then((mod) => mod.AccountEmailVerificationManager));
const ConnectedProviderAccount = dynamic(() => import('./ConnectedProviderAccount').then((mod) => mod.ConnectedProviderAccount));
const AccountConnectedDevice = dynamic(() => import('./AccountConnectedDevice').then((mod) => mod.AccountConnectedDevice));
const AccountProfileSection = dynamic(() => import('./AccountProfile').then((mod) => mod.AccountProfileSection));
const AccountUpdates = dynamic(() => import('./AccountUpdates').then((mod) => mod.AccountUpdates));
const AccountAdvance = dynamic(() => import('./AccountAdvance').then((mod) => mod.AccountAdvance));

export const AccountSetting = () => {

    return (
        <Box className="w-full space-y-4">
            <Text className='text-xl p-2 border-b-2 border-theme-borderSecondary'>ACCOUNT</Text>
            <Flex className="dark:bg-theme-bgSecondary bg-neutral-100 p-4 w-full rounded-xl flex flex-col justify-start items-start space-y-8 border-2 border-neutral-900">
                <ErrorManager> 
                    <AccountProfileSection />                    
                </ErrorManager>
                <ErrorManager> 
                    <AccountUpdates/>
                </ErrorManager>
                <ErrorManager>
                    <AccountEmailVerificationManager/>
                </ErrorManager>
                <ErrorManager> 
                    <ConnectedProviderAccount/>
                </ErrorManager>

                { /* SecurityReleated */ }
                <SecurityReleated>
                    <ErrorManager> 
                        <AccountConnectedDevice/>
                    </ErrorManager>
                    <ErrorManager> 
                        <AccountAdvance/>
                    </ErrorManager>
                </SecurityReleated>
            </Flex>
        </Box>
    )
}

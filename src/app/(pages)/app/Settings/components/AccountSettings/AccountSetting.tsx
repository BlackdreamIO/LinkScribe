import { Box, Flex, Text } from "@chakra-ui/react";

import ErrorManager from "../../../components/ErrorHandler/ErrorManager";

import { AccountProfileSection } from "./AccountProfile";
import { AccountUpdates } from "./AccountUpdates";
import { AccountEmailVerificationManager } from "./AccountEmailVerificationManager";
import { ConnectedProviderAccount } from "./ConnectedProviderAccount";
import { AccountConnectedDevice } from "./AccountConnectedDevice";
import { SecurityReleated } from "./SecuretySite";
import { AccountAdvance } from "./AccountAdvance";


export const AccountSetting = () => {

    return (
        <Box className="w-full space-y-4">
            <Text className='text-xl p-2 border-b-2 border-theme-borderSecondary'>ACCOUNT</Text>
            <Flex className="dark:bg-theme-bgFourth p-4 w-full rounded-xl flex flex-col justify-start items-start space-y-8">
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

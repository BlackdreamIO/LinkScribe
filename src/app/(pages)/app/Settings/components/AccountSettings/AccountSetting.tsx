"use client"

import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { AccountProfileSection } from "./AccountProfile";
import { AccountUpdates } from "./AccountUpdates";

export const AccountSetting = () => {

    return (
        <Box className="w-full space-y-4">
            <Text className='text-xl p-2 border-b-2 border-theme-borderSecondary'>ACCOUNT</Text>
            <Flex className="dark:bg-theme-bgFourth p-4 w-full rounded-xl flex flex-col justify-start items-start space-y-8">
                <AccountProfileSection />
                <AccountUpdates/>
            </Flex>
        </Box>
    )
}

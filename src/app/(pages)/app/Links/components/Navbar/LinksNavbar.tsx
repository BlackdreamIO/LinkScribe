import { Box, Flex } from "@chakra-ui/react";

import LinksNavbarSettings from "./LinksNavbarSettings";
import { LinkNavbarAdditionals } from "./LinkNavbarAdditionals";
import { KeyboardNavigationProvider } from "@/context/KeyboardNavigationContext";

export default function LinksNavbar() 
{
    return (
        <Box className="w-full dark:bg-theme-bgSecondary transition-all duration-200 p-3">
            <KeyboardNavigationProvider>
                <Flex className="w-full" justify={'space-between'} alignItems={"center"} direction={'row'}>
                    <LinksNavbarSettings/>
                    <LinkNavbarAdditionals/>
                </Flex>
            </KeyboardNavigationProvider>
        </Box>
    )
}
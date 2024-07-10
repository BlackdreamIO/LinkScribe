import { Box, Flex, Text } from "@chakra-ui/react";

export const CustomizationSettings = () => {
    return (
        <Box className="w-full">
            <Text className='text-2xl p-2 border-b-2 border-theme-borderSecondary'>Customization</Text>
            <Flex className="dark:bg-theme-bgSecondary bg-neutral-100 p-4 w-full rounded-xl flex flex-col justify-start items-start space-y-8 border-2 border-neutral-900">

            </Flex>
        </Box>
    )
}

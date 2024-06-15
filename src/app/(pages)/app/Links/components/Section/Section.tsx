'use client'

import { Box, VStack } from "@chakra-ui/react"
import { SectionHeader } from "./SectionHeader"

export const Section = () => {
    return (
        <Box className='w-full dark:bg-theme-bgFifth border rounded-2xl flex flex-col justify-center space-y-4'>
            <SectionHeader />

            <VStack className="w-full p-2">
                {
                    <Box className='w-full dark:bg-black flex flex-row items-center justify-between py-2 px-4 h-14 rounded-2xl'>
                        lorem ipsum mmatter
                    </Box>
                }
            </VStack>
        </Box>
    )
}

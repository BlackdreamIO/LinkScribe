import { useAGContextWrapper } from './AGContextWrapper';

import { Box, Heading, HStack, Text } from '@chakra-ui/react';

import ErrorManager from '../ErrorHandler/ErrorManager';

import { AGSectionSelect } from "./AGSectionSelect";
import { AGOutputLinks } from './AGLinks';
import { Checkbox } from '@/components/ui/checkbox';

export const AGOutput = () => {

    const { generatedLinks, selectAllLinks, selectedLinks } = useAGContextWrapper();

    return (
        <Box className='w-full p-2 dark:bg-theme-bgFifth rounded-lg space-y-4 border border-neutral-700'>
            <Box className='w-full'>
                <HStack className="w-full justify-between px-4 dark:bg-theme-bgFourth py-2 rounded-lg border border-neutral-700 max-md:!flex-col">
                    <Heading className="text-xl font-bold max-lg:text-lg max-md:text-sm">Generated Links {generatedLinks.length}</Heading>
                    <ErrorManager>
                        <AGSectionSelect />
                    </ErrorManager>
                </HStack>
                <Box className='w-full flex flex-row items-center justify-between px-4 pt-4'>
                    <Text className='dark:text-white'>
                        Select All
                    </Text>
                    <Checkbox onClick={() => selectAllLinks()} checked={selectedLinks.every((link) => link.selected)} />
                </Box>
            </Box>
            <ErrorManager>
                <AGOutputLinks/>
            </ErrorManager>
        </Box>
    )
}

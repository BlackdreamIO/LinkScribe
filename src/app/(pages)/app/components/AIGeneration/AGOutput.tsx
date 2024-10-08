import { useAGContextWrapper } from './AGContextWrapper';

import { Box, Heading, HStack, Text } from '@chakra-ui/react';

import ErrorManager from '../ErrorHandler/ErrorManager';

import { AGSectionSelect } from "./AGSectionSelect";
import { AGOutputLinks } from './AGLinks';

export const AGOutput = () => {

    const { generatedLinks } = useAGContextWrapper();

    return (
        <Box className='w-full p-2 dark:bg-theme-bgFifth rounded-lg space-y-4 border border-neutral-700'>
            <HStack className="w-full justify-between px-4 dark:bg-theme-bgFourth py-2 rounded-lg border border-neutral-700 max-md:!flex-col">
                <Heading className="text-xl font-bold max-lg:text-lg max-md:text-sm">Generated Links {generatedLinks.length}</Heading>
                <ErrorManager>
                    <AGSectionSelect />
                </ErrorManager>
            </HStack>
            <ErrorManager>
                <AGOutputLinks/>
            </ErrorManager>
        </Box>
    )
}

import { Box, HStack, Text } from '@chakra-ui/react';
import { ScrollArea } from '@/components/ui/scroll-area';

import { DotsVerticalIcon } from '@radix-ui/react-icons';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAGContextWrapper } from './AGContextWrapper';
import { ConditionalRender } from '@/components/ui/conditionalRender';


export const AGOutputLinks = () => {

    const { generatedLinks } = useAGContextWrapper();

    return (
        <ScrollArea className="w-full h-[250px] rounded-md space-y-4 !blur-none !backdrop-blur-none z-40">
            {
                (generatedLinks ?? []).map((link, index) => (
                    <HStack key={index} className="w-full flex flex-row items-center justify-between my-2 px-4 py-2 border border-neutral-700 dark:bg-theme-bgFourth rounded-lg">
                        <Box>
                            <Text>{link.title}</Text>
                            <Text className="text-sky-300">{link.url}</Text>
                        </Box>
                        <Box className="flex flex-row items-center justify-center space-x-2 bg-theme-bgFourth">
                            <DropdownMenu modal={true}>
                                <DropdownMenuTrigger>
                                    <DotsVerticalIcon/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='dark:bg-theme-bgFifth border border-neutral-700'>
                                    <DropdownMenuItem>Edit Title</DropdownMenuItem>
                                    <DropdownMenuItem>Edit Url</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Box>
                    </HStack>
                ))
            }
            <ConditionalRender render={generatedLinks.length == 0}>
                <Text className='text-center'>
                    No links generated
                </Text>
            </ConditionalRender>
        </ScrollArea>
    )
}

import { useEffect, useState } from 'react';
import { useAGContextWrapper } from './AGContextWrapper';
import { LinkScheme } from '@/scheme/Link';

import { Box, HStack, Text } from '@chakra-ui/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

import { DotsVerticalIcon } from '@radix-ui/react-icons';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { ConditionalRender } from '@/components/ui/conditionalRender';
import { Checkbox } from '@/components/ui/checkbox';

type SelectableLinkProps = {
    title : string;
    url : string;
    selected : boolean;
    onSelect? : () => void;
}

const SelectableLink = ({ title, url, onSelect, selected } : SelectableLinkProps) => {
    
    return (
        <HStack onClick={onSelect} className="w-full flex flex-row items-center justify-between my-2 px-4 py-2 border border-neutral-700 dark:bg-theme-bgFourth rounded-lg cursor-pointer
            dark:hover:bg-theme-bgThird">
            <Box>
                <Text>{title}</Text>
                <Link href={url} target='_blank' referrerPolicy='no-referrer' className="text-sky-300">{url}</Link>
            </Box>
            <Box className="flex flex-row items-center justify-center space-x-2 bg-theme-bgFourth">
                <Checkbox checked={selected} onClick={onSelect} />
            </Box>
        </HStack>
    )
}


export const AGOutputLinks = () => {

    const { generatedLinks, selectedLinks, setSelectedLinks } = useAGContextWrapper();

    const handleSelectDeselectLinks = (id : string) => {
        setSelectedLinks(selectedLinks.map((link) => link.id == id ? {...link, selected : !link.selected} : link));
    }

    return (
        <ScrollArea className="w-full h-[250px] rounded-md space-y-4 !blur-none !backdrop-blur-none z-40">
            {
                (selectedLinks ?? []).map((link, index) => (
                    <SelectableLink
                        key={index}
                        title={link.title}
                        url={link.url}
                        selected={link.selected}
                        onSelect={() => handleSelectDeselectLinks(link.id)}
                    />
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

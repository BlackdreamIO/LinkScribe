"use client"

import { useSectionController } from '@/context/SectionControllerProviders';
import { SectionContainerContextWrapper } from './SectionContainerContextWrapper';

import { Box, VStack } from '@chakra-ui/react';
import { Input } from '@/components/ui/input';

import { Section } from '../Section/Section';
import { SectionCreator } from '../Section/SectionCreator';

export const SectionContainer = () => {

    const { contextSections } = useSectionController()!;

    return (
        <SectionContainerContextWrapper>
            <Box className='w-full h-[85vh]'>
                <Box className='w-full p-4'>
                    <Input
                        className='w-full'
                    />
                </Box>
                <VStack className='p-4 h-full overflow-y-scroll scrollbar-dark' gap={50}>
                    {
                        contextSections.map((section, i) => (
                            <Section 
                                currrentSection={section}
                                key={section.id} 
                            />    
                        ))
                    }
                </VStack>
            </Box>
        </SectionContainerContextWrapper>
    )
}

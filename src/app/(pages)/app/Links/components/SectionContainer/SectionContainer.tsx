"use client"

import dynamic from 'next/dynamic';
import { useSectionController } from '@/context/SectionControllerProviders';
import { SectionContainerContextWrapper } from './SectionContainerContextWrapper';

import { Box, VStack } from '@chakra-ui/react';

const Section = dynamic(() => import('../Section/Section').then((mod) => mod.Section), { ssr : true });

export const SectionContainer = () => {

    const { contextSections } = useSectionController()!;

    return (
        <SectionContainerContextWrapper>
            <Box className='w-full h-[93vh]'>
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

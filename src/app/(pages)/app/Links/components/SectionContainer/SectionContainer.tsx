"use client"

import React from 'react';
import { SectionContainerContextWrapper } from './SectionContainerContextWrapper';

import { Box, VStack } from '@chakra-ui/react';
import { Input } from '@/components/ui/input';

import { Section } from '../Section/Section';
import { useSectionController } from '@/context/SectionControllerProviders';

export const SectionContainer = () => {

    const { contextSections } = useSectionController()!;

    return (
        <SectionContainerContextWrapper>
            <Box className='w-full min-h-[95vh]'>
                <Box className='w-full p-4'>
                    <Input
                        className='w-full'
                    />
                </Box>
                <VStack className='p-4' gap={50}>
                    {
                        contextSections.map((section, i) => (
                            <Section 
                                currrentSection={section}
                                key={i} 
                            />    
                        ))
                    }
                    {/* <Section />
                    <Section />
                    <Section />
                    <Section /> */}
                </VStack>
            </Box>
        </SectionContainerContextWrapper>
    )
}

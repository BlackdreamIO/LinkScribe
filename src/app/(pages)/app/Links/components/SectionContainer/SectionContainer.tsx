"use client"

import React from 'react';
import { SectionContainerContextWrapper } from './SectionContainerContextWrapper';

import { Box, VStack } from '@chakra-ui/react';
import { Input } from '@/components/ui/input';

import { Section } from '../Section/Section';

export const SectionContainer = () => {
    return (
        <SectionContainerContextWrapper>
            <Box className='w-full min-h-[95vh]'>
                <Box className='w-full p-4'>
                    <Input
                        className='w-full'
                    />
                </Box>
                <VStack className='p-4' gap={50}>
                    <Section />
                    <Section />
                    <Section />
                    <Section />
                </VStack>
            </Box>
        </SectionContainerContextWrapper>
    )
}

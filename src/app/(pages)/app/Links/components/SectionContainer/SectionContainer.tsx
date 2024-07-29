"use client"

import { useMemo } from 'react';
import { useSectionController } from '@/context/SectionControllerProviders';
import { SectionScheme } from '@/scheme/Section';
import dynamic from 'next/dynamic';

import { Box, VStack } from '@chakra-ui/react';
import { SectionContainerContextWrapper } from './SectionContainerContextWrapper';
import ErrorManager from '../../../components/ErrorHandler/ErrorManager';

const Section = dynamic(() => import('../Section/Section').then((mod) => mod.Section), { ssr : true });

export const SectionContainer = () => {

    const { contextSections, GetSections } = useSectionController()!;

    const MemoizedContentDisplay = useMemo(() => {
        return contextSections.map((section, i) => (
            <ErrorManager key={section.id}>
                <Section
                    currrentSection={section}
                    key={section.id}
                />
            </ErrorManager>
        ))
    }, [contextSections]);

    return (
        <SectionContainerContextWrapper>
            <Box className='w-full h-[93vh]'>
                <VStack className='p-4 h-full overflow-y-scroll scrollbar-dark' gap={50}>
                    {MemoizedContentDisplay}
                </VStack>
            </Box>

        </SectionContainerContextWrapper>
    )
}

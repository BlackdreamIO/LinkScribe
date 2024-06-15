"use client"

import { useSectionController } from '@/context/SectionControllerProviders';
import CheckDbExist from '@/global/dbExist';

import BarLoader from "react-spinners/BarLoader";

import { Box, Divider, Text, Stack, VStack } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';

import LinksNavbar from './components/LinksNavbar';
import { DBLoadComponent } from './components/DBLoadComponent';
import { EllipsisVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Section } from './components/Section/Section';

export default function LinkPage() 
{
    //const { contextSections, GetSections } = useSectionController()!;
    
    //const dbExist = CheckDbExist();
    
    return (
      <Box className="w-full h-screen overflow-scroll no-scrollbar dark:bg-[rgb(5,5,5)] bg-neutral-100">
        
        <LinksNavbar />
        {/* <DBLoadComponent onCreate={async () => await GetSections(true)} /> */}
        {/* {
            contextSections.map((section, index) => (
                <Button key={index}>{section.id}</Button>
            ))
        } */}

        <Box className='w-full p-4'>
            <Input
                className='w-full'
            />
        </Box>

        <VStack className='p-4'>
            <Section />
        </VStack>

        <Box className='w-full p-4 mt-10'>
            <Box className='w-full dark:bg-theme-bgFifth border rounded-2xl flex flex-col justify-center space-y-4'>
                <Box className='w-full flex flex-row items-center justify-between px-4 h-14'>
                    <Text className='text-xl'>OTHER LINKS</Text>
                    <Text><EllipsisVertical /></Text>
                </Box>
                <Divider className='dark:bg-neutral-700 w-full h-[1px]' />
                <Box className='w-full flex flex-col items-center justify-center p-2 space-y-4 mt-5'>
                    <Box className='w-full dark:bg-theme-bgThird flex flex-row items-center justify-between py-2 px-4 h-14 rounded-2xl'>
                        lorem ipsum mmatter
                    </Box>
                    {
                        Array(36).fill('').slice(0, 1).map((x, i) => (
                            <Box key={i} className='w-full dark:bg-black flex flex-row items-center justify-between py-2 px-4 h-14 rounded-2xl'>
                                lorem ipsum mmatter
                            </Box>
                        ))
                    }
                </Box>
            </Box>
        </Box>

        <Box className='w-full p-4 mt-5 '>
            <Box className='w-full dark:bg-theme-bgFifth border rounded-2xl flex flex-col justify-center space-y-4'>
                <Box className='w-full flex flex-row items-center justify-between px-4 h-14'>
                    <Text className='text-xl'>OTHER LINKS</Text>
                    <Text><EllipsisVertical /></Text>
                </Box>
                <Divider className='dark:bg-neutral-700 w-full h-[1px]' />
                <Box className='w-full flex flex-col items-center justify-center p-2 space-y-4 mt-5'>
                    <Box className='w-full dark:bg-black flex flex-row items-center justify-between py-2 px-4 h-14 rounded-2xl'>
                        lorem ipsum mmatter
                    </Box>
                    <Box className='w-full dark:bg-black flex flex-row items-center justify-between py-2 px-4 h-14 rounded-2xl'>
                        lorem ipsum mmatter
                    </Box>
                    <Box className='w-full dark:bg-black flex flex-row items-center justify-between py-2 px-4 h-14 rounded-2xl'>
                        lorem ipsum mmatter
                    </Box>
                </Box>
            </Box>
        </Box>
      </Box>
    );
}

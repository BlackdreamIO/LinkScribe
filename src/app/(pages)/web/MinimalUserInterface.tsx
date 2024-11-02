import { Box, Image, VStack, Text, HStack } from '@chakra-ui/react';

export default function MinimalUserInterface() 
{
    return (
    <HStack className='max-w-xl m-auto'>
            <Image
                className='w-5/12' 
                src='https://nextjs-supabase-demo.makerkit.dev/_next/image?url=%2Fassets%2Fimages%2Fdashboard.webp&w=1080&q=75' 
                alt='image source was not found'
            />
            <VStack justify={'center'} className='space-y-3 w-5/12 m-auto'>
                <Text className='text-4xl'>Dashboard</Text>
                <Text className='text-xl text-center'>A fantastic dashboard to manage your SaaS business</Text>
                <Text className='text-neutral-500 text-center'>
                    Our dashboard offers an overview of your SaaS business. 
                    It shows at a glance all you need to know about your business. 
                    It is fully customizable and extendable.
                </Text>
            </VStack>
        </HStack>
    )
}

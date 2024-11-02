'use client'

import { motion } from "framer-motion";
import { Box, Image, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

export default function HeroSectioon() 
{
    const gradientStyle1 = `bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text`;
    const gradientStyle2 = `bg-gradient-to-r from-cyan-300 via-green-400 to-cyan-300 bg-clip-text text-transparent`;
    const gradientStyle3 = `bg-gradient-to-t from-neutral-800 to-neutral-400 bg-clip-text text-transparent`;

    const HeroSectionVarient = {
        animate: {
          opacity : 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
        hidden : {
            opacity : 0,
            transition: {
                staggerChildren: 0.2,
            },
        }
    }

    return (
        <motion.div 
            initial={"hidden"} 
            animate={"animate"} 
            transition={{ ease: "easeOut", duration: 2, staggerChildren : 1 }} 
            variants={HeroSectionVarient} 
            className="w-full flex flex-col max-w-xl m-auto space-y-20">

            <Box as={motion.div} className="w-full flex flex-col space-y-5">
                <Box as={motion.div} variants={HeroSectionVarient} className="w-auto m-auto bg-black rounded-xl px-4 py-1 border border-neutral-400">
                    <Text className="max-md:text-sm max-sm:text-xs">The best saas product for link management</Text>
                </Box>
                <Text as={motion.p} variants={HeroSectionVarient} className={`!leading-relaxed text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-7xl 3xl:text-7xl text-center ${gradientStyle3}`}>
                    The 
                        <span className="text-blue-500"> Ultimate </span> 
                        <span> SaaS </span> 
                        Solution for Efficient 
                        <span className={gradientStyle2}> Link Management </span>
                </Text>
                <Text as={motion.p} variants={HeroSectionVarient} 
                    className="text-neutral-400 m-auto text-center
                    w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 3xl:w-6/12
                    text-sm sm:text-sm md:text-lg lg:xl:text-xl xl:text-xl 2xl:text-2xl 3xl:text-2xl mb-5">
                    Here you can write a short description of your SaaS
                    This subheading is usually laid out on multiple lines
                    Impress your customers, straight to the point.
                </Text>
                <Button variant={'outline'} className="w-3/12 max-md:w-5/12 m-auto py-6 !mt-[70px] rounded-3xl bg-black text-white">Get Started</Button>
            </Box>
           
           <Box className="m-auto">
                <Image 
                    className="w-9/12 m-auto rounded-md shadow-[0px_0px_100px_5px_rgb(0,0,0)]"
                    src={'https://nextjs-supabase-demo.makerkit.dev/_next/image?url=%2Fassets%2Fimages%2Fdashboard-dark.webp&w=3840&q=75'} 
                    alt='not found' 
                />
           </Box>

        </motion.div>
    )
}

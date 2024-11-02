'use client'

import { useState, useEffect } from "react";
import {  motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Box, HStack, Text, Flex, Img, Image } from "@chakra-ui/react";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function Navbar() 
{
    const [toggleNavbar, setToggleNavbar] = useState(false);

    useEffect(() => {
        const handleWindowResize = () => { if(window.innerWidth > 768) setToggleNavbar(false); }
        document.addEventListener('resize', handleWindowResize);
    }, [])
    

    const navbarAnimation  = {
        visible : { height : '90px' },
        hidden : { height : '0px' }
    }

    return (
        <Box className="dark:bg-white/80 bg-neutral-200 shadow-lg max-sm:dark:bg-white/90 max-sm:bg-neutral-200 p-2 
        relative inset-x-0 top-5 z-30 mx-auto w-full border dark:border-gray-100 border-gray-300 max-w-xl rounded-3xl mb-20">
            <Box className="flex flex-row items-center justify-between p-2 max-sm:p-2">
                <HStack alignItems={'center'} className="space-x-3">
                    <Image className="h-7 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="ocon not found"/>
                    <Text size={'small'} className="text-black max-md:text-xs">Website Title</Text>
                </HStack>
                <HStack className="dark:text-black space-x-3 font-bold max-sm:!hidden">
                    <Link href={"#"} className="dark:hover:text-blue-600 text-sm max-md:text-xs">HOME</Link>
                    <Link href={"#"} className="dark:hover:text-blue-600 text-sm max-md:text-xs">ABOUT</Link>
                    <Link href={"#"} className="dark:hover:text-blue-600 text-sm max-md:text-xs">DOWNLOAD</Link>
                    <Link href={"#"} className="dark:hover:text-blue-600 text-sm max-md:text-xs">GITHUB</Link>
                </HStack>
                <HStack className="max-sm:!hidden">
                    <Button className="dark:bg-neutral-900 text-white rounded-xl">Sign Up</Button>
                    <Button className="bg-blue-500 rounded-xl">Log In</Button>
                </HStack>
                <Button 
                    onClick={() => setToggleNavbar(!toggleNavbar)} 
                    variant={'ghost'} 
                    className="text-black hover:text-black text-3xl p-0 hover:bg-transparent hidden max-sm:block outline-none">
                    <Menu  />
                </Button>
            </Box>
            <motion.div initial={{height : '0px'}} variants={navbarAnimation} animate={toggleNavbar ? 'visible' : 'hidden'} className="overflow-hidden">
                <HStack className="text-black space-x-3 font-bold py-4 px-2">
                    <Link href="/" className="hover:text-blue-600 max-md:text-xs no-underline">HOME</Link>
                    <Link href="/about" className="hover:text-blue-600 max-md:text-xs no-underline">ABOUT</Link>
                    <Link href="/download" className="hover:text-blue-600 max-md:text-xs no-underline">DOWNLOAD</Link>
                    <Link href="/github" className="hover:text-blue-600 max-md:text-xs no-underline">GITHUB</Link>
                </HStack>
                <HStack className="space-x-3">
                    <Button className="w-full bg-neutral-900 text-white hover:text-black outline-none rounded-xl">
                        Sign Up
                    </Button>
                    <Button className="w-full bg-blue-500 hover:bg-blue-300 outline-none rounded-xl ">
                        Log In
                    </Button>
                </HStack>
            </motion.div>
        </Box>
    )
} 

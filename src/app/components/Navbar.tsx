import { Box, HStack, Text } from "@chakra-ui/react"
import Image from "next/image"
import Link from "next/link"

import facebookIcon from "../../../public/icons/facebook.svg";

const LinkStyle = `text-neutral-300 hover:bg-neutral-300 hover:text-black hover:font-semibold px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer
max-md:text-xs max-md:px-2`

export const Navbar = () => {
    return (
        <Box className="fixed top-0 z-50 w-full flex flex-row items-center justify-between max-md:justify-center bg-black/30 backdrop-filter backdrop-blur-lg px-4 py-2">
            <Text className="text-xl text-green-400 capitalize pointer-events-none max-md:hidden">MOHAMMED HAMIM</Text>
            
            <HStack className="space-x-2 max-md:space-x-0 px-0 py-0 rounded-xl flex flex-row items-center justify-center">
                <Link className={LinkStyle} href={"/"}>Home</Link>
                <Link className={LinkStyle} href={"/"}>Experience</Link>
                <Link className={LinkStyle} href={"/"}>Projects</Link>
                <Link className={LinkStyle} href={"/"}>Contact</Link>
            </HStack>

            {/* <Text className=" right-6 text-xl text-green-400 capitalize pointer-events-none">CV</Text> */}
        </Box>
    )
}

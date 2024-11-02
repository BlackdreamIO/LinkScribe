import { Box, HStack, VStack, Text, Image, Link } from "@chakra-ui/react";
import windowsIcon from '../../../../public/images/windows.png';
import macIcon from '../../../../public/images/mac.png';

export default function Footer() 
{
    return (
        <Box className="bg-neutral-900 w-full p-2">
            <VStack className="w-full max-w-xl space-y-5 m-auto">
                <HStack flexDir={'column'} justify={'center'}>
                    <Text className="text-2xl text-green-400">Download Our App</Text>
                    <Text className="text-base text-center text-neutral-500">Works seamlessly on Mac and Windows</Text>
                </HStack>
                <Box className="w-full flex flex-row items-center justify-center space-x-3 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-2">
                    <HStack 
                        justify={'center'} 
                        className="bg-black w-[350px] py-5 space-x-3 rounded-2xl border-2 hover:border-[skyblue] group transition-all duration-200
                            max-sm:w-[200px] max-md:w-[250px] max-md:py-3">
                        <Image
                            className="w-2/12 transition-all duration-200 grayscale group-hover:grayscale-0" 
                            src={windowsIcon.src} 
                            alt="icon was not found"
                        />
                        <Box className="space-y-2 max-sm:space-y-0">
                            <Text className="text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-2xl 3xl:text-2xl">Download On</Text>
                            <Text className="text-xl max-md:text-lg max-sm:text-sm">Windows</Text>
                        </Box>
                    </HStack>
                    <HStack 
                        justify={'center'} 
                        className="bg-black w-[350px] py-5 space-x-3 rounded-2xl border-2 hover:border-[skyblue] group transition-all duration-200
                            max-sm:w-[200px] max-md:w-[250px] max-md:py-3 max-sm:space-y-0">
                        <Image
                            className="w-2/12 transition-all duration-200 grayscale group-hover:grayscale-0" 
                            src={macIcon.src} 
                            alt="icon was not found"
                        />
                        <Box className="space-y-2 max-sm:space-y-0">
                            <Text className="text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-2xl 3xl:text-2xl">Download On</Text>
                            <Text className="text-xl max-md:text-lg max-sm:text-sm">Mac</Text>
                        </Box>
                    </HStack>
                </Box>
            </VStack>
            <Box className="flex flex-col items-center justify-center space-y-4 mt-10">
                <Text className=" text-center my-3 tracking-[0.5rem] uppercase text-lg font-bold md:text-base lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-xl">
                    NightX                    
                </Text>
                <Text className="text-neutral-500 text-xs md:text-sm lg:text-base xl:text-base 2xl:text-base 3xl:text-base">
                    FOUNDER 
                    <Link href="https://blackdreamio.vercel.app" className="mx-2 !text-[mediumspringgreen]"> 
                        BLACKDREAM  
                    </Link> @2024
                </Text>
                <Box display={'flex'} flexDir={'row'} className="text-neutral-500 space-x-5 text-xs md:text-sm lg:text-base xl:text-base 2xl:text-base 3xl:text-base" >
                    <Link>About Us</Link>
                    <Link>Contact Us</Link>
                    <Link>Github</Link>
                </Box>
            </Box>
        </Box>
    )
}

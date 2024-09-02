import { TextGenerateEffect } from "@/lib/generateUIText"
import { Box, Text } from "@chakra-ui/react"

export const HeroSection = () => {
    return (
        <Box className="min-h-screen h-screen max-h-auto w-full dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center">
            <Box className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></Box>
            <Box className="flex flex-col items-center justify-center space-y-4">
                <Text className="text-neutral-200 text-center relative z-20 3xl:text-9xl 2xl:text-9xl xl:text-8xl lg:text-8xl md:text-8xl sm:text-7xl tiny:text-5xl text-5xl
                  tracking-widest ">
                      BLACKDREAM
                </Text>
                <TextGenerateEffect words="FULLSTACK ENGEENIER" duration={1} />
            </Box>
        </Box>
    )
}

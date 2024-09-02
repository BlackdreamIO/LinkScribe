import { Box } from "@chakra-ui/react";

import { HeroSection } from "./components/HeroSection";
import { GlobeDemo } from "./components/GlobeDemo";
import { Skills } from "./components/Skills";

export default function HomePage()
{
    return (
        <Box>
            <HeroSection/>
            <GlobeDemo />
            <Skills/>
        </Box>
    )
}

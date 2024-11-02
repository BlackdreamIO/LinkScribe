import { VStack } from "@chakra-ui/react";
import Footer from "./Footer";
import HeroSectioon from "./HeroSectioon";
import MinimalUserInterface from "./MinimalUserInterface";
import Navbar from "./Navbar";

export default function Webview() 
{
    return (
        <div className="space-y-5">
            <Navbar />
                <VStack className="w-full p-0 space-y-96">
                    <HeroSectioon/>
                    <MinimalUserInterface/>
                </VStack>
            <Footer/>
        </div>
    )
}

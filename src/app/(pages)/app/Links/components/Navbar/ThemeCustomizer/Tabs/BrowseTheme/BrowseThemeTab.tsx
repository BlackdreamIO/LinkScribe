import { useThemeContext } from "@/context/ThemeContextProvider";

import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { Box, Grid } from "@chakra-ui/react";
import { ThemeCard } from "./ThemeCard";

import themeImage from "../../../../../../../../../../public/images/theme.png"

export const BrowseThemeTab = ({ tabValue="browse" }) => {

    const { setAppBackgroundColor } = useThemeContext();

    const PREDEFINED_THEMES = [
        {
            title: "Azure Blaze",
            themeImg: themeImage.src,
            color : "radial-gradient( circle farthest-corner at 7.2% 13.6%,  rgba(37,249,245,1) 0%, rgba(8,70,218,1) 90% )",
        },
        {
            title: "Tangerine Spark",
            themeImg: themeImage.src,
            color : "linear-gradient(90deg, #1CB5E0 0%, #000851 100%)",
        },
        {
            title: "Golden Glow",
            themeImg: themeImage.src,
            color : "radial-gradient( circle 331px at 1.4% 52.9%,  rgba(255,236,2,1) 0%, rgba(255,223,2,1) 33.6%, rgba(255,187,29,1) 61%, rgba(255,175,7,1) 100.7% )",
        },
        {
            title: "Crimson Flame",
            themeImg: themeImage.src,
            color : "linear-gradient( 91.2deg,  rgba(136,80,226,1) 4%, rgba(16,13,91,1) 96.5% )",
        },
        {
            title: "Ocean Twilight",
            themeImg: themeImage.src,
            color : "linear-gradient( 109.6deg,  rgba(103,30,117,1) 11.2%, rgba(252,76,2,1) 91.1% )",
        },
        {
            title: "Sapphire Horizon",
            themeImg: themeImage.src,
            color : "radial-gradient( circle farthest-corner at 10% 20%,  rgba(14,174,87,1) 0%, rgba(12,116,117,1) 90% )",
        },
    ]

    return (
        <TabsContent value={tabValue}>
            <Box className="w-full flex flex-row items-center justify-between">
                <Input placeholder="Search Themes" className="w-full dark:bg-theme-bgFifth px-4 h-10 rounded-lg !ring-0 !outline-none" />
            </Box>

            <Grid className="w-full p-4 grid grid-cols-3 gap-4 max-h-[700px] overflow-y-scroll scrollbar-dark">
                {
                    PREDEFINED_THEMES.map((theme, i) => (
                        <ThemeCard
                            key={i}
                            title={theme.title}
                            themeImg={theme.themeImg}
                            onApply={() => setAppBackgroundColor(theme.color)}
                            onCustomize={() => {}}
                        />
                    ))
                }
            </Grid>
        </TabsContent>
    )
}

import { useEffect, useState } from "react";
import { useThemeContext } from "@/context/ThemeContextProvider";
import { IAppTheme } from "@/interface/AppTheme";
import dynamic from "next/dynamic";

import { Box, Grid } from "@chakra-ui/react";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";

const ThemeCard = dynamic(() => import('./ThemeCard').then((mod) => mod.ThemeCard),
{ ssr : true, loading : () => <Skeleton className='w-full dark:bg-theme-bgFourth animate-none h-40 rounded-xl' /> });


import { Skeleton } from "@/components/ui/skeleton";

export const BrowseThemeTab = ({ tabValue="browse" }) => {

    const { setAppBackgroundColor, appBackgroundColor, ConfigureTheme, themes : PREDEFINED_THEMES, setThemes : setPREDEFINED_THEMES } = useThemeContext();
    const [themes, setThemes] = useState<IAppTheme[]>(PREDEFINED_THEMES);

    useEffect(() => {
        setThemes(PREDEFINED_THEMES);
    }, [PREDEFINED_THEMES])
    

    return (
        <TabsContent value={tabValue} className="min-h-[700px]">
            <Box className="w-full flex flex-row items-center justify-between">
                <Input
                    placeholder="Search Themes"
                    className="w-full dark:bg-theme-bgFifth px-4 h-10 rounded-lg !ring-0 !outline-none"
                    onChange={(e) => {
                        setThemes(PREDEFINED_THEMES.filter((theme) => theme.title.toLowerCase().includes(e.target.value.toLowerCase())));
                    }}
                />
            </Box>

            <Grid className="w-full p-4 grid grid-cols-3 gap-4 max-h-[700px] overflow-y-scroll scrollbar-dark">
                {
                    (themes ?? []).map((theme, i) => {
                        const matchTitle = PREDEFINED_THEMES[i]?.title == theme.title;
                        const matchBackground = appBackgroundColor == theme.appBackground && PREDEFINED_THEMES[i]?.title == theme.title;

                        return (
                            <ThemeCard
                                key={i}
                                theme={theme}
                                isActive={matchBackground}
                                onApply={() => setAppBackgroundColor(theme.appBackground)}
                                onDelete={() => setPREDEFINED_THEMES(PREDEFINED_THEMES.filter((t) => t.title != theme.title))}
                                onCustomize={() => {
                                    ConfigureTheme(theme);
                                }}
                            />
                        )
                    })
                }
            </Grid>
        </TabsContent>
    )
}

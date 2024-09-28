import { IAppTheme } from "@/interface/AppTheme";
import themeImage from "../../public/images/theme.png";


export const PREDEFINED_THEMES : IAppTheme[] = [
    {
        title: "Azure Blaze",
        themeImg: themeImage.src,
        appBackground : "radial-gradient( circle farthest-corner at 7.2% 13.6%,  rgba(37,249,245,1) 0%, rgba(8,70,218,1) 90% )",
        dropdownGlassmorphism : false,
        linkGlassmorphism : false,
        modalGlassmorphism : false,
        sectionGlassmorphism : false,
    },
    {
        title: "Tangerine Spark",
        themeImg: themeImage.src,
        appBackground : "linear-gradient(90deg, #1CB5E0 0%, #000851 100%)",
        dropdownGlassmorphism : false,
        linkGlassmorphism : false,
        modalGlassmorphism : false,
        sectionGlassmorphism : false,
    },
    {
        title: "Golden Glow",
        themeImg: themeImage.src,
        appBackground : "radial-gradient( circle 331px at 1.4% 52.9%,  rgba(255,236,2,1) 0%, rgba(255,223,2,1) 33.6%, rgba(255,187,29,1) 61%, rgba(255,175,7,1) 100.7% )",
        dropdownGlassmorphism : false,
        linkGlassmorphism : false,
        modalGlassmorphism : false,
        sectionGlassmorphism : false,
    },
    {
        title: "Crimson Flame",
        themeImg: themeImage.src,
        appBackground : "linear-gradient( 91.2deg,  rgba(136,80,226,1) 4%, rgba(16,13,91,1) 96.5% )",
        dropdownGlassmorphism : false,
        linkGlassmorphism : false,
        modalGlassmorphism : false,
        sectionGlassmorphism : false,
    },
    {
        title: "Ocean Twilight",
        themeImg: themeImage.src,
        appBackground : "linear-gradient( 109.6deg,  rgba(103,30,117,1) 11.2%, rgba(252,76,2,1) 91.1% )",
        dropdownGlassmorphism : false,
        linkGlassmorphism : false,
        modalGlassmorphism : false,
        sectionGlassmorphism : false,
    },
    {
        title: "Sapphire Horizon",
        themeImg: themeImage.src,
        appBackground : "radial-gradient( circle farthest-corner at 10% 20%,  rgba(14,174,87,1) 0%, rgba(12,116,117,1) 90% )",
        dropdownGlassmorphism : false,
        linkGlassmorphism : false,
        modalGlassmorphism : false,
        sectionGlassmorphism : false,
    },
]
"use client"

import { useState } from "react";

import { Box } from "@chakra-ui/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrowseThemeTab, CreateThemeTab } from ".";
import { useThemeContext } from "@/context/ThemeContextProvider";


export const ThemeTabManager = () => {

    const { ConfigureTheme } = useThemeContext();

    const TriggerStyle = `w-full data-[state=active]:text-black data-[state=active]:bg-theme-primaryAccent py-2`;

    return (
        <Box className="w-full">
            <Tabs defaultValue="browseTab" className="w-full space-y-4">
                <TabsList className="w-full dark:bg-theme-bgSecondary border">
                    <TabsTrigger className={TriggerStyle} value="browseTab">Browse Theme</TabsTrigger>
                    <TabsTrigger className={TriggerStyle} value="createTheme">Create Theme</TabsTrigger>
                    <TabsTrigger className={TriggerStyle} value="uploadWalpaper">Upload Walpaper</TabsTrigger>
                </TabsList>
                <BrowseThemeTab tabValue="browseTab"/>
                <CreateThemeTab tabValue="createTheme" />
            </Tabs>
        </Box>
    )
}

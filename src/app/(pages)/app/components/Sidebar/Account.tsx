'use client'

import { useUser, useSession } from "@clerk/nextjs";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"
import { Box, Text } from "@chakra-ui/react";

export const Account = () => {

    const { user, isSignedIn, isLoaded } = useUser();

    return (
        <Box className="w-full">
            <Box className="flex flex-row items-center gap-4 dark:bg-[mediumspringgreen] dark:bg-opacity-50 
            w-full py-2 px-4 rounded-3xl focus-visible:!outline-blue-500 !ring-0 !border-none outline-none transition-all duration-150">
                {
                    user?.hasImage && isLoaded ? (
                        <Image
                            src={user.imageUrl}
                            alt=""
                            unoptimized
                            width={100}
                            height={100}
                            className="w-10 h-10 rounded-full"
                        />
                    )
                    :
                    (
                        <Skeleton className="w-10 h-10 rounded-full" />
                    )
                }
                <Box className="flex flex-grow flex-col items-start justify-center overflow-hidden">
                    {
                        isSignedIn && isLoaded ? (
                            <>
                                {
                                    user && user.username ? (
                                        <Text fontWeight={"bold"} className="truncate">{user.username.replaceAll("_", " ")}</Text>
                                    )
                                    :
                                    <Text fontWeight={"bold"} className="truncate">{`${user.firstName} ${user.lastName}`}</Text>
                                }
                                <Text className="truncate mr-3">{user.primaryEmailAddress?.emailAddress}</Text>
                            </>
                        )
                        :
                        (
                            <>
                                {/* <Text>NO USER FOUND</Text> */}
                                <Skeleton className="w-11/12 h-2 mb-2" />
                                <Skeleton className="w-11/12 h-2" />
                            </>
                        )
                    }
                </Box>
            </Box>
        </Box>
    )
}

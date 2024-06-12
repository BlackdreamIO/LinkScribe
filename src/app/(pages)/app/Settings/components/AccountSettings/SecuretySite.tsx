import { Box, Text } from "@chakra-ui/react"

export const SecurityReleated = ({children} : { children : React.ReactNode }) => {
    return (
        <Box className="w-full space-y-6">
            <Text className="text-3xl">Security</Text>
            <Box className="ml-10 space-y-8">
                {children}
            </Box>
        </Box>
    )
}

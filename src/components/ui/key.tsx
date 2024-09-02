import { cn } from "@/utils/utils";
import { Box, Text } from "@chakra-ui/react";

export const Labelkey = ({ label, className } : { label : string, className? : string  }) => {
    return (
        <Box className={cn("w-auto px-4 py-1 rounded-md text-theme-textSecondary  text-xs", className)}>
            <Text>{label}</Text>
        </Box>
    )
}

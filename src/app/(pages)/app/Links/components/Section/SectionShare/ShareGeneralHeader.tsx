import { Box, Text } from "@chakra-ui/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../DynamicImport"


type DropdownSelectionProps = {
    label : string;
    value : string;
    options : string[];
    onSelect : (value : string) => void;
}

export const ShareGeneralHeader = () => {
    
    const DropdownSelection = ({ label, value, options, onSelect } : DropdownSelectionProps) => {
        return (
            <DropdownMenu modal={true}>
                <DropdownMenuTrigger className="w-full flex flex-row items-center justify-between h-10 text-left px-4 rounded-lg dark:hover:!bg-theme-bgThird
                !outline-none !ring-0">
                    <Text className="text-base">{label}</Text>
                    <Text>{value}</Text>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48 dark:bg-theme-bgFifth">
                    {
                        options.map((option, index) => (
                            <DropdownMenuItem 
                                key={index}
                                className="py-2 w-full dark:hover:bg-theme-bgThird"
                                onClick={() => onSelect(option)}
                            >
                                {option}
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
    
    return (
        <Box className="w-full flex flex-col items-center space-y-2 dark:bg-theme-bgFourth p-2 rounded-lg border border-neutral-700">
            <DropdownSelection
                label="Mode"
                value="Public"
                options={["Public", "Transfer"]}
                onSelect={(value) => console.log(value)}
            />
            <DropdownSelection
                label="Expiration"
                value="24 Hours"
                options={[
                    "24 Hours",
                    "7 Days",
                    "3 Days",
                    "30 Minutes",
                    "1 Hour",
                    "2 Hours",
                    "4 Hours",
                    "8 Hours",
                ]}
                onSelect={(value) => console.log(value)}
            />
        </Box>
    )
}

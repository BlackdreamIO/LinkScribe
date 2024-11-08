
interface IDetermineInputSource {
    image : File | Blob | string;
}

type InputSourceType = "File" | "Blob" | "Base64" | "URL" | "Unknown";

interface IDetermineInputSourceResult {
    type: InputSourceType;
}

export const DetermineInputSource = ({ image } : IDetermineInputSource) : IDetermineInputSourceResult  => {
    if(image instanceof File) {
        return {
            type : "File"
        }
    }
    if(image instanceof Blob) {
        return {
            type : "Blob"
        }
    }
    if (typeof image === "string" && image.startsWith("data:")) {
        return {
            type: "Base64"
        }
    }
    if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
        return {
            type: "URL"
        }
    }
    return {
        type: "Unknown"
    }
}

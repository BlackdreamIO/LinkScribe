import { useState, useEffect } from "react";
import ScreenFull from "screenfull";

export default function useFullscreenToggle() 
{
    const [isFulscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        
        const handleToggleFullscreen = () => {
            if(ScreenFull.isEnabled && ScreenFull.request) {
                if(isFulscreen) {
                    ScreenFull?.request();
                }
                else if(!isFulscreen) {
                    ScreenFull.exit();
                }
            }
            else {
                console.log("Browser does not support fullscreen")
                alert("Browser does not support fullscreen");
            }
        }

        handleToggleFullscreen();
    }, [isFulscreen])
    

    return [isFulscreen, setIsFullscreen] as const;
}
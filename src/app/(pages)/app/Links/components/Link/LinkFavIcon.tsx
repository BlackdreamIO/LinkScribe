import Image from "next/image";
import { ConditionalRender } from "@/components/ui/conditionalRender";

export const LinkFavIcon = ({ faviconUrl } : { faviconUrl : string }) => {

    const getFaviconUrl = (link: string) => {
        try {
            const domain = new URL(link);
            return `${domain.origin}/favicon.ico`;
        }
        catch (error) {
            console.error('Invalid URL : Failed To Load favicon');
            return '';
        }
    };

    return (
        <ConditionalRender render={faviconUrl.length > 0}>
            {/* <Image
                src={getFaviconUrl(faviconUrl)}
                alt="."
                width={24}
                height={24}
                quality={100}
                loading="lazy"
                className="-z-0"
            /> */}
            w
        </ConditionalRender>
    )
}

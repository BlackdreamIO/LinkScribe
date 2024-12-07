import { LinkScheme } from "@/scheme/Link";
interface IDeleteLinkPreviewImages {
    email : string;
    links : LinkScheme[];
}

export class CloudinaryManagerClass {
    static async DeleteLinkPreviewImages({ email, links } : IDeleteLinkPreviewImages) {
        
    }
}
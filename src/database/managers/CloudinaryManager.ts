import { LinkScheme } from "@/scheme/Link";
import { CloudinaryGetAllResources } from "@/app/actions/cloudnary/getAllResources";
import { CloudinaryDeleteResources } from "@/app/actions/cloudnary/deleteResourses";

interface IDeleteLinkPreviewImages {
    email : string;
    links : LinkScheme[];
}

export class CloudinaryManagerClass {
    static async DeleteLinkPreviewImages({ email, links } : IDeleteLinkPreviewImages) {
        const { data } = await CloudinaryGetAllResources({ email : email });

        const cloudnaryIds = new Set(data.map(asset => asset.display_name));
        const localLinksIds = new Set(links.map(link => link.id));

        const cloudnaryImagesToDelete = [...cloudnaryIds].filter(id => !localLinksIds.has(id));

        if(cloudnaryImagesToDelete.length == 0) return;

        const { success, error } = await CloudinaryDeleteResources({ email : email, publicIDs : cloudnaryImagesToDelete});

        console.log({
            success : success,
            error : error
        })
    }
}
import { CreateLink } from "@/database/actions/links/createLink";
import { UpdateLink } from "@/database/actions/links/updateLink";
import { DeleteLink } from "@/database/actions/links/deleteLink";
import { LinkScheme } from "@/scheme/Link";
import { DeleteCloudinaryImage } from "@/app/actions/cloudnary/deleteImage";

interface ILinkManager {
    email : string;
    token : string;
    links: LinkScheme[];
    onSucess?: (error: any) => void,
    onSyncError : (error : any) => void;
}

let operationDone = 0;

export class LinkManagerClass {
    
    static async createLinkToSupabase({ token, links, onSyncError } : ILinkManager)
    {
        let totalOperationCount = links.length;
        if(totalOperationCount === 0) return;

        const linkDataArray = links.map(link => ({
            id: link.id,
            title: link.title,
            url: link.url,
            ref: link.ref,
            created_at: new Date(link.created_at).toISOString(),
            image: link.image
        }));

        await CreateLink({
            token,
            useBulkInsert : true,
            bulkData : linkDataArray,
            onError : onSyncError,
            onSuccess : () => operationDone++
        })

        if(operationDone === totalOperationCount) operationDone = 0;
        else if (operationDone !== totalOperationCount) onSyncError("Some of the links could not successfully synced.");
    }
    static async updateLinkToSupabase({ links, onSyncError, token, onSucess } : ILinkManager)
    {
        let totalOperationCount = links.length;
        if(totalOperationCount === 0) return;

        for(const link of links) {
            await UpdateLink({
                linkData : link,
                token : token,
                onSuccess : () => operationDone++,
                onError : onSyncError
            })
        }

        if(operationDone === totalOperationCount) operationDone = 0;
        else if (operationDone !== totalOperationCount) onSyncError("Some of the links could not successfully synced.");
    }
    static async deleteLinkToSupabase({ links, email, token, onSyncError } : ILinkManager)
    {
        let totalOperationCount = links.length;
        if(totalOperationCount === 0) return;

        for(const link of links) {
            await DeleteLink({
                linkData : link,
                token : token,
                onSuccess : () => operationDone++,
                onError : onSyncError
            })
        }

        if(operationDone === totalOperationCount) operationDone = 0;
        else if (operationDone !== totalOperationCount) onSyncError("Some of the links could not successfully synced.");
    }
}
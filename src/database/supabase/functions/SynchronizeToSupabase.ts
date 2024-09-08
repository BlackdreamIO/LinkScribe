import { DexieGetSectionsByEmail } from "@/database/dexie/helper/DexieSectionByEmail";
import { SectionManagerClass, LinkManagerClass, CloudinaryManagerClass } from "@/database/managers";
import { GetSections } from "@/database/actions/sections/getAllSections";
import { SectionScheme } from "@/scheme/Section";
import { IdentifySectionChanges } from "../helper/IdentifySectionChanges";
import { IdentifyLinksChanges } from "../helper/IdentifyLinksChanges";

interface ISynchronizeToSupabase {
    token : string;
    email : string;
    callback? : (status : "Syncing" | "Synced" | "Error") => void;
}

export default async function SynchronizeToSupabase(args : ISynchronizeToSupabase) {
    
    const { email, token, callback } = args;

    try {
        const supabaseSections: SectionScheme[] = await GetSections({ email, token, onSuccess: (data) => data,
            onError: (error) => console.error("Error fetching sections from Supabase:", error)
        });
    
        const dexieSections = await DexieGetSectionsByEmail(email) ?? [];
    
        const { newSections, deletedSections, updatedSections } = IdentifySectionChanges({ dexieSections, supabaseSections });
        const { newLinks, deletedLinks, updatedLinkss } = IdentifyLinksChanges({ dexieSections, supabaseSections });
    
        console.log({
            added : newSections,
            updated : updatedSections,
            deleted : deletedSections
        })

        console.log({
            addedLinks : newLinks,
            updatedLinks : updatedLinkss,
            deletedLinks : deletedLinks
        })

        SectionManagerClass.InitializeSectionManager({ email, token });

        callback?.("Syncing");
        await SectionManagerClass.createSectionToSupabase({ email, token, sections : newSections, onSyncError(err) { console.log(err); callback?.("Error"); } });
        callback?.("Synced");
        await SectionManagerClass.deleteSectionToSupabase({ email, token, sections : deletedSections, onSyncError(err) {console.log(err); callback?.("Error");} });
        callback?.("Synced");
        await SectionManagerClass.updateSectionToSupabase({ email, token, sections : updatedSections, onSyncError(err) {console.log(err); callback?.("Error");} });    
        callback?.("Synced");

        await LinkManagerClass.createLinkToSupabase({ email, token, links : newLinks, onSyncError(error) {console.log(error)} });
        callback?.("Synced");
        await LinkManagerClass.deleteLinkToSupabase({ email, token, links : deletedLinks, onSyncError(error) {console.log(error)} })
        callback?.("Synced");
        await LinkManagerClass.updateLinkToSupabase({ email, token, links : updatedLinkss, onSyncError(error) {console.log(error)} })
        callback?.("Synced");

        await CloudinaryManagerClass.DeleteLinkPreviewImages({ email : email, links : dexieSections.flatMap(section => section.links) });
        callback?.("Synced");
    }
    catch (error) {
        console.error(error);
        callback?.("Error");
    }
}
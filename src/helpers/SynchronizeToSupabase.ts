import { SectionScheme } from "@/scheme/Section";

import { GetSections } from "@/database/functions/supabase/sections/getAllSections";
import { DexieGetSections } from "@/database/functions/dexie/DexieSections";
import { isEqual } from "./isEqual";

import { CreateSection } from "@/database/functions/supabase/sections/createSections";
import { DeleteSection } from "@/database/functions/supabase/sections/deleteSection";
import { UpdateSection } from "@/database/functions/supabase/sections/updateSection";
import { LinkScheme } from "@/scheme/Link";
import { CreateLink } from "@/database/functions/supabase/links/createLink";
import { DeleteLink } from "@/database/functions/supabase/links/deleteLink";
import { UpdateLink } from "@/database/functions/supabase/links/updateLink";
import { DexieGetSectionsByEmail } from "@/database/functions/dexie/DexieSectionByEmail";
import { SyncStatus } from "@/types/Sync";
import { DateToDayMonthYear } from "./DateToDayMonthYear";

interface ISynchronizeToSupabase {
    token : string;
    email : string;
    
    useCacheSections? : boolean;
    sections? : SectionScheme[];

    onStatusCallback? : (stauts : SyncStatus) => void;
    onSyncSuccess? : () => void;
    onSyncError? : (error : any) => void;
}

/**
 * Synchronizes local sections with Supabase.
 *
 * This function fetches sections from Supabase, compares them with local sections,
 * and updates Supabase with new, deleted, or updated sections.
 *
 * @param {ISynchronizeToSupabase} options - synchronization options
 * @param {string} options.email - user email
 * @param {string} options.token - authentication token
 * @param {(error: any) => void} [options.onSyncError] - error callback
 * @param {(status: SyncStatus) => void} [options.onStatusCallback] - status callback
 * @return {Promise<void>}
 */
export async function SynchronizeToSupabase({ email, token, onSyncError, onStatusCallback } : ISynchronizeToSupabase)
{
    try {
        // Fetch sections from Supabase
        const supabaseSections: SectionScheme[] = await GetSections({
            email,
            token,
            onSuccess: (data) => data,
            onError: (error) => console.error("Error fetching sections from Supabase:", error)
        });

        const dexieSections = await DexieGetSectionsByEmail(email) ?? [];

        const { createdIDS, updatedIDS, deletedIDS } = GetSectionIDS({ dexieSections : dexieSections, supabaseSections : supabaseSections });

        const { createdLinksIDS, updatedLinksIDS, deletedLinksIDS } = GetLinkIDS({ dexieSections : dexieSections, supabaseSections : supabaseSections });

        // Sort both arrays based on the 'id' property
        const sortedSupabaseSections = supabaseSections.sort((a, b) => a.id.localeCompare(b.id));
        const sortedDexieSections = dexieSections.sort((a, b) => a.id.localeCompare(b.id));

        const updatedSectionss: SectionScheme[] = sortedDexieSections.filter((section) => {
            const supabaseSection = sortedSupabaseSections.find((s) => s.id === section.id);

            console.log(section, supabaseSection);

            return supabaseSection && !isEqual(
                {
                    id : section.id,
                    title : section.title,
                    totalLinksCount :  section.totalLinksCount,
                    links : [],
                    links_layout : { layout : section.links_layout.layout, size : section.links_layout.size },
                    selfLayout : section.selfLayout,
                    section_ref : section.section_ref,
                },
                {
                    id : supabaseSection.id,
                    title : supabaseSection.title,
                    totalLinksCount :  supabaseSection.totalLinksCount,
                    links : [],
                    links_layout : { layout : supabaseSection.links_layout.layout, size : supabaseSection.links_layout.size },
                    selfLayout : supabaseSection.selfLayout,
                    section_ref : supabaseSection.section_ref,
                }
            );
        })

        const updatedLinks : LinkScheme[] = sortedDexieSections.flatMap(section => section.links).filter((link) => {
            const supabaseLinks = sortedSupabaseSections.flatMap(section => section.links).find((s) => s.id === link.id);

            return supabaseLinks && !isEqual(
                {
                    id : link.id,
                    title : link.title,
                    url : link.url,
                    visitCount : link.visitCount,
                },
                {
                    id : supabaseLinks.id,
                    title : supabaseLinks.title,
                    url : supabaseLinks.url,
                    visitCount : supabaseLinks.visitCount,
                }
            );
        })

        // Get new, deleted, and updated sections
        const newSections = getNewSections(sortedDexieSections, createdIDS);
        const deletedSections = getNewSections(sortedSupabaseSections, deletedIDS);
        const updatedSections = getNewSections(updatedSectionss, updatedIDS);

        // Get new, deleted, and updated links
        const newLinks = getNewLinks(sortedDexieSections.flatMap(section => section.links), createdLinksIDS);
        const deletedLinks = getNewLinks(sortedSupabaseSections.flatMap(section => section.links), deletedLinksIDS);
        //const updatedLinks = getNewLinks(sortedDexieSections.flatMap(section => section.links), updatedLinksIDS);

        console.log("Section : ",{ Added : newSections, Deleted : deletedSections, Updated : updatedSections });

        console.log("Link : ",{ Added : newLinks, Deleted : deletedLinks, Updated : updatedLinks });
    
        let hadError = false;

        onStatusCallback?.("Syncing");
        await CreateSectionToSupabase({ email, sections : newSections, token, onSyncError : (e) => onSyncError?.(e) }).catch(() => hadError=true);
        await DeleteSectionToSupabase({ sections : deletedSections, token, onSyncError : (e) => onSyncError?.(e) }).catch(() => hadError=true);
        await UpdateSectionToSupabase({ sections : updatedSections, token, email, onSyncError : (e) => onSyncError?.(e) }).catch(() => hadError=true);

        await CreateLinkToSupabase({ links : newLinks, token, email, onSyncError : (e) => onSyncError?.(e) }).catch(() => hadError=true);;
        await DeleteLinkToSupabase({ links : deletedLinks, token, onSyncError : (e) => onSyncError?.(e) }).catch(() => hadError=true);;
        await UpdateLinkToSupabase({ updatedLinks : updatedLinks, token, onSyncError : (e) => onSyncError?.(e) }).catch(() => hadError=true);;
        
        hadError ? onStatusCallback?.("Error") : onStatusCallback?.("Synced");
    }
    catch (error)
    {
        console.error("Error During Synchronization:", error);
    }
};


// --------------------------------------------------------------SECTION--------------------------------------------------------------------- //

let operationDone = 0;

interface ICreateSectionToSupabase {
    email : string;
    token : string;
    sections:SectionScheme[];
    onSyncError : (error : any) => void;
}

async function CreateSectionToSupabase({ email, token, sections, onSyncError } : ICreateSectionToSupabase)
{
    let totalOperationCount = sections.length;
    
    if(totalOperationCount === 0) return;

    for (const section of sections) {
        await CreateSection({
            token: token,
            email: email,
            sectionData : section,
            onSuccess: (data) => operationDone++,
            onError: (error) => onSyncError(`Error creating sections in Supabase: ${error}`)
        })
    }

    console.log("Synchronization Completed Successfully");

    if(operationDone === totalOperationCount) {
        console.log("All Synchronization");
        operationDone = 0;
    }
}

interface IDeleteSectionToSupabase {
    token : string;
    sections:SectionScheme[];
    onSyncError : (error : any) => void;
}

async function DeleteSectionToSupabase({ token, sections, onSyncError } : IDeleteSectionToSupabase)
{
    let totalOperationCount = sections.length;

    if(totalOperationCount === 0) return;

    for (const section of sections) {
        await DeleteSection({
            token: token,
            section_id : section.id,
            onSuccess: (data) => operationDone++,
            onError: (error) => onSyncError(`Error deleting section in Supabase: ${error}`)
        })
    }

    console.log("Synchronization Deleted Completed");

    if(operationDone === totalOperationCount) {
        console.log("All Deletation Synchronization");
        operationDone = 0;
    }
}
interface IUpdateSectionToSupabase {
    email : string;
    token : string;
    sections:SectionScheme[];
    onSyncError : (error : any) => void;
}

async function UpdateSectionToSupabase({ email, token, sections, onSyncError } : IUpdateSectionToSupabase)
{
    let totalOperationCount = sections.length;

    if(totalOperationCount === 0) return;

    for (const section of sections) {
        await UpdateSection({
            token: token,
            email : email,
            sectionData : section,
            onSuccess: (data) => operationDone++,
            onError: (error) => onSyncError(`Error updating section in Supabase: ${error}`)
        })
    }

    console.log("Synchronization Update Completed");

    if(operationDone === totalOperationCount) {
        console.log("All Update Synchronization");
        operationDone = 0;
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------------- //

// --------------------------------------------------------------LINKS--------------------------------------------------------------------- //

interface ICreateLinkToSupabase {
    email : string;
    token : string;
    links:LinkScheme[];
    onSyncError : (error : any) => void;
}

async function CreateLinkToSupabase({ email, token, links, onSyncError } : ICreateLinkToSupabase)
{
    let totalOperationCount = links.length;
    if(totalOperationCount === 0) return;

    const linkDataArray = links.map(link => ({
        id: link.id,
        title: link.title,
        url: link.url,
        ref: link.ref,
        created_at: new Date(link.created_at).toISOString(),
    }));

    await CreateLink({
        token: token,
        bulkData : linkDataArray,
        useBulkInsert : true,
        onSuccess: (data) => operationDone++,
        onError: (error) => onSyncError(`Error creating links in Supabase: ${error}`)
    })

    console.log("Links Synchronization Completed Successfully");
    if(operationDone === totalOperationCount) {
        console.log("All Links Creation Synchronization");
        operationDone = 0;
    }
}

interface IUpdateLinkToSupabase {
    token : string;
    updatedLinks : LinkScheme[];
    onSyncError : (error : any) => void;
}

async function UpdateLinkToSupabase({ token, updatedLinks, onSyncError } : IUpdateLinkToSupabase)
{
    let totalOperationCount = updatedLinks.length;
    if(updatedLinks.length < 1) return;

    for (const updatedLink of updatedLinks) {
        await UpdateLink({
            token: token,
            updatedLink : updatedLink,
            onSuccess: (data) => operationDone++,
            onError: (error) => onSyncError(`Error updating links in Supabase: ${error}`)
        })
    }
    console.log("Links Synchronization Updated Successfully");
    if(operationDone === totalOperationCount) {
        console.log("All Links Update Synchronization");
        operationDone = 0;
    }
}

interface IDeleteLinkToSupabase {
    token : string;
    links:LinkScheme[];
    onSyncError : (error : any) => void;
}

async function DeleteLinkToSupabase({ token, links, onSyncError } : IDeleteLinkToSupabase)
{
    let totalOperationCount = links.length;
    if(totalOperationCount === 0) return;
    for (const link of links) {
        await DeleteLink({
            token: token,
            linkData : link,
            onSuccess: (data) => operationDone++,
            onError: (error) => onSyncError(`Error deleting links in Supabase: ${error}`)
        })
    }
    console.log("Links Synchronization Deleted Successfully");
    if(operationDone === totalOperationCount) {
        console.log("All Links Deletion Synchronization");
        operationDone = 0;
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------------- //

function GetSectionIDS ({ dexieSections, supabaseSections } : { dexieSections : SectionScheme[], supabaseSections : SectionScheme[] }) {
    // Sort both arrays based on the 'id' property
    const sortedSupabaseSections = supabaseSections.sort((a, b) => a.id.localeCompare(b.id));
    const sortedDexieSections = dexieSections.sort((a, b) => a.id.localeCompare(b.id));

    // Create sets of IDs for quick lookup
    const supabaseIds = new Set(sortedSupabaseSections.map(section => section.id));
    const dexieIds = new Set(sortedDexieSections.map(section => section.id));

    const newIds = new Set([...dexieIds].filter(id => !supabaseIds.has(id))); // Get IDs Of Newly Created Sections
    const deletedIds = new Set([...supabaseIds].filter(id => !dexieIds.has(id))); // Get IDs Of Deleted Sections
    const updatedIds = new Set([...dexieIds].filter(id => supabaseIds.has(id))); // Get IDs Of Updated Sections

    return { createdIDS : newIds, deletedIDS : deletedIds, updatedIDS : updatedIds };
}

function GetLinkIDS ({ dexieSections, supabaseSections } : { dexieSections : SectionScheme[], supabaseSections : SectionScheme[] }) {

    // Flatten the arrays to get individual link IDs
    const supabaseLinkIds = new Set(supabaseSections.flatMap(section => section.links.map(link => link.id)));
    const dexieLinkIds = new Set(dexieSections.flatMap(section => section.links.map(link => link.id)));

    const newIds = new Set([...dexieLinkIds].filter(id => !supabaseLinkIds.has(id))); // Get IDs Of Newly Created Links
    const deletedIds = new Set([...supabaseLinkIds].filter(id => !dexieLinkIds.has(id))); // Get IDs Of Deleted Links
    const updatedIds = new Set([...dexieLinkIds].filter(id => supabaseLinkIds.has(id))); // Get IDs Of Updated Links


    return { createdLinksIDS : newIds, deletedLinksIDS : deletedIds, updatedLinksIDS : updatedIds };
}

// Function to get new sections from Dexie based on new IDs
function getNewSections(dexieSections: SectionScheme[], newIds: Set<string>): SectionScheme[] {
    const currentSections = dexieSections.filter(section => newIds.has(section.id));
    return [...new Set(removeExtraSections(currentSections))];
}

function getNewLinks(dexieLinks: LinkScheme[], newIds: Set<string>): LinkScheme[] {
    const currentSections = dexieLinks.filter(link => newIds.has(link.id));
    return currentSections;
}

const removeExtraSections = (sections: SectionScheme[]): SectionScheme[] => sections.map(section => ({...section}));

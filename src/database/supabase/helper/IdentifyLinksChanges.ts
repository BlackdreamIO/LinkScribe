import { isEqual } from "@/helpers";
import { LinkScheme } from "@/scheme/Link";
import { SectionScheme } from "@/scheme/Section";
 
export function IdentifyLinksChanges ({ dexieSections, supabaseSections } : { dexieSections : SectionScheme[], supabaseSections : SectionScheme[] }) {
    
    // Sort both arrays based on the 'id' property
    const sortedSupabaseSections = supabaseSections.sort((a, b) => a.id.localeCompare(b.id));
    const sortedDexieSections = dexieSections.sort((a, b) => a.id.localeCompare(b.id));

    // Flatten the arrays to get individual link IDs
    const supabaseLinkIds = new Set(supabaseSections.flatMap(section => section.links.map(link => link.id)));
    const dexieLinkIds = new Set(dexieSections.flatMap(section => section.links.map(link => link.id)));

    const createdLinksIDS = new Set([...dexieLinkIds].filter(id => !supabaseLinkIds.has(id))); // Get IDs Of Newly Created Links
    const deletedLinksIDS = new Set([...supabaseLinkIds].filter(id => !dexieLinkIds.has(id))); // Get IDs Of Deleted Links

    const updatedLinkss : LinkScheme[] = sortedDexieSections.flatMap(section => section.links).filter((link) => {
        const supabaseLinks = sortedSupabaseSections.flatMap(section => section.links).find((s) => s.id === link.id);

        return supabaseLinks && !isEqual(
            {
                id : link.id,
                title : link.title,
                url : link.url,
                visitCount : link.visitCount,
                image : link.image,
            },
            {
                id : supabaseLinks.id,
                title : supabaseLinks.title,
                url : supabaseLinks.url,
                visitCount : supabaseLinks.visitCount,
                image : supabaseLinks.image,
            }
        );
    })

    const newLinks = getNewLinks(sortedDexieSections.flatMap(section => section.links), createdLinksIDS);
        const deletedLinks = getNewLinks(sortedSupabaseSections.flatMap(section => section.links), deletedLinksIDS);

    return { newLinks, deletedLinks, updatedLinkss };
}

function getNewLinks(dexieLinks: LinkScheme[], newIds: Set<string>): LinkScheme[] {
    const currentSections = dexieLinks.filter(link => newIds.has(link.id));
    return currentSections;
}
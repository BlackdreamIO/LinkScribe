import { DexieDB } from "@/database/dexie";
import { RefineEmail } from "@/helpers/NormalizeEmail";

export async function DexieGetSectionsByEmail(emai : string)
{
    if(!emai) return;

    const sections = await DexieDB.sections.toArray();
    const filteredSection = sections.filter(section => section.section_ref === RefineEmail(emai));
    return filteredSection;
}
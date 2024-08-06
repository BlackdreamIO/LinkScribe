import { DexieDB } from "@/database/dexie";

export async function DexieGetSections()
{
    const sections = await DexieDB.sections.toArray();
    return sections;
}
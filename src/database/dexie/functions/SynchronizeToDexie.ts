import { DexieGetSectionsByEmail } from "@/database/dexie/helper/DexieSectionByEmail";
import { SectionScheme } from "@/scheme/Section";
import { SectionManagerDexie } from "../helper/SectionManagerDexie";

interface ISynchronizeToDexieDB {
    email: string;
    sections: SectionScheme[];
}

export async function SynchronizeToDexieDB({ email, sections }: ISynchronizeToDexieDB) {
    const currentSections = await DexieGetSectionsByEmail(email) ?? [];
    const currentSectionIds = new Set(currentSections.map(section => section.id));

    await SectionManagerDexie.syncSections(sections, currentSectionIds);
    await SectionManagerDexie.removeDeletedSections(currentSectionIds);
}

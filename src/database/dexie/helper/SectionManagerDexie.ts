import { DexieDB } from "@/database/dexie/DexieDB";
import { isEqual } from "@/helpers/isEqual";
import { SectionScheme } from "@/scheme/Section";

export class SectionManagerDexie {
    static async syncSections(sections: SectionScheme[], currentSectionIds: Set<string>) {
        for (const section of sections) {
            const existingSection = await DexieDB.sections.get(section.id);

            if (existingSection) {
                await this.updateSectionIfChanged(existingSection, section);
            } else {
                await DexieDB.sections.add(section);
            }

            currentSectionIds.delete(section.id);
        }
    }

    static async updateSectionIfChanged(existingSection: SectionScheme, newSection: SectionScheme) {
        if (!isEqual(existingSection, newSection)) {
            await DexieDB.sections.update(newSection.id, {
                ...newSection
            });
        }
    }

    static async removeDeletedSections(currentSectionIds: Set<string>) {
        for (const id of currentSectionIds) {
            await DexieDB.sections.where('id').equals(id).delete();
        }
    }
}

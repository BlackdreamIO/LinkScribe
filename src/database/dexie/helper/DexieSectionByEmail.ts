import { RefineEmail } from "@/helpers";
import { DexieDB } from "../DexieDB";
import { SectionScheme } from "@/scheme/Section";

interface IDexieGetSectionsByEmail {
    email : string;
    onSuccess? : (data : SectionScheme[]) => void;
    onError? : (error : any) => void;
}

export async function DexieGetSectionsByEmail({ email, onSuccess, onError } : IDexieGetSectionsByEmail) : Promise<SectionScheme[] | undefined>
{
    try {
        if(!email) return;

        const sections = await DexieDB.sections.toArray();
        const filteredSection = sections.filter(section => section.section_ref === RefineEmail(email));
        onSuccess?.(filteredSection);
        return filteredSection;
    }
    catch (error) {
        onError?.(error);
        return undefined;
    }
}
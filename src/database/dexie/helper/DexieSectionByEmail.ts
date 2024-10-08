import { RefineEmail } from "@/helpers";
import { DexieDB } from "../DexieDB";
import { SectionScheme } from "@/scheme/Section";
import { WatchDexieOperation } from "@/helpers/WatchDexieOperation";

interface IDexieGetSectionsByEmail {
    email : string;
    onSuccess? : (data : SectionScheme[]) => void;
    onError? : (error : any) => void;
}

export async function DexieGetSectionsByEmail({ email, onSuccess, onError } : IDexieGetSectionsByEmail) : Promise<SectionScheme[] | undefined>
{
    const result = await WatchDexieOperation(async () => {
        const sections = await DexieDB.sections.toArray();
        const filteredSection = sections.filter(section => section.section_ref === RefineEmail(email));
        onSuccess?.(filteredSection);
        return filteredSection;
    })
    .catch((error) => {
        onError?.(error);
        return undefined;
    })

    return result;
}
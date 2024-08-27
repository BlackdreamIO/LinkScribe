import { CreateSection } from "@/database/actions/sections/createSections";
import { DeleteSection } from "@/database/actions/sections/deleteSection";
import { UpdateSection } from "@/database/actions/sections/updateSection";
import { SectionScheme } from "@/scheme/Section";

interface ISectionManager {
    email : string;
    token : string;
    sections : SectionScheme[];
    onSyncError : (err : any) => void; 
}


let operationDone = 0;

export class SectionManagerClass
{
    static async createSectionToSupabase({ email, sections, token, onSyncError } : ISectionManager) {
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

        if(operationDone === totalOperationCount) operationDone = 0;
    };

    static async deleteSectionToSupabase({ token, sections, onSyncError } : ISectionManager)
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

        if(operationDone === totalOperationCount) operationDone = 0;
    };
    static async updateSectionToSupabase({ email, token, sections, onSyncError } : ISectionManager)
    {
        let totalOperationCount = sections.length;
        if(totalOperationCount === 0) return;

        for (const section of sections) {
            await UpdateSection({
                token,
                email,
                sectionData : section,
                onSuccess: (data) => operationDone++,
                onError: (error) => onSyncError(`Error updating section in Supabase: ${error}`)
            })
        }

        if(operationDone === totalOperationCount) operationDone = 0;
    }
}
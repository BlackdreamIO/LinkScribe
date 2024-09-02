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

export class SectionManagerClass
{
    private static email : string;
    private static token : string;
    private static operationDone: number;

    static InitializeSectionManager({ email, token, } : { email : string, token : string, }) {
        SectionManagerClass.email = email;
        SectionManagerClass.token = token;
    }

    private static resetOperationCount() {
        SectionManagerClass.operationDone = 0;
    }

    static async createSectionToSupabase({ sections, onSyncError } : ISectionManager) {
        let totalOperationCount = sections.length;
        if(totalOperationCount === 0) return;

        for (const section of sections) {
            await CreateSection({
                token: this.token,
                email: this.email,
                sectionData : section,
                onSuccess: (data) => this.operationDone++,
                onError: (error) => onSyncError(`Error creating sections in Supabase: ${error}`)
            })
        }

        if(this.operationDone === totalOperationCount) this.resetOperationCount();
    };

    static async deleteSectionToSupabase({ sections, onSyncError } : ISectionManager)
    {
        let totalOperationCount = sections.length;
        if(totalOperationCount === 0) return;

        for (const section of sections) {
            await DeleteSection({
                token: this.token,
                section_id : section.id,
                onSuccess: (data) => this.operationDone++,
                onError: (error) => onSyncError(`Error deleting section in Supabase: ${error}`)
            })
        }

        if(this.operationDone === totalOperationCount) this.resetOperationCount();
    };
    static async updateSectionToSupabase({ sections, onSyncError } : ISectionManager)
    {
        let totalOperationCount = sections.length;
        if(totalOperationCount === 0) return;

        for (const section of sections) {
            await UpdateSection({
                token : this.token,
                email : this.email,
                sectionData : section,
                onSuccess: (data) => this.operationDone++,
                onError: (error) => onSyncError(`Error updating section in Supabase: ${error}`)
            })
        }

        if(this.operationDone === totalOperationCount) this.resetOperationCount();
    }
}
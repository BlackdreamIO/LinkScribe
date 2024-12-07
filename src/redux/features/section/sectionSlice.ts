import { LinkScheme } from '@/scheme/Link';
import { SectionScheme } from '@/scheme/Section';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TodoState {
    sections: SectionScheme[];
}

const initialState: TodoState = {
    sections: [],
};

const sectionSlice = createSlice({
    name: 'sectionSlice',
    initialState,
    reducers: {
        addSection: (state, action: PayloadAction<SectionScheme>) => {
            state.sections.push(action.payload);
        },
        updateSection: (state, action: PayloadAction<Partial<SectionScheme> & { id: string }>) => {
            const { id, ...changes } = action.payload;
            const section = state.sections.find((section) => section.id === id);
            if (section) {
                Object.assign(section, changes);
            }
        },
        deleteSection: (state, action: PayloadAction<string>) => {
            state.sections = state.sections.filter((section) => section.id !== action.payload);
        },

        addLink: (state, action: PayloadAction<{ sectionId: string; link: LinkScheme }>) => {
            const { sectionId, link } = action.payload;
            const section = state.sections.find((section) => section.id === sectionId);
            if (section) {
                section.links.push(link);
            }
        },
        updateLink: (state, action: PayloadAction<{ sectionId: string; link: LinkScheme }>) => {
            const { sectionId, link } = action.payload;
        
            const section = state.sections.find((section) => section.id === sectionId);
        
            if (section) {
                // Find the index of the link to update
                const linkIndex = section.links.findIndex((existingLink) => existingLink.id === link.id);
        
                if (linkIndex !== -1) {
                    // Replace only the specific link
                    section.links[linkIndex] = {
                        ...section.links[linkIndex],
                        ...link,
                    };
                }
            }
        },        
        deleteLink: (state, action: PayloadAction<{ sectionId: string; linkId: string }>) => {
            const { sectionId, linkId } = action.payload;
            const section = state.sections.find((section) => section.id === sectionId);
            if (section) {
                section.links = section.links.filter(x => x.id !== linkId);
            }
        },
    },
    extraReducers() { },
});

export const {
    addSection,
    updateSection,
    deleteSection,
    addLink,
    updateLink,
    deleteLink
} = sectionSlice.actions;

export default sectionSlice.reducer;

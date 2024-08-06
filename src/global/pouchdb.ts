import { SectionScheme } from "@/scheme/Section"

export function ConvertSectionToDocs(sections : SectionScheme[])
{ 
    return sections.map(section => {
        return { _id: section.id.toString(), ...section };
    }
)}

export function ConvertSectionToDoc(section : SectionScheme)
{ 
    return { _id: section.id.toString(), ...section };
}

export function ConvertDocsToSection(docs : any)
{ 
    return { id: parseInt(docs._id), ...docs };
}

export function DeleteDocs(docs : PouchDB.Core.AllDocsResponse<{}>)
{ 
    docs.rows.map(row => ({
        _id: row.id,
        _rev: row.value.rev,
        _deleted: true
    }));
}
import { SectionScheme } from "@/scheme/Section";

export function ConvertSectionToJSON(contextSections : SectionScheme[])
{
    const formattedArray = contextSections.map(item => ({
        id : '--protected',
        title : item.title,
        linkCount : item.totalLinksCount,
        created_at: new Date(item.created_at).toDateString(),
        links: item.links.map(link => ({
            ...link,
            id : '--protected',
            ref : '--protected',
            created_at: new Date(link.created_at).toDateString(),
        }))
    }));

    const json = JSON.stringify(formattedArray, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
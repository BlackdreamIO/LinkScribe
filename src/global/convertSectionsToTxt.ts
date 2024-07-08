import { SectionScheme } from "@/scheme/Section";

export function ConvertSectionToTxt(contextSections : SectionScheme[])
{
    const text = contextSections.map(item => {
        let itemText = `Title: ${item.title}\nTotal Link : ${item.totalLinksCount}\nCreated At: ${new Date(item.created_at).toDateString()}\nLinks:\n`;
        
        item.links.forEach(link => {
            itemText += `  - Title: ${link.title}\n    URL: ${link.url}\n    Created At: ${new Date(link.created_at).toDateString()}\n`;
        })
        return itemText;
    }).join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'export.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
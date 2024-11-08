export async function IsValidImageUrl(url : string)
{
    try
    {
        const res = await fetch(url);
        const buff = await res.blob();
        
        const isImage = buff.type.startsWith('image/');
        return isImage;
    }
    catch (error) {
        return false;
    }
}
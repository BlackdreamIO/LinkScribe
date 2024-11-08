
export function ConvertBlobToUrl (blob : Blob) {
    const url = URL.createObjectURL(blob);
    return url
}
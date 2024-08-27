/**
 * Refines an email address by removing special characters and returns the normalized email.
 *
 * @param {string} email - The email address to be normalized.
 * @return {string} The normalized email address without special characters.
 */
export function RefineEmail(email : string) : string
{
    if(email.length > 0 || email !== "") {
        return email.replaceAll("@", "").replaceAll(".", "").replaceAll("_", "");
    }
    else {
        console.error("func : ConvertEmailString >> Enter String");
        return "";
    }
}
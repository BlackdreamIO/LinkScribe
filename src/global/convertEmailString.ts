
export function ConvertEmailString(email : string) : string
{
    if(email.length > 0 || email !== "") {
        return email.replaceAll("@", "").replaceAll(".", "").replaceAll("_", "");
    }
    else {
        console.error("func : ConvertEmailString >> Enter String");
        return "";
    }
}
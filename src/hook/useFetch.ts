import { useSendToastMessage } from "./useSendToastMessage";

interface IFetchPost {
    url : string;
    body : any;
    jsonStringifyBody? : boolean;
    useCache? : boolean;
    showError? : boolean;
    returnJson? : boolean;
    requestOptions? : RequestInit;
    headerOptions? : HeadersInit;
}

interface IFetchGet {
    url : string;
    token : string;
    useCache? : boolean;
    showError? : boolean;
    returnJson? : boolean;
    requestOptions? : RequestInit;
    headerOptions? : HeadersInit;
}


interface IRequestOutput {
    response : any;
    status : number;
    statusText : string;
    hasError? : boolean;
    error? : any;
}

export const useFetch = () => {

    const { ToastMessage } = useSendToastMessage();

    async function fetchPost({
        url,
        body,
        jsonStringifyBody = true,
        useCache = false,
        showError = true,
        returnJson = true,
        headerOptions = {},
        requestOptions = {}
    }: IFetchPost): Promise<IRequestOutput> {
        try {
            const isFormData = body instanceof FormData;
            const headers = isFormData
                ? headerOptions
                : { 'Content-Type': 'application/json', ...headerOptions };
    
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: jsonStringifyBody && !isFormData ? JSON.stringify(body) : body,
                cache: !useCache ? 'no-store' : 'default',
                ...requestOptions
            });
    
            if (!response.ok && showError) {
                ToastMessage({ message: "Post Request Send Error", type: "Error", duration: 2000 });
            }
    
            return {
                response: returnJson ? await response.json() : response,
                status: response.status,
                statusText: response.statusText,
                hasError: !response.ok
            };
        }
        catch (error) {
            if (showError) {
                ToastMessage({ message: "Post Request Send Error", type: "Error", duration: 2000 });
            }
            return {
                response: undefined,
                status: 500,
                statusText: "Internal Server Error",
                hasError: true,
                error
            };
        }
    }    

    async function fetchGet({
        url,
        useCache=false,
        returnJson=true,
        showError=true,
        headerOptions,
        requestOptions
    } : IFetchGet) {
        try
        {
            const response = await fetch(url, {
                method: 'GET',
                headers: headerOptions,
                cache: useCache ? 'default' : 'no-store',
                ...requestOptions
            })
    
            if (!response.ok && showError) {
                ToastMessage({ message : "Get Request Send Error", type : "Error", duration : 2000 });
            }
    
            return returnJson ? await response.json() : response;
        }
        catch (error) {
            if(showError) {
                ToastMessage({ message : "Get Request Send Error", type : "Error", duration : 2000 });
            }
        }
    }

    return { fetchPost, fetchGet };
}

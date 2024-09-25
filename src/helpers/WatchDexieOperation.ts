
export async function WatchDexieOperation (operation: () => Promise<any>)
{
    try
    {
        const result = await operation();
        localStorage.setItem("dexieMemoryAllocationError", JSON.stringify(false));
        return result;
    }
    catch (error : any) {
        switch (error.name) {
            case 'AbortError':
                //console.error('Transaction aborted:', error.message);
                localStorage.setItem("dexieMemoryAllocationError", JSON.stringify(true));
                break;
        
            case 'ConstraintError':
                //console.error('Constraint violation:', error.message);
                localStorage.setItem("dexieMemoryAllocationError", JSON.stringify(true));
                break;

            case 'QuotaExceededError':
                //console.error('Disk Space Full:', error.message);
                localStorage.setItem("dexieMemoryAllocationError", JSON.stringify(true));
                break;
    
            case 'DatabaseClosedError':
                //console.error('Disk Space Full:', error.message);
                localStorage.setItem("dexieMemoryAllocationError", JSON.stringify(true));
                break;

            default:
                //console.error('Unexpected Dexie error:', error);
                localStorage.setItem("dexieMemoryAllocationError", JSON.stringify(true));
                break;
        }
    }
}

interface IQuery {
    label : string,
    value : string
}

export const FILTER_QUERIES : IQuery[] = [
    {
        label : "from:<origin>",
        value : "from:<>"
    },
    {
        label : "from:<origin> title",
        value : "from:<> example"
    },
    {
        label : "by:<method> [view, date, vaild]",
        value : "by:<>"
    },
    {
        label : "date:<00/00/0000>",
        value : "date:<00/00/0000>"
    }
]

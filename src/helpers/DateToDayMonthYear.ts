
/**
 * Converts a given Date object to a string representing the day, month, and year in UTC.
 *
 * @param {Date} date - The Date object to be converted.
 * @return {string} A string in the format 'day/month/year' representing the UTC day, month, and year.
 */
export function DateToDayMonthYear(date : Date)
{

    // UTC Day, Month, Year

    const day = new Date(date).getUTCDay();
    const month = new Date(date).getUTCMonth();
    const year = new Date(date).getUTCFullYear();

    return `${day}/${month}/${year}`;
}
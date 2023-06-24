import * as fs from 'fs';

export function readCsv(filePath: string): [number[], number[]] {

    // Read the CSV file contents as a string
    const csvContents = fs.readFileSync(filePath, 'utf8');

    // Parse the CSV string into an array of objects
    const csvRows = csvContents.trim().split('\n').slice(1).map(row => {
    const [timestamp, n_days_since_1st_may, temperature, comment] = row.trim().split(',');
        return {
            timestamp,
            n_days_since_1st_may: parseInt(n_days_since_1st_may),
            temperature: parseFloat(temperature),
            comment
        };
    });

    // Extract the n_days_since_1st_may and temperature columns into separate arrays
    const x = csvRows.map(row => row.n_days_since_1st_may);
    const y = csvRows.map(row => row.temperature);

    return [x, y];

}


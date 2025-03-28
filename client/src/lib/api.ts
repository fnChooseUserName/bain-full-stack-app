const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';


/**
 * Wrapper function for making API requests. Prepends base-url to each request so only the endpoint needs to be supplied.
 * @param endpoint - API endpoint (e.g., "/distance")
 * @param method - HTTP method (GET, POST)
 * @param body - Optional body for POST requests
 */
export const request = async (
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: Record<string, any>
) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if(!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`[API Error] ${response.status} : ${errorMessage}`)
        }

        return await response.json();

    } catch(error) {
        console.error(`[API Error] ${error}`);
        throw error;
    }
};

/**
 * Get the distance between two addresses/locations.
 * @param address1 - First address
 * @param address2 - Second address
 */
export async function getDistance(address1: string, address2: string) {
    return await request('/distance', 'POST', { address1, address2 });
}


/**
 * Get a list of all of the previous distinct searches made.
*/
export async function getHistory() {
    return await request('/query-history', 'GET');
}
const API_BASE_URL = 'https://flight-tracker-backend-550i.onrender.com';

/**
 * A helper function to handle fetch responses.
 * @param {Response} response - The response from a fetch call.
 */
const handleResponse = async (response) => {
    if (response.ok) {
        // For 204 No Content, we don't need to parse JSON
        if (response.status === 204) {
            return;
        }
        return response.json();
    } else {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
};

/**
 * Fetches the trips for a specific user.
 * @param {string} userId - The ID of the user.
 * @param {string} token - The Firebase auth token for authorization (optional, for future use).
 */
export const fetchTrips = async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}` // Add this line when you implement backend auth
        },
    });
    return handleResponse(response);
};

/**
 * Adds a new trip to the database via manual entry.
 * @param {object} tripData - The flight details from the form.
 * @param {string} token - The Firebase auth token.
 */
export const addTrip = async (tripData, token) => {
    const response = await fetch(`${API_BASE_URL}/api/trips`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tripData),
    });
    return handleResponse(response);
};

/**
 * Creates a Stripe checkout session.
 * @param {string} priceId - The ID of the Stripe price.
 * @param {string} userId - The ID of the user.
 * @param {string} token - The Firebase auth token.
 */
export const createCheckoutSession = async (priceId, userId, token) => {
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priceId, userId }),
    });
    return handleResponse(response);
};

/**
 * Sends a request to the backend to cancel a user's subscription.
 * @param {string} userId - The ID of the user.
 * @param {string} token - The Firebase auth token.
 */
export const cancelSubscription = async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/cancel-subscription`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
};


// <<< NEW CODE BLOCK STARTS HERE: ACCOUNT MANAGEMENT API FUNCTIONS >>>

/**
 * Fetches detailed account information for a user.
 * @param {string} userId - The ID of the user.
 * @param {string} token - The Firebase auth token.
 */
export const getUserAccount = async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/api/user/me/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
    });
    return handleResponse(response);
};

/**
 * Creates a Stripe Customer Portal session for the user to manage their billing.
 * @param {string} userId - The ID of the user.
 * @param {string} token - The Firebase auth token.
 */
export const createCustomerPortalSession = async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/create-customer-portal-session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
};

/**
 * Deletes a specific flight entry.
 * @param {string} flightId - The ID of the flight to delete.
 * @param {string} userId - The ID of the user who owns the flight.
 * @param {string} token - The Firebase auth token.
 */
export const deleteTrip = async (flightId, userId, token) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${flightId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        // The backend expects the userId in the body for this dev-mode implementation
        body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
};

// <<< END OF NEW CODE BLOCK >>>

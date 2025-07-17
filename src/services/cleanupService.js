const { pool } = require('../database');

/**
 * Finds all active flights where the departure date is in the past
 * and deactivates them. This frees up tracking slots for users.
 * This function is designed to be called by a secure, scheduled cron job.
 */
const deactivatePastFlights = async () => {
    const client = await pool.connect();
    try {
        console.log('--- [Cleanup Service] Starting job: Deactivate past flights ---');
        
        // Find all active flights where the departure date is before today.
        // The `departure_date` is stored as VARCHAR, so it needs to be cast to a DATE.
        // We use `< NOW()::date` to safely compare it with the current date.
        const { rows } = await client.query(`
            UPDATE flights
            SET is_active = FALSE, updated_at = NOW()
            WHERE is_active = TRUE AND departure_date::date < NOW()::date
            RETURNING flight_id, user_id;
        `);

        if (rows.length > 0) {
            console.log(`[Cleanup Service] Deactivated ${rows.length} past flights.`);
            // The user's active flight count is calculated dynamically via a query,
            // so simply setting is_active=FALSE is enough to free up the slot.
        } else {
            console.log('[Cleanup Service] No past flights found to deactivate.');
        }

        return { deactivatedCount: rows.length };

    } catch (error) {
        console.error('[Cleanup Service] CRITICAL ERROR during flight cleanup:', error);
        throw error; // Rethrow to be handled by the caller
    } finally {
        client.release();
        console.log('--- [Cleanup Service] Finished job: Deactivate past flights ---');
    }
};

module.exports = {
    deactivatePastFlights,
};

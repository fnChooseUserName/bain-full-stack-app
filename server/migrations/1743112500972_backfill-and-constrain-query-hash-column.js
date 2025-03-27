/* eslint-disable camelcase */
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {

    // Enable pgcrypto extension to use digest() function below
    await pgm.sql('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    
    // Backfill query_hash values for existing records
    await pgm.sql(`
        UPDATE distance_queries
        SET query_hash = encode(digest(
        CONCAT(lat1, lon1, lat2, lon2), 'sha256'
        ), 'hex')
        WHERE query_hash IS NULL;
    `);

    // Add NOT NULL constraints
    pgm.alterColumn('distance_queries', 'query_hash', {
        notNull: true
    });

    // Add index and UNIQUE constraint
    pgm.createIndex('distance_queries', 'query_hash', {
        unique: true
    });

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropIndex('distance_queries', 'query_hash');
    pgm.alterColumn('distance_queries', 'query_hash', { notNull: false });
};

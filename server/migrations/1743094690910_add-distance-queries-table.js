/* eslint-disable camelcase *
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('distance_queries', {
        id: 'id',
        address1: { type: 'text', notNull: true },
        address2: { type: 'text', notNull: true },
        lat1: { type: 'double precision', notNull: true },
        lon1: { type: 'double precision', notNull: true },
        lat2: { type: 'double precision', notNull: true },
        lon2: { type: 'double precision', notNull: true },
        distance_km: { type: 'double precision', notNull: true },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
      });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('distance_queries');
};

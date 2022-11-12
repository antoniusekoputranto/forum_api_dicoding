/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },

        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users(id)',
            onDelete: 'CASCADE'
        },

        thread: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'threads(id)',
            onDelete: 'CASCADE'
        },

        content: {
            type: 'TEXT',
            notNull: true,
        },

        is_deleted: {
            type: 'BOOLEAN',
            notNull: true,
            default: false
        },

        date: {
            type: 'TEXT',
            notNUll: false,
            default: pgm.func('current_timestamp')
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('comments')
};

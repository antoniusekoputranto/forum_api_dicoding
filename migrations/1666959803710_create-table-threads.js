
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },

        owner: {
            type: 'VARCHAR(50)',
            notNUll: true,
            references: 'users(id)',
            onDelete: 'CASCADE'
        },

        title: {
            type: 'VARCHAR(255)',
            notNull: true,
        },

        body: {
            type: 'TEXT',
            notNull: true,
        },

        date: {
            type: 'TEXT',
            notNUll: false,
            default: pgm.func('current_timestamp')
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('threads')
};

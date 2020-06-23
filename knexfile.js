// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
        host:'eduapp.cp3patxhutdg.ap-south-1.rds.amazonaws.com',
        user:'admin',
        password:'eduappadmin',
        database:'edusoul' 
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

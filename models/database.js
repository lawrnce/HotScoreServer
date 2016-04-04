var pg = require('pg')
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/hotscore'

var client = new pg.Client(connectionString)
client.connect()

var setupString  = 'CREATE TABLE items (id SERIAL PRIMARY KEY, title VARCHAR(40) not null, age int, likes int, score numeric); DROP FUNCTION IF EXISTS hot_score(integer, integer); CREATE OR REPLACE FUNCTION hot_score(likes integer, age integer) RETURNS numeric AS $$ SELECT round(cast($1 / power($2, 1.8) as numeric), 22) $$ LANGUAGE SQL IMMUTABLE;'

// Create table and add hot score function
var query = client.query(setupString)

query.on('end', function() { client.end() })

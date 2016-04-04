#Hot Score Server

Hot Score Server ranks posts based on popularity with a time decay. The implementation is similar to [Hacker News](https://news.ycombinator.com). It is written in node.js with postgres as the database. For this demo, an internal cron function updates an item's score each second.

##Installation

Install [Postgres](http://www.postgresql.org/download/) and create a database called 'hotscore'.

```SQL
-- In the terminal, start psql and run
CREATE DATABASE hotscore
```
Make sure PostgreSQL is running on port 5432. Run the database setup script in the '/models' directory.

```Node
node database.js
```

Return to the root directory and run.
```Node
npm start
```
Open localhost:3000 in your browser.

##Usage

Hot Score Server is an api service. Use curl to interface it.

####Create item
```
curl --data "title=Some Title Here" http://localhost:3000/api
```
####Update item's likes
```
curl -X PUT --data "likes=4" http://localhost:3000/api/:item_id
```
:item_id denotes an item's primary id in the database.

####Delete item
```
curl -X DELETE http://localhost:3000/api/:item_id
```

##View Data
* http://localhost:3000/popular
* http://localhost:3000/recent

##Author
Lawrence Tran

##License
GPL

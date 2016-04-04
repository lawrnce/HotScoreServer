#Hot Score Server

Hot Score Server ranks posts based on popularity with a time decay. The implementation is similar to [Hacker News](https://news.ycombinator.com). It is written in node.js with postgres as the database.

##Installation

Install [Postgres](http://www.postgresql.org/download/) and create a database called 'hotscore'.

```SQL
-- In the terminal, start psql and run
CREATE DATABASE hotscore
```
Run the database setup script. cd to the models directory and run

```Node
node database.js
```

Return to the root directory and start
```Node
npm start
```


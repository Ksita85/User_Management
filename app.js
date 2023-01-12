const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Parsing middleware

//Parse application
app.use(bodyParser.urlencoded({ extended: false }));

//Parse application Json
app.use(bodyParser.json());

//Static Files
app.use(express.static('public'));

//Templating Engine
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

//Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Connect to Database
pool.getConnection(( err, connection ) => {
    if(err) throw err;
    console.log('Connected as ID: ' + connection.threadId);
});

const routes = require('./server/routes/user');

app.use('', routes)

app.listen(port, () => console.log(`App Listening on port ${port}`));
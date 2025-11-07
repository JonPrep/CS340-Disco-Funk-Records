/*
 * Disco Funk Records - Web Application Server
 * CS340 Project - Team Disco Funk (70)
 * Members: Jonathan Prevish, Riley Monroe
 */

// Import required modules
const express = require('express');
const exphbs = require('express-handlebars');
const mysql = require('mysql2');

// Initialize express application
const app = express();

// Port configuration
const PORT = 7070;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Configure handlebars
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main'
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

hbs.handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 2);
});

// Create MySQL database connection pool
var dbConnectionPool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_monroer',
    password: '6523',
    database: 'cs340_monroer'
});

// Test database connection
dbConnectionPool.query('SELECT 1', function(error) {
    if (error) {
        console.log('Database connection failed :(');
        console.log(error);
    } else {
        console.log('Database connection successful');
    }
});

/*
 * ROUTES
 */

// Homepage
app.get('/', function(req, res) {
    res.render('index');
});

// Customers
app.get('/customers', function(req, res) {
    const query1 = "SELECT customerID, name, address, phoneNumber, email FROM Customers;";

    dbConnectionPool.query(query1, function(error, rows) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render('customers', {data: rows});
        }
    });
});

// Sales
app.get('/sales', function(req, res) {
    const query1 =  `SELECT Sales.salesID, Sales.invoiceDate, Customers.name,
                     Sales.invoiceAmount, Sales.paymentType, Sales.status
                     FROM Sales
                     INNER JOIN Customers ON Sales.customerID = Customers.customerID;`;

    dbConnectionPool.query(query1, function(error, rows) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render('sales', {data: rows});
        }
    });
});

// Inventory
app.get('/inventory', function(req, res) {
    const query1 =  `SELECT Inventory.inventoryID, Songs.title, Songs.artist,
                     Inventory.type, Inventory.quantity, Inventory.price
                     FROM Inventory
                     INNER JOIN Songs ON Inventory.songID = Songs.songID;`;

    dbConnectionPool.query(query1, function(error, rows) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render('inventory', {data: rows});
        }
    });
});

// Songs
app.get('/songs', function(req, res) {
    const query1 = "SELECT songID, title, genre, artist, album, dateReleased, format FROM Songs;";

    dbConnectionPool.query(query1, function(error, rows) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render('songs', {data: rows});
        }
    });
});

// Suppliers
app.get('/suppliers', function(req, res) {
    const query1 = "SELECT supplierID, name, address, phoneNumber, email FROM Suppliers;";

    dbConnectionPool.query(query1, function(error, rows) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render('suppliers', {data: rows});
        }
    });
});

// Purchases page
app.get('/purchases', function(req, res) {
    const query1 =  "SELECT Purchases.purchaseID, Purchases.purchaseDate, " +
                    "Suppliers.name, Purchases.totalCost, Purchases.status " +
                    "FROM Purchases " +
                    "INNER JOIN Suppliers ON Purchases.supplierID = Suppliers.supplierID;";

    dbConnectionPool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render('purchases', {data: rows});
        }
    });
});


// Start server
app.listen(PORT, function() {
    console.log('==================================');
    console.log('Disco Funk Records Server Started');
    console.log('Express server listening on port ' + PORT);
    console.log('==================================');
});

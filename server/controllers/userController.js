const mysql = require('mysql');

//Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


//View Users

exports.view = (req, res) => {
    //Connect to Database
    pool.getConnection(( err, connection ) => {
        if(err) throw err;
        console.log('Connected to database as ID: ' + connection.threadId);
        //User the connection
        stmt = 'SELECT * FROM user';
        connection.query(stmt, (err, rows) => {
            //when done with the connection, release it
            connection.release();
            if (!err) {
                let removedUser = req.query.removed;
                res.render('home', { rows, removedUser });
            } else {
                console.log(err);
            }

            console.log('The data from user table: \n', rows);
        });
    });
}

//Search Users

exports.find = (req, res) => {
    //Connect to Database
    pool.getConnection(( err, connection ) => {
        if(err) throw err;
        console.log('Connected to database as ID: ' + connection.threadId);
        
        let searchWord = req.body.search;
        
        //find the word
        stmt = 'SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?';
        connection.query(stmt,  ['%'+ searchWord + '%', '%'+ searchWord + '%'], (err, rows) => {
            //when done with the connection, release it
            connection.release();
            if (!err) {
                res.render('home', { rows });
            } else {
                console.log(err);
            }

            console.log('Search results: \n', rows);
        });
    }); 
}


//Render Create User Form

exports.form = (req, res) => {
    res.render('add-user');
}

//Add new User to database

exports.create = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;
    let errors = [];

    //Check required fields
    if (!first_name || !last_name || !email || !phone) {
        errors.push({ msg: 'Please fill in all fields' });
    }
    
    if (errors.length > 0) {
        res.render('add-user', { errors, first_name, last_name, email, phone });
        console.log(errors);
    } else {
        //Connect to Database
        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('Connected to database as ID: ' + connection.threadId);

            //Add new user 
            stmt = 'INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?';
            connection.query(stmt, [first_name, last_name, email, phone, comments], (err, rows) => {
                //when done with the connection, release it
                connection.release();
                if (!err) {
                    res.render('add-user', { alert:'User added successfully' });
                } else {
                    console.log(err);
                }
                console.log('User Added: \n', rows);
            });
        });
    };
}

//Get Edit User form
exports.edit = (req, res) => {
    //Connect to Database
    pool.getConnection(( err, connection ) => {
        if(err) throw err;
        console.log('Connected to database as ID: ' + connection.threadId);
        //User the connection
        stmt = 'SELECT * FROM user WHERE id = ?';
        connection.query(stmt, [req.params.id], (err, rows) => {
            //when done with the connection, release it
            connection.release();
            if (!err) {
                res.render('edit-user', { rows });
            } else {
                console.log(err);
            }

            console.log('User to edit: \n', rows);
        });
    });
}

//Update User inf

exports.update = (req, res) => {
    //Connect to Database
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected to database as ID: ' + connection.threadId);
        const { first_name, last_name, email, phone, comments } = req.body;
        stmt = 'UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?';
        connection.query(stmt, [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
            if (!err) {
                //Show the updated user info
                query = 'SELECT * FROM user WHERE id = ?';
                connection.query(query, [req.params.id], (err, rows) => {
                    if (!err) {
                        res.render('edit-user', { rows, alert: `User ${first_name} has been updated.` });
                    } else {
                        console.log(err);
                    }
                    console.log('User updated: \n', rows);
                });
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);
        });
    });
}

//Delete User
exports.delete = (req, res) => {
    //Connect to Database
    pool.getConnection(( err, connection ) => {
        if(err) throw err;
        console.log('Connected to database as ID: ' + connection.threadId);
        //User the connection
        stmt = 'DELETE FROM user WHERE id = ?';
        connection.query(stmt, [req.params.id], (err, rows) => {
            //when done with the connection, release it
            connection.release();
            if (!err) {
                let removedUser = encodeURIComponent('User successfully removed.');
                res.redirect('/?removed=' + removedUser);
            } else {
                console.log(err);
            }
            console.log('User deleted');
        });
    });
}

//   // Hide a record

//   connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
//     if (!err) {
//       let removedUser = encodeURIComponent('User successeflly removed.');
//       res.redirect('/?removed=' + removedUser);
//     } else {
//       console.log(err);
//     }
//     console.log('The data from beer table are: \n', rows);
//   });

// }

exports.user = (req, res) => {
        //Connect to Database
        pool.getConnection(( err, connection ) => {
            if(err) throw err;
            console.log('Connected to database as ID: ' + connection.threadId);
            //User the connection
            stmt = 'SELECT * FROM user WHERE id = ?';
            connection.query(stmt, [req.params.id], (err, rows) => {
                //when done with the connection, release it
                connection.release();
                if (!err) {
                    res.render('user-view', { rows });
                } else {
                    console.log(err);
                }
                console.log('User: \n', rows);
            });
        });
}
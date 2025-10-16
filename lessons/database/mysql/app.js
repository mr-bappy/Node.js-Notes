import express from "express";
import mysql from "mysql2/promise";

// step 1: connect to mysql server
const db = await mysql.createConnection({
    host: "localhost",
    user: "db_user_name",
    password: "db_password",
    database: "db_name",
});
console.log("mySQL connected successfully");

// step 2: create a database
// await db.execute(`create database mysql_db`);
// console.log(await db.execute("show databases"));

// step 3: create a table
// await db.execute(`
//     CREATE TABLE students(
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     email VARCHAR(100) NOT NULL UNIQUE
//     );
// `);

// step 4: perform CRUD operation

// insertion
// using inline values (not recommended)
// await db.execute(`
//     INSERT INTO students(name, email)
//     VALUES
//     ("vishal", "vishal@gmail.com");
// `);

// using prepared values (recommended)
// await db.execute(`
//     INSERT INTO students(name, email)
//     VALUES
//     (?,?)
// `, ["lalit", "lalit@gmail.com"]);

// until now we have inserting single data, but what about inserting multiple data at one time, here we go

// const values = [
//     ["rohan", "rohan@gmail.com"],
//     ["akash", "akash@gmail.com"],
//     ["siddhu", "siddhu@gmail.com"],
//     ["ritesh", "ritesh@gmail.com"],
//     ["harshal", "harshal@gmail.com"],
// ];

// await db.query(`
//     INSERT INTO students(name, email)
//     VALUES
//     ?
// `, [values]);

// reading
// reading all values
// const [rows] = await db.execute(`
//     SELECT * FROM students;
// `);

// reading values according to condition
// const [rows] = await db.execute(`
//     SELECT * FROM students where name="vishal";
// `);

// console.log(rows);

// updating
// usual way
// try {
//     const [rows] = await db.execute(`
//         UPDATE students
//         SET email="vishal@admin.com"
//         where name="vishal";
//     `);
//     console.log("All users: ", rows);
// } catch (error) {
//     console.log(error);
// }

// genuine way
// try {
//     const [rows] = await db.execute(`
//         UPDATE students
//         SET email=?
//         where name=?;
//     `, ["lalit@manager.com","lalit"]);
//     console.log("All users: ", rows);
// } catch (error) {
//     console.log(error);
// }

// delete 
// usual way
// const [rows] = await db.execute(`
//     DELETE from students where email="ritesh@gmail.com";
// `);
// console.log(rows);

// genuine way
// const [rows] = await db.execute(`
//     DELETE from students where email=?;
// `, ["siddhu@gmail.com"]);
// console.log(rows);

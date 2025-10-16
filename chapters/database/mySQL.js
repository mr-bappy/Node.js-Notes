/*

mySQL
- open source relational database management
- stores data in tables, rows - records and columns - data attributes
- uses structured query language for managing and manipulating data
- suitable for both small and large-scale application
- cross platform

key concepts
- table
- row(record or tuple)
- column(attribute)
- primary key
- foreign key

commands
// mySQL is case-insensitive, meaning drop or DROP will be same

create database db_name; //creating a database
drop databse db_name; //deleting a database

use db_name; // using a database to work with

// creating a column
create table table_name(
colName_1 data_type key/constraints
colName_2 data_type key/constraints
);

// inserting single data
insert into table_name(colName_1, colName_2) values ("value_of_colName_1", "value_of_colName_2");
// note: we have not inserted id value because we have used auto_increment

// inserting multiple data
insert into table_name(colName_1, colName_2)
values
("value", "value"),
("value_", "value_"),
("_value", "_value");

// display all values of table
select * from table_name;

// display values according to condition
select * from table_name where condition

// updating value
update table_name
set colName_1 = value1, colName_2 = value2
where condition;

// delete value
delete from table_name
where condition;

*/
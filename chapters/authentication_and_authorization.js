/*

step 1: creating a routes
step 2: creating controllers

COOKIES
- small piece of data stored in user's browser

step 3: set cookie
step 4: cookie-parser middleware

authentication vs authorization
authentication - check identity
authorization - manage resource access

authenticatoin 
- session based
- JWT based

creating schema in DRIZZLE

handling user registratoin and storing data in database
handling user login and comparing data

password hashing:
- bcrypt
- argon2 (recommended)

session vs JWT authentication

protected route in express

logout and dynamic navbar

form validation
- packages: express-session, connect-flash

user authorization or data access to specific login user

zod validation

update and delete data in drizzle using express

session & JWT hybrid authentication
- creating session schema
- creating session
- creating access and refresh token
- refresh token if access token expired
- user logout: clear sessions and token 
- auto login after sign up

creating dynamic profile
- showing username & email
- verify email btn, change password btn, edit profile btn

EMAIL VERIFICATION

using ethereal and nodemailer
- install nodemailer
- create verification schema
- create OTP generation
- verify using nodemailer and ethereal


TRANSACTION IN DBMS
- one or more db operations executed as one unit of work
- entire sequence must complete successfully(commit) or fail entirely(rollback)

why to use?
- ensures data integrity
- prevent data corruption
- maintain atomicity
- handle concurrent requests
- rollback on failure 
- user authentication & verification
- e-commerce payments
- banking systems
- booking & reservations
- batch updates

URL API
- makes creating dynamic url easy

*/
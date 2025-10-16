/*

route parameters
- dynamic parts of URL that can be accessed using req.params
- defined in route path with (:), eg: /user/:id/view/:article
- access value of route parameters via req.params.id , req.params.article


query parameters
- key-value pairs appended to a URL after a ?, seperated by &, like /search?query=express&limit=10
- accessed by using req.query, which returns object containing the parameters
- for eg: /search?page=4, req.query.page, will give "page"
- often used to pass optional or filter data to the server without modifying the route
- always part of a URL & visible in browser and address part

*/


/*

form submission in express
- by default form uses GET method
- access data from PORT, middleware: express.urlencoded(), req.body in .post()

*/

/*

handle error pages in express

*/

/*

router in express js

*/
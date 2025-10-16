/*

understand sync vs async

node.js elements:
v8 engine - handles synchronous
libuv - c library that handles asynchronous

how node.js program starts
- main thread
- offloading
- thread pool

how it works?

[application] <--JS--> [V8 Engine] [ node.js bindings(Node API) (OS operation) ] <----> [ Libuv (event queue) <----> (event loop) ----> blocking operation ----> (worker threads) ----> execute callback ----> (event loop)]


*/
# Hello Notes Server Fastify

A _very_ simplistic server for in-memory storage of notes, so that the UI components can make more realistic requests.
- no authentication.
- probably not very threadsafe.
- 'allow all' CORS headers to aid local development.

At the moment this stores notes only, and that's it.

Using `fastify` for the server and `jest` for testing.

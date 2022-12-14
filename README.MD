# BG Clients Application

The BG Clients Application is allowing to keep track of the clients communications for a lawyer office.

It allows the creation of a private secured area for clients in order to communicate them useful informations like events and PDF files they can consult and download.

Once the application administrator creates a client, an user is created on Supabase with his email and a default password.

The administrator can publish events and files for clients.

When a client connects, he can view his informations on his secured area and download his files. He can also change his own password and the administrator can also reset his password to the default one.

The application is live on Vercel: https://bgclients.vercel.app

![Query](./Screenshot.png)

The application is built with three components:

- the database server, with a relational database schema deployed on Supabase PostgreSQL service.
- the REST API server, built with Express.
- the frontend application, built with ReactJS, Redux and Bootstrap5, relaying on the underlying REST API server to communicate with the database.

This repository contains the frontend application.

#### `Enjoy! :)`

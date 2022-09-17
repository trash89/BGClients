# BG Clients Application

The BG Clients Application is allowing to keep track of the clients for a lawyer office.

It allows the creation of a private secured area for clients in order to communicate them useful informations like events and PDF files they can consult and download.

Once the application administrator creates a client, an user is created on Supabase with his email and a default password.

The administrator can enter events and files for clients.

When a client connects, he can view his informations on his secured area and download his files. He can also change his own password and the administrator can also reset his password to the default one.

Live on Vercel platform : https://bgclients.vercel.app

The application is built with three components:

- the database server, with a relational database schema deployed on Supabase PostgreSQL service.
- the API REST server, built with Express.
- the frontend application, built with ReactJS, Redux and Bootstrap5, relaying on the underlying API REST server to communicate with the database.

This repository contains the API REST server for the BG Clients application and the React frontend client.

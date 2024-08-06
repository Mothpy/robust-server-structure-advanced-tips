const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");
const usersRouter = require("./users/users.router");
const pastesRouter = require("./pastes/pastes.router");

app.use(express.json());

// use routes for users and pastes 
app.use("/users", usersRouter); 
app.use("/pastes", pastesRouter); 


// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
});

module.exports = app;

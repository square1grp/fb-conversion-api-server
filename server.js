const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

const routes = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


routes(app); //register the route

app.listen(port);


console.log('CIA pixel API server started on: ' + port);
const express = require('express');
const path = require('path');
require('dotenv').config();

const route = require('./routes/client/index.route');

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));



route(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

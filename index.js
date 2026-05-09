const express = require('express');
const path = require('path');
require('dotenv').config();

const database = require('./config/database');

const systemConfig = require('./config/system');

const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

database.connect();


const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// App local
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use((req, res, next) => {
    res.locals.prefixAdmin = systemConfig.prefixAdmin;
    next();
});

// Debug: log every request
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

const staticPath = path.join(__dirname, "public");
console.log("Static path:", staticPath);
app.use(express.static(staticPath, {
    etag: false,
    maxAge: 0,
    setHeaders: (res) => {
        res.setHeader("Cache-Control", "no-store");
    }
}));

route(app)
routeAdmin(app)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

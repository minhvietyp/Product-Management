const express = require('express');
const path = require('path');
require('dotenv').config();

const database = require('./config/database');

const systemConfig = require('./config/system');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

const moment = require('moment');

database.connect();


const app = express();

// Socket IO
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
global._io = io;

const socketHandler = require("./sockets/index");
socketHandler(io);


const methodOverride = require('method-override');
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


//flash
app.use(cookieParser('keyboard cat'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}));
app.use(flash());

// Tiny MCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));


// App local
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;


app.use((req, res, next) => {
    res.locals.prefixAdmin = systemConfig.prefixAdmin;
    next();
});

// Debug: log every request
app.use((req, res, next) => {
    // require('fs').appendFileSync('debug.txt', `[${req.method}] ${req.originalUrl}\n`);
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
app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
        pageTitle: "404 Not Found",
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

const express = require('express');
const app = express();
const port = 3003;
const middleware = require('./middleware');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./database');
const session = require('express-session');

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);

//pug config
app.set('view engine', 'pug');
app.set('views', 'views');

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

//static css config
app.use(express.static(path.join(__dirname, 'public')));

//session
app.use(
  session({
    secret: 'bbq_chips',
    resave: true,
    saveUninitialized: false,
  })
);

//Routes
const loginRoute = require('./routes/loginRoutes');
const logoutRoute = require('./routes/logoutRoutes');
const registerRoute = require('./routes/registerRoutes');

app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/register', registerRoute);

app.get('/', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'Home',
    userLoggedIn: req.session.user,
  };

  res.status(200).render('home', payload);
});

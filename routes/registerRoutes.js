const express = require('express');
const app = express();
const router = express.Router();
const User = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');

app.set('view engine', 'pug');
app.set('views', 'views');

router.get('/', (req, res, next) => {
  res.status(200).render('register');
});

router.post('/', async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;

  const payload = req.body;

  if (
    firstName.trim() &&
    lastName.trim() &&
    username.trim() &&
    email.trim() &&
    password
  ) {
    //Searches for duplicated users
    const user = await User.findOne({
      //OR operator
      $or: [{ username: username.trim() }, { email: email.trim() }],
    }).catch((err) => {
      payload.errorMessage = 'Something went wrong while validating your user.';
      res.status(200).render('register', payload);
    });

    if (!user) {
      //no user

      const data = req.body;
      data.password = await bcrypt.hash(data.password, 10);
      const user = await User.create(data);

      req.session.user = user;

      return res.redirect('/');
    } else {
      //user found
      payload.errorMessage =
        email == user.email
          ? 'Email already in use.'
          : 'Username already in use.';
    }

    res.status(200).render('register', payload);
  } else {
    payload.errorMessage = 'Make sure each field is not empty.';
    res.status(200).render('register', payload);
  }
});

module.exports = router;

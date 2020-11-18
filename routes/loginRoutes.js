const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');

app.set('view engine', 'pug');
app.set('views', 'views');

router.get('/', (req, res, next) => {
  res.status(200).render('login');
});

router.post('/', async (req, res, next) => {
  const { logUsername, logPassword } = req.body;
  const payload = req.body;

  try {
    if (logUsername && logPassword) {
      const user = await User.findOne({
        //OR operator
        $or: [{ username: logUsername.trim() }, { email: logUsername.trim() }],
      });

      if (user) {
        const result = await bcrypt.compare(logPassword, user.password);
        if (result) {
          req.session.user = user;
          return res.redirect('/');
        }
        payload.errorMessage = 'Credentials incorrect.';
        return res.status(200).render('login', payload);
      }
    }

    payload.errorMessage = 'Fields cannot be empty';
    res.status(200).render('login', payload);
  } catch (ex) {
    console.log(ex);
    payload.errorMessage = ex?.error?.message[0];
    res.status(500).render('login', payload);
  }
});

module.exports = router;

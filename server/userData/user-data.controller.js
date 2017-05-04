//var Q = require('q');
var User = require('./user-data.model.js');
var passport = require('passport');

//var createUser = Q.nbind(User.create, User);

module.exports = {
  login: function (req, res, next) {
    // var username = req.body.user;
    // var password = req.body.password;

    // findUser({user: user, password: password})
    // .than(function (user) {
    //   if(!user) {
    //     next(new Error("User does not exist"));
    //   } else {
    //     res.send('success');
    //   }
    // })
    // .fail(function (error) {
    //   next(error);
    // })

    passport.authenticate('local', function(err, user, info) {
      if(err) {
        return next(err);
      }
      if(!user) {
        //return res.redirect('/login');
        return res.status(401).json({
          err: info
        });
      }
      req.logIn(user, function(err) {
        if (err) {
          return res.status(500).json({
            err: 'Could not log in user'
          });
        }
        res.status(200).json({
          status: 'Login successful!'
        })
        //return res.redirect('/users/' + user.username);
      })
    })(req, res, next);
  },


  newUser: function (req, res, next) {
    // console.log("Received User Data from client: ", req.body);
    // return createUser({
    //   userRealName: req.body.userRealName,
    //   email: req.body.email,
    //   username: req.body.username,
    //   password: req.body.password
    // })
    // .fail(function (error) {
    //   next(error);
    // })
    User.register(new User({ username: req.body.username, userRealName: req.body.userRealName, email: req.body.email }),
      req.body.password, function(err, account) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      passport.authenticate('local')(req, res, function () {
        return res.status(200).json({
          status: 'Registration successful!'
        });
      });
    });
  },

  signout: function(req, res) {
    req.logout();
    res.status(200).json({
      status: 'Bye!'
    });
    //res.redirect('/');
  }
}

// router.post('/register', function(req, res) {
//   User.register(new User({ username: req.body.username }),
//     req.body.password, function(err, account) {
//     if (err) {
//       return res.status(500).json({
//         err: err
//       });
//     }
//     passport.authenticate('local')(req, res, function () {
//       return res.status(200).json({
//         status: 'Registration successful!'
//       });
//     });
//   });
// });
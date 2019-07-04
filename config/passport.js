var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models/user');
var secret = require('../secret/secret');
passport.use(new GoogleStrategy({
	clientID: secret.google.clientID,
	clientSecret: secret.google.clientSecret,
	callbackURL: secret.google.callbackURL
    // clientID: '195642924636-dbt5dq5c0olr37o7en5qvhqfh6gd13qq.apps.googleusercontent.com',
    // clientSecret: 'OSsY6p8EwgWkVHJ1bqciniUs',
    // callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({
	    'google': profile.id
    }, function(err, user) {
	   if (err) {
		 return(500,{
			 'error': err
		 })
	 }
	 if (!user) {
		 User.findOne({'email':profile.emails[0].value}, (err, user) => {
			 // console.log(profile);
			if(err){
			    return done(err);
			}
			var messages = [];
			if(!user){
				user = new User({
				    fullname:profile.displayName,
 				    email: profile.emails[0].value
 			    })
 			    user.save(function(err) {
 					  if (err) console.log(err);
 					  // return done(err, user);
 					  return cb(err,user);
 				   });
		    } else {
			    return cb(err,user);
		    }
		 });
	 }
    })
  }
));
passport.serializeUser((user,done) => {
	done(null,user.id);
});
passport.deserializeUser((id,done) => {
	User.findById(id, (err,user) => {
		done(err,user);
	});
});
passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({'email':email}, (err, user) => {
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, req.flash('error', 'User With Email Already Exist.'));
        }
        var newUser = new User();
        newUser.fullname = req.body.fullname;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.save((err) => {
            return done(null, newUser);
        });
    })
}));
passport.use('local.login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({'email':email}, (err, user) => {
        if(err){
            return done(err);
        }
        var messages = [];
        if(!user || !user.validPassword(password)){
            messages.push('Email Does Not Exist Or Password is Invalid')
            return done(null, false, req.flash('error', messages));
        }
        return done(null, user);
    });
}));
// passport.use(new GoogleStrategy((req, token, refreshToken, profile, done) => {
//     User.findOne({google:profile.id}, (err, user) => {
//         if(err){
//             return done(err);
//         }
//         if(user){
//             done(null, user);
//         }else{
//             var newUser = new User();
//             newUser.google = profile.id;
//             newUser.fullname = profile.displayName;
//             newUser.email = profile._json.email;
//             newUser.tokens.push({token:token});
//             newUser.save(function(err) {
//                 if(err){
//                     console.log(err);
//                 }
//                 done(null, newUser);
//             });
//         }
//     })
// }));

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');
var secret = require('../secret/secret');
//Start of google authentication
passport.use(new GoogleStrategy({
	clientID: secret.google.clientID,
	clientSecret: secret.google.clientSecret,
	callbackURL: secret.google.callbackURL
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
//End of google authentication
//Start of twitter authentication
passport.use(new TwitterStrategy({
    consumerKey: secret.twitter.consumerKey,
    consumerSecret: secret.twitter.consumerSecret,
    callbackURL: secret.twitter.callbackURL
  },
  function(token, tokenSecret, profile, cb) {
    User.findOne({'twitter':profile.id}, (err, user) => {
	    if (err) {
		  return(500,{
			  'error': err
		  })
		  console.log(err);
	  }	 if (!user) {
	  		 User.findOne({'id':profile.id}, (err, user) => {
	  			 // console.log(profile);
	  			if(err){
	  			    return done(err);
	  			}
	  			var messages = [];
	  			if(!user){
	  				user = new User({
	  				    fullname:profile.displayName,
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
    });
  }
));
//End of twitter authentication
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
	   // console.log("eto:"+req.body.upload);
        newUser.fullname = req.body.fullname;
	   newUser.address = req.body.address;
	   newUser.age = req.body.age;
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

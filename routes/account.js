var User = require('../models/user');
module.exports = (app,passport) => {
	app.get('/account/create', (req, res) => {
		var success = req.flash('success');
		res.render('account/user', {
			title: 'Account Registration',
			name: req.user,
			success: success,
			hasErrors: success.length > 0
		});
	});
	app.post('/account/create',passport.authenticate('local.signup',{
		successRedirect: '/account/create',
		failureRedirect: '/account/create',
		failureFlash: true
	}));
	app.get('/users', (req, res) => {
		User.find({}, (err, result) => {
				res.render('account/users', {title: 'All Users || RateMe',
				name: req.user,
				data: result
			});
		});
	});
}
function validate(req,res,next){
	req.checkBody('fullname', 'Fullname is required').notEmpty();
	req.checkBody('fullname', 'Fullname must not be be less than 5').isLength({min:5});
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('email','Email is invalid').isEmail();
	req.checkBody('password','Password is required').notEmpty();
	req.checkBody('password','Password must not be less than 5').isLength({min:5});
	var errors = req.validationErrors();
	if(errors){
		var messages = [];
		errors.forEach((error)=>{
			messages.push(error.msg);
		});
		req.flash('error',messages);
		res.redirect('signup');
	}else{
		return next();
	}
}

var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var User = require('../models/user');
var Company = require('../models/company');
var async = require('async');
var {arrayAverage} = require('../myFunctions');
module.exports = (app, passport) => {
	app.get('/account/create', (req, res) => {
		var success = req.flash('success');
		res.render('account/user', {
			title: 'Account Registration',
			name: req.user,
			success: success,
			hasErrors: success.length > 0
		});
	});
	app.post('/account/create', passport.authenticate('local.signup', {
		successRedirect: '/account/create',
		failureRedirect: '/account/create',
		failureFlash: true
	}));
	app.get('/users', (req, res) => {
		User.find({}, (err, result) => {
			res.render('account/users', {
				title: 'All Users || RateMe',
				name: req.user,
				data: result
			});
		});
	});
	//User Search
	app.post('/account/search', (req, res) => {
		var name = req.body.search;
		var regex = new RegExp(name, 'i');
		User.find({'$or': [{'fullname': regex}]}, (err, data) => {
			if (err) {
				console.log(err);
			}
			res.render('account/users', {title: 'All Users || RateMe',name: req.user,data: data});
		});
	});
	//User Profile
	app.get('/account-profile/:id', (req, res) => {
		async.waterfall([
			function(callback){
			    User.findOne({'_id': req.params.id}, (err, data) => {
				   // res.render('account/user-profile', {title: 'Profile Name', name:req.user, id: req.params.id,data: data});
				   callback(err, data);
			    })
			},
			function(data, callback){
			    Company.findOne({'name': data.company.name}, (err, result) => {
					if(data.company.name!=''){
						var avg = arrayAverage(result.ratingNumber);
						res.render('account/user-profile', {title: 'Profile Name', name:req.user, id: req.params.id, data: result,user:data,average:avg});
					}else{
						res.render('account/user-profile-none', {title: 'Profile Name', name:req.user, id: req.params.id,user:data});
					}
			    })
			}
		],(err) =>{
				if(err){
					return next(err);
				}
				// res.redirect('/forgot');
		});
         // Company.findOne({'name':req.user.company.name}, (err, result) => {
		//     console.log(req.user.company.name);
		//     	var avg = arrayAverage(result.ratingNumber);
		//       res.render('account/user-profile', {title: 'Profile Name', name:req.user, id: req.params.id,data: result,average: avg});
         // });
     });
	//Updating of User Account
	app.get('/account/update-user/:id', (req, res) => {
		var messg = req.flash('success');
 	    	User.findOne({'_id':req.params.id}, (err, data) => {
 		   res.render('account/user-update', {title: 'Update User', name:req.user, data:data});
 	    });
	});

	app.post('/account/update-user/:id', (req, res) => {
		// console.log("nandito na");
		// console.log(req.params.id);
		async.waterfall([
			function(callback){
			    User.findOne({'_id': req.params.id}, (err, data) => {
				   // res.render('account/user-profile', {title: 'Profile Name', name:req.user, id: req.params.id,data: data});
				   callback(err, data);
			    })
			},
               function(result, callback){
                   User.update({
                       '_id': req.params.id
                   },
                   {
				    fullname: req.body.fullname,
				    address: req.body.address,
				    age: req.body.age,
				    email: req.body.email,
				    'company.image': req.body.upload,
                   }, (err) => {
                       req.flash('success', 'Your review has been added.');
                       res.redirect('/account/update-user/'+req.params.id)
                   })
               }
		],(err) =>{
				if(err){
					return next(err);
				}
				// res.redirect('/forgot');
		});
	});
	app.post('/upload', (req, res) => {
		var form = new formidable.IncomingForm();
		form.uploadDir = path.join(__dirname, '../public/uploads');
		form.on('file', (field, file) => {
			fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
				if (err) {
					throw err
				}
				console.log('File has been renamed');
			});
		});
		form.on('error', (err) => {
			console.log('An error occured', err);
		});
		form.on('end', () => {
			console.log('File upload was successful');
		});
		form.parse(req);
	});
}

function validate(req, res, next) {
	req.checkBody('fullname', 'Fullname is required').notEmpty();
	req.checkBody('fullname', 'Fullname must not be be less than 5').isLength({
		min: 5
	});
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is invalid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password', 'Password must not be less than 5').isLength({
		min: 5
	});
	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach((error) => {
			messages.push(error.msg);
		});
		req.flash('error', messages);
		res.redirect('signup');
	} else {
		return next();
	}
}

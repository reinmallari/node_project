module.exports = {
	auth:{
		user: '',
		pass: ''
	},
  google: {
	  clientID: '195642924636-dbt5dq5c0olr37o7en5qvhqfh6gd13qq.apps.googleusercontent.comq',
       clientSecret: 'OSsY6p8EwgWkVHJ1bqciniUsq',
       callbackURL: "http://localhost:3000/auth/google/callback",
	  passReqToCallback: true
	},
  twitter: {
	  consumerKey: '6deeewfI8MwZmRz2QdOMtVV6wq',
       consumerSecret: 'hV6PeJmfyjNwgEX6Ts6RUtZXiLCB9VQ8LfL1w0bTCuVETili1Cq',
       callbackURL: "http://localhost:3000/auth/twitter/callback",
	  passReqToCallback: true
	}
};

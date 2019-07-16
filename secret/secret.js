module.exports = {
	auth:{
		user: 'reinmallari10@gmail.com',
		pass: 'janessarein1005'
	},
  google: {
	  clientID: '195642924636-dbt5dq5c0olr37o7en5qvhqfh6gd13qq.apps.googleusercontent.com',
       clientSecret: 'OSsY6p8EwgWkVHJ1bqciniUs',
       callbackURL: "http://localhost:3000/auth/google/callback",
	  passReqToCallback: true
	},
  twitter: {
	  consumerKey: '6deeewfI8MwZmRz2QdOMtVV6w',
       consumerSecret: 'hV6PeJmfyjNwgEX6Ts6RUtZXiLCB9VQ8LfL1w0bTCuVETili1C',
       callbackURL: "http://localhost:3000/auth/twitter/callback",
	  passReqToCallback: true
	}
};

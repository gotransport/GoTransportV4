var express    = require("express");
var  app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user")
// var result = {
//     data  : String 
// };
// var data;
app.use(bodyparser.urlencoded({extended  : true}));
mongoose.connect("mongodb://localhost:27017/login");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("./library"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.post("/signup",function(req,res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
    	console.log(err);
    	return res.render("signup");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/home");
    });
  });
});

app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/home",
		failureRedirect: "/login"
    }), function(req, res){ 
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/home");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

// app.get("/oops",function(req,res){
//     res.render("test",{data : data});
// });
app.get("/home",function(req,res){
 res.render("home");
});

app.get("/circular",function(req,res){
	res.render("circular");
});

app.get("/awareness",function(req,res){
	res.render("awareness");
});

app.get("/about",function(req,res){
	res.render("about");
});

app.get("/login",function(req,res){
	res.render("login");
});

app.get("/signup",function(req,res){
	res.render("signup");
});

app.get("/QR",function(req,res){
	res.render("QR");
});

app.post("/new",function(req,res){
   var data = req.body.data;
   console.log(data);
});

app.listen(3020,function(req,res){
console.log("Start");
}) ;
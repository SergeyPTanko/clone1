// app/routes.js
module.exports = function(app, passport, connection, mysql) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) 
	{
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) 
	{
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	
	
	
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) 
	{
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/login', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('pincode.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	

	// =====================================
	// Search API =========================
	// =====================================
	app.get('/search', isLoggedIn, function(req, res) 
	{
		var x = req.query.mytext;
		var y = req.query.searchpin;
		console.log("PAYTM X-> " +x + "Y-> " +y);
		res.render('search_pincodedata.ejs', {
			query : x,
			api : y,
			user : req.user
		});
	});

	
	
	// ==============================================//
	// API's To Access the SQL DataBase After Login //
	// =============================================//
	
    
	// =====================================
	// pindata to be shown in HTML from MYSql
	// =====================================
	
	 app.get('/pindata' , isLoggedIn, function(req,res)
	 {
        var query = "SELECT * FROM ??";
        var table = ["pin_data"];
        query = mysql.format(query,table);
        console.log(" PAYTM querry -> " + query + "connection -> " + connection);
        
        connection.query(query,function(err,rows)
        {
            if(err) 
            {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } 
            else 
            {
                res.json({"Error" : false, "Message" : "Success", "pinData" : rows});
            }
        });
    });
    
    
    // =====================================
	// pindata from pin_id
	// =====================================
	app.get("/pindata/pinid/:pin_id", isLoggedIn, function(req,res)
	{
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["pin_data","pin_id",req.params.pin_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows)
        {
            if(err) 
            {
                res.json({"Error" : true, "Message" : "Error executing MySQL query for Search Querry of pin_id" + err});
            } 
            else
            {
                res.json({"Error" : false, "Message" : "Success", "pinData" : rows});
                
            }
        });
    });
    
    
    // =====================================
	// pindata from pin_code
	// =====================================
     
	app.get("/pindata/pincode/:pin_code", isLoggedIn, function(req,res)
	{
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["pin_data","pin_code",req.params.pin_code];
        query = mysql.format(query,table);
        console.log("PAYTM Querry in pin_code -> " + query);
        connection.query(query,function(err,rows)
        {
            if(err) 
            {
                res.json({"Error" : true, "Message" : "Error executing MySQL query for Search Querry of pin_code" + err});
            } 
            else
            {
                res.json({"Error" : false, "Message" : "Success", "pinData" : rows});
            }
        });
    });
    
    
    // =====================================
	// pindata from office_name
	// =====================================
	app.get("/pindata/pinofficename/:pin_office_name", isLoggedIn, function(req,res)
	{
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["pin_data","pin_office_name",req.params.pin_office_name];
        query = mysql.format(query,table);
        console.log("PAYTM Querry in office -> " + query);
        connection.query(query,function(err,rows)
        {
            if(err) 
            {
                res.json({"Error" : true, "Message" : "Error executing MySQL query for Search Querry of pin_office_name" + err});
            } 
            else
            {
                res.json({"Error" : false, "Message" : "Success", "pinData" : rows});
            }
        });
    });
    
    
    // =====================================
	// pindata from taluk
	// =====================================
	app.get("/pindata/pinTaluk/:pin_Taluk", isLoggedIn, function(req,res)
	{
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["pin_data","pin_Taluk",req.params.pin_Taluk];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows)
        {
            if(err) 
            {
                res.json({"Error" : true, "Message" : "Error executing MySQL query for Search Querry of pin_Taluk" + err});
            } 
            else
            {
                res.json({"Error" : false, "Message" : "Success", "pinData" : rows});
            }
        });
    });
	

	// =====================================
	// LOGOUT API ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

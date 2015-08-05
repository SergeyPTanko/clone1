// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');
var flash    = require('connect-flash');
var mysql   = require("mysql");
var https = require('https');
// configuration ===============================================================
require('./config/passport')(passport); // pass passport for configuration


app.configure(function()
 {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating	

	// required for passport
	app.use(express.session({ secret: 'KARTIK' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	// open mysql database connection
	connectMysql();
});

// routes ======================================================================

// connecting to MYSQL database
function connectMysql() 
{
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : '127.0.0.1',
        user     : 'root',
        password : '',
        database : 'load_pincode_data',
        debug    :  false
    });
    pool.getConnection(function(err,connection)
    {
        if(err) 
        {
          stop(err);
        } 
        else 
        {
        	console.log("KARTIK_LOG connection ->" + connection);
        	fetchDataFromAPI(connection);
        	require('./app/routes.js')(app, passport, connection, mysql); // load our routes and pass in our app and fully configured passport
        }
    });
}

// Fetching data from public API and parsing it to values and storing in MySql
function fetchDataFromAPI(connection)
{
	var url = 'https://data.gov.in/api/datastore/resource.json?resource_id=0a076478-3fd3-4e2c-b2d2-581876f56d77&api-key=8b5e72d61484945034cb91e8fc8361bb';
	https.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
        body += chunk;
    });

    res.on('end', function()
     {
        var fbResponse = JSON.parse(body)
        console.log("KARTIK Got response: OK ");
        
        fbResponse.records.forEach(function(f)
        {
        
       // console.log("KARTIK LOG what is in array : " + f.id);
		
      	var id = f.id ;
      	var officename =  f.officename 
      	var pincode = f.pincode ;
      	var officeType =  f.officeType ;
      	var Deliverystatus =  f.Deliverystatus ;
      	var  divisionname = f.divisionname ;
      	var regionname =  f.regionname ;
      	var  circlename =  f.circlename ;
        var Taluk = f.Taluk ;
        var  Districtname = f.Districtname ;
        var statename =  f.statename ;
        var Telephone =  f.Telephone ;
         
         var values = [[id, officename, pincode, officeType, Deliverystatus, divisionname, regionname, circlename, Taluk, Districtname, statename, Telephone ]];  
        configureExpress(connection, values);
          
        });
        connection.end();
    });
}).on('error', function(e) {
      console.log("Got error: ", e);
});
}
 
 // storing the value into table to database for which connection was opened 
function configureExpress(connection, values)
{
	connection.query("SELECT 1 FROM pin_data WHERE pin_id = '"+values[0][0]+"' ORDER BY pin_id LIMIT 1" , function(error, result, field) 
	{
    if(result.length <= 0)
     {
	var sql = "INSERT INTO pin_data (pin_id, pin_office_name, pin_code, pin_officeType, pin_Deliverystatus, pin_divisionname, pin_regionname, pin_circlename, pin_Taluk,  pin_Districtname,  pin_statename, pin_Telephone) VALUES ?";
	connection.query(sql, [values], function(err)
	{
    if (err) throw err;
	});
        
    }
	});
}

// if we encountered any error , stop the DB and terminate the process
function stop(err)
 {
    console.log("ISSUE WITH MYSQL \n" + err);
    process.exit(1);
}


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);





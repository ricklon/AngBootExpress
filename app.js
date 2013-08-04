
/**
 * Module dependencies.
 */

var express = require('express'),
  cons = require('consolidate'),
   routes = require('./routes'),
   user = require('./routes/user'),
   http = require('http'),
   path = require('path'),
   request = require('request'),  
   mongojs = require('mongojs');

var app = express(),
    db = mongojs("appdb",["appdb"]);
 
 
//Rotten tomatoes key
var key = "t7hguhwcm7d7nx5zpwjk4re9";


// all environments
app.set('port', process.env.PORT || 3000);

//ejs documentation: https://github.com/visionmedia/ejs
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get("/", function(req, res){
    var title = req.query.title;
    res.send("Title: " + title);
    console.log(req.route);
    
    
    request('http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey='+key+'&q='+title, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            console.log(body.movies);
            
            for (ii = 0; ii < body.movies[0].abridged_cast.length; ii++ ){
                console.log(body.movies[0].abridged_cast[ii]);
            }
            
        }
    });

    
    /*
    res.render("index.ejs", {
        layout:false,
        title:  title
    });
    */
});





http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



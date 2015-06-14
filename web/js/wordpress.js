var WordPress = function (options){
	this.blogUrl = options.blogUrl;
    this.renderSelector = options.renderSelector;
    this.baseUrl = "https://public-api.wordpress.com/rest/v1.1/sites/";
    this.authBaseUrl = "https://public-api.wordpress.com/oauth2/authorize";
    this.clientId = options.clientId;
    this.createUrl = options.createUrl;
}
WordPress.prototype.listPosts = function(){
    var that = this;
    this.loading(true);
    $(that.renderSelector).html("");
    $.ajax({
        "url": this.baseUrl+this.blogUrl+"/posts/",
        "dataType": "jsonp",
        "success": function(response){
            console.log(response);
            var template =  $("#post-list-tmpl").html();
            var rendered_template = _.template(template);
            $(that.renderSelector).html(rendered_template({
                posts:response.posts
            }));
            $(that.renderSelector+" .read-more").click(function(){
                var post_id = $(this).attr("class").match(/id-(\d+)/)[1];
                that.loadPost(post_id);
            });
        },
        "complete":function(){
            that.loading(false);
        }
    });
}

WordPress.prototype.loadPost = function(ID){
    var that = this;
    this.loading(true);
    $(that.renderSelector).html("");
    $.ajax({
        "url": this.baseUrl+this.blogUrl+"/posts/"+ID,
        "dataType": "jsonp",
        "success": function(response){
            console.log(response);
            var template =  $("#post-tmpl").html();
            var rendered_template = _.template(template);
            $(that.renderSelector).html(rendered_template({
                post:response
            }));
            $(that.renderSelector+" .back").click(function(){
                that.listPosts();
            });
        },
        "complete":function(){
            that.loading(false);
        }
    });
}
WordPress.prototype.createPost = function(){
    if(0 > window.location.href.indexOf(this.createUrl)){
        var authUrl = this.authBaseUrl;
        authUrl += "?"+ $.param({
            "client_id": this.clientId,
            "redirect_uri": this.createUrl,
            "response_type": "code"
        });
        window.location = authUrl;
        return;
    }
    var that = this;
    this.loading(true);
    $.ajax({
        "url": this.baseUrl+this.blogUrl+"/posts/new",
        "type": 'POST',
        "data": { 
            "title": $("#title").val(), 
            "content": $("#content").val()
        },
        "beforeSend" : function( xhr ) {
            xhr.setRequestHeader( 'Authorization', 'BEARER ' + $("#token").val() );
        },
        "success": function(response){
            console.log(response);
            window.location = "index.html";
        },
        "complete":function(){
            that.loading(false);
        }
    });
}
WordPress.prototype.loading = function(toggle){
	if(toggle === true){
		$("#loadingModal").modal({
			"backdrop": "static",
			"keyboard": false
		});
	}
	else{
		$("#loadingModal").modal("hide");
	}
}

/*
	Forecast Protoype
		- Handles communication with forcast.io api
		  https://developer.forecast.io/
		  Stores repsonse from forecast for retrieval
		- Utility methods to convert response data to weather icons
		  http://erikflowers.github.io/weather-icons/
	
	Properties:
		baseUrl: forecase io api url
		apiKey: api key that allows access to forecast.io
		weather: object of response data
		longitude: longitude sent to forecast.io
		latitude: latitude sent to forecast.io
		options: options that are converted to query parameters 
			and sent in forecast.io request
	API:
	Forecast (setup)
		- constructor that takes setup object and sets properties
	Forecast.prototype.loading(toggle)
		- overridable prototype method
		- toggle on when ajax starts
		- toggle off when ajax/callback are complete
	Forecast.prototype.render()
		- overridable prototype method
		- should use objects data to display
	Forecast.prototype.getCurrentForecast(callback)
		- makes ajax call to forecast
		- calls optional callback when complete
	Forecast.prototype.loadTest(testname)
		- loads object with data from json file /tests
		- accepts name of the json file (no extension)
	Forecast.qualifyPrecip(intensity)
		- namespace method
		- converts a cm/h decimal to a quality of rain
		- can be very light, light, moderate, heavy
	Forecast.forecastIconToWeatherIcon(icon)
		- namespace method
		- coverts icon name from forecast to weather icons
		- http://erikflowers.github.io/weather-icons/
	Forecast.windBearingToWeatherIcon(bearing)
		- namespace method
		- coverts decimal bearing to closest direction that has a weather icon
		- http://erikflowers.github.io/weather-icons/
 */
var Forecast = function (setup){
	this.apiKey = setup.apiKey;
	if(setup.longitude)this.longitude = setup.longitude;
	if(setup.latitude)this.latitude = setup.latitude;
	if(setup.render)this.render = setup.render;
	if(setup.loading)this.loading = setup.loading;
	if(setup.options) this.options = setup.options;
}
Forecast.prototype.baseUrl = "https://api.forecast.io/forecast/";
Forecast.prototype.apiKey = "";
//store response here
Forecast.prototype.weather = {};
Forecast.prototype.longitude = 0.0;
Forecast.prototype.latitude = 0.0;
//default to return metric units
Forecast.prototype.options = {
	"units":"ca"
};
Forecast.prototype.loading = function(toggle){};
Forecast.prototype.render = function(){};
Forecast.prototype.getCurrentForecast = function(callback){
	var that = this;
	that.loading(true);
	$.ajax({
		"url": this.baseUrl+this.apiKey+"/"+this.latitude+","+this.longitude+"?"+$.param(this.options),
		"dataType": "jsonp",
		"success": function(data){
			console.log(data);
			that.weather = data;
			if(callback)callback();
		},
		"complete": function(){
			that.loading(false);
		}
	});
};
Forecast.prototype.loadTest = function (testName){
	var that = this;
	$.ajax({
		"url": "/tests/"+testName+".json",
		"dataType": "json",
		"success": function(data){
			console.log(data);
			that.weather = data;
		}
	});
};
Forecast.qualifyPrecip = function(intensity){
	var quality = "";
	if(intensity > 0 && intensity <= 0.005){
		quality = "very light";
	}
	else if(intensity > 0.005 && intensity <= 0.043){
		quality = "light";
	}
	else if(intensity > 0.043 && intensity <= 0.254){
		quality = "moderate";
	}
	else if(intensity > 0.254){
		quality = "heavy";
	}
	return quality;
};
Forecast.forecastIconToWeatherIcon = function(icon){
	var icons = {
		"clear-day": "wi-day-sunny",
		"clear-night": "wi-night-clear",
		"rain": "wi-rain",
		"snow": "wi-snow",
		"sleet": "wi-sleet",
		"wind": "wi-windy",
		"fog": "wi-fog",
		"cloudy": "wi-cloudy",
		"partly-cloudy-day": "wi-day-cloudy",
		"partly-cloudy-night": "wi-night-alt-cloudy"
	}
	return "wi "+icons[icon] || "";
};
Forecast.windBearingToWeatherIcon = function(bearing){
	var closestWind = Math.round(bearing/15)*15;
	return "wi wi-wind-default _"+closestWind+"-deg";
};
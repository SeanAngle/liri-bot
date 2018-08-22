require("dotenv").config();


var keys = require("./keys.js");
var request = require('request');
var Bands = require("./keys.js")
var Spotify = require('node-spotify-api');
var fs = require('fs');
var input = process.argv;
var action = input[2];
var inputs = input[3];

switch (action) {
	case "concert-this":
	bandsInTown(inputs);
	break;

	case "spotify-this-song":
	spotify(inputs);
	break;

	case "movie-this":
	movie(inputs);
	break;

	case "do-what-it-says":
	doWhatItSays();
	break;
};

function bandsInTown(inputs) {
    var key = new Bands(keys.bandKeys);
    
    var URL = "https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=" + key;

    request(URL, function(error, response, body){

        var venueInfo = response.venue;

        if(!inputs){
            inputs = 'Drake';
            console.log("------------------");
            console.log("Event Name: " + venueInfo[0].name);
            console.log("Event Locaton: " + venueInfo[0].city + " , " + venueInfo[0].Country);
            console.log("Event time: ");


        }
    })

}

function spotify(inputs) {

    var spotify = new Spotify(keys.spotifyKeys);
    
    if (!inputs){
        
        inputs = 'The Sign';

        spotify.search({ type: 'track', query: inputs }, function(error, data){
            var songInfo = data.tracks.items;

            if (error){
                console.log('Error occurred: ' + error);
                return;
            }

            console.log("------------------------");
            console.log("Artist(s): " + songInfo[5].artists[0].name);
            console.log("Song Name: " + songInfo[5].name);
            console.log("Preview Link: " + songInfo[5].preview_url);
            console.log("Album: " + songInfo[5].album.name);
            console.log("------------------------");
            
            
        });
        return;
    }

    spotify.search({ type: 'track', query: inputs }, function(error, data) {
        
        if (error){
            console.log('Error occurred: ' + error);
            return;
        }
        

        var songInfo = data.tracks.items;
        
        console.log("------------------------");
        console.log("Artist(s): " + songInfo[0].artists[0].name);
        console.log("Song Name: " + songInfo[0].name);
        console.log("Preview Link: " + songInfo[0].preview_url);
        console.log("Album: " + songInfo[0].album.name);
        console.log("------------------------");
	});
}


function movie(inputs) {

	var URL = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=trilogy";

	request(URL, function(error, response, body) {
		if (!inputs){
        	inputs = 'Mr Nobody';
    	}
		if (!error && response.statusCode === 200) {

            console.log("------------------------");
		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("------------------------");

		}
	});
};

function doWhatItSays() {
	fs.readFile('log.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		
		
  	});

};
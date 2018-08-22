require("dotenv").config();

//All Variables
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var moment = require('moment')
var action = process.argv[2];
var inputs = process.argv.slice(3).join(" ");

//Switch and Case calls the functions
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

    case "help":
    console.log("In order to use this program you must enter a command with the following format: 'node liri <command> <search term>\nhe command 'concert-this' will return the next venue of the artist/band entered in the search.\nThe command 'spotify-this-song' will return information of the song entered in the search\nThe command 'movie-this' will return information of the movie entered in the search\nThe command do-what-it-says will take the command and search term from random.txt");
    break;

    default:
    console.log("Commands include 'concert-this', 'spotify-this-song', 'movie-this', and 'do-what-it-says'. If you have more questions, type command 'help'");
};

//Calls the band the user picks and gives them information on their next show
function bandsInTown(inputs) {
    var key = "21a32782080ab9f4e10fa1754fc55ff1";
    
    var URL = "https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=" + key;

    request(URL, function(error, response, body){
        if(error){
            console.log("Error: " + error);
        }


        if(!error && response.statusCode === 200){
            var item = JSON.parse(body)[0];
            console.log("------------------");
            console.log("Lineup: " + item.lineup);
            console.log("Venue Name: "+ item.venue.name);
            console.log("Location: " + item.venue.city + ", " + item.venue.region);
            console.log("Date: " + moment(item.datetime).format("MM/DD/YYYY"))
            console.log("------------------");
        }   
    })

}

//This function uses the spotify API to get information on a song of their choice
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

//The movie function get information of a movie of their choice
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

//This function takes the text of the random.txt file and puts it directly into the function of spotify 
function doWhatItSays() {
	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
        }

        var dataArr = data.split(",");
        action = dataArr[0];
        inputs = dataArr[1];
        spotify(inputs);

		
		
  	});

};
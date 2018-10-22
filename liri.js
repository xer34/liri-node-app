require("dotenv").config();
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const bandsintown = require("bandsintown")("codingbootcamp");
const inquirer = require("inquirer");
const fs = require("fs");
const OmdbApi = require("omdb-api-pt");
// Create a new instance of the module.
const omdb = new OmdbApi({
  apiKey: "trilogy" // Your API key.
});
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
switch (command) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThis();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doIt();
    break;
}
function concertThis() {
  inquirer
    .prompt([
      // Here we create a basic text prompt.
      {
        type: "input",
        message: "Please enter the name of the Band or Show.",
        name: "concertName"
      }
    ])
    .then(function(inquirerResponse) {
      console.log(
        inquirerResponse.concertName +
          ". Got it. Stand by while I look that up."
      );
      bandsintown
        .getArtistEventList(inquirerResponse.concertName)
        .then(function(events) {
          console.log("Looks like that will be at " + events[0].venue.place);
          console.log(
            "in... um " + events[0].venue.city + ", " + events[0].venue.country
          );
          console.log("Here's the Date: " + events[0].formatted_datetime);
        });
    });
}
function spotifyThis() {
  inquirer
    .prompt([
      // Here we create a basic text prompt.
      {
        type: "input",
        message: "Please enter the name of the song.",
        name: "trackname"
      }
    ])
    .then(function(inquirerResponse) {
      console.log(
        "Looking up '" + inquirerResponse.trackname + "'. Please stand by."
      );
      spotify
        .search({ type: "track", query: inquirerResponse.trackname, limit: 1 })
        .then(function(response) {
          console.log(
            inquirerResponse.trackname +
              " was performed by " +
              response.tracks.items[0].album.artists[0].name
          );
          console.log(
            "The album name is " + response.tracks.items[0].album.name
          );
          console.log(
            "You can preview the track here: " +
              response.tracks.items[0].preview_url
          );
          //  * If no song is provided then your program will default to "The Sign" by Ace of Base.
        })
        .catch(function(err) {
          console.log(err);
        });
    });
}
function movieThis() {
  inquirer
    .prompt([
      // Here we create a basic text prompt.
      {
        type: "input",
        message: "Please enter the name of the movie.",
        name: "moviename"
      }
    ])
    .then(function(inquirerResponse) {
      console.log(
        "Looking up '" + inquirerResponse.moviename + "'. Please stand by."
      );
      omdb
        .bySearch({
          search: inquirerResponse.moviename,
          page: 1,
          tomatoes: true
        })
        .then(function(response) {
          console.log("The Movie Title is: " + response.Search[0].Title);
          console.log("It came out in " + response.Search[0].Year);
          omdb
            .byId({
              imdb: response.Search[0].imdbID
            })
            .then(function(response) {
              console.log(
                "It got a " +
                  response.Ratings[1].Value +
                  " on Rotten Tomatoes and a " +
                  response.Ratings[0].Value +
                  " on IMDB"
              );
              console.log("The movie was produced in " + response.Country);
              console.log(
                "The plot goes something like this: " + response.Plot
              );
              console.log("Here are some of the actors: " + response.Actors);
            });
        })
        .catch(err => console.error(err));
    });
}
function doIt() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) throw err;
    var array = data.toString().split("\n");
    var randomCommand = array[Math.floor(Math.random() * array.length)];
    console.log("DOING RANDOM THING: " + randomCommand);
    if (randomCommand === array[0]) {
      spotify
        .search({ type: "track", query: "I Want It That Way", limit: 1 })
        .then(function(response) {
          console.log(
            "I Want It That Way was performed by " +
              response.tracks.items[0].album.artists[0].name
          );
          console.log(
            "The album name is " + response.tracks.items[0].album.name
          );
          console.log(
            "You can preview the track here: " +
              response.tracks.items[0].preview_url
          );
        })
        .catch(function(err) {
          console.log(err);
        });
    }
    if (randomCommand === array[1]) {
      omdb
        .bySearch({
          search: "Mr. Nobody",
          page: 1,
          tomatoes: true
        })
        .then(function(response) {
          console.log("The Movie Title is: " + response.Search[0].Title);
          console.log("It came out in " + response.Search[0].Year);
          omdb
            .byId({
              imdb: response.Search[0].imdbID
            })
            .then(function(response) {
              console.log(
                "It got a " +
                  response.Ratings[1].Value +
                  " on Rotten Tomatoes and a " +
                  response.Ratings[0].Value +
                  " on IMDB"
              );
              console.log("The movie was produced in " + response.Country);
              console.log(
                "The plot goes something like this: " + response.Plot
              );
              console.log("Here are some of the actors: " + response.Actors);
            });
        })
        .catch(err => console.error(err));
    }
    if (randomCommand === array[2]) {
      bandsintown
        .getArtistEventList("Backstreet Boys")
        .then(function(events) {
          console.log("Looks like the Backstreet Boys will be at " + events[0].venue.place);
          console.log(
            "in... um " + events[0].venue.city + ", " + events[0].venue.country
          );
          console.log("Here's the Date: " + events[0].formatted_datetime);
        });
    }
    //----------------
  });
}

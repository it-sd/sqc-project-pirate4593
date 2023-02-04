Media Master
============

My project is going to be a media library with information on movies, anime, and tvshows.
The information I will be using will include titles, cast lists, posters, awards, plot, and languages that they could be in.
I want to make this website so people don't have to search other streaming services to figure out where the show they want to watch is located.

Web service
-----------

[IMDb-API](https://imdb-api.com) (API Key)
* Search /{lang?}/API/Search/{apiKey}/{expression} GET
* Posters /{lang?}/API/Posters/{apiKey}/{id} GET
* FullCast /{lang?}/API/FullCast/{apiKey}/{id} GET
* Trailer /{lang?}/API/Trailer/{apiKey}/{id} GET
* Ratings /{lang?}/API/Ratings/{apiKey}/{id} GET

Database use
------------

The data that I will need includes movie, anime, and tv show information like titles, seasons, cast information, plot, ratings, and other things liek that.
I'll be needing a few tables that includes this info like a media table to account for all movies, anime, and tv shows. 
Another table would be a ratings table with a media id and a type id from the media table to connect it to the media table.

Initial designs
---------------

![Sample Page](/docs/sample page.svg)
![Site Map](/docs/starting site map.svg)

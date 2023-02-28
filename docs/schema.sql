\encoding UTF8

DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS type;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS vote;

CREATE TABLE type (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL
);

CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  description TEXT NOT NULL,
  main_cast TEXT NOT NULL,
  poster TEXT NULL,
  media_type_id INTEGER NOT NULL,
  FOREIGN KEY (media_type_id) REFERENCES type(id)
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  score INTEGER NOT NULL,
  media_id INTEGER NOT NULL,
  FOREIGN KEY (media_id) REFERENCES media(id)
);

CREATE TABLE vote (
  id SERIAL PRIMARY KEY,
  media_id INTEGER NOT NULL,
  value FLOAT NOT NULL,
  FOREIGN KEY (media_id) REFERENCES media(id)
);

ALTER TABLE ratings DROP CONSTRAINT ratings_media_id_fkey;
ALTER TABLE media DROP CONSTRAINT media_media_type_id_fkey;
ALTER TABLE vote DROP CONSTRAINT vote_media_id_fkey;

INSERT INTO media (number, title, genre, description, main_cast, poster, media_type_id)
  VALUES
 (1, 'Inception (2010)','Action, Adventure, Sci-Fi', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.', 
 'Christopher Nolan, Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Ken Watanabe', 
 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_Ratio0.6837_AL_.jpg', 1), (2, 'Rick and Morty', 'Animation, Adventure, Comedy', 'An animated series that follows the exploits of a super scientist and his not-so-bright grandson.','Justin Roiland, Chris Parnell, Spencer Grammer, Sarah Chalke', 'https://m.media-amazon.com/images/M/MV5BZjRjOTFkOTktZWUzMi00YzMyLThkMmYtMjEwNmQyNzliYTNmXkEyXkFqcGdeQXVyNzQ1ODk3MTQ@._V1_Ratio0.6837_AL_.jpg', 2), (3, 'Naruto', 'Animation, Action, Adventure', 'Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the villages leader and strongest ninja.', 'Junko Takeuchi, Maile Flanagan, Kate Higgins, Chie Nakamura', 'https://m.media-amazon.com/images/M/MV5BMDI3ZDY4MDgtN2U2OS00Y2YzLWJmZmYtZWMzOTM3YWFjYmUyXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_Ratio0.7245_AL_.jpg', 3);

INSERT INTO type (type)
  VALUES
('Movie'),('TV Show'), ('Anime');

INSERT INTO ratings (score, media_id)
  VALUES
(8.8, 1), (9.1, 2),(8.4, 3);
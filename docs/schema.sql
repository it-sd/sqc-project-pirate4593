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
  imdb_id TEXT NOT NULL,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  description TEXT NOT NULL,
  main_cast TEXT NOT NULL,
  poster TEXT NULL,
  rating DECIMAL NULL,
  lang TEXT NULL,
  media_type_id INTEGER,
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
  imdb_id TEXT NULL,
  media_id INTEGER NULL,
  value FLOAT NOT NULL,
  FOREIGN KEY (media_id) REFERENCES media(id)
);

ALTER TABLE ratings DROP CONSTRAINT ratings_media_id_fkey;
ALTER TABLE media DROP CONSTRAINT media_media_type_id_fkey;
ALTER TABLE vote DROP CONSTRAINT vote_media_id_fkey;

INSERT INTO media (imdb_id, title, genre, description, main_cast, poster, rating, lang, media_type_id)
  VALUES
 ('tt1375666', 'Inception','Action, Adventure, Sci-Fi', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.', 
 'Christopher Nolan, Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Ken Watanabe', 
 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_Ratio0.6837_AL_.jpg', 8.8, 'English, Japanese, French', 1),('tt1877830', 'The Batman', 'Action, Crime, Drama', 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city''s hidden corruption and question his family''s involvement.', 'Robert Pattinson, Zoë Kravitz, Jeffrey Wright', 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_Ratio0.6762_AL_.jpg', 7.8, 'English, Spanish, Latin, Italian', 1), ('tt2861424', 'Rick and Morty', 'Animation, Adventure, Comedy', 'An animated series that follows the exploits of a super scientist and his not-so-bright grandson.','Justin Roiland, Chris Parnell, Spencer Grammer, Sarah Chalke', 'https://m.media-amazon.com/images/M/MV5BZjRjOTFkOTktZWUzMi00YzMyLThkMmYtMjEwNmQyNzliYTNmXkEyXkFqcGdeQXVyNzQ1ODk3MTQ@._V1_Ratio0.6837_AL_.jpg', 9.1, 'English', 2), ('tt0409591', 'Naruto', 'Animation, Action, Adventure', 'Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the villages leader and strongest ninja.', 'Junko Takeuchi, Maile Flanagan, Kate Higgins, Chie Nakamura', 'https://m.media-amazon.com/images/M/MV5BMDI3ZDY4MDgtN2U2OS00Y2YzLWJmZmYtZWMzOTM3YWFjYmUyXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_Ratio0.7245_AL_.jpg', 8.4, 'Japanese', 2);

INSERT INTO type (type)
  VALUES
('Movie'),('TV Series');

INSERT INTO ratings (score, media_id)
  VALUES
(8.8, 1), (7.4, 2), (9.1, 3), (8.4, 4);
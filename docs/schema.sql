\encoding UTF8

DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS type;
DROP TABLE IF EXISTS ratings;

CREATE TABLE type (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL
);

CREATE TABLE media (
  id SERIAL PRIMARY KEY,
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

ALTER TABLE ratings DROP CONSTRAINT ratings_media_id_fkey;
ALTER TABLE media DROP CONSTRAINT media_media_type_id_fkey;

INSERT INTO media (title, genre, description, main_cast, poster, media_type_id)
  VALUES
 ('Inception (2010)','<p>Action, Adventure, Sci-Fi</p>', '<p>A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.</p>', 
 '<p>Christopher Nolan, Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Ken Watanabe</p>', 
 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_Ratio0.6837_AL_.jpg', 1);

INSERT INTO type (type)
  VALUES
('Movie'),('Series');

INSERT INTO ratings (score, media_id)
  VALUES
(8.8, 1);
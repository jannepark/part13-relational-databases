# 13.2 psql Commands
postgres=# CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

postgres=# INSERT INTO blogs (author, url, title, likes) VALUES
('Antti Aapinen', 'http://blogs.com/blog1', 'Eka blogi', 5),
('Kiero Kielo', 'http://blogs.com/blog2', 'Toka blogi', 1);

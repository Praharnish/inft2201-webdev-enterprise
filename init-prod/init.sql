CREATE TABLE IF NOT EXIST demo_ping (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL
);

INSERT INTO demo_ping(message) VALUES ('Postgres is up!');
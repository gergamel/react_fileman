-- sudo docker network create --driver=bridge --subnet=172.18.0.0/24 --gateway=172.18.0.1 br2
-- sudo docker run -d --name react_fileman_db --network br2 -p 54321:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=fileman postgres:9.6-alpine
-- PGPASSWORD=postgres psql -h 0.0.0.0 -U postgres -d fileman -f init.sql

DROP TABLE IF EXISTS "Files";

CREATE TABLE IF NOT EXISTS "Files" (
    "Digest"        BYTEA PRIMARY KEY,
    "ContentType"   VARCHAR(127),   -- https://stackoverflow.com/questions/19852/maximum-length-of-a-mime-content-type-header-field
    "Size"          INTEGER,
    "Name"          VARCHAR(255),   -- https://serverfault.com/questions/9546/filename-length-limits-on-linux
    "Created"       TIMESTAMP NOT NULL,
    "Category"      TEXT
);

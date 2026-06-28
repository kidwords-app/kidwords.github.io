# Kidwords App — RDS schema

For local env vars and `vercel dev` testing, see [local-dev.md](./local-dev.md).

postgres=> \d+ words
                                                       Table "public.words"
    Column    |            Type             | Collation | Nullable | Default | Storage  | Compression | Stats target | Description 
--------------+-----------------------------+-----------+----------+---------+----------+-------------+--------------+-------------
 word         | text                        |           | not null |         | extended |             |              | 
 grade        | grade                       |           | not null |         | plain    |             |              | 
 definition   | text                        |           |          |         | extended |             |              | 
 example      | text                        |           |          |         | extended |             |              | 
 try_it       | text                        |           |          |         | extended |             |              | 
 speak        | text                        |           |          |         | extended |             |              | 
 tags         | text[]                      |           |          |         | extended |             |              | 
 image_s3_key | text                        |           |          |         | extended |             |              | 
 created_at   | timestamp without time zone |           |          | now()   | plain    |             |              | 
 updated_at   | timestamp without time zone |           |          | now()   | plain    |             |              | 
Indexes:
    "words_pkey" PRIMARY KEY, btree (word, grade)
Access method: heap
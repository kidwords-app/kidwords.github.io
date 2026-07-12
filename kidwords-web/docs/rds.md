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

### Grade enum

Canonical `grade` values: `preschool`, `kindergarten`, `grade1`.

App `LevelId` mapping: `preK` → `preschool`, `K` → `kindergarten`, `G1` → `grade1`.

### Feedback

```
postgres=> \d feedback
                               Table "public.feedback"
   Column   |            Type             | Collation | Nullable |      Default
------------+-----------------------------+-----------+----------+-------------------
 id         | uuid                        |           | not null | gen_random_uuid()
 word       | text                        |           | not null |
 grade      | grade                       |           | not null |
 feedback   | text                        |           | not null |
 created_at | timestamp without time zone |           |          | now()
Indexes:
    "feedback_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "feedback_word_grade_fkey" FOREIGN KEY (word, grade) REFERENCES words(word, grade)
```

Feedback is accepted only for word+grade rows that exist in `words` (published).
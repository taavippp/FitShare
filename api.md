# FitShare API structure
## /api/user
GET: log in, data in body for security reasons
POST: register new
DELETE: authenticate then delete existing

## /api/post
GET: get post data, query param bool if comments are also fetched
POST: authenticate then insert new
DELETE: authenticate then delete existing

## /api/profile
GET: get profile data - username, latest posts, etc

## /api/comment
POST: authenticate then insert new
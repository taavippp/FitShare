# FitShare API
This file lists all API endpoints, what HTTP methods are implemented, what the endpoint's purpose is and what the data requirements are.

## /api/user
### POST method
Logging in / registering an user. Logging in returns JSON web token.
- Header: `X-Login` with value `"true"` or `"false"`
- Body: `username` and `password`
### DELETE method
Deletes an user.
- Header: `Authorization` with JSON web token
- Body: `username` and `password`

## /api/post
### GET method
Returns post data.
- Query: `id` string (post ID) or `page` number
### POST method
Creates a new post. Returns new post's ID.
- Header: `Authorization` with JSON web token
- Body: `title` string and `content` array
### DELETE method
Deletes a post and its comments.
- Header: `Authorization` with JSON web token
- Body: `id` string (post ID)

## /api/comment
### GET method
Returns comments for a post.
- Query: `id` string (post ID)
### POST method
Creates a new comment for a post.
- Header: `Authorization` with JSON web token
- Body: `postID` string (post ID) and `text` string

## /api/exercise
### GET method
Returns all exercises or specified ones.
- Query: `IDs` optional, numbers (exercise IDs) separated by -, example `1-2-4`
### POST method
Creates a new exercise.
- Header: `Authorization` with JSON web token
- Body: `name` string and `categories` array

## /api/is_admin ❗
❗ Considering moving this endpoint under `/api/user`. However, profile requests will most likely also be implemented under that endpoint and thus, a header perhaps called `X-Verify` is required.
### GET method
Returns whether user is an administrator (error status code if not).
- Header: `Authorization` with JSON web token
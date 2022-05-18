# DIFFERENCES FROM INITIAL CODE

- added a linter (eslint) and change the style formatting
- renamed getProfile middleware to authentication
- removed sequilize and model references from request object
- add path versioning to the API
- removed :userId from /balances/deposit/:userId as it seems redundant as we already have the profileId from login
- added postman collection export
#dev tinder api
authRouter
-post /signup
-post /login
-post /logout

profileRouter
-get /profile/view
-patch /profile/edit
-patch /profile/password

conectionRequestRouter
-post /request/send/intrested/:userId
-post /request/send/ignore/:userId
-post /request/send/accepted/:userId
-post /request/send/rejected/:userId
-get /user/connection

userRouter
-get /user/requests
-get /user/feed. = Gets you the profile of other users platform

status: ignore,intrested,accept,rejected
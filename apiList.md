# DevTinder APIs

Auth APIs

- POST /signup
- POST /login
- POST /logout

Profile APIS

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

Right - Left swipe APIss

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

Request Accepted - Rejected APIs
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

Friends APIs
- GET /friends(connections)
- GET /requests/received
- GET /feed - Gets you profiles of other users on the platform

Status : interested, ignored, accepted, rejected
# Endoints Descriptions

> > **_NOTE:_** Make all api requests using content-type: application/json

## Authentication Service

---

**NOTE**

To use the JWT Authentication do the following:

- After logging in using `/auth/login`, store the `accessToken` in a secure storage
- On Mobile client, store the `refreshToken` as well as `accessToken`
  - Store refreshToken using `SecureStore` or `AsyncStorage`
- Whenever you make a request to MediConnect endpoints,
  - pass `accessToken` in the request header `authorization` in the format `Bearer <AccessToken>`
  - If the response is 403 Forbidden or any status code other than 200, use `/auth/refresh-token` to get a fresh token set of access and refresh tokens

---

#### /auth/signup

`method`:`POST`

`request.body`:`{email, password, role}`

`response`: The newly created user data in JSON

> role is one of ['admin', 'patient', 'doctor']
> role will be removed soon so only use role in signup for testing

#### /auth/login

`method`:`POST`

`request.body`:`{email, password}`

`response`:`{accessToken, refreshToken}`

> refreshToken is automatically set as a cookie in web client. Has to be stored in

#### /auth/validate

> **_NOTE:_** This is an internal API used for authentication

`method`:`GET`

`request.body`:`{}`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`:`{'Success'}`

- `status 200`: If the JWT access token is still valid

#### /auth/refresh-token

`method`:`GET`

`request.body`:`{refresh_token}`

`response`:`{accessToken, refreshToken}`

- `status 200`: If the refresh token is still valid and new tokens are generated
- `status 301`: If the token is null
- `status 403`: If the token is invalid

## Mobile Backend

#### /mobile/create-patient-profile

`method`:`POST`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`request.body`:`{user_id, name, gender, address, weight, blood_pressure, image, age, blood_glucose, contact, bloodtype, allergies, height}`

`response`: The newly created user profile data as JSON

#### /mobile/patient-data

`method`:`GET`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: Data of currently logged in patient

#### /mobile/upcoming-appointments

`method`:`GET`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: All appointments with the status 'scheduled'

#### /mobile/all-appointments

`method`:`GET`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: All appointments that have been created against the current patient

#### /mobile/get-doctors

`method`:`GET`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: A list of all the doctor (and their details) currently registered in the database

## Web Backend

#### /web/create-doctor-profile

`method`:`POST`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`request.body`:`{user_id, name, roomno, qualification, image, designation, contact}`

`response`: Displays the newly created doctor's profile in JSON

#### /web/update-doctor

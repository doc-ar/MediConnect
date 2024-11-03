> **_NOTE:_** Make all api requests using content-type: application/json

# Authentication Service

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

## /auth/signup

### Description

`method`:`POST`

`request.body`:`{email, password, role}`

`response`: The newly created user data in JSON

> role is one of ['admin', 'patient', 'doctor']
> role will be removed soon so only use role in signup for testing

### Example

Sample Input:

```
{
    "email": "weused@test.com",
    "password": "12345678",
    "role": "patient"
}
```

Response:

```
{
    "users": {
        "user_id": "7f347868-e8f3-4533-b391-83a6c10e2cfa",
        "email": "weused@test.com",
        "password": "$2b$10$ZAkwJFT.skbitU0tbD0SS.PxKz4OFSUmfnIQcikOa6E.sevqtK/My",
        "role": "patient",
        "created_at": "2024-11-03T22:57:36.578Z"
    }
}
```

## /auth/login

### Description

`method`:`POST`

`request.body`:`{email, password}`

`response`:`{accessToken, refreshToken}`

> refreshToken is automatically set as a cookie in web client. Has to be stored in

### Example

Sample Input:

```
{
    "email": "weused@yahoo.com",
    "password": "12345678"
}
```

Response:

```
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmVkZTQzNjMtMzA1Mi00MDJmLTk2MDctMDAwZWI2ZWQyZDRhIiwiZW1haWwiOiJ3ZXVzZWRAeWFob28uY29tIiwiaWF0IjoxNzMwNjc0Nzc5LCJleHAiOjE3MzA2NzU5Nzl9.JnAxQC6NGw3-qX5nbk52lQ8HctEuHQoJBd0BF-NcJbE",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmVkZTQzNjMtMzA1Mi00MDJmLTk2MDctMDAwZWI2ZWQyZDRhIiwiZW1haWwiOiJ3ZXVzZWRAeWFob28uY29tIiwiaWF0IjoxNzMwNjc0Nzc5LCJleHAiOjE3MzA2NzcxNzl9.P-39BoVwDati6BttOWyLoBytvpqn4iTY4mwCUhXVU70"
}
```

Or if Refresh token is expired the response is:

```
{
    "error": "jwt expired"
}
```

## /auth/validate

> **_NOTE:_** This is an internal API used for authentication. Do not use this endpoint

`method`:`GET`

`request.body`:`{}`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`:`{'Success'}`

- `status 200`: If the JWT access token is still valid

## /auth/refresh-token

`method`:`GET`

`request.body`:`{refresh_token}`

`response`:`{accessToken, refreshToken}`

- `status 200`: If the refresh token is still valid and new tokens are generated
- `status 301`: If the token is null
- `status 403`: If the token is invalid

# Mobile Backend

## /mobile/create-patient-profile

### Description

`method`:`POST`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`request.body`:`{user_id, name, gender, address, weight, blood_pressure, image, age, blood_glucose, contact, bloodtype, allergies, height}`

`response`: The newly created user profile data as JSON

### Example

Sample Input:

```
{
    "name": "Amaid Zia",
    "gender": "Male",
    "address": "Some address",
    "weight": "65",
    "blood_pressure": "80/120",
    "age": "35",
    "blood_glucose": "2500",
    "contact": "+921234567890",
    "height": "161"
}
```

Response:

```
{
    "patient_id": "370c003c-06df-479a-9833-ae441a3ea4f8",
    "user_id": "bede4363-3052-402f-9607-000eb6ed2d4a",
    "name": "Amaid Zia",
    "gender": "Male",
    "address": "Some address",
    "weight": "65",
    "blood_pressure": "80/120",
    "image": null,
    "age": 35,
    "blood_glucose": "2500",
    "contact": "+921234567890",
    "bloodtype": null,
    "allergies": null,
    "height": "161"
}
```

## /mobile/patient-data

### Description

`method`:`GET`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: Data of currently logged in patient

### Example

```
{
    "user_id": "bede4363-3052-402f-9607-000eb6ed2d4a",
    "patient_id": "370c003c-06df-479a-9833-ae441a3ea4f8",
    "email": "weused@yahoo.com",
    "name": "Amaid Zia",
    "gender": "Male",
    "address": "Some address",
    "weight": "65",
    "blood_pressure": "80/120",
    "image": null,
    "age": 35,
    "blood_glucose": "2500",
    "contact": "+921234567890",
    "bloodtype": null,
    "allergies": null,
    "height": "161"
}
```

## /mobile/upcoming-appointments

### Description

`method`:`GET`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: All appointments with the status 'scheduled'

### Example

Response:

```
[
    {
        "appointment_id": "24d33758-4078-4280-b0ef-2bfebfecb19a",
        "doctor_id": "9403b0f7-a378-4f03-b56e-dbf656f413df",
        "patient_id": "370c003c-06df-479a-9833-ae441a3ea4f8",
        "slot_id": "2dc8b8d7-dca6-43ae-a64d-d7cfaa73d6de",
        "status": "scheduled"
    }
]
```

## /mobile/all-appointments

### Description

`method`:`GET`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: All appointments that have been created against the current patient

### Example

Response:

```
[
    {
        "appointment_id": "9d36f177-8735-4c55-ad2a-a44be30cbfa2",
        "doctor_id": "9403b0f7-a378-4f03-b56e-dbf656f413df",
        "patient_id": "370c003c-06df-479a-9833-ae441a3ea4f8",
        "slot_id": "1667c715-cb29-40d7-94cf-69e318f48891",
        "status": "cancelled"
    },
    {
        "appointment_id": "971eb884-9a11-482b-8a96-9a454f18ebf1",
        "doctor_id": "9403b0f7-a378-4f03-b56e-dbf656f413df",
        "patient_id": "370c003c-06df-479a-9833-ae441a3ea4f8",
        "slot_id": "3dd595e3-15b2-4fa4-85a8-3a51a223c4e5",
        "status": "completed"
    },
    {
        "appointment_id": "b6b4534b-789f-4472-a97a-e9829f944054",
        "doctor_id": "9403b0f7-a378-4f03-b56e-dbf656f413df",
        "patient_id": "370c003c-06df-479a-9833-ae441a3ea4f8",
        "slot_id": "f43b9c49-2261-4248-8f8f-932e99a7de1a",
        "status": "completed"
    },
    {
        "appointment_id": "24d33758-4078-4280-b0ef-2bfebfecb19a",
        "doctor_id": "9403b0f7-a378-4f03-b56e-dbf656f413df",
        "patient_id": "370c003c-06df-479a-9833-ae441a3ea4f8",
        "slot_id": "2dc8b8d7-dca6-43ae-a64d-d7cfaa73d6de",
        "status": "scheduled"
    }
]
```

## /mobile/latest-prescription

### Description

`method`:`GET`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: A formatted prescription with doctor name and date

# Web Backend

### Example

Response:

```
{
    "doctor": "Emama Bilal",
    "date": "2024-Nov-10",
    "medication": [
        {
            "Medicine": "Azoxan",
            "Strength": "500mg",
            "Dosage": "2 tablets",
            "Frequency": "12 hrs",
            "Duration": "10 Days"
        },
        {
            "Medicine": "Conta",
            "Strength": "200mg",
            "Dosage": "1 tablet",
            "Frequency": "6 hrs",
            "Duration": "5 Days"
        },
        {
            "Medicine": "Floran",
            "Strength": "500mg",
            "Dosage": "1 tablet",
            "Frequency": "24 hrs",
            "Duration": "8 Days"
        },
        {
            "Medicine": "Roxan",
            "Strength": "200mg",
            "Dosage": "2 tablets",
            "Frequency": "12 hrs",
            "Duration": "10 Days"
        }
    ]
}
```

## /mobile/get-doctors

### Description

`method`:`GET`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: A list of all the doctor (and their details) currently registered in the database

# Web Backend

### Example

Response:

```
[
    {
        "name": "AR",
        "email": "weused@outlook.com",
        "contact": "1234",
        "roomno": "20120",
        "designation": "FCPS, MBBS",
        "qualification": null,
        "image": null,
        "schedule": [
            {
                "date": null,
                "day": null,
                "slots": null
            }
        ]
    },
    {
        "name": "Emama Bilal",
        "email": "weused@gmail.com",
        "contact": "+92 321 534212",
        "roomno": "N106",
        "designation": "MBBS, ENT Specialization",
        "qualification": null,
        "image": null,
        "schedule": [
            {
                "date": "2024-11-01",
                "day": "Friday",
                "slots": [
                    "10:00 am - 11:00 am",
                    "12:00 pm - 01:00 pm",
                    "03:00 pm - 04:00 pm"
                ]
            },
            {
                "date": "2024-10-30",
                "day": "Wednesday",
                "slots": [
                    "09:00 am - 10:00 am",
                    "11:00 am - 12:00 pm",
                    "02:00 pm - 03:00 pm"
                ]
            },
            {
                "date": "2024-11-10",
                "day": "Sunday",
                "slots": [
                    "09:00 am - 09:30 am"
                ]
            },
            {
                "date": "2024-10-31",
                "day": "Thursday",
                "slots": [
                    "09:00 am - 10:00 am",
                    "11:00 am - 12:00 pm",
                    "01:00 pm - 02:00 pm"
                ]
            }
        ]
    }
]
```

## /web/create-doctor-profile

### Description

`method`:`POST`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`request.body`:`{user_id, name, roomno, qualification, image, designation, contact}`

`response`: Displays the newly created doctor's profile in JSON

### Example

Sample Input:

```
{
    "name": "AbdurRahman Khan",
    "roomno": "D3102",
    "contact": "+92 315 6893410"
}
```

Response:

```
{
    "doctor_id": "ffee19ea-7fe2-414c-a54f-ca8984d8b890",
    "user_id": "82f776f8-9a8f-42bd-9497-a25d98685a2f",
    "name": "AbdurRahman Khan",
    "roomno": "D3102",
    "qualification": null,
    "image": null,
    "designation": null,
    "contact": "+92 315 6893410"
}
```

## /web/update-doctor

### Description

`method`:`PATCH`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`request.body`:`{name, roomno, qualification, image, designation, contact}`

`response`: The newly updated doctor's profile in JSON

### Example

Sample Input:

> The specified fields are updated in the DB and the unspecified ones are set to null. So update all the fields every time

```
{
    "name": "Update",
    "roomno": "205",
    "contact": "+92321534212",
    "designation": "SR. Cardiologist"
}
```

Response:

```
{
    "doctor_id": "ffee19ea-7fe2-414c-a54f-ca8984d8b890",
    "user_id": "82f776f8-9a8f-42bd-9497-a25d98685a2f",
    "name": "Update",
    "roomno": "205",
    "qualification": null,
    "image": null,
    "designation": "SR. Cardiologist",
    "contact": "+92321534212"
}
```

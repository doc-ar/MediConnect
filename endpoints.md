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

> **_NOTE:_** Make all api requests using content-type: application/json

## `POST` /auth/signup

### Description

`request.body`:`{email, password, role}`

`response`: The newly created user data in JSON

> role is one of ['admin', 'patient', 'doctor']
> role will be removed soon so only use role in signup for testing

### Example

Sample Input:

```json
{
  "email": "weused@test.com",
  "password": "12345678",
  "role": "patient"
}
```

Response:

```json
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

## `POST` /auth/login

### Description

`request.body`:`{email, password}`

`response`:`{accessToken, refreshToken}`

> refreshToken is automatically set as a cookie in web client. Has to be stored in

### Example

Sample Input:

```json
{
  "email": "weused@yahoo.com",
  "password": "12345678"
}
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmVkZTQzNjMtMzA1Mi00MDJmLTk2MDctMDAwZWI2ZWQyZDRhIiwiZW1haWwiOiJ3ZXVzZWRAeWFob28uY29tIiwiaWF0IjoxNzMwNjc0Nzc5LCJleHAiOjE3MzA2NzU5Nzl9.JnAxQC6NGw3-qX5nbk52lQ8HctEuHQoJBd0BF-NcJbE",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmVkZTQzNjMtMzA1Mi00MDJmLTk2MDctMDAwZWI2ZWQyZDRhIiwiZW1haWwiOiJ3ZXVzZWRAeWFob28uY29tIiwiaWF0IjoxNzMwNjc0Nzc5LCJleHAiOjE3MzA2NzcxNzl9.P-39BoVwDati6BttOWyLoBytvpqn4iTY4mwCUhXVU70"
}
```

## `GET` /auth/validate

> **_NOTE:_** This is an internal API used for authentication. Do not use this endpoint

`request.body`:`{}`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`:`{'Success'}`

- `status 200`: If the JWT access token is still valid

## `GET` /auth/refresh-token

`request.body`:`{refresh_token}`

`response`:`{accessToken, refreshToken}`

- `status 200`: If the refresh token is still valid and new tokens are generated
- `status 301`: If the token is null
- `status 403`: If the token is invalid

### Example

> Input is only required for mobile client, on web this will be done automatically through cookies

Sample Input:

```json
{
    "refresh_token": ${Your refresh token}
}
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmVkZTQzNjMtMzA1Mi00MDJmLTk2MDctMDAwZWI2ZWQyZDRhIiwiZW1haWwiOiJ3ZXVzZWRAeWFob28uY29tIiwiaWF0IjoxNzMwNjc0Nzc5LCJleHAiOjE3MzA2NzU5Nzl9.JnAxQC6NGw3-qX5nbk52lQ8HctEuHQoJBd0BF-NcJbE",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmVkZTQzNjMtMzA1Mi00MDJmLTk2MDctMDAwZWI2ZWQyZDRhIiwiZW1haWwiOiJ3ZXVzZWRAeWFob28uY29tIiwiaWF0IjoxNzMwNjc0Nzc5LCJleHAiOjE3MzA2NzcxNzl9.P-39BoVwDati6BttOWyLoBytvpqn4iTY4mwCUhXVU70"
}
```

Or if Refresh token is expired the response is:

```json
{
  "error": "jwt expired"
}
```

# Mobile Backend

## `POST` /mobile/create-patient-profile

### Description

`request.headers.authorization`:`Bearer $(Your Access Token)`

`request.body`:`{user_id, name, gender, address, weight, blood_pressure, image, age, blood_glucose, contact, bloodtype, allergies, height}`

`response`: The newly created user profile data as JSON

### Example

Sample Input:

```json
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

```json
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

## `POST` /mobile/create-appointment

### Description

`request.headers.authorization`:`Bearer $(Your Access Token)`

`request.body`:`{doctor_id, patient_id, slot_id}`

`response`: Displays the newly created doctor's profile in JSON

### Example

Sample Input:

```json
{
  "doctor_id": "0603dba8-945a-4641-8756-4e7ab8b34513",
  "patient_id": "f8db86b9-ba08-4904-9962-1e45b01bf1b9",
  "slot_id": "318c5806-2edd-46e4-8bdd-5677d16086e4"
}
```

Response:

```json
{
  "appointment_id": "968327b5-6c68-461e-8b08-15b4d202c32c",
  "doctor_id": "0603dba8-945a-4641-8756-4e7ab8b34513",
  "patient_id": "f8db86b9-ba08-4904-9962-1e45b01bf1b9",
  "slot_id": "318c5806-2edd-46e4-8bdd-5677d16086e4",
  "status": "scheduled"
}
```

## `GET` /mobile/patient-data

### Description

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: Data of currently logged in patient

### Example

Response:

```json
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

## `GET` /mobile/upcoming-appointments

### Description

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: All appointments with the status 'scheduled'

### Example

Response:

```json
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

## `GET` /mobile/all-appointments

### Description

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: All appointments that have been created against the current patient

### Example

Response:

```json
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

## `GET` /mobile/latest-prescription

### Description

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: A formatted prescription with doctor name and date

### Example

Response:

```json
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

## `GET` /mobile/get-doctors

### Description

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: A list of all the doctor (and their details) currently registered in the database

### Example

Response:

```json
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
        "slots": ["09:00 am - 09:30 am"]
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

## `PATCH` /mobile/update-patient

### Description

`request.headers.authorization`:`Bearer $(Your Access Token)`

`request.body`:`{name, gender, address, weight, blood_pressure, image, age, blood_glucose, contact, bloodtype, allergies, height}
}`

`response`: The newly updated doctor's profile in JSON

### Example

Sample Input:

> The specified fields are updated in the DB and the unspecified ones are set to null. So update all available fields

```json
{
  "name": "AbdurRahman Khan",
  "gender": "Male",
  "address": "House 131, Sanda Khurd",
  "weight": "60",
  "blood_pressure": "80/120",
  "image": "cdn.dummy.com/myprofile.jpg",
  "age": "21",
  "blood_glucose": "250",
  "contact": "+923156893410",
  "bloodtype": "B+",
  "height": "161"
}
```

Response:

```json
{
  "patient_id": "370c003c-06df-479a-9833-ae441a3ea4f8",
  "user_id": "bede4363-3052-402f-9607-000eb6ed2d4a",
  "name": "AbdurRahman Khan",
  "gender": "Male",
  "address": "House 131, Sanda Khurd",
  "weight": "60",
  "blood_pressure": "80/120",
  "image": "cdn.dummy.com/myprofile.jpg",
  "age": 21,
  "blood_glucose": "250",
  "contact": "+923156893410",
  "bloodtype": "B+",
  "allergies": null,
  "height": "161"
}
```

# Web Backend

## `POST` /web/create-doctor-profile

### Description

`method`:`POST`

`request.headers.authorization`:`Bearer $(Your Access Token)`

`request.body`:`{user_id, name, roomno, qualification, image, designation, contact}`

`response`: Displays the newly created doctor's profile in JSON

### Example

Sample Input:

```json
{
  "name": "AbdurRahman Khan",
  "roomno": "D3102",
  "contact": "+92 315 6893410"
}
```

Response:

```json
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

## `GET` /web/doctor-data

### Description

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: All data of the currently logged in doctor

### Example

Response:

```json
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
      "slots": ["09:00 am - 09:30 am"]
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
```

## `GET` /web/get-patients

### Description

`request.headers.authorization`:`Bearer $(Your Access Token)`

`response`: All patients in db

### Example

Response:

```json
[
  {
    "patient_id": "370c003c-06df-479a-9833-ae441a3ea4f8",
    "name": "AbdurRahman Khan",
    "email": "weused@yahoo.com",
    "address": "House 131, Sanda Khurd",
    "weight": "60",
    "blood_pressure": "80/120",
    "contact": "+923156893410",
    "blood_glucose": "250",
    "image": "cdn.dummy.com/myprofile.jpg",
    "gender": "Male",
    "age": 21,
    "prescriptions": [
      {
        "doctor": "Emama Bilal",
        "date": "2024-Oct-31",
        "medication": [
          {
            "Dosage": "2 tablets",
            "Duration": "10 Days",
            "Medicine": "Azoxan",
            "Strength": "500mg",
            "Frequency": "12 hrs"
          },
          {
            "Dosage": "1 tablet",
            "Duration": "5 Days",
            "Medicine": "Conta",
            "Strength": "200mg",
            "Frequency": "6 hrs"
          },
          {
            "Dosage": "1 tablet",
            "Duration": "8 Days",
            "Medicine": "Floran",
            "Strength": "500mg",
            "Frequency": "24 hrs"
          },
          {
            "Dosage": "2 tablets",
            "Duration": "10 Days",
            "Medicine": "Roxan",
            "Strength": "200mg",
            "Frequency": "12 hrs"
          }
        ]
      }
    ],
    "soap_notes": [
      {
        "plan": {
          "therapy": "Continue cognitive-behavioral therapy",
          "follow_up": "Follow up in 2 weeks to reassess anxiety levels",
          "medications": "Increase Sertraline to 75mg daily",
          "instructions": "Practice mindfulness exercises and maintain a consistent sleep schedule"
        },
        "objective": {
          "mood": "Anxious",
          "affect": "Constricted",
          "speech": "Normal rate and tone",
          "judgment": "Intact",
          "thought_process": "Linear and goal-directed"
        },
        "assessment": "Exacerbation of generalized anxiety disorder",
        "subjective": {
          "allergies": "None",
          "medications": "Sertraline 50mg daily",
          "family_history": "Mother has a history of depression",
          "social_history": "Works as a software engineer, lives alone",
          "chief_complaint": "Feeling anxious and overwhelmed",
          "past_psychiatric_history": "History of generalized anxiety disorder",
          "history_of_present_illness": "The patient reports increased anxiety over the past 2 weeks due to work-related stress. Trouble sleeping and constant worry. No suicidal ideation."
        },
        "LastUpdated": "2023-07-21"
      }
    ]
  },
  {
    "patient_id": "f8db86b9-ba08-4904-9962-1e45b01bf1b9",
    "name": "Test API",
    "email": "weused@test.com",
    "address": "Some address",
    "weight": "65",
    "blood_pressure": "80/120",
    "contact": "+921234567890",
    "blood_glucose": "2500",
    "image": null,
    "gender": "Female",
    "age": 35,
    "prescriptions": [
      {
        "doctor": null,
        "date": null,
        "medication": null
      }
    ],
    "soap_notes": null
  }
]
```

## `PATCH` /web/update-doctor

### Description

`request.headers.authorization`:`Bearer $(Your Access Token)`

`request.body`:`{name, roomno, qualification, image, designation, contact}`

`response`: The newly updated doctor's profile in JSON

### Example

Sample Input:

> The specified fields are updated in the DB and the unspecified ones are set to null. So update all the fields every time

```json
{
  "name": "Update",
  "roomno": "205",
  "contact": "+92321534212",
  "designation": "SR. Cardiologist"
}
```

Response:

```json
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

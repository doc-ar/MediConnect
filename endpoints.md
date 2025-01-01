# Table of Contents

- [Table of Contents](#table-of-contents)
- [Authentication Service](#authentication-service)
  - [`POST` /auth/signup](#post-authsignup)
    - [Description](#description)
    - [Example](#example)
  - [`POST` /auth/login](#post-authlogin)
    - [Description](#description-1)
    - [Example](#example-1)
  - [`GET` /auth/validate](#get-authvalidate)
    - [Description](#description-2)
  - [`GET` /auth/refresh-token](#get-authrefresh-token)
    - [Description](#description-3)
    - [Example](#example-2)
  - [`POST` /auth/forgot-password](#post-authforgot-password)
    - [Description](#description-4)
    - [Example](#example-3)
  - [`POST` /auth/change-password](#post-authchange-password)
    - [Description](#description-5)
    - [Example](#example-4)
- [Mobile Backend](#mobile-backend)
  - [`POST` /mobile/create-patient-profile](#post-mobilecreate-patient-profile)
    - [Description](#description-6)
    - [Example](#example-5)
  - [`POST` /mobile/create-appointment](#post-mobilecreate-appointment)
    - [Description](#description-7)
    - [Example](#example-6)
  - [`GET` /mobile/patient-data](#get-mobilepatient-data)
    - [Description](#description-8)
    - [Example](#example-7)
  - [`GET` /mobile/upcoming-appointments](#get-mobileupcoming-appointments)
    - [Description](#description-9)
    - [Example](#example-8)
  - [`GET` /mobile/all-appointments](#get-mobileall-appointments)
    - [Description](#description-10)
    - [Example](#example-9)
  - [`GET` /mobile/latest-prescription](#get-mobilelatest-prescription)
    - [Description](#description-11)
    - [Example](#example-10)
  - [`GET` /mobile/all-prescriptions](#get-mobileall-prescriptions)
    - [Description](#description-12)
    - [Example](#example-11)
  - [`GET` /mobile/get-doctors](#get-mobileget-doctors)
    - [Description](#description-13)
    - [Example](#example-12)
  - [`PATCH` /mobile/update-patient](#patch-mobileupdate-patient)
    - [Description](#description-14)
    - [Example](#example-13)
- [Web Backend](#web-backend)
  - [`POST` /web/create-doctor-profile](#post-webcreate-doctor-profile)
    - [Description](#description-15)
    - [Example](#example-14)
  - [`GET` /web/doctor-data](#get-webdoctor-data)
    - [Description](#description-16)
    - [Example](#example-15)
  - [`GET` /web/get-patients](#get-webget-patients)
    - [Description](#description-17)
    - [Example](#example-16)
  - [`GET` /web/get-appointments](#get-webget-appointments)
    - [Description](#description-18)
    - [Example](#example-17)
  - [`GET` /web/get-prescriptions/{patient\_id}](#get-webget-prescriptionspatient_id)
    - [Description](#description-19)
    - [Example](#example-18)
  - [`POST` /web/new-soapnote](#post-webnew-soapnote)
    - [Description](#description-20)
    - [Example](#example-19)
  - [`POST` /web/new-transcription](#post-webnew-transcription)
    - [Description](#description-21)
    - [Example](#example-20)
  - [`POST` /web/new-prescription](#post-webnew-prescription)
    - [Description](#description-22)
    - [Example](#example-21)
  - [`POST` /web/get-medicines](#post-webget-medicines)
    - [Description](#description-23)
    - [Example](#example-22)
  - [`PATCH` /web/update-doctor](#patch-webupdate-doctor)
    - [Description](#description-24)
    - [Example](#example-23)


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

<details>
<summary>Expand / Collapse</summary><br>
Sample Input:

```json
{
  "email": "dr.louis@gmail.com",
  "password": "12345678",
  "role": "doctor"
}
```

Response:

```json
{
  "users": {
    "user_id": "4ecb1312-dd2d-4fa3-bea0-a19dc3775b29",
    "email": "dr.louis@gmail.com",
    "password": "$2b$10$.rHfOyLWjz8KcWLNVy1HMOHI8u1Z7YSJE6FX8HBHuWTQBSM05loDq",
    "role": "doctor",
    "created_at": "2024-12-11T20:49:12.212Z"
  }
}
```

</details>

## `POST` /auth/login

### Description

`request.body`:`{email, password}`

`response`:`{accessToken, refreshToken}`

> refreshToken is automatically set as a cookie in web client. Has to be stored in

### Example

<details>
<summary>Expand / Collapse</summary><br>

Sample Input:

```json
{
  "email": "asfar.hassan@gmail.com",
  "password": "12345678"
}
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWJjZWRiYmQtNTM5Yi00YmY0LTgxNzMtNjY0NzZmNDQ1YmRkIiwiZW1haWwiOiJhc2Zhci5oYXNzYW5AZ21haWwuY29tIiwicm9sZSI6ImRvY3RvciIsImlhdCI6MTczMzk2ODA3NSwiZXhwIjoxNzMzOTY5Mjc1fQ.G_eL4iYadik_FR-bK3Zs4rcf4LdV4TsZ3O-D21v0kWw",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWJjZWRiYmQtNTM5Yi00YmY0LTgxNzMtNjY0NzZmNDQ1YmRkIiwiZW1haWwiOiJhc2Zhci5oYXNzYW5AZ21haWwuY29tIiwicm9sZSI6ImRvY3RvciIsImlhdCI6MTczMzk2ODA3NSwiZXhwIjoxNzMzOTcwNDc1fQ.2Qbj3j8pMxGbZdSGiz8Z8SpiserHi9jorlX1qOTFyrA",
  "hasPatientProfile": false,
  "hasDoctorProfile": true
}
```

</details>

## `GET` /auth/validate

### Description

> **_NOTE:_** This is an internal API used for authentication. Do not use this endpoint

`request.body`:`{}`

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`response`:`{'Success'}`

- `status 200`: If the JWT access token is still valid

## `GET` /auth/refresh-token

### Description

`request.body`:`{refresh_token}`

`response`:`{accessToken, refreshToken}`

- `status 200`: If the refresh token is still valid and new tokens are generated
- `status 301`: If the token is null
- `status 403`: If the token is invalid

### Example

<details>
<summary>Expand / Collapse</summary><br>

> Input is only required for mobile client, on web this will be done automatically through cookies

Sample Input:

```json
{
    "refresh_token": ${Your_refresh_token}
}
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWJjZWRiYmQtNTM5Yi00YmY0LTgxNzMtNjY0NzZmNDQ1YmRkIiwiZW1haWwiOiJhc2Zhci5oYXNzYW5AZ21haWwuY29tIiwicm9sZSI6ImRvY3RvciIsImlhdCI6MTczMzk2ODMyNiwiZXhwIjoxNzMzOTY5NTI2fQ.LdMxpsKS9Na4tSeEy8gCF_SiXPCG2fucYN8IbSyy9YU",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWJjZWRiYmQtNTM5Yi00YmY0LTgxNzMtNjY0NzZmNDQ1YmRkIiwiZW1haWwiOiJhc2Zhci5oYXNzYW5AZ21haWwuY29tIiwicm9sZSI6ImRvY3RvciIsImlhdCI6MTczMzk2ODMyNiwiZXhwIjoxNzMzOTcwNzI2fQ.AQvxgircM0rIIfpHjV1Z20nsVOe1Ku623VRIO_MRaEk"
}
```

Or if Refresh token is expired the response is:

```json
{
  "error": "jwt expired"
}
```

</details>

## `POST` /auth/forgot-password

### Description

`request.body`:`{email}`

`response`:`{message}`

### Example

<details>
<summary>Expand / Collapse</summary><br>

Sample Input:

```json
{
  "email": "emamabilal@gmail.com"
}
```

Response:

```json
{
  "message": "Password reset email sent!"
}
```

</details>

## `POST` /auth/change-password

### Description

`request.body`:`{old_password, new_password}`

`response`:`{message, updated_user}`

### Example

<details>
<summary>Expand / Collapse</summary><br>

Sample Input:

```json
{
  "old_password": "12345678",
  "new_password": "Emama1?"
}
```

Response:

```json
{
  "message": "Password reset successful",
  "updated_user": [
    {
      "user_id": "60110a4c-1577-4e32-add1-988107939218",
      "email": "emamabilal@gmail.com",
      "password": "$2b$10$PyT2SZzijg0HH8Se99LJiu4ZXymAv9ihioKCsJO01J6TpGjFF7nve",
      "role": "patient",
      "created_at": "2024-12-15T21:09:25.117Z"
    }
  ]
}
```

</details>

# Mobile Backend

## `POST` /mobile/create-patient-profile

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`request.body`:`{user_id, name, gender, address, weight, blood_pressure, image, age, blood_glucose, contact, bloodtype, allergies, height}`

`response`: The newly created user profile data as JSON

### Example

<details>
<summary>Expand / Collapse</summary><br>

Sample Input:

```json
{
  "name": "Mike Adams",
  "gender": "Male",
  "address": "654 Cedar Ln, Lakeville",
  "weight": "85",
  "blood_pressure": "125/75",
  "image": "https://example.com/images/madams.jpg",
  "age": "50",
  "blood_glucose": "90",
  "contact": "+12345678905",
  "bloodtype": "A-",
  "allergies": "Sulfa Drugs",
  "height": "182"
}
```

Response:

```json
{
  "patient_id": "e257d960-331a-4e03-964e-e7d7c72e9476",
  "user_id": "1b4583f8-21fd-4e4c-a626-df44c285249b",
  "name": "Mike Adams",
  "gender": "Male",
  "address": "654 Cedar Ln, Lakeville",
  "image": "https://example.com/images/madams.jpg",
  "age": 50,
  "contact": "+12345678905",
  "weight": "85",
  "blood_pressure": "125/75",
  "blood_glucose": "90",
  "bloodtype": "A-",
  "allergies": "Sulfa Drugs",
  "height": "182",
  "reports": []
}
```

</details>

## `POST` /mobile/create-appointment

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`request.body`:`{doctor_id, patient_id, slot_id}`

`response`: Displays the newly created doctor's profile in JSON

### Example

<details>
<summary>Expand / Collapse</summary><br>

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

</details>

## `GET` /mobile/patient-data

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`response`: Data of currently logged in patient

### Example

<details>
<summary>Expand / Collapse</summary><br>

Response:

```json
{
  "user_id": "1b4583f8-21fd-4e4c-a626-df44c285249b",
  "patient_id": "e257d960-331a-4e03-964e-e7d7c72e9476",
  "email": "mike.addams@gmail.com",
  "name": "Mike Adams",
  "gender": "Male",
  "address": "654 Cedar Ln, Lakeville",
  "weight": "85",
  "blood_pressure": "125/75",
  "image": "https://example.com/images/madams.jpg",
  "age": 50,
  "blood_glucose": "90",
  "contact": "+12345678905",
  "bloodtype": "A-",
  "allergies": "Sulfa Drugs",
  "height": "182",
  "reports": []
}
```

</details>

## `GET` /mobile/upcoming-appointments

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`response`: All appointments with the status 'scheduled'

### Example

<details>
<summary>Expand / Collapse</summary><br>
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

</details>

## `GET` /mobile/all-appointments

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`response`: All appointments that have been created against the current patient

### Example

<details>
<summary>Expand / Collapse</summary><br>
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

</details>

## `GET` /mobile/latest-prescription

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`response`: A formatted prescription with doctor name and date

### Example

<details>
<summary>Expand / Collapse</summary><br>
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

</details>

## `GET` /mobile/all-prescriptions

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`response`: A formatted list of all prescriptions

### Example

<details>
<summary>Expand / Collapse</summary><br>
Response:

```json
[
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
]
```

</details>

## `GET` /mobile/get-doctors

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`response`: A list of all the doctor (and their details) currently registered in the database

### Example

<details>
<summary>Expand / Collapse</summary><br>
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

</details>

## `PATCH` /mobile/update-patient

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`request.body`:`{name, gender, address, weight, blood_pressure, image, age, blood_glucose, contact, bloodtype, allergies, height}
}`

`response`: The newly updated patient's profile in JSON

### Example

<details>
<summary>Expand / Collapse</summary><br>
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

</details>

# Web Backend

## `POST` /web/create-doctor-profile

### Description

`method`:`POST`

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`request.body`:`{user_id, name, roomno, qualification, image, designation, contact}`

`response`: Displays the newly created doctor's profile in JSON

### Example

<details>
<summary>Expand / Collapse</summary><br>
Sample Input:

```json
{
  "name": "Dr. Saba Qamar",
  "roomno": "505",
  "qualification": "MBBS, DCH",
  "designation": "Pediatrician",
  "image": "https://example.com/images/sqamar.jpg",
  "contact": "+12345678914"
}
```

Response:

```json
{
  "doctor_id": "5c93dbfa-0632-4024-a1ca-bff39bd1d24b",
  "user_id": "ea132879-0a1c-42b1-affc-cd97ffe03c20",
  "name": "Dr. Saba Qamar",
  "roomno": "505",
  "qualification": "MBBS, DCH",
  "image": "https://example.com/images/sqamar.jpg",
  "designation": "Pediatrician",
  "contact": "+12345678914"
}
```

</details>

## `GET` /web/doctor-data

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`response`: All data of the currently logged in doctor

### Example

<details>
<summary>Expand / Collapse</summary><br>
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

</details>

## `GET` /web/get-patients

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`response`: All patients in db

### Example

<details>
<summary>Expand / Collapse</summary><br>
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

</details>

## `GET` /web/get-appointments

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`response`: List of all appointments of current doctor

### Example

<details>
<summary>Expand / Collapse</summary><br>
Sample Input:

```json

```

Response:

```json

```

</details>

## `GET` /web/get-prescriptions/{patient_id}

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`response`: List of all prescriptions of specified patient

### Example

<details>
<summary>Expand / Collapse</summary><br>
Sample Input:

```json

```

Response:

```json

```

</details>

## `POST` /web/new-soapnote

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`request.body`:`{soap_note_data}`

`response`: The newly created soap note

### Example

<details>
<summary>Expand / Collapse</summary><br>
Sample Input:

```json

```

Response:

```json

```

</details>

## `POST` /web/new-transcription

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`request.body`:`{transcript_data}`

`response`: The newly created transcription

### Example

<details>
<summary>Expand / Collapse</summary><br>
Sample Input:

```json

```

Response:

```json

```

</details>

## `POST` /web/new-prescription

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`request.body`:`{prescription_data}`

`response`: The newly created prescription

### Example

<details>
<summary>Expand / Collapse</summary><br>
Sample Input:

```json

```

Response:

```json

```

</details>

## `POST` /web/get-medicines

### Description

`response`: A JSON list of all medicines

### Example

<details>
<summary>Expand / Collapse</summary><br>
Response:

```json
[
    {
        "medicine_id": "b16f9826-9761-4e88-9aa6-22cf51f35124",
        "medicine_name": "Panadol",
        "medicine_formula": "Paracetamol",
        "medicine_strength": "500mg",
        "price": "40"
    },
    {
        "medicine_id": "c853ef6a-d889-4a72-a387-4f236eed6be8",
        "medicine_name": "Nims",
        "medicine_formula": "Nimesulide",
        "medicine_strength": "100mg",
        "price": "120"
    },
    {
        "medicine_id": "067d7855-4c76-4f5a-a96c-48769cffe3dc",
        "medicine_name": "Arinac",
        "medicine_formula": "Ibuprofen / Pseudoephedrine",
        "medicine_strength": "200mg / 30mg",
        "price": "65"
    },
    {
        "medicine_id": "13a0ca9c-77b0-49cb-9c91-670c6c17308d",
        "medicine_name": "Arinac Forte",
        "medicine_formula": "Ibuprofen / Pseudoephedrine",
        "medicine_strength": "400mg / 60mg",
        "price": "115"
    },
    {
        "medicine_id": "244f8339-87f0-41ea-a40e-543a7888feea",
        "medicine_name": "Nuberol",
        "medicine_formula": "Orphenadrine Citrate / Paracetamol",
        "medicine_strength": "35mg / 450mg",
        "price": "65"
    },
    {
        "medicine_id": "6944d827-8f87-462e-a7c2-464c22823e87",
        "medicine_name": "Nuberol Forte",
        "medicine_formula": "Orphenadrine Citrate / Paracetamol",
        "medicine_strength": "50mg / 650mg",
        "price": "55"
    }
]
```

</details>

## `PATCH` /web/update-doctor

### Description

`request.headers.authorization`:`Bearer $(Your_Access_Token)`

`request.body`:`{name, roomno, qualification, image, designation, contact}`

`response`: The newly updated doctor's profile in JSON

### Example

<details>
<summary>Expand / Collapse</summary><br>
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

</details>

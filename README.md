#### Table of Contents
- [Introduction](#introduction)
- [Tool and Technologies](#tool-and-technologies)
- [Setup](#setup)
- [Documentation](#documentation)

# Introduction

MediConnect is a healthcare portal that streamlines the hectic processing between the doctors and the patients to provide a comfortable healthcare experience. MediConnect Provides a web portal for the doctors and a mobile app for the patients. The doctor's portal has a special feature called SOAP note generation which can record and transcribe doctor-patient conversations and generate soap notes automatically using either Google's GEMINI or our own model.

# Tool and Technologies

- Nodejs (Backend)
- React (Website)
- React Native (Mobile App)
- Python (Machine Learning Model)
- Flask (ML Backend)
- Neon (Database)
- Nginx (Reverse Proxy)
- Let's Encrypt (SSL Certificates)
- Docker and Docker Compose (Deployment)

# Setup

1. Clone the github repository and cd into it

```bash
git clone https://github.com/doc-ar/MediConnect
cd MediConnect
```

2. Execute [generate_db.sql](./generate_db.sql) commands on either Postgresql or NEON

3. Fill the [.env.template](./.env.template) with required data and save it as .env

4. Run the docker compose commands to start the project

```bash
sudo docker compose build
sudo docker compose up
```

# Documentation

Read [Endpoints.md](./endpoints.md) for a comprehensive description of all available endpoints

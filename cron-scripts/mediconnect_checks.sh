#!/bin/bash

# Define your PostgreSQL connection string
CONNECTION_STRING="postgresql://mediconnectdb_owner:pPWcMk9tjC0J@ep-hidden-butterfly-a1zjufn3.ap-southeast-1.aws.neon.tech/mediconnectdb?sslmode=require"

# Run the SQL functions
psql "$CONNECTION_STRING" -c "SELECT update_time_slots_availability();"
psql "$CONNECTION_STRING" -c "SELECT cancel_past_appointments();"

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6
-- Dumped by pg_dump version 16.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: cancel_past_appointments(); Type: FUNCTION; Schema: public; Owner: mediconnectdb_owner
--

CREATE FUNCTION public.cancel_past_appointments() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE appointments
    SET status = 'cancelled'
    WHERE slot_id IN (
        SELECT slot_id FROM time_slots
        WHERE (
            date < (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'GMT+5')::DATE
            OR (
                date = (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'GMT+5')::DATE
                AND end_time <= (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'GMT+5')::TIME
            )
        )
    )
    AND status NOT IN ('completed', 'cancelled');
END;
$$;


ALTER FUNCTION public.cancel_past_appointments() OWNER TO mediconnectdb_owner;

--
-- Name: generate_time_slots_for_date(date); Type: FUNCTION; Schema: public; Owner: mediconnectdb_owner
--

CREATE FUNCTION public.generate_time_slots_for_date(target_date date) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    doctor RECORD;
    start_times TIME[] := ARRAY['14:00:00', '15:00:00', '16:00:00'];
    end_times TIME[] := ARRAY['15:00:00', '16:00:00', '17:00:00'];
BEGIN
    -- Loop through each doctor
    FOR doctor IN SELECT doctor_id FROM doctors LOOP
        -- Insert time slots for the doctor
        FOR i IN 1..array_length(start_times, 1) LOOP
            INSERT INTO time_slots (doctor_id, start_time, end_time, availability, date, day)
            VALUES (
                doctor.doctor_id,
                start_times[i],
                end_times[i],
                TRUE,
                target_date,
                trim(to_char(target_date, 'Day')) -- Trim trailing spaces
            );
        END LOOP;
    END LOOP;
END;
$$;


ALTER FUNCTION public.generate_time_slots_for_date(target_date date) OWNER TO mediconnectdb_owner;

--
-- Name: generate_time_slots_for_today(); Type: FUNCTION; Schema: public; Owner: mediconnectdb_owner
--

CREATE FUNCTION public.generate_time_slots_for_today() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    current_date DATE := (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'GMT+5')::DATE;
    doctor RECORD;
    start_times TIME[] := ARRAY['14:00:00', '15:00:00', '16:00:00'];
    end_times TIME[] := ARRAY['15:00:00', '16:00:00', '17:00:00'];
BEGIN
    -- Loop through each doctor
    FOR doctor IN SELECT doctor_id FROM doctors LOOP
        -- Insert time slots for the doctor
        FOR i IN 1..array_length(start_times, 1) LOOP
            INSERT INTO time_slots (doctor_id, start_time, end_time, availability, date, day)
            VALUES (
                doctor.doctor_id,
                start_times[i],
                end_times[i],
                TRUE,
                current_date,
                trim(to_char(current_date, 'Day')) -- Trim trailing spaces
            );
        END LOOP;
    END LOOP;
END;
$$;


ALTER FUNCTION public.generate_time_slots_for_today() OWNER TO mediconnectdb_owner;

--
-- Name: generate_time_slots_for_week(date); Type: PROCEDURE; Schema: public; Owner: mediconnectdb_owner
--

CREATE PROCEDURE public.generate_time_slots_for_week(IN start_date date)
    LANGUAGE plpgsql
    AS $$
DECLARE
    day_offset INT;
BEGIN
    FOR day_offset IN 0..6 LOOP
        PERFORM generate_time_slots_for_date(start_date + day_offset);
    END LOOP;
END;
$$;


ALTER PROCEDURE public.generate_time_slots_for_week(IN start_date date) OWNER TO mediconnectdb_owner;

--
-- Name: update_time_slots_availability(); Type: FUNCTION; Schema: public; Owner: mediconnectdb_owner
--

CREATE FUNCTION public.update_time_slots_availability() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE time_slots
    SET availability = FALSE
    WHERE (
        date < (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'GMT+5')::DATE
        OR (
            date = (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'GMT+5')::DATE
            AND end_time <= (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'GMT+5')::TIME
        )
    )
    AND availability = TRUE;
END;
$$;


ALTER FUNCTION public.update_time_slots_availability() OWNER TO mediconnectdb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: mediconnectdb_owner
--

CREATE TABLE public.appointments (
    appointment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    doctor_id uuid NOT NULL,
    patient_id uuid NOT NULL,
    slot_id uuid NOT NULL,
    status character varying(20) NOT NULL,
    CONSTRAINT appointments_status_check CHECK (((status)::text = ANY ((ARRAY['cancelled'::character varying, 'scheduled'::character varying, 'rescheduled'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.appointments OWNER TO mediconnectdb_owner;

--
-- Name: doctors; Type: TABLE; Schema: public; Owner: mediconnectdb_owner
--

CREATE TABLE public.doctors (
    doctor_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name character varying(100) NOT NULL,
    roomno character varying(10),
    qualification character varying(100),
    image text,
    designation character varying(100),
    contact character varying(15)
);


ALTER TABLE public.doctors OWNER TO mediconnectdb_owner;

--
-- Name: medicines; Type: TABLE; Schema: public; Owner: mediconnectdb_owner
--

CREATE TABLE public.medicines (
    medicine_id uuid DEFAULT gen_random_uuid() NOT NULL,
    medicine_name character varying(50) NOT NULL,
    medicine_formula character varying(50) NOT NULL,
    medicine_strength character varying(50) NOT NULL,
    price numeric
);


ALTER TABLE public.medicines OWNER TO mediconnectdb_owner;

--
-- Name: patients; Type: TABLE; Schema: public; Owner: mediconnectdb_owner
--

CREATE TABLE public.patients (
    patient_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name character varying(100) NOT NULL,
    gender character varying(10),
    address text,
    image text,
    age integer,
    contact character varying(15),
    weight numeric,
    blood_pressure character varying(20),
    blood_glucose numeric,
    bloodtype character varying(5),
    allergies text,
    height numeric,
    reports jsonb DEFAULT '[]'::jsonb,
    CONSTRAINT patients_bloodtype_check CHECK (((bloodtype)::text = ANY ((ARRAY['A+'::character varying, 'A-'::character varying, 'B+'::character varying, 'B-'::character varying, 'O+'::character varying, 'O-'::character varying, 'AB+'::character varying, 'AB-'::character varying])::text[])))
);


ALTER TABLE public.patients OWNER TO mediconnectdb_owner;

--
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: mediconnectdb_owner
--

CREATE TABLE public.prescriptions (
    prescription_id uuid DEFAULT gen_random_uuid() NOT NULL,
    appointment_id uuid,
    prescription_data jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.prescriptions OWNER TO mediconnectdb_owner;

--
-- Name: soap_notes; Type: TABLE; Schema: public; Owner: mediconnectdb_owner
--

CREATE TABLE public.soap_notes (
    soap_note_id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid,
    soap_note_data jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.soap_notes OWNER TO mediconnectdb_owner;

--
-- Name: time_slots; Type: TABLE; Schema: public; Owner: mediconnectdb_owner
--

CREATE TABLE public.time_slots (
    slot_id uuid DEFAULT gen_random_uuid() NOT NULL,
    doctor_id uuid,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    availability boolean DEFAULT true,
    date date,
    day character varying(10),
    CONSTRAINT time_slots_day_check CHECK (((day)::text = ANY ((ARRAY['Monday'::character varying, 'Tuesday'::character varying, 'Wednesday'::character varying, 'Thursday'::character varying, 'Friday'::character varying, 'Saturday'::character varying, 'Sunday'::character varying])::text[])))
);


ALTER TABLE public.time_slots OWNER TO mediconnectdb_owner;

--
-- Name: transcriptions; Type: TABLE; Schema: public; Owner: mediconnectdb_owner
--

CREATE TABLE public.transcriptions (
    transcription_id uuid DEFAULT gen_random_uuid() NOT NULL,
    appointment_id uuid,
    data text
);


ALTER TABLE public.transcriptions OWNER TO mediconnectdb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: mediconnectdb_owner
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(10) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['doctor'::character varying, 'patient'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO mediconnectdb_owner;


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (appointment_id);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (doctor_id);


--
-- Name: medicines medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_pkey PRIMARY KEY (medicine_id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (patient_id);


--
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (prescription_id);


--
-- Name: soap_notes soap_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.soap_notes
    ADD CONSTRAINT soap_notes_pkey PRIMARY KEY (soap_note_id);


--
-- Name: time_slots time_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_pkey PRIMARY KEY (slot_id);


--
-- Name: transcriptions transcriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.transcriptions
    ADD CONSTRAINT transcriptions_pkey PRIMARY KEY (transcription_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: idx_appointment_doctor_id; Type: INDEX; Schema: public; Owner: mediconnectdb_owner
--

CREATE INDEX idx_appointment_doctor_id ON public.appointments USING btree (doctor_id);


--
-- Name: idx_appointment_patient_id; Type: INDEX; Schema: public; Owner: mediconnectdb_owner
--

CREATE INDEX idx_appointment_patient_id ON public.appointments USING btree (patient_id);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: mediconnectdb_owner
--

CREATE INDEX idx_user_email ON public.users USING btree (email);


--
-- Name: appointments appointments_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id);


--
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id);


--
-- Name: doctors doctors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: patients patients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: prescriptions prescriptions_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(appointment_id);


--
-- Name: soap_notes soap_notes_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.soap_notes
    ADD CONSTRAINT soap_notes_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id);


--
-- Name: time_slots time_slots_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id);


--
-- Name: transcriptions transcriptions_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mediconnectdb_owner
--

ALTER TABLE ONLY public.transcriptions
    ADD CONSTRAINT transcriptions_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(appointment_id);

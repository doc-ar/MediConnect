import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import { neon } from "@neondatabase/serverless";
import { authMiddleware } from "./utils/authorization.js";

dotenv.config();

const sql = neon(process.env.DATABASE_URL);
const PORT = process.env.PORT;
const corsOptions = { credentials: true, origin: process.env.URL || "*" };

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(json());

// Post Requests
app.post("/mobile/create-patient-profile", authMiddleware, async (req, res) => {
  try {
    // Check that the user role is patient
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    if (!(tokenData.role === "patient")) {
      return res.status(403).json({ error: "The user is not a patient" });
    }

    // Check if the patient already exists
    const patientData = await sql`
      SELECT * FROM patients
      WHERE user_id = ${tokenData.user_id};
    `;
    if (patientData.length > 0 && patientData[0].patient_id) {
      return res.status(409).json({ error: "The user already exists" });
    }

    const result = await sql`
      INSERT INTO patients (user_id,name,gender,address,weight,blood_pressure,image,age,blood_glucose,contact,bloodtype,allergies,height)
      VALUES (${tokenData.user_id},${req.body.name},${req.body.gender},${req.body.address},
              ${req.body.weight},${req.body.blood_pressure},${req.body.image},${req.body.age},
              ${req.body.blood_glucose},${req.body.contact},${req.body.bloodtype},${req.body.allergies},${req.body.height})
      RETURNING *
    `;
    res.status(200).json(result[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post("/mobile/create-appointment", authMiddleware, async (req, res) => {
  try {
    // Check that the user role is patient
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    if (!(tokenData.role === "patient")) {
      return res.status(403).json({ error: "The user is not a patient" });
    }

    // Check if appointment exists
    const appointments = await sql`
      SELECT * FROM appointments
      WHERE doctor_id = ${req.body.doctor_id}
      AND patient_id = ${req.body.patient_id}
      AND slot_id = ${req.body.slot_id}
    `;
    if (appointments.length > 0 && appointments[0].appointment_id) {
      return res.status(409).json({ error: "The appointment already exists" });
    }

    // Execute Query
    const appointment = await sql`
      INSERT INTO appointments (doctor_id,patient_id,slot_id,status)
      VALUES (${req.body.doctor_id}, ${req.body.patient_id}, ${req.body.slot_id}, 'scheduled')
      RETURNING *
    `;
    res.status(200).json(appointment[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

// GET Request endpoints
app.get("/mobile/patient-data", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);

    const patientData = await sql`
      SELECT  u.user_id,p.patient_id,          
              u.email,p.name,p.gender,p.address,p.weight,p.blood_pressure,p.image,
              p.age,p.blood_glucose,p.contact,p.bloodtype,p.allergies,p.height
      FROM  users u
      JOIN  patients p ON p.user_id = u.user_id
      WHERE u.user_id = ${tokenData.user_id};
    `;

    res.status(200).json(patientData[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/mobile/all-appointments", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);

    const result = await sql`
      SELECT  a.appointment_id, a.status,
              d.name, u.email AS doctor_email, d.designation, d.qualification, d.image, d.roomno, d.contact,
              ts.date, ts.start_time, ts.end_time, ts.day,
              prescription_data AS prescription
      FROM appointments a
      JOIN time_slots ts ON ts.slot_id = a.slot_id
      JOIN doctors d ON d.doctor_id = a.doctor_id
      JOIN patients p ON p.patient_id = a.patient_id
      LEFT JOIN prescriptions ps ON ps.appointment_id = a.appointment_id
      JOIN users u ON u.user_id = d.user_id
      WHERE p.user_id = ${tokenData.user_id}
    `;

    res.status(200).json(result);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/mobile/upcoming-appointments", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);

    const result = await sql`
      SELECT  a.appointment_id, a.status,
              d.name, d.designation, d.qualification, d.image, d.roomno, d.contact, u.email,
              ts.date, ts.start_time, ts.end_time, ts.day
      FROM appointments a
      JOIN time_slots ts ON ts.slot_id = a.slot_id
      JOIN doctors d ON d.doctor_id = a.doctor_id
      JOIN patients p ON p.patient_id = a.patient_id
      JOIN users u ON u.user_id = d.user_id
      WHERE p.user_id = ${tokenData.user_id}
      AND a.status = 'scheduled'
      ORDER BY ts.date DESC
      LIMIT 1
    `;

    res.status(200).json(result);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/mobile/all-prescriptions", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);

    const result = await sql`
      SELECT  d.name AS "doctor",
              TO_CHAR(ts.date, 'YYYY-Mon-DD') AS "date",
              p.prescription_data AS "medication"
      FROM prescriptions p
      JOIN appointments a ON a.appointment_id = p.appointment_id
      JOIN time_slots ts ON ts.slot_id = a.slot_id
      JOIN doctors d ON d.doctor_id = a.doctor_id
      JOIN patients pa ON pa.patient_id = a.patient_id
      JOIN users u ON u.user_id = pa.user_id
      WHERE u.user_id = ${tokenData.user_id}
    `;

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/mobile/latest-prescription", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);

    const result = await sql`
      SELECT  d.name AS "doctor",
              TO_CHAR(ts.date, 'YYYY-Mon-DD') AS "date",
              p.prescription_data AS "medication"
      FROM prescriptions p
      JOIN appointments a ON a.appointment_id = p.appointment_id
      JOIN time_slots ts ON ts.slot_id = a.slot_id
      JOIN doctors d ON d.doctor_id = a.doctor_id
      JOIN patients pa ON pa.patient_id = a.patient_id
      JOIN users u ON u.user_id = pa.user_id
      WHERE u.user_id = ${tokenData.user_id}
      AND   a.status = 'scheduled'
      ORDER BY ts.date DESC
      LIMIT 1
    `;

    res.status(200).json(result[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/mobile/get-doctors", authMiddleware, async (req, res) => {
  try {
    const result = await sql`
      SELECT
          d.name, u.email, d.contact, d.roomno,
          d.designation, d.qualification, d.image,
          json_agg(
              json_build_object(
                  'date', slot_data.date,
                  'day', slot_data.day,
                  'slots', slot_data.slots
              )
          ) AS schedule
      FROM
          doctors d
      JOIN
          users u ON d.user_id = u.user_id
      LEFT JOIN (
          SELECT
              ts.doctor_id, ts.date, ts.day,
              array_agg(
                  to_char(ts.start_time, 'HH:MI am') || ' - ' || to_char(ts.end_time, 'HH:MI am')
              ) AS slots
          FROM
              time_slots ts
          GROUP BY
              ts.doctor_id, ts.date, ts.day
      ) AS slot_data ON slot_data.doctor_id = d.doctor_id
      GROUP BY
          d.name, u.email, d.contact, d.roomno, d.designation, d.qualification, d.image;
    `;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/mobile/get-soap-notes", authMiddleware, async (req, res) => {
  try {
    // Check that the user role is patient
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    if (!(tokenData.role === "patient")) {
      return res.status(403).json({ error: "The user is not a patient" });
    }

    const soap_note = await sql`
      SELECT sn.soap_note_data FROM soap_notes sn
      JOIN patients p ON p.patient_id = sn.patient_id
    `;
    if (soap_note.length === 0) {
      return res.json({});
    }

    return res.status(200).json(soap_note[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH Request endpoints
app.patch("/mobile/update-patient", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    const patientData = await sql`
      SELECT * FROM patients
      WHERE user_id = ${tokenData.user_id};
    `;

    if (patientData.length === 0) {
      return res.status(404).json({ error: "The user does not exist" });
    }

    const result = await sql`
      UPDATE patients
      SET name            = ${req.body.name},
          gender          = ${req.body.gender},
          address         = ${req.body.address},
          weight          = ${req.body.weight},
          blood_pressure  = ${req.body.blood_pressure},
          image           = ${req.body.image},
          age             = ${req.body.age},
          blood_glucose   = ${req.body.blood_glucose},
          contact         = ${req.body.contact},
          bloodtype       = ${req.body.bloodtype},
          allergies       = ${req.body.allergies},
          height          = ${req.body.height}
      WHERE user_id = ${tokenData.user_id}
      RETURNING *
    `;

    return res.status(200).json(result[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.patch("/web/update-appointment", authMiddleware, async (req, res) => {
  try {
    // Check if appointment exists
    const object_exists = await sql`
      SELECT appointment_id FROM appointments
      WHERE appointment_id = ${req.body.appointment_id};
    `;
    if (object_exists.length === 0) {
      return res.status(404).json({ error: "The appointment does not exist" });
    }

    // execute query
    const result = await sql`
      UPDATE appointments
      SET slot_id       = ${req.body.slot_id},
          status        = ${req.body.status}
      WHERE appointment_id = ${req.body.appointment_id}
      RETURNING *
    `;

    return res.json(result[0]);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Mobile Backend is running on port ${PORT}`);
});

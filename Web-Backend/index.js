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

// POST request Endpoints
app.post("/web/create-doctor-profile", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    const doctorData = await sql`
      SELECT * FROM doctors
      WHERE user_id = ${tokenData.user_id};
    `;
    const userData = await sql`
      SELECT * FROM users
      WHERE user_id = ${tokenData.user_id}
    `;

    if (doctorData.length > 0 && doctorData[0].doctor_id) {
      return res.status(409).json({ error: "The user already exists" });
    }
    if (!(userData[0].role === "doctor"))
      return res.status(403).json({ error: "The user is not a doctor" });

    const result = await sql`
      INSERT INTO doctors (user_id,name,roomno,qualification,image,designation,contact)
      VALUES (${tokenData.user_id},${req.body.name},${req.body.roomno},${req.body.qualification},
              ${req.body.image},${req.body.designation},${req.body.contact})
      RETURNING *
    `;
    res.status(200).json(result[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

// GET request endpoints
app.get("/web/doctor-data", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    const doctorData = sql`
      SELECT * FROM doctors
      WHERE user_id = ${tokenData.user_id};
    `;

    if (doctorData.length === 0) {
      return res.status(404).json({ error: "The user does not exist" });
    }

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
      WHERE
          u.user_id = ${tokenData.user_id}
      GROUP BY
          d.name, u.email, d.contact, d.roomno, d.designation, d.qualification, d.image;
    `;
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/web/get-patients", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    const result = await sql`
      SELECT  p.patient_id, p.name, u.email, p.address, p.weight, p.blood_pressure,
              p.contact, p.blood_glucose, p.image, p.gender, p.age,
              json_agg(
                json_build_object(
                  'doctor', prescriptions.doctor,
                  'date', prescriptions.date,
                  'medication', prescriptions.medication 
                )
              ) AS prescriptions,
              soap_notes.soap_note_data AS soap_notes
      FROM  patients p
      JOIN  users u ON p.user_id = u.user_id
      LEFT JOIN (
        SELECT  pa.patient_id, d.name AS "doctor",
                TO_CHAR(ts.date, 'YYYY-Mon-DD') AS "date",
                p.prescription_data AS "medication"
        FROM prescriptions p
        JOIN appointments a ON a.appointment_id = p.appointment_id
        JOIN time_slots ts ON ts.slot_id = a.slot_id
        JOIN doctors d ON d.doctor_id = a.doctor_id
        JOIN patients pa ON pa.patient_id = a.patient_id
        JOIN users u ON u.user_id = pa.user_id
      ) AS prescriptions ON prescriptions.patient_id = p.patient_id
      LEFT JOIN (
        SELECT p.patient_id, sn.soap_note_data
        FROM soap_notes sn
        JOIN patients p ON p.patient_id = sn.patient_id
      ) AS soap_notes ON soap_notes.patient_id = p.patient_id
      GROUP BY p.patient_id, u.email, soap_notes.soap_note_data
    `;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH request endpoints
app.patch("/web/update-doctor", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    const doctorData = await sql`
      SELECT * FROM doctors
      WHERE user_id = ${tokenData.user_id};
    `;

    if (doctorData.length === 0) {
      return res.status(404).json({ error: "The user does not exist" });
    }

    const result = await sql`
      UPDATE doctors
      SET name          = ${req.body.name},
          roomno        = ${req.body.roomno},
          qualification = ${req.body.qualification},
          image         = ${req.body.image},
          designation   = ${req.body.designation},
          contact       = ${req.body.contact}
      WHERE user_id = ${tokenData.user_id}
      RETURNING *
    `;

    return res.status(200).json(result[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Doctor Backend Service is running on ${PORT}`);
});

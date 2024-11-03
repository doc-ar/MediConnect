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
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    const patientData = await sql`
      SELECT * FROM patients
      WHERE user_id = ${tokenData.user_id};
    `;
    const userData = await sql`
      SELECT * FROM users
      WHERE user_id = ${tokenData.user_id}
    `;

    if (patientData.length > 0 && patientData[0].patient_id) {
      return res.status(409).json({ error: "The user already exists" });
    }
    if (!(userData[0].role === "patient"))
      return res.status(403).json({ error: "The user is not a patient" });

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

// GET Request endpoints
app.get("/mobile/patient-data", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);

    const patientData = await sql`
      SELECT 
          u.user_id,p.patient_id,          
      u.email,p.name,p.gender,p.address,p.weight,p.blood_pressure,p.image,
          p.age,p.blood_glucose,p.contact,p.bloodtype,p.allergies,p.height
      FROM 
          users u
      JOIN 
          patients p ON p.user_id = u.user_id
      WHERE 
          u.user_id = ${tokenData.user_id};
    `;

    res.status(200).json(patientData[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/mobile/upcoming-appointments", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);

    const patientData = await sql`
      SELECT * FROM patients
      WHERE user_id = ${tokenData.user_id};
    `;

    const result = await sql`
      SELECT * FROM appointments
      WHERE patient_id = ${patientData[0].patient_id}
      AND status = 'scheduled'
    `;

    res.status(200).json(result);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/mobile/all-appointments", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);

    const patientData = await sql`
      SELECT * FROM patients
      WHERE user_id = ${tokenData.user_id};
    `;

    const result = await sql`
      SELECT * FROM appointments
      WHERE patient_id = ${patientData[0].patient_id}
    `;

    res.status(200).json(result);
  } catch (error) {
    res.json({ error: error.message });
  }
});

//app.get("/mobile/latest-prescription", authMiddleware, async (req, res) => {
//  try {
//    const authHeader = req.headers["authorization"];
//    const token = authHeader && authHeader.split(" ")[1];
//    const tokenData = jwt.decode(token);
//
//    const result = await sql`
//      SELECT appointment_id, COUNT(*)
//      FROM appointments
//      GROUP BY appointment_id
//      HAVING COUNT(*) > 1;
//    `;
//
//    //d.name AS "Doctor",
//    //TO_CHAR(ts.date, 'YYYY-Mon-DD') AS "Date",
//    //p.prescription_data AS "Medication"
//    //WHERE u.user_id = ${tokenData.user_id} AND a.status = 'scheduled'
//    //ORDER BY ts.date DESC
//    //LIMIT 1
//    res.status(200).json(result[0]);
//  } catch (error) {
//    res.json({ error: error.message });
//  }
//});

app.get("/mobile/get-doctors", authMiddleware, async (req, res) => {
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
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH Request endpoints

app.listen(PORT, () => {
  console.log(`Mobile Backend is running on port ${PORT}`);
});

import express, { json } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import jwt from "jsonwebtoken";
import { neon } from "@neondatabase/serverless";
import { authMiddleware } from "./utils/authorization.js";
import {
  cancel_appointment,
  complete_appointment,
  reschedule_appointment,
} from "./utils/update-appointment-queries.js";
import {
  getSOAPNotesFromGemini,
  getSOAPNotesFromFlask,
  getPrompt,
} from "./utils/soap-helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
const sql = neon(process.env.DATABASE_URL);
const PORT = process.env.WEB_BACKEND_PORT || 3001;
const corsOptions = { credentials: true, origin: process.env.URL || "*" };

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// POST request Endpoints
app.post("/web/create-doctor-profile", authMiddleware, async (req, res) => {
  try {
    // check if the user role is doctor
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    if (!(tokenData.role === "doctor")) {
      return res.status(403).json({ error: "The user is not a doctor" });
    }

    // check if the doctor profile already exists
    const doctorData = await sql`
      SELECT * FROM doctors
      WHERE user_id = ${tokenData.user_id};
    `;
    if (doctorData.length > 0 && doctorData[0].doctor_id) {
      return res.status(409).json({ error: "The user already exists" });
    }

    // execute query
    const result = await sql`
      INSERT INTO doctors (user_id,name,roomno,qualification,image,designation,contact)
      VALUES (${tokenData.user_id},${req.body.name},${req.body.roomno},${req.body.qualification},
              ${req.body.image},${req.body.designation},${req.body.contact})
      RETURNING *
    `;
    res.json(result[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post("/web/new-soapnote", authMiddleware, async (req, res) => {
  try {
    // check if role is doctor
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    if (!(tokenData.role === "doctor")) {
      return res.status(403).json({ error: "The user is not a doctor" });
    }

    // check if soap note doesn't already exist
    const object_exists = await sql`
      SELECT soap_note_id FROM soap_notes
      WHERE patient_id = ${req.body.patient_id}
    `;
    if (object_exists.length > 0) {
      return res.status(409).json({ error: "The soap note already exists" });
    }

    // execute query
    const result = await sql`
      INSERT INTO soap_notes (patient_id, soap_note_data)
      VALUES (${req.body.patient_id}, ${JSON.stringify(req.body.soap_note_data)})
      RETURNING *
    `;

    res.json(result[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post("/web/new-transcription", authMiddleware, async (req, res) => {
  try {
    // check if role is doctor
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    if (!(tokenData.role === "doctor")) {
      return res.status(403).json({ error: "The user is not a doctor" });
    }

    // check if the transcription already exists
    const object_exists = await sql`
      SELECT transcription_id FROM transcriptions
      WHERE appointment_id = ${req.body.appointment_id}
    `;
    if (object_exists.length > 0) {
      return res.status(409).json({ error: "The transcript already exists" });
    }

    // execute query
    const transcription = await sql`
      INSERT INTO transcriptions (appointment_id, data)
      VALUES (${req.body.appointment_id}, ${req.body.transcript})
      RETURNING *
    `;
    res.json(transcription[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post("/web/new-prescription", authMiddleware, async (req, res) => {
  try {
    // check if role is doctor
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    if (!(tokenData.role === "doctor")) {
      return res.status(403).json({ error: "The user is not a doctor" });
    }

    // check if the prescription already exists
    const object_exists = await sql`
      SELECT prescription_id FROM prescriptions
      WHERE appointment_id = ${req.body.appointment_id}
    `;
    if (object_exists.length > 0) {
      return res.status(409).json({ error: "The prescription already exists" });
    }

    // execute query
    const prescription = await sql`
      INSERT INTO prescriptions (appointment_id, prescription_data)
      VALUES (${req.body.appointment_id}, ${JSON.stringify(req.body.prescription_data)})
      RETURNING *
    `;
    res.json(prescription[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/web/doctor-data", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);

    const result = await sql`
      SELECT  d.name, u.email, d.contact, d.roomno,
              d.designation, d.qualification, d.image,
              json_agg(
                  json_build_object(
                      'date', slot_data.date,
                      'day', slot_data.day,
                      'slots', slot_data.slots
                  )
              ) AS schedule
      FROM  doctors d
      JOIN  users u ON d.user_id = u.user_id
      LEFT JOIN (
          SELECT  ts.doctor_id, ts.date, ts.day,
                  array_agg(
                      to_char(ts.start_time, 'HH:MI am') || ' - ' || to_char(ts.end_time, 'HH:MI am')
                  ) AS slots
          FROM time_slots ts
          GROUP BY  ts.doctor_id, ts.date, ts.day
      ) AS slot_data ON slot_data.doctor_id = d.doctor_id
      WHERE u.user_id = ${tokenData.user_id}
      GROUP BY d.name, u.email, d.contact, d.roomno, d.designation, d.qualification, d.image;
    `;
    res.json(result[0]);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.get("/web/get-patients", authMiddleware, async (req, res) => {
  try {
    const result = await sql`
      SELECT  p.patient_id AS patientid, p.name, u.email, p.address, p.contact,
              p.image, p.gender, p.age, p.allergies, p.weight, p.reports,
              p.blood_pressure AS bloodpressure, p.blood_glucose AS bloodglucose,
              json_agg(
                json_build_object(
                  'doctor', prescriptions.doctor,
                  'date', prescriptions.date,
                  'medication', prescriptions.medication 
                )
              ) AS prescriptions,
              soap_notes.soap_note_id,
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
        SELECT p.patient_id, sn.soap_note_id, sn.soap_note_data
        FROM soap_notes sn
        JOIN patients p ON p.patient_id = sn.patient_id
      ) AS soap_notes ON soap_notes.patient_id = p.patient_id
      GROUP BY p.patient_id, u.email, soap_notes.soap_note_data, soap_notes.soap_note_id
    `;
    return res.json(result);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.get("/web/get-patients/:id", authMiddleware, async (req, res) => {
  try {
    const result = await sql`
      SELECT  p.patient_id AS patientid, p.name, u.email, p.address, p.contact,
              p.image, p.gender, p.age, p.allergies, p.weight, p.reports,
              p.blood_pressure AS bloodpressure, p.blood_glucose AS bloodglucose,
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
        SELECT p.patient_id, sn.soap_note_id, sn.soap_note_data
        FROM soap_notes sn
        JOIN patients p ON p.patient_id = sn.patient_id
      ) AS soap_notes ON soap_notes.patient_id = p.patient_id
      WHERE p.patient_id = ${req.params.id}
      GROUP BY p.patient_id, u.email, soap_notes.soap_note_data
    `;
    return res.json(result);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.get("/web/get-appointments", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);

    const appointments = await sql`
      SELECT  a.appointment_id AS appointmentId, ts.slot_id, a.status,
              d.name AS doctorname, d.designation, d.qualification,
              d.image, d.roomno AS doctorRoom, d.contact, u.email,
              TO_CHAR(ts.date, 'YYYY-Mon-DD') AS "date", ts.day, ts.start_time AS startTime, ts.end_time AS endTime,
              p.patient_id AS patientId, p.name AS patientName, p.contact AS patientContact, patient_u.email AS patientEmail, p.address AS patientAddress
      FROM appointments a
      JOIN time_slots ts ON ts.slot_id = a.slot_id
      JOIN doctors d ON d.doctor_id = a.doctor_id
      JOIN patients p ON p.patient_id = a.patient_id
      JOIN users u ON u.user_id = d.user_id
      JOIN users patient_u ON patient_u.user_id = p.user_id
      WHERE u.user_id = ${tokenData.user_id}
    `;

    return res.json(appointments);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.get(
  "/web/get-prescriptions/:patient_id",
  authMiddleware,
  async (req, res) => {
    try {
      // Check if prescription exists
      const object_exists = sql`
      SELECT patient_id FROM patients
      WHERE patient_id = ${req.params.patient_id}
    `;
      if (object_exists.length === 0) {
        return res
          .status(409)
          .json({ error: "The patient has no prescriptions" });
      }

      // Execute Query
      const prescriptions = await sql`
      SELECT  pa.name AS "patient_name",
              TO_CHAR(ts.date, 'YYYY-Mon-DD') AS "date",
              p.prescription_data AS "medication"
      FROM prescriptions p
      JOIN appointments a ON a.appointment_id = p.appointment_id
      JOIN time_slots ts ON ts.slot_id = a.slot_id
      JOIN doctors d ON d.doctor_id = a.doctor_id
      JOIN patients pa ON pa.patient_id = a.patient_id
      JOIN users u ON u.user_id = pa.user_id
      WHERE pa.patient_id = ${req.params.patient_id}
    `;

      return res.json(prescriptions);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

app.get("/web/get-medicines", authMiddleware, async (req, res) => {
  try {
    const medicines = await sql`
      SELECT * FROM medicines
    `;
    return res.status(200).json(medicines);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/web/get-soapnotes/:patient_id", authMiddleware, async (req, res) => {
  try {
    if (!req.params.patient_id) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    const soap_notes = await sql`
      SELECT * FROM soap_notes
      WHERE patient_id = ${req.params.patient_id}
    `;

    return res.status(200).json(soap_notes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/web/generate-soap-notes", authMiddleware, async (req, res) => {
  try {
    // check if role is doctor
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    if (!(tokenData.role === "doctor")) {
      return res.status(403).json({ error: "The user is not a doctor" });
    }

    const geminiUse = req.body.geminiUse;

    if (geminiUse) {
      const patient = await sql`
        SELECT * FROM patients
        WHERE patient_id = ${req.body.patient_id}
      `;
      const prompt = getPrompt(
        patient[0].name,
        patient[0].age,
        patient[0].gender,
        req.body.transcript,
      );

      const response = await getSOAPNotesFromGemini(prompt);
      const result = {
        soap_notes: response,
        transcript: req.body.transcript,
      };
      return res.status(200).json(result);
    }

    const response = await getSOAPNotesFromFlask(req.body.transcript);
    response.transcript = req.body.transcript;
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

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

    return res.json(result[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.patch("/web/update-appointment", authMiddleware, async (req, res) => {
  try {
    if (!req.body.appointment_id || !req.body.status) {
      return res
        .status(400)
        .json({ error: "appointment_id or status is missing" });
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    if (!(tokenData.role === "doctor")) {
      return res.status(403).json({ error: "The user is not a doctor" });
    }

    let response;

    if (req.body.status === "scheduled") {
      return res
        .status(403)
        .json({ error: "Scheduling appointment not allowed" });
    } else if (req.body.status === "cancelled") {
      response = await cancel_appointment(sql, req);
    } else if (req.body.status === "rescheduled") {
      response = await reschedule_appointment(sql, req);
    } else if (req.body.status === "completed") {
      response = await complete_appointment(sql, req);
    } else {
      return res.status(400).json({ error: "Wrong Error Status" });
    }

    return res.json(response);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
});

app.patch("/web/update-soapnote", authMiddleware, async (req, res) => {
  try {
    // Check if appointment exists
    const object_exists = await sql`
      SELECT soap_note_id FROM soap_notes
      WHERE soap_note_id = ${req.body.soap_note_id};
    `;
    if (object_exists.length === 0) {
      return res.status(404).json({ error: "The soap note does not exist" });
    }

    // execute query
    const result = await sql`
      UPDATE soap_notes
      SET soap_note_data = ${JSON.stringify(req.body.soap_note_data)}
      WHERE soap_note_id = ${req.body.soap_note_id}
    `;
    return res.json(result[0]);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Doctor Backend Service is running on ${PORT}`);
});

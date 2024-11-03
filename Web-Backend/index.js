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

import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";
import { authMiddleware, currentDate } from "../utils/authorization.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "reports"); // Path to 'reports/' folder
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create directory and parents if necessary
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const sql = neon(process.env.DATABASE_URL);
const PORT = process.env.FILE_SERVER_PORT || 3004;
const corsOptions = { credentials: true, origin: process.env.URL || "*" };
const upload = multer({ storage: storage });
const app = express();

//app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use("file/reports", express.static(path.join(__dirname, "reports")));

app.post(
  "file/upload",
  authMiddleware,
  upload.single("report"),
  async (req, res) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      const tokenData = jwt.decode(token);

      if (!(tokenData.role === "patient")) {
        return res.status(403).json({ error: "The user is not a patient" });
      }

      let currentReports = patientReports[0]?.reports || [];
      const fileUrl = `https://www.mediconnect.live/file/reports/${req.file.filename}`;
      const patientReports = await sql`
        SELECT reports
        FROM patients
        WHERE user_id = ${tokenData.user_id}
      `;

      const newReport = {
        url: fileUrl,
        name: req.body.name,
        date_added: currentDate(),
      };

      currentReports.push(newReport);
      await sql`
        UPDATE patients
        SET reports = ${JSON.stringify(currentReports)}
        WHERE user_id = ${tokenData.user_id}
      `;

      res.status(201).json({
        message: "File Uploaded Successfully",
        file_url: fileUrl,
        name: req.body.name,
        upload_date: newReport.date_added,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

app.listen(PORT, () => {
  console.log(`File Server is running on port ${PORT}`);
});

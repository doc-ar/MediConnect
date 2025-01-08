import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import fs, { stat } from "fs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";
import { authMiddleware } from "./utils/authorization.js";
import { currentDate } from "./utils/date.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const reportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "reports"); // Path to 'reports/' folder
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create directory and parents if necessary
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(" ", "")}`);
  },
});

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "avatars"); // Path to 'reports/' folder
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create directory and parents if necessary
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(" ", "")}`);
  },
});

const sql = neon(process.env.DATABASE_URL);
const PORT = process.env.FILE_SERVER_PORT || 3004;
const corsOptions = { credentials: true, origin: process.env.URL || "*" };
const upload_report = multer({ storage: reportStorage });
const upload_avatar = multer({
  storage: avatarStorage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});
const app = express();

//app.use(express.json());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/file/reports", express.static(path.join(__dirname, "reports")));
app.use("/file/avatars", express.static(path.join(__dirname, "avatars")));

app.post(
  "/file/upload",
  authMiddleware,
  upload_report.single("report"),
  async (req, res) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      const tokenData = jwt.decode(token);

      if (!(tokenData.role === "patient")) {
        return res.status(403).json({ error: "The user is not a patient" });
      }

      const patientReports = await sql`
        SELECT reports
        FROM patients
        WHERE user_id = ${tokenData.user_id}
      `;
      let currentReports = patientReports[0]?.reports || [];
      const fileUrl = `https://www.mediconnect.live/file/reports/${req.file.filename}`;

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
      return res.status(500).json({ error: error.message });
    }
  },
);

app.delete("/file/delete", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const tokenData = jwt.decode(token);
    if (!(tokenData.role === "patient")) {
      return res.status(403).json({ error: "The user is not a patient" });
    }

    const file_url = req.body.file_url;
    const filename = file_url.replace(
      "https://www.mediconnect.live/file/reports/",
      "",
    );
    const file_path = path.join(__dirname, "reports", filename);
    if (!fs.existsSync(file_path)) {
      return res.status(404).json({
        error: `The file '${filename}' does not exist on the server.`,
      });
    }

    // Delete File
    fs.unlink(file_path, (err) => {
      if (err) {
        throw new Error(`Error removing file: ${err.message}`);
      }
    });

    // Retrieve the current reports from the database
    const patientReports = await sql`
      SELECT reports
      FROM patients
      WHERE user_id = ${tokenData.user_id}
    `;
    let currentReports = patientReports[0]?.reports || [];

    // Filter out the report matching the deleted file's URL
    const updatedReports = currentReports.filter(
      (report) => report.url !== file_url,
    );

    // Update the patient's reports in the database
    await sql`
      UPDATE patients
      SET reports = ${JSON.stringify(updatedReports)}
      WHERE user_id = ${tokenData.user_id}
    `;

    res.status(200).json({
      message: `The file '${filename}' was removed successfully.`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post(
  "/file/upload-avatar",
  authMiddleware,
  upload_avatar.single("avatar"),
  async (req, res) => {
    try {
      const fileUrl = `https://www.mediconnect.live/file/avatars/${req.file.filename}`;

      res.status(201).json({
        message: "Picture Uploaded Successfully",
        file_url: fileUrl,
        date_added: currentDate(),
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

app.listen(PORT, () => {
  console.log(`File Server is running on port ${PORT}`);
});

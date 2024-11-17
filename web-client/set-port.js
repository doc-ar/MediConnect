import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Retrieve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the parent .env file
const parentEnvPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: parentEnvPath });

// Retrieve WEB_CLIENT_PORT from the parent .env file, or use a default value
const port = process.env.WEB_CLIENT_PORT || 3003;

// Define the path for the React app's .env file
const reactEnvPath = path.resolve(__dirname, ".env");

// Write the PORT variable to the React app's .env file
try {
  fs.writeFileSync(reactEnvPath, `PORT=${port}\n`);
  console.log(`React PORT set to ${port} (written to ${reactEnvPath})`);
} catch (error) {
  console.error(`Failed to write React .env file: ${error.message}`);
  process.exit(1);
}

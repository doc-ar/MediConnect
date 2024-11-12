import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
dotenv.config();

const getDoctorWithScheduleQuery = (user_id) => `
  SELECT
      d.name,
      u.email,
      u.password,
      d.contact,
      d.roomno,
      d.designation,
      d.qualification,
      d.image,
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
          ts.doctor_id,
          ts.date,
          ts.day,
          array_agg(
              to_char(ts.start_time, 'HH:MI am') || ' - ' || to_char(ts.end_time, 'HH:MI am')
          ) AS slots
      FROM
          time_slots ts
      GROUP BY
          ts.doctor_id, ts.date, ts.day
  ) AS slot_data ON slot_data.doctor_id = d.doctor_id
  WHERE
      u.user_id = ${user_id}  -- Use parameter placeholder
  GROUP BY
      d.name, u.email, u.password, d.contact, d.roomno, d.designation, d.qualification, d.image;
`;

const getUserDataQuery = (user_id) => `
  SELECT * FROM users
  WHERE user_id = ${user_id};  -- Use parameter placeholder
`;

async function getDoctorDataQuery(user_id) {
  const sql = neon(process.env.DATABASE_URL);
  const doctorData = await sql`
    SELECT * FROM doctors
    WHERE user_id = ${user_id};
  `;
  console.log(doctorData);
  return process.env.DATABASE_URL;
}

export { getDoctorWithScheduleQuery, getDoctorDataQuery, getUserDataQuery };

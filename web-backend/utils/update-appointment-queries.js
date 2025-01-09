import { AppError } from "./AppErrors.js";

async function cancel_appointment(sql, req) {
  try {
    // Check if appointment exists
    const appointment = await sql`
      SELECT * FROM appointments
      WHERE appointment_id = ${req.body.appointment_id}
    `;
    if (appointment.length == 0) {
      throw new AppError("The appointment does not exist", 404);
    }

    const cancelled_appointment = await sql.transaction([
      sql`
        UPDATE appointments
        SET status = 'cancelled'
        WHERE appointment_id = ${req.body.appointment_id}
        RETURNING *
      `,
      // Make Time Slot Available
      sql`
        UPDATE time_slots
        SET availability = 'TRUE'
        WHERE slot_id = ${appointment[0].slot_id}
      `,
      sql`
        SELECT update_time_slots_availability();
      `,
    ]);
    return cancelled_appointment[0];
  } catch (error) {
    throw error;
  }
}

async function reschedule_appointment(sql, req) {
  try {
    // Check if appointment exists
    const appointment = await sql`
      SELECT * FROM appointments
      WHERE appointment_id = ${req.body.appointment_id}
    `;
    if (appointment.length == 0) {
      throw new AppError("The appointment does not exist", 404);
    }

    const rescheduled_appointment = await sql.transaction([
      // Update Appointment
      sql`
        UPDATE appointments
        SET slot_id = ${req.body.slot_id},
        status = 'rescheduled'
        WHERE appointment_id = ${req.body.appointment_id}
        RETURNING *
      `,
      // Update Old Time Slot
      sql`
        UPDATE time_slots
        SET availability = 'TRUE'
        WHERE slot_id = ${appointment[0].slot_id}
      `,
      // Update New Time Slot
      sql`
        UPDATE time_slots
        SET availability = 'FALSE',
            start_time = ${req.body.start_time},
            end_time = ${req.body.end_time},
            date = ${req.body.date}
        WHERE slot_id = ${req.body.slot_id}
      `,
      sql`
        SELECT update_time_slots_availability();
      `,
    ]);
    return rescheduled_appointment[0];
  } catch (error) {
    throw error;
  }
}

async function complete_appointment(sql, req) {
  try {
    // Check if appointment exists
    const appointment = await sql`
      SELECT * FROM appointments
      WHERE appointment_id = ${req.body.appointment_id}
    `;
    if (appointment.length == 0) {
      throw new AppError("The appointment does not exist", 404);
    }

    const completed_appointment = await sql.transaction([
      sql`
        UPDATE appointments
        SET status = 'completed'
        WHERE appointment_id = ${req.body.appointment_id}
        RETURNING *
      `,
      sql`
        SELECT update_time_slots_availability();
      `,
    ]);

    return completed_appointment[0];
  } catch (error) {
    throw error;
  }
}

export { cancel_appointment, reschedule_appointment, complete_appointment };

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  start_time: string;
  end_time: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentWithPatient extends Appointment {
  patient: {
    id: string;
    name: string;
    phone: string;
  };
}

export interface GetAppointmentsParams {
  startDate: Date;
  endDate: Date;
}


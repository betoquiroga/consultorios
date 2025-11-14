import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../services/appointment.service";
import type { GetAppointmentsParams } from "../interfaces/appointment.interface";

export function useAppointments(params: GetAppointmentsParams) {
  return useQuery({
    queryKey: ["appointments", params.startDate.toISOString(), params.endDate.toISOString()],
    queryFn: () => appointmentService.getAppointments(params),
  });
}


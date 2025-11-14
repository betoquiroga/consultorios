import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "../services/appointment.service";
import type { CreateAppointmentParams } from "../services/appointment.service";

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateAppointmentParams) =>
      appointmentService.createAppointment(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}


import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../services/doctor.service";

export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: () => doctorService.getDoctors(),
  });
}


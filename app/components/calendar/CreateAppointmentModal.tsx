import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { PatientAutocomplete } from "./PatientAutocomplete";
import type { Patient } from "../../services/patient.service";

type CreateAppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    patient_id: string;
    start_time: string;
    end_time: string;
    reason: string;
  }) => Promise<void>;
  isLoading?: boolean;
};

export function CreateAppointmentModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateAppointmentModalProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [startTime, setStartTime] = useState("");
  const [reason, setReason] = useState("");

  const endTime = useMemo(() => {
    if (startTime) {
      const start = new Date(startTime);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      return end.toISOString().slice(0, 16);
    }
    return "";
  }, [startTime]);

  const handleClose = () => {
    setSelectedPatient(null);
    setStartTime("");
    setReason("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPatient || !startTime) return;

    const start = new Date(startTime);
    const end = new Date(endTime);

    await onSubmit({
      patient_id: selectedPatient.id,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      reason,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md rounded-xl border border-gray-800 bg-gray-900/95 p-6 shadow-xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-gray-100">
          Crear Nueva Cita
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PatientAutocomplete
            value={selectedPatient}
            onChange={setSelectedPatient}
            label="Paciente"
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Fecha y Hora de Inicio
              <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-100 transition-colors duration-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Fecha y Hora de Fin
            </label>
            <input
              type="datetime-local"
              value={endTime}
              disabled
              className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Razón de la Cita
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-100 placeholder:text-gray-400 transition-colors duration-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
              placeholder="Describe la razón de la consulta..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 font-medium text-gray-200 transition-colors duration-200 hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedPatient || !startTime}
              className="flex-1 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Creando..." : "Crear Cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


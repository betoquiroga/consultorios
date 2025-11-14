import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { patientService } from "../../services/patient.service";
import type { Patient } from "../../services/patient.service";

type PatientAutocompleteProps = {
  value: Patient | null;
  onChange: (patient: Patient | null) => void;
  label: string;
  required?: boolean;
};

export function PatientAutocomplete({
  value,
  onChange,
  label,
  required = false,
}: PatientAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchPatients = async () => {
      if (searchTerm.length < 2) {
        setPatients([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await patientService.searchPatients(searchTerm);
        setPatients(results);
        setIsOpen(results.length > 0);
      } catch (error) {
        console.error("Error al buscar pacientes:", error);
        setPatients([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchPatients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSelect = (patient: Patient) => {
    onChange(patient);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-2 block text-sm font-medium text-gray-200">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={value ? `${value.name} - ${value.phone}` : searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (value) {
                onChange(null);
              }
            }}
            onFocus={() => {
              if (searchTerm.length >= 2 && patients.length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder="Buscar paciente por nombre o teléfono..."
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 pl-10 pr-10 py-2.5 text-gray-100 placeholder:text-gray-400 transition-colors duration-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            required={required}
            disabled={!!value}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {isOpen && (searchTerm.length >= 2 || patients.length > 0) && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 shadow-xl max-h-60 overflow-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">
                Buscando pacientes...
              </div>
            ) : patients.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No se encontraron pacientes
              </div>
            ) : (
              <ul className="py-1">
                {patients.map((patient) => (
                  <li key={patient.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(patient)}
                      className="w-full px-4 py-2 text-left text-gray-100 hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-400">{patient.phone}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


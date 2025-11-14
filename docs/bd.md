# 📚 Documentación de la Base de Datos – MVP Agenda Médica con Chat IA

## 1. Descripción General
El MVP utiliza Supabase como backend y se apoya en la tabla `auth.users` para gestionar a los doctores. Las tablas adicionales mantienen la estructura mínima necesaria para permitir:
- Gestión de doctores.
- Identificación de pacientes.
- Creación y administración de citas.
- Integración con un chat IA asociado a cada doctor.

Todas las claves primarias y foráneas son UUID.

## 2. Tablas del Sistema
El sistema utiliza **tres tablas principales** además de `auth.users`.

---

## 2.1. Tabla: `doctors`
Extiende la información básica del usuario que existe en `auth.users`.

**Columnas:**
- `id` (uuid, PK, FK → auth.users.id)
- `name` (text)  
- `chat_id` (uuid, UNIQUE)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz)

**Descripción:**
La fila se crea inmediatamente después de un registro exitoso del usuario en Supabase Auth. `chat_id` es usado para identificar el chat embebido por doctor.

---

## 2.2. Tabla: `patients`
Identifica pacientes por teléfono dentro del contexto de un doctor.

**Columnas:**
- `id` (uuid, PK)
- `doctor_id` (uuid, FK → doctors.id)
- `name` (text)
- `phone` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Índices:**
- `UNIQUE (doctor_id, phone)`
- `INDEX (doctor_id)`

**Descripción:**
Garantiza que un paciente no se duplique si usa el mismo teléfono con el mismo doctor.

---

## 2.3. Tabla: `appointments`
Registra todas las citas del sistema.

**Columnas:**
- `id` (uuid, PK)
- `doctor_id` (uuid, FK → doctors.id)
- `patient_id` (uuid, FK → patients.id)
- `start_time` (timestamptz)
- `end_time` (timestamptz)
- `reason` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Índices:**
- `UNIQUE (doctor_id, start_time)`
- `INDEX (doctor_id, start_time)`
- `INDEX (patient_id)`

**Descripción:**
`end_time` debe calcularse en backend sumando 30 minutos. Esta tabla contiene las reglas de disponibilidad, disponibilidad de horario y vínculo entre doctor y paciente.

---

## 3. Relaciones entre Tablas
```
auth.users (1) — (1) doctors — (N) patients — (N) appointments
```

- Un doctor es un usuario de Supabase Auth.
- Un doctor tiene varios pacientes.
- Un paciente pertenece a un solo doctor.
- Un paciente puede tener múltiples citas.

---

## 4. Validaciones que deben implementarse en Backend
La base de datos mantiene reglas básicas a través de índices únicos, pero las reglas de negocio principales deben implementarse en el backend:

- Validación de horarios: lunes a viernes, 08:00–18:00.
- Validación de intervalos de 30 minutos.
- No permitir citas duplicadas o solapadas.
- Evitar citas futuras duplicadas por paciente.
- Cálculo automático de `end_time`.

---

## 5. Reglas Importantes
- Todas las tablas usan UUID como clave primaria.
- `doctors.id` debe coincidir con `auth.users.id`.
- No se almacena contraseña ni email en tablas adicionales.
- `chat_id` también es UUID y permite identificar el chat asociado.

---

## 6. Alcance Cubierto por este Modelo
- Gestión mínima de doctores.
- Identificación confiable de pacientes.
- Agenda funcional con soporte para IA.
- Estructura escalable para futuras funciones sin romper el MVP.

---

## 7. Estado Final
Con estas tablas y relaciones, el MVP cumple con los requisitos funcionales:
- Consultar disponibilidad.
- Crear y eliminar citas.
- Validar conflictos de horario.
- Reutilizar pacientes por teléfono.
- Conectar un chat IA específico por doctor.


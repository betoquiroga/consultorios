import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: "system" | "user" | "assistant" | "function";
  content: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
};

export async function POST(request: Request) {
  try {
    const { message, doctor_id, messages: previousMessages } =
      await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "El mensaje es requerido" },
        { status: 400 }
      );
    }

    if (!doctor_id || typeof doctor_id !== "string") {
      return NextResponse.json(
        { error: "doctor_id es requerido" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no está configurada" },
        { status: 500 }
      );
    }

    const peruTimeZone = "America/Lima";
    const now = new Date();
    
    const formatter = new Intl.DateTimeFormat("es-PE", {
      timeZone: peruTimeZone,
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
    
    const parts = formatter.formatToParts(now);
    const datePart = parts.find((p) => p.type === "day")?.value;
    const monthPart = parts.find((p) => p.type === "month")?.value;
    const yearPart = parts.find((p) => p.type === "year")?.value;
    const hourPart = parts.find((p) => p.type === "hour")?.value;
    const minutePart = parts.find((p) => p.type === "minute")?.value;
    const weekdayPart = parts.find((p) => p.type === "weekday")?.value;
    
    const currentDateFormatted = `${weekdayPart}, ${datePart} de ${monthPart} de ${yearPart}`;
    const currentTimeFormatted = `${hourPart}:${minutePart}`;
    
    const currentDateISOWithTimezone = now.toISOString();

    const systemPrompt = `Eres un asistente especializado en agendar citas médicas. Tu única función es ayudar a los usuarios a programar, modificar o cancelar citas. 

FECHA Y HORA ACTUAL (Hora de Perú - UTC-5):
- Fecha actual: ${currentDateFormatted}
- Hora actual: ${currentTimeFormatted} (hora de Perú)
- Fecha ISO actual: ${currentDateISOWithTimezone}

IMPORTANTE: 
- El ID del doctor es: ${doctor_id}. Siempre usa este ID cuando llames a la función check_availability.
- El usuario está en Perú (timezone: America/Lima, UTC-5). Todas las horas que mencione están en hora peruana.
- Cuando el usuario diga "hoy", "ahora", "en este momento", etc., debes usar la fecha y hora actual en hora peruana (${currentDateISOWithTimezone}).
- Cuando el usuario diga "mañana", calcula la fecha del día siguiente a partir de la fecha actual en hora peruana.
- Cuando el usuario mencione solo una hora sin fecha (ej: "a las 10am"), asume que es para HOY a esa hora en hora peruana.
- Siempre convierte las fechas relativas a fechas absolutas usando la fecha actual como referencia.
- IMPORTANTE: Las horas que el usuario mencione están en hora peruana (UTC-5). Debes convertir las horas a UTC cuando generes el start_time en formato ISO 8601.

Cuando un usuario solicite una cita, DEBES usar la función check_availability para verificar si el doctor está disponible en el horario solicitado. 

Si el doctor está disponible:
1. Informa al usuario que el doctor está disponible en ese horario
2. PIDE al usuario su nombre completo y número de teléfono
3. Una vez que tengas el nombre y teléfono, usa la función create_appointment para crear la cita
4. Confirma al usuario que la cita ha sido agendada exitosamente

Si el doctor no está disponible, informa al usuario y sugiere otros horarios disponibles.

SI el usuario saluda, se amable. Si el usuario solicita algo fuera de este ámbito de las citas médicas, responde de manera breve y sarcástica indicando que no puedes ayudar con eso.`;

    const messages: ChatMessage[] = previousMessages || [
      { role: "system", content: systemPrompt },
    ];

    messages.push({ role: "user", content: message });

    const functions = [
      {
        name: "check_availability",
        description:
          "Verifica si el doctor está disponible en un horario específico. Usa esta función cuando el usuario solicite una cita. El doctor_id se proporciona automáticamente, solo necesitas especificar el start_time.",
        parameters: {
          type: "object",
          properties: {
            start_time: {
              type: "string",
              description:
                `La fecha y hora de inicio de la cita en formato ISO 8601 en UTC (ejemplo: 2024-01-15T15:00:00Z para las 10:00 AM hora de Perú). FECHA ACTUAL EN PERÚ: ${currentDateISOWithTimezone}. Si el usuario dice "hoy", usa la fecha actual. Si dice "mañana", usa el día siguiente. Si menciona solo una hora sin fecha, asume que es para HOY a esa hora en hora peruana. IMPORTANTE: El usuario menciona horas en hora peruana (UTC-5), así que debes sumar 5 horas para convertir a UTC. Por ejemplo, si el usuario dice "10:00 AM", eso es 10:00 AM hora de Perú = 15:00 UTC, así que usa "2024-01-15T15:00:00Z". SIEMPRE usa la fecha actual (${currentDateISOWithTimezone}) como referencia para calcular fechas relativas.`,
            },
          },
          required: ["start_time"],
        },
      },
      {
        name: "create_appointment",
        description:
          "Crea una cita médica. Usa esta función SOLO cuando ya tengas el nombre completo y teléfono del paciente, y después de haber verificado que el doctor está disponible. El doctor_id se proporciona automáticamente.",
        parameters: {
          type: "object",
          properties: {
            patient_name: {
              type: "string",
              description: "El nombre completo del paciente",
            },
            patient_phone: {
              type: "string",
              description: "El número de teléfono del paciente",
            },
            start_time: {
              type: "string",
              description:
                `La fecha y hora de inicio de la cita en formato ISO 8601 en UTC (debe ser la misma fecha que se verificó con check_availability).`,
            },
            reason: {
              type: "string",
              description:
                "La razón o motivo de la cita (opcional). Si el usuario no proporciona un motivo, puedes dejar este campo vacío.",
            },
          },
          required: ["patient_name", "patient_phone", "start_time"],
        },
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      functions,
      function_call: "auto",
    });

    const assistantMessage = completion.choices[0].message;

    if (assistantMessage.function_call) {
      const functionName = assistantMessage.function_call.name;
      const functionArgs = JSON.parse(
        assistantMessage.function_call.arguments || "{}"
      );

      if (functionName === "check_availability") {
        let startTime = functionArgs.start_time;

        const parsedDate = new Date(startTime);
        const nowDate = new Date();
        
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Fecha inválida recibida");
        }

        if (parsedDate < nowDate) {
          const todayPeru = new Date(nowDate.toLocaleString("en-US", { timeZone: peruTimeZone }));
          const parsedHours = parsedDate.getUTCHours();
          const parsedMinutes = parsedDate.getUTCMinutes();
          
          todayPeru.setUTCHours(parsedHours, parsedMinutes, 0, 0);
          startTime = todayPeru.toISOString();
        }

        const requestBody = {
          doctor_id: doctor_id,
          start_time: startTime,
        };

        const checkResponse = await fetch(
          new URL(
            "/api/appointments/check-availability",
            request.url
          ).toString(),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!checkResponse.ok) {
          throw new Error("Error al verificar disponibilidad");
        }

        const availabilityData = await checkResponse.json();

        messages.push({
          role: "assistant",
          content: assistantMessage.content || "",
          function_call: assistantMessage.function_call,
        });

        messages.push({
          role: "function",
          name: functionName,
          content: JSON.stringify(availabilityData),
        });

        const finalCompletion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages:
            messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
          functions,
          function_call: "auto",
        });

        const finalMessage = finalCompletion.choices[0].message;

        if (finalMessage.function_call) {
          const finalFunctionName = finalMessage.function_call.name;
          const finalFunctionArgs = JSON.parse(
            finalMessage.function_call.arguments || "{}"
          );

          if (finalFunctionName === "create_appointment") {
            const createRequestBody = {
              doctor_id: doctor_id,
              patient_name: finalFunctionArgs.patient_name,
              patient_phone: finalFunctionArgs.patient_phone,
              start_time: finalFunctionArgs.start_time,
              reason: finalFunctionArgs.reason || null,
            };

            const createResponse = await fetch(
              new URL("/api/appointments/create", request.url).toString(),
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(createRequestBody),
              }
            );

            if (!createResponse.ok) {
              throw new Error("Error al crear la cita");
            }

            const createData = await createResponse.json();

            messages.push({
              role: "assistant",
              content: finalMessage.content || "",
              function_call: finalMessage.function_call,
            });

            messages.push({
              role: "function",
              name: finalFunctionName,
              content: JSON.stringify(createData),
            });

            const confirmationCompletion = await openai.chat.completions.create({
              model: "gpt-4o",
              messages:
                messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
              functions,
              function_call: "auto",
            });

            const confirmationMessage =
              confirmationCompletion.choices[0].message.content ||
              "Cita creada exitosamente";

            const updatedMessages = [...messages];
            updatedMessages.push({
              role: "assistant",
              content: confirmationMessage,
            });

            return NextResponse.json({
              message: confirmationMessage,
              messages: updatedMessages,
            });
          }
        }

        const finalMessageContent =
          finalMessage.content || "No se pudo generar una respuesta";

        const updatedMessages = [...messages];
        updatedMessages.push({
          role: "assistant",
          content: finalMessageContent,
        });

        return NextResponse.json({
          message: finalMessageContent,
          messages: updatedMessages,
        });
      }

      if (functionName === "create_appointment") {
        const createRequestBody = {
          doctor_id: doctor_id,
          patient_name: functionArgs.patient_name,
          patient_phone: functionArgs.patient_phone,
          start_time: functionArgs.start_time,
          reason: functionArgs.reason || null,
        };

        const createResponse = await fetch(
          new URL("/api/appointments/create", request.url).toString(),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(createRequestBody),
          }
        );

        if (!createResponse.ok) {
          throw new Error("Error al crear la cita");
        }

        const createData = await createResponse.json();

        messages.push({
          role: "assistant",
          content: assistantMessage.content || "",
          function_call: assistantMessage.function_call,
        });

        messages.push({
          role: "function",
          name: functionName,
          content: JSON.stringify(createData),
        });

        const finalCompletion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages:
            messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
          functions,
          function_call: "auto",
        });

        const finalMessage =
          finalCompletion.choices[0].message.content ||
          "Cita creada exitosamente";

        const updatedMessages = [...messages];
        updatedMessages.push({
          role: "assistant",
          content: finalMessage,
        });

        return NextResponse.json({
          message: finalMessage,
          messages: updatedMessages,
        });
      }
    }

    const responseMessage =
      assistantMessage.content || "No se pudo generar una respuesta";

    const updatedMessages = [...messages];
    updatedMessages.push({
      role: "assistant",
      content: responseMessage,
    });

    return NextResponse.json({
      message: responseMessage,
      messages: updatedMessages,
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json(
      {
        error: "Error al procesar tu mensaje",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}


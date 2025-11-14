import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "El mensaje es requerido" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no está configurada" },
        { status: 500 }
      );
    }

    const systemPrompt =
      "Eres un asistente especializado en agendar citas médicas. Tu única función es ayudar a los usuarios a programar, modificar o cancelar citas. Si el usuario solicita algo fuera de este ámbito, responde de manera breve y sarcástica indicando que no puedes ayudar con eso.";

    const response = await openai.responses.create({
      model: "gpt-4o",
      input: message,
      instructions: systemPrompt,
    });

    const assistantMessage =
      response.output_text || "No se pudo generar una respuesta";

    return NextResponse.json({ message: assistantMessage });
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


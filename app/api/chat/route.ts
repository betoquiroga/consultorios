import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message, previous_response_id } = await request.json();

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
      "Eres un asistente especializado en agendar citas médicas. Tu única función es ayudar a los usuarios a programar, modificar o cancelar citas. SI el usuario saluda, se amable. Si el usuario solicita algo fuera de este ámbito de las citas médicas, responde de manera breve y sarcástica indicando que no puedes ayudar con eso.";

    const responseParams: {
      model: string;
      input: string;
      instructions: string;
      previous_response_id?: string;
    } = {
      model: "gpt-4o",
      input: message,
      instructions: systemPrompt,
    };

    if (previous_response_id) {
      responseParams.previous_response_id = previous_response_id;
    }

    const response = await openai.responses.create(responseParams);

    const assistantMessage =
      response.output_text || "No se pudo generar una respuesta";

    return NextResponse.json({
      message: assistantMessage,
      response_id: response.id,
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


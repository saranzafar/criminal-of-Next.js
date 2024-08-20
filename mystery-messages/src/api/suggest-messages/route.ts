import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextResponse } from "next/server";

// create an open ai client (that's edge friendly)

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

//set the runtime to edge for best performance
export const runtime = "edge"

export async function POST(request: Request) {
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as single a single string. Each question should be separated by ‘||’ these questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for diverse audience. Avoid personal are sensitive topics, focusing instead on Universal themes that encourage friendly interaction. For example, your output should be structured like this: ‘what's a hobby you have recently started? ||If you have dinner with any historical figure, who would it be? ||What’s a simple thing that make you happy?’ Ensure the questions are intriguing, foster curiosity, and contribute to positive and welcome conversational environment"

        //ask openai for streaming chat completion given the prompt
        const response = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            max_tokens: 400,
            stream: true,
            prompt,
        })

        //convert the response into afriendly text=stream
        const stream = OpenAIStream(response)
        //response with the stream
        return new StreamingTextResponse(stream)
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error
            return NextResponse.json({
                name, status, headers, message
            }, { status }
            )
        } else {
            console.error("An unepected error occured", error)
        }
    }
}

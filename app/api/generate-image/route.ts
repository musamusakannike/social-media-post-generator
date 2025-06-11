import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
    }

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required." }, { status: 400 })
    }

    // The 'predict' endpoint is designed for specific tasks like image generation.
    // We use the 'imagen-3.0-generate-002' model for this purpose.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`

    // Construct the payload for the Imagen model
    const payload = {
      instances: [{ prompt: prompt }],
      parameters: { sampleCount: 1 },
    }

    // Make the API call to Google's service
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error("Google AI API Error:", errorText)
      return NextResponse.json(
        { error: `Failed to generate image. Status: ${apiResponse.status}` },
        { status: apiResponse.status },
      )
    }

    const result = await apiResponse.json()

    // Check if the prediction and the base64 encoded image exist
    if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
      const imageUrl = result.predictions[0].bytesBase64Encoded
      // Send the base64 image data back to the client
      return NextResponse.json({ imageUrl }, { status: 200 })
    } else {
      // Handle cases where the API response structure is unexpected
      console.error("Unexpected API response structure:", result)
      return NextResponse.json({ error: "Unexpected response from image generation API." }, { status: 500 })
    }
  } catch (error) {
    console.error("Server-side error:", error)
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 })
  }
}

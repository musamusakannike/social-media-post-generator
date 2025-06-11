"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Key, Wand2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AIImageGeneratorProps {
  type: "content" | "background"
  onImageGenerated: (imageDataUrl: string) => void
  textContent?: string
}

export default function AIImageGenerator({ type, onImageGenerated, textContent }: AIImageGeneratorProps) {
  const [apiKey, setApiKey] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  const generateDefaultPrompt = () => {
    if (type === "content") {
      return `Create a modern, clean illustration related to: "${textContent}". Use vibrant colors and professional design. Style: minimal, tech-focused, high quality.`
    } else {
      return `Create an abstract background design inspired by: "${textContent}". Use gradients, geometric shapes, and modern aesthetics. Style: clean, professional, suitable as a background.`
    }
  }

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your Gemini API key.")
      return
    }

    const prompt = customPrompt.trim() || generateDefaultPrompt()

    setIsGenerating(true)
    setError("")

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, apiKey }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.imageUrl) {
        const imageDataUrl = `data:image/png;base64,${data.imageUrl}`
        onImageGenerated(imageDataUrl)
      } else {
        throw new Error("Failed to get image URL from response.")
      }
    } catch (err: any) {
      setError(err.message)
      console.error("Error generating image:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-500" />
          Generate AI {type === "content" ? "Content" : "Background"} Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need a Google AI Studio API key to generate images. Get one at{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              aistudio.google.com
            </a>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="apiKey" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Gemini API Key
          </Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="font-mono"
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="customPrompt">Custom Prompt (Optional)</Label>
          <Textarea
            id="customPrompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={generateDefaultPrompt()}
            className="h-24 resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to use an auto-generated prompt based on your text content.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !apiKey.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

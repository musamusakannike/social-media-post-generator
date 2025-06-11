"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toPng } from "html-to-image"

export default function Home() {
  const [text, setText] = useState("15 Programming Tips You NEED to Know! 💻🚀")
  const [username, setUsername] = useState("@musa_codes")
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=100&width=100")
  const [threadText, setThreadText] = useState("A thread 🧵")
  const imageRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadImage = async () => {
    if (imageRef.current) {
      try {
        const dataUrl = await toPng(imageRef.current, { quality: 0.95 })
        const link = document.createElement("a")
        link.download = `${text.substring(0, 20).replace(/\s+/g, "-")}.png`
        link.href = dataUrl
        link.click()
      } catch (error) {
        console.error("Error generating image:", error)
      }
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Social Media Post Generator</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Post Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Main Text</Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your post text"
                className="h-24"
              />
            </div>

            <div>
              <Label htmlFor="threadText">Thread Text (optional)</Label>
              <Input
                id="threadText"
                value={threadText}
                onChange={(e) => setThreadText(e.target.value)}
                placeholder="A thread 🧵"
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
              />
            </div>

            <div>
              <Label htmlFor="profileImage">Profile Picture</Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
            </div>

            <Button onClick={downloadImage} className="w-full mt-4">
              <Download className="mr-2 h-4 w-4" /> Download Image
            </Button>
          </div>
        </Card>

        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div
            ref={imageRef}
            className="w-full aspect-square bg-black text-white p-6 flex flex-col justify-between relative"
            style={{ maxWidth: "500px" }}
          >
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-2xl md:text-3xl font-bold max-w-[80%]">{text}</div>
            </div>

            {threadText && <div className="text-center mb-12">{threadText}</div>}

            <div className="absolute bottom-6 left-6 flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image
                  src={profileImage || "/placeholder.svg"}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-lg">{username}</span>
            </div>

            <div className="absolute bottom-6 right-6">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-md font-medium">Follow</button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">How to use</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Enter your main text content in the "Main Text" field</li>
          <li>Customize the thread text (optional)</li>
          <li>Enter your username</li>
          <li>Upload your profile picture</li>
          <li>Click "Download Image" to save your post as a PNG file</li>
        </ol>
      </div>
    </main>
  )
}

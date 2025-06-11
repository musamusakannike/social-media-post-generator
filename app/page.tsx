"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Download,
  ImageIcon,
  Type,
  Palette,
  Layout,
  Smile,
  X,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Bot,
  Code,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { toPng } from "html-to-image"
import dynamic from "next/dynamic"
import { templates } from "@/lib/templates"
import { cn } from "@/lib/utils"
import ColorPicker from "@/components/color-picker"
import AIImageGenerator from "@/components/ai-image-generator"

// Dynamically import EmojiPicker to avoid SSR issues
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-muted animate-pulse rounded-lg"></div>,
})

export default function Home() {
  const [postConfig, setPostConfig] = useState({
    text: "15 Programming Tips You NEED to Know! 💻🚀",
    threadText: "A thread 🧵",
    username: "@musa_codes",
    profileImage: "/placeholder.svg?height=100&width=100",
    backgroundColor: "#000000",
    backgroundImage: "",
    textColor: "#ffffff",
    fontSize: 32,
    threadFontSize: 18,
    fontFamily: "Inter",
    fontWeight: "bold",
    contentImage: "",
    contentImageSize: 200,
    imagePosition: "above", // "above" or "below"
    showContentImage: false,
    showThreadText: true,
    // Add code block properties
    codeBlock: "",
    codeLanguage: "javascript",
    codePosition: "above", // "above" or "below"
    showCodeBlock: false,
    codeTheme: "dark", // "dark" or "light"
  })

  const [activeTemplate, setActiveTemplate] = useState("default")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAIContentGenerator, setShowAIContentGenerator] = useState(false)
  const [showAIBackgroundGenerator, setShowAIBackgroundGenerator] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // Apply template with animation
  const applyTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setPostConfig({
        ...postConfig,
        ...template.config,
      })
      setActiveTemplate(templateId)
    }
  }

  // Handle emoji selection
  const handleEmojiClick = (emojiData: any) => {
    setPostConfig({
      ...postConfig,
      text: postConfig.text + emojiData.emoji,
    })
  }

  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "background" | "content") => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          if (type === "profile") {
            setPostConfig({
              ...postConfig,
              profileImage: event.target.result as string,
            })
          } else if (type === "background") {
            setPostConfig({
              ...postConfig,
              backgroundImage: event.target.result as string,
            })
          } else if (type === "content") {
            setPostConfig({
              ...postConfig,
              contentImage: event.target.result as string,
              showContentImage: true,
            })
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle AI generated images
  const handleAIImageGenerated = (imageDataUrl: string, type: "content" | "background") => {
    if (type === "content") {
      setPostConfig({
        ...postConfig,
        contentImage: imageDataUrl,
        showContentImage: true,
      })
      setShowAIContentGenerator(false)
    } else {
      setPostConfig({
        ...postConfig,
        backgroundImage: imageDataUrl,
      })
      setShowAIBackgroundGenerator(false)
    }
  }

  // Download image with loading state
  const downloadImage = async () => {
    if (imageRef.current) {
      setIsGenerating(true)
      try {
        const dataUrl = await toPng(imageRef.current, { quality: 0.95 })
        const link = document.createElement("a")
        link.download = `${postConfig.text.substring(0, 20).replace(/\s+/g, "-")}.png`
        link.href = dataUrl
        link.click()
      } catch (error) {
        console.error("Error generating image:", error)
      } finally {
        setIsGenerating(false)
      }
    }
  }

  // Update a specific config property
  const updateConfig = (key: keyof typeof postConfig, value: any) => {
    setPostConfig({
      ...postConfig,
      [key]: value,
    })
  }

  // Clear background image
  const clearBackgroundImage = () => {
    setPostConfig({
      ...postConfig,
      backgroundImage: "",
    })
  }

  // Clear content image
  const clearContentImage = () => {
    setPostConfig({
      ...postConfig,
      contentImage: "",
      showContentImage: false,
    })
  }

  // Add clear code block function
  const clearCodeBlock = () => {
    setPostConfig({
      ...postConfig,
      codeBlock: "",
      showCodeBlock: false,
    })
  }

  // Reset to default
  const resetToDefault = () => {
    const defaultTemplate = templates.find((t) => t.id === "default")
    if (defaultTemplate) {
      setPostConfig({
        ...postConfig,
        ...defaultTemplate.config,
      })
      setActiveTemplate("default")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-1000">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Social Media Post Generator
          </h1>
          <p className="text-muted-foreground">Create stunning social media posts with AI-powered images</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_500px] gap-8">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-in fade-in slide-in-from-left duration-700">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Customize Your Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="space-y-6">
                <TabsList className="grid grid-cols-5 bg-muted/50">
                  <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Layout className="mr-2 h-4 w-4" /> Templates
                  </TabsTrigger>
                  <TabsTrigger value="content" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Type className="mr-2 h-4 w-4" /> Content
                  </TabsTrigger>
                  <TabsTrigger value="style" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Palette className="mr-2 h-4 w-4" /> Style
                  </TabsTrigger>
                  <TabsTrigger
                    value="background"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" /> Background
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <ImageIcon className="mr-2 h-4 w-4" /> Profile
                  </TabsTrigger>
                </TabsList>

                {/* Templates Tab */}
                <TabsContent value="templates" className="space-y-4 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Choose a Template</h3>
                    <Button variant="outline" size="sm" onClick={resetToDefault}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {templates.map((template, index) => (
                      <div
                        key={template.id}
                        className={cn(
                          "border rounded-lg p-3 cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-105 group",
                          activeTemplate === template.id ? "border-primary ring-2 ring-primary/20 shadow-lg" : "",
                        )}
                        onClick={() => applyTemplate(template.id)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div
                          className="aspect-square mb-3 rounded-md flex items-center justify-center text-sm font-medium transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: template.config.backgroundColor,
                            color: template.config.textColor,
                            backgroundImage: template.config.backgroundImage
                              ? `url(${template.config.backgroundImage})`
                              : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {template.name}
                        </div>
                        <p className="text-xs font-medium text-center">{template.name}</p>
                        {activeTemplate === template.id && (
                          <Badge className="w-full mt-2 justify-center" variant="default">
                            Active
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label htmlFor="text" className="text-sm font-medium">
                          Main Text
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="hover:bg-yellow-50 hover:border-yellow-300">
                              <Smile className="h-4 w-4 mr-2" /> Add Emoji
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="end">
                            <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Textarea
                        id="text"
                        value={postConfig.text}
                        onChange={(e) => updateConfig("text", e.target.value)}
                        placeholder="Enter your post text"
                        className="h-24 resize-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Switch
                        id="show-thread-text"
                        checked={postConfig.showThreadText}
                        onCheckedChange={(checked) => updateConfig("showThreadText", checked)}
                      />
                      <Label htmlFor="show-thread-text" className="text-sm font-medium">
                        Show Thread Text
                      </Label>
                    </div>

                    {postConfig.showThreadText && (
                      <div className="animate-in slide-in-from-top duration-300">
                        <Label htmlFor="threadText" className="text-sm font-medium">
                          Thread Text
                        </Label>
                        <Input
                          id="threadText"
                          value={postConfig.threadText}
                          onChange={(e) => updateConfig("threadText", e.target.value)}
                          placeholder="A thread 🧵"
                          className="mt-2 focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    )}

                    <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Content Type</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={!postConfig.showCodeBlock && !postConfig.showContentImage ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setPostConfig({
                                ...postConfig,
                                showCodeBlock: false,
                                showContentImage: false,
                                codeBlock: "",
                                contentImage: "",
                              })
                            }}
                          >
                            Text Only
                          </Button>
                          <Button
                            variant={postConfig.showContentImage ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setPostConfig({
                                ...postConfig,
                                showCodeBlock: false,
                                showContentImage: true,
                                codeBlock: "",
                              })
                            }}
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Image
                          </Button>
                          <Button
                            variant={postConfig.showCodeBlock ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setPostConfig({
                                ...postConfig,
                                showContentImage: false,
                                showCodeBlock: true,
                                contentImage: "",
                              })
                            }}
                          >
                            <Code className="h-4 w-4 mr-2" />
                            Code
                          </Button>
                        </div>
                      </div>

                      {/* Image Content Section */}
                      {postConfig.showContentImage && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="contentImage" className="text-sm font-medium">
                              Content Image
                            </Label>
                            {postConfig.contentImage && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearContentImage}
                                className="hover:bg-red-50 hover:text-red-600"
                              >
                                <X className="h-4 w-4 mr-2" /> Clear
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              id="contentImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, "content")}
                              className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <Button
                              variant="outline"
                              onClick={() => setShowAIContentGenerator(true)}
                              className="hover:bg-purple-50 hover:border-purple-300"
                            >
                              <Bot className="h-4 w-4 mr-2" />
                              Generate with AI
                            </Button>
                          </div>

                          {postConfig.contentImage && (
                            <div className="space-y-4">
                              <div
                                className="relative w-full bg-muted rounded-lg overflow-hidden"
                                style={{ height: `${postConfig.contentImageSize}px` }}
                              >
                                <Image
                                  src={postConfig.contentImage || "/placeholder.svg"}
                                  alt="Content preview"
                                  fill
                                  className="object-contain"
                                />
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <Label className="text-sm font-medium">Image Size</Label>
                                  <div className="flex items-center gap-4 mt-2">
                                    <Slider
                                      min={100}
                                      max={400}
                                      step={10}
                                      value={[postConfig.contentImageSize]}
                                      onValueChange={(value) => updateConfig("contentImageSize", value[0])}
                                      className="flex-1"
                                    />
                                    <span className="w-16 text-center text-sm font-mono">
                                      {postConfig.contentImageSize}px
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Image Position</Label>
                                  <div className="flex gap-2 mt-2">
                                    <Button
                                      variant={postConfig.imagePosition === "above" ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => updateConfig("imagePosition", "above")}
                                      className="flex-1"
                                    >
                                      <ArrowUp className="h-4 w-4 mr-2" />
                                      Above Text
                                    </Button>
                                    <Button
                                      variant={postConfig.imagePosition === "below" ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => updateConfig("imagePosition", "below")}
                                      className="flex-1"
                                    >
                                      <ArrowDown className="h-4 w-4 mr-2" />
                                      Below Text
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Code Block Section */}
                      {postConfig.showCodeBlock && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="codeBlock" className="text-sm font-medium">
                              Code Block
                            </Label>
                            {postConfig.codeBlock && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateConfig("codeBlock", "")}
                                className="hover:bg-red-50 hover:text-red-600"
                              >
                                <X className="h-4 w-4 mr-2" /> Clear
                              </Button>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground">Language</Label>
                                <Select
                                  value={postConfig.codeLanguage}
                                  onValueChange={(value) => updateConfig("codeLanguage", value)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="javascript">JavaScript</SelectItem>
                                    <SelectItem value="typescript">TypeScript</SelectItem>
                                    <SelectItem value="python">Python</SelectItem>
                                    <SelectItem value="java">Java</SelectItem>
                                    <SelectItem value="cpp">C++</SelectItem>
                                    <SelectItem value="html">HTML</SelectItem>
                                    <SelectItem value="css">CSS</SelectItem>
                                    <SelectItem value="sql">SQL</SelectItem>
                                    <SelectItem value="bash">Bash</SelectItem>
                                    <SelectItem value="json">JSON</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground">Theme</Label>
                                <Select
                                  value={postConfig.codeTheme}
                                  onValueChange={(value) => updateConfig("codeTheme", value)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <Textarea
                              id="codeBlock"
                              value={postConfig.codeBlock}
                              onChange={(e) => updateConfig("codeBlock", e.target.value)}
                              placeholder={`// Enter your ${postConfig.codeLanguage} code here
function example() {
  console.log("Hello, World!");
}`}
                              className="h-32 resize-none font-mono text-sm"
                            />

                            {postConfig.codeBlock && (
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-sm font-medium">Code Position</Label>
                                  <div className="flex gap-2 mt-2">
                                    <Button
                                      variant={postConfig.codePosition === "above" ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => updateConfig("codePosition", "above")}
                                      className="flex-1"
                                    >
                                      <ArrowUp className="h-4 w-4 mr-2" />
                                      Above Text
                                    </Button>
                                    <Button
                                      variant={postConfig.codePosition === "below" ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => updateConfig("codePosition", "below")}
                                      className="flex-1"
                                    >
                                      <ArrowDown className="h-4 w-4 mr-2" />
                                      Below Text
                                    </Button>
                                  </div>
                                </div>

                                <div className="p-3 rounded-lg border bg-muted/30">
                                  <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                                  <div
                                    className={`p-3 rounded text-xs font-mono overflow-x-auto ${
                                      postConfig.codeTheme === "dark"
                                        ? "bg-gray-900 text-gray-100"
                                        : "bg-gray-100 text-gray-900"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                                      <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                      </div>
                                      <span>{postConfig.codeLanguage}</span>
                                    </div>
                                    <pre className="whitespace-pre-wrap">{postConfig.codeBlock}</pre>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Style Tab */}
                <TabsContent value="style" className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
                      <Label htmlFor="textColor" className="text-sm font-medium">
                        Text Color
                      </Label>
                      <div className="mt-2">
                        <ColorPicker
                          color={postConfig.textColor}
                          onChange={(color) => updateConfig("textColor", color)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="fontSize" className="text-sm font-medium">
                        Main Text Size
                      </Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          id="fontSize"
                          min={16}
                          max={64}
                          step={1}
                          value={[postConfig.fontSize]}
                          onValueChange={(value) => updateConfig("fontSize", value[0])}
                          className="flex-1"
                        />
                        <span className="w-16 text-center font-mono text-sm">{postConfig.fontSize}px</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="threadFontSize" className="text-sm font-medium">
                        Thread Text Size
                      </Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          id="threadFontSize"
                          min={12}
                          max={32}
                          step={1}
                          value={[postConfig.threadFontSize]}
                          onValueChange={(value) => updateConfig("threadFontSize", value[0])}
                          className="flex-1"
                        />
                        <span className="w-16 text-center font-mono text-sm">{postConfig.threadFontSize}px</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="fontFamily" className="text-sm font-medium">
                        Font Family
                      </Label>
                      <Select
                        value={postConfig.fontFamily}
                        onValueChange={(value) => updateConfig("fontFamily", value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Verdana">Verdana</SelectItem>
                          <SelectItem value="monospace">Monospace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="fontWeight" className="text-sm font-medium">
                        Font Weight
                      </Label>
                      <Select
                        value={postConfig.fontWeight}
                        onValueChange={(value) => updateConfig("fontWeight", value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select weight" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Background Tab */}
                <TabsContent value="background" className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                      <Label htmlFor="backgroundColor" className="text-sm font-medium">
                        Background Color
                      </Label>
                      <div className="mt-2">
                        <ColorPicker
                          color={postConfig.backgroundColor}
                          onChange={(color) => updateConfig("backgroundColor", color)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="backgroundImage" className="text-sm font-medium">
                          Background Image
                        </Label>
                        {postConfig.backgroundImage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearBackgroundImage}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-4 w-4 mr-2" /> Clear
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          id="backgroundImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "background")}
                          className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setShowAIBackgroundGenerator(true)}
                          className="hover:bg-purple-50 hover:border-purple-300"
                        >
                          <Bot className="h-4 w-4 mr-2" />
                          Generate with AI
                        </Button>
                      </div>

                      {postConfig.backgroundImage && (
                        <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden animate-in fade-in duration-500">
                          <Image
                            src={postConfig.backgroundImage || "/placeholder.svg"}
                            alt="Background preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="username" className="text-sm font-medium">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={postConfig.username}
                        onChange={(e) => updateConfig("username", e.target.value)}
                        placeholder="@username"
                        className="mt-2 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="profileImage" className="text-sm font-medium">
                        Profile Picture
                      </Label>
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "profile")}
                        className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                      <div className="flex items-center p-3 bg-muted/30 rounded-lg">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted mr-3">
                          <Image
                            src={postConfig.profileImage || "/placeholder.svg"}
                            alt="Profile preview"
                            fill
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">Profile picture preview</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              <Button
                onClick={downloadImage}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center animate-in fade-in slide-in-from-right duration-700">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-semibold">Live Preview</h2>
              <Badge variant="secondary" className="animate-pulse">
                Live
              </Badge>
            </div>
            <div
              ref={imageRef}
              className="w-full aspect-square p-6 flex flex-col justify-between relative shadow-2xl rounded-lg overflow-hidden transition-all duration-500 hover:shadow-3xl"
              style={{
                backgroundColor: postConfig.backgroundColor,
                backgroundImage: postConfig.backgroundImage ? `url(${postConfig.backgroundImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: postConfig.textColor,
                maxWidth: "500px",
              }}
            >
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                {/* Code Block Above */}
                {postConfig.codePosition === "above" && postConfig.showCodeBlock && postConfig.codeBlock && (
                  <div className="w-full max-w-[85%] animate-in fade-in duration-500">
                    <div
                      className={`p-4 rounded-lg text-xs font-mono overflow-x-auto ${
                        postConfig.codeTheme === "dark"
                          ? "bg-gray-900 text-gray-100 border border-gray-700"
                          : "bg-gray-100 text-gray-900 border border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3 text-xs opacity-70">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <span>{postConfig.codeLanguage}</span>
                      </div>
                      <pre className="whitespace-pre-wrap text-xs leading-relaxed">{postConfig.codeBlock}</pre>
                    </div>
                  </div>
                )}

                {/* Image Above */}
                {postConfig.imagePosition === "above" && postConfig.showContentImage && postConfig.contentImage && (
                  <div
                    className="animate-in fade-in duration-500"
                    style={{ maxHeight: `${postConfig.contentImageSize}px` }}
                  >
                    <img
                      src={postConfig.contentImage || "/placeholder.svg"}
                      alt="Content"
                      style={{ maxHeight: `${postConfig.contentImageSize}px`, maxWidth: "100%" }}
                      className="object-contain"
                    />
                  </div>
                )}

                <div
                  className="text-center max-w-[85%] transition-all duration-300"
                  style={{
                    fontSize: `${postConfig.fontSize}px`,
                    fontFamily: postConfig.fontFamily,
                    fontWeight: postConfig.fontWeight,
                  }}
                >
                  {postConfig.text}
                </div>

                {/* Image Below */}
                {postConfig.imagePosition === "below" && postConfig.showContentImage && postConfig.contentImage && (
                  <div
                    className="animate-in fade-in duration-500"
                    style={{ maxHeight: `${postConfig.contentImageSize}px` }}
                  >
                    <img
                      src={postConfig.contentImage || "/placeholder.svg"}
                      alt="Content"
                      style={{ maxHeight: `${postConfig.contentImageSize}px`, maxWidth: "100%" }}
                      className="object-contain"
                    />
                  </div>
                )}

                {/* Code Block Below */}
                {postConfig.codePosition === "below" && postConfig.showCodeBlock && postConfig.codeBlock && (
                  <div className="w-full max-w-[85%] animate-in fade-in duration-500">
                    <div
                      className={`p-4 rounded-lg text-xs font-mono overflow-x-auto ${
                        postConfig.codeTheme === "dark"
                          ? "bg-gray-900 text-gray-100 border border-gray-700"
                          : "bg-gray-100 text-gray-900 border border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3 text-xs opacity-70">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <span>{postConfig.codeLanguage}</span>
                      </div>
                      <pre className="whitespace-pre-wrap text-xs leading-relaxed">{postConfig.codeBlock}</pre>
                    </div>
                  </div>
                )}
              </div>

              {postConfig.showThreadText && postConfig.threadText && (
                <div
                  className="text-center mb-12 transition-all duration-300"
                  style={{ fontSize: `${postConfig.threadFontSize}px` }}
                >
                  {postConfig.threadText}
                </div>
              )}

              <div className="absolute bottom-6 left-6 flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3 ring-2 ring-white/20">
                  <Image
                    src={postConfig.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-base">{postConfig.username}</span>
              </div>

              <div className="absolute bottom-6 right-6">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">How to Use This Tool</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Getting Started</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>Choose a template or start from scratch</li>
                    <li>Enter your main text content</li>
                    <li>Add emojis using the emoji picker</li>
                    <li>Upload images or generate them with AI</li>
                  </ol>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">AI Image Generation</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>Get a free Gemini API key from Google AI Studio</li>
                    <li>Click "Generate with AI" for content or background</li>
                    <li>Customize prompts or use auto-generated ones</li>
                    <li>Download your finished post</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Image Generator Modals */}
        {showAIContentGenerator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Generate Content Image</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAIContentGenerator(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <AIImageGenerator
                  type="content"
                  textContent={postConfig.text}
                  onImageGenerated={(imageUrl) => handleAIImageGenerated(imageUrl, "content")}
                />
              </div>
            </div>
          </div>
        )}

        {showAIBackgroundGenerator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Generate Background Image</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAIBackgroundGenerator(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <AIImageGenerator
                  type="background"
                  textContent={postConfig.text}
                  onImageGenerated={(imageUrl) => handleAIImageGenerated(imageUrl, "background")}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

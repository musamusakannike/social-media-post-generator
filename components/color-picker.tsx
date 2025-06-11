"use client"

import type React from "react"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// Dynamically import the color picker to avoid SSR issues
const HexColorPicker = dynamic(() => import("react-colorful").then((mod) => mod.HexColorPicker), { ssr: false })

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(color)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Only update if it's a valid hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      onChange(value)
    }
  }

  const handleColorChange = (newColor: string) => {
    setInputValue(newColor)
    onChange(newColor)
  }

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[40px] p-0 flex-shrink-0"
            style={{ backgroundColor: color }}
            aria-label="Pick a color"
          >
            <span className="sr-only">Pick a color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <HexColorPicker color={color} onChange={handleColorChange} />
        </PopoverContent>
      </Popover>

      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder="#000000"
        className={cn(
          "font-mono",
          !/^#([0-9A-F]{3}){1,2}$/i.test(inputValue) && inputValue !== "" ? "border-red-500" : "",
        )}
      />
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link, CheckCircle } from "lucide-react"

interface VideoUploadProps {
  onVideoSelect: (videoUrl: string) => void
  currentVideo?: string
}

export function VideoUpload({ onVideoSelect, currentVideo }: VideoUploadProps) {
  const [videoUrl, setVideoUrl] = useState(currentVideo || "")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      onVideoSelect(url)
    }
  }

  const handleUrlSubmit = () => {
    if (videoUrl.trim()) {
      onVideoSelect(videoUrl.trim())
    }
  }

  return (
    <Card className="bg-[#343434]/50 border-[#343434]">
      <CardHeader>
        <CardTitle className="text-white">Configurar Video Preview</CardTitle>
        <CardDescription className="text-gray-300">
          Sube tu video o proporciona una URL para el preview del programa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#343434]">
            <TabsTrigger
              value="upload"
              className="text-white data-[state=active]:bg-[#69d9d7] data-[state=active]:text-black"
            >
              <Upload size={16} className="mr-2" />
              Subir Archivo
            </TabsTrigger>
            <TabsTrigger
              value="url"
              className="text-white data-[state=active]:bg-[#69d9d7] data-[state=active]:text-black"
            >
              <Link size={16} className="mr-2" />
              URL del Video
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-file" className="text-white">
                Seleccionar archivo de video
              </Label>
              <Input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="bg-[#343434]/50 border-[#343434] text-white file:bg-[#69d9d7] file:text-black file:border-0 file:rounded file:px-4 file:py-2 file:mr-4"
              />
              {uploadedFile && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle size={16} />
                  Archivo cargado: {uploadedFile.name}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-url" className="text-white">
                URL del video
              </Label>
              <div className="flex gap-2">
                <Input
                  id="video-url"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://ejemplo.com/mi-video.mp4"
                  className="bg-[#343434]/50 border-[#343434] text-white placeholder:text-gray-400"
                />
                <Button onClick={handleUrlSubmit} className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black">
                  Aplicar
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

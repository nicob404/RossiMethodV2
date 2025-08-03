"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 border-none bg-transparent">
        <div className="relative w-full pt-[56.25%]">
          {" "}
          {/* 16:9 Aspect Ratio */}
          {videoUrl.includes("youtube.com/embed") || videoUrl.includes("vimeo.com/video") ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={videoUrl}
              title="Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video className="absolute top-0 left-0 w-full h-full rounded-lg" controls autoPlay src={videoUrl}>
              Tu navegador no soporta el tag de video.
            </video>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

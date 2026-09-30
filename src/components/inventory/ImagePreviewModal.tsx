import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ImagePreviewModalProps {
  previewImage: { url: string; name: string; tag: string } | null
  onClose: () => void
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  previewImage,
  onClose,
}) => {
  return (
    <Dialog open={!!previewImage} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-background border border-border">
        {previewImage && (
          <div>
            <div className="aspect-4/3 w-full bg-black overflow-hidden flex items-center justify-center">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 flex items-center justify-between bg-card border-t border-border">
              <div>
                <h3 className="font-bold text-sm text-foreground">{previewImage.name}</h3>
                <span className="font-mono text-xs text-muted-foreground">{previewImage.tag}</span>
              </div>
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

import React, { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import { useApp } from '@/context/AppContext'
import { Shuffle, Sparkles, Scissors, X } from 'lucide-react'

interface MixingChooserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const MixingChooserDialog: React.FC<MixingChooserDialogProps> = ({ open, onOpenChange }) => {
  const { setCurrentPage, setActiveMixingSubtype } = useApp()

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      const key = e.key.toUpperCase()
      if (key === 'C') {
        e.preventDefault()
        setActiveMixingSubtype('carat_changer')
        setCurrentPage('mixing')
        onOpenChange(false)
      } else if (key === 'M') {
        e.preventDefault()
        setActiveMixingSubtype('mixing')
        setCurrentPage('mixing')
        onOpenChange(false)
      } else if (key === 'K') {
        e.preventDefault()
        setActiveMixingSubtype('cutting')
        setCurrentPage('mixing')
        onOpenChange(false)
      } else if (key === 'ESCAPE') {
        onOpenChange(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, setCurrentPage, setActiveMixingSubtype, onOpenChange])

  const selectOption = (type: 'mixing' | 'carat_changer' | 'cutting') => {
    setActiveMixingSubtype(type)
    setCurrentPage('mixing')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 bg-zinc-900 text-white border-amber-600/50 shadow-2xl">
        <DialogHeader className="border-b border-zinc-800 pb-3">
          <DialogTitle className="text-center font-serif text-lg font-bold text-amber-400 tracking-wider">
            GOLD ALLOY & CARAT CHANGER MENU
          </DialogTitle>
          <p className="text-center text-xs text-zinc-400 mt-1">
            Press the shortcut key or click an option below:
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2.5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => selectOption('carat_changer')}
            className="h-14 justify-between bg-zinc-800/80 hover:bg-amber-950/50 border-zinc-700 hover:border-amber-500 text-white px-4 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-zinc-100">Carat Changer</div>
                <div className="text-[11px] text-zinc-400">Convert gold weight from one Karat to another</div>
              </div>
            </div>
            <HotkeyHint hotkey="C" className="bg-amber-500 text-zinc-950 border-0 font-bold px-2 py-0.5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => selectOption('mixing')}
            className="h-14 justify-between bg-zinc-800/80 hover:bg-amber-950/50 border-zinc-700 hover:border-amber-500 text-white px-4 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                <Shuffle className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-zinc-100">Mixing PAT (Alloy Addition)</div>
                <div className="text-[11px] text-zinc-400">Calculate Copper/Silver/Cadmium mix ratios</div>
              </div>
            </div>
            <HotkeyHint hotkey="M" className="bg-amber-500 text-zinc-950 border-0 font-bold px-2 py-0.5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => selectOption('cutting')}
            className="h-14 justify-between bg-zinc-800/80 hover:bg-amber-950/50 border-zinc-700 hover:border-amber-500 text-white px-4 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                <Scissors className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-zinc-100">Mixing CUT (Cutting Mail)</div>
                <div className="text-[11px] text-zinc-400">Alloy reduction and impurity deductions</div>
              </div>
            </div>
            <HotkeyHint hotkey="K" className="bg-amber-500 text-zinc-950 border-0 font-bold px-2 py-0.5" />
          </Button>
        </div>

        <div className="text-center pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
          <X className="h-3.5 w-3.5" />
          <span>Press <strong>Esc</strong> to close without changes</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

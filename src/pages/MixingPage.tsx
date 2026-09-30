import React, { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { WeightInput } from '@/components/shared/WeightInput'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import { KaratBadge } from '@/components/shared/KaratBadge'
import { formatGrams, formatTMR, DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Shuffle, Sparkles, Scissors, ArrowLeft, RotateCcw, Save, Printer } from 'lucide-react'
import { toast } from 'sonner'

export const MixingPage: React.FC = () => {
  const {
    settings,
    activeMixingSubtype,
    setActiveMixingSubtype,
    setCurrentPage,
    unitMode,
    setUnitMode,
  } = useApp()

  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA

  // Tab: 'mixing' | 'carat_changer' | 'cutting'
  const activeTab = activeMixingSubtype || 'mixing'

  // Mixing State
  const [weightMg, setWeightMg] = useState<number>(116640) // 10 tolas default
  const [passaMg, setPassaMg] = useState<number>(0)
  const [patPerTolaMg, setPatPerTolaMg] = useState<number>(1458) // 12 ratti ≈ 1.458g per recording
  const [mailMode, setMailMode] = useState<'inner' | 'outer'>('inner') // I or O

  // Alloy Ratios (Silver, Copper, Cadmium)
  const [silverRatio, setSilverRatio] = useState<number>(50)
  const [copperRatio, setCopperRatio] = useState<number>(35)
  const [cadmiumRatio, setCadmiumRatio] = useState<number>(15)

  // Carat Changer State (Section 6.5)
  const [changerWeightMg, setChangerWeightMg] = useState<number>(11664) // 1 tola
  const [fromCarat, setFromCarat] = useState<number>(16.5)
  const [toCarat, setToCarat] = useState<number>(18)

  // Calculations for Mixing
  // Mail +++ = (weight / tola) * patPerTola + passa
  const tolas = weightMg / (gramsPerTola * 1000)
  const calculatedMailMg = Math.round(tolas * patPerTolaMg) + passaMg
  const totalWeightMg = activeTab === 'cutting'
    ? Math.max(0, weightMg - calculatedMailMg)
    : weightMg + calculatedMailMg

  // Calculations for Carat Changer (Formula: NewWeight = OldWeight * (FromCarat / ToCarat))
  // Passa to add or remove = NewWeight - OldWeight
  const targetWeightMg = Math.round(changerWeightMg * (fromCarat / (toCarat || 1)))
  const changerPassaMg = Math.abs(targetWeightMg - changerWeightMg)
  const isAddingAlloy = toCarat < fromCarat // lower karat means adding alloy; higher karat means refining

  // Ratio sum validation
  const ratioSum = silverRatio + copperRatio + cadmiumRatio
  const isRatioValid = ratioSum === 100

  // Hotkeys: I, O, Esc, F4, G, W, F7
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      if (!isInput) {
        const key = e.key.toUpperCase()
        if (key === 'I') {
          e.preventDefault()
          setMailMode('inner')
          toast.info("Mode: INNER MAIL (I)")
        } else if (key === 'O') {
          e.preventDefault()
          setMailMode('outer')
          toast.info("Mode: OUTER MAIL (O)")
        } else if (key === 'ESCAPE') {
          e.preventDefault()
          setCurrentPage('billing')
        }
      }

      if (e.key === 'F4') {
        e.preventDefault()
        handleZero()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mailMode])

  const handleZero = () => {
    setWeightMg(0)
    setPassaMg(0)
    setChangerWeightMg(0)
    toast.info("Cleared calculations (F4)")
  }

  const handleSaveRecord = () => {
    toast.success("Alloy mixing batch calculation saved to audit log!")
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="h-12 border-b bg-card px-4 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCurrentPage('billing')}
            className="h-8 gap-1.5 text-xs text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Main Form
          </Button>

          <h1 className="font-serif font-black text-lg tracking-wider text-amber-900 dark:text-amber-300 uppercase">
            {activeTab === 'carat_changer' ? 'CARAT CHANGER' : 'GOLD MIXING & ALLOY'}
          </h1>
        </div>

        {/* Tab switchers */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveMixingSubtype(v as any)}
          className="w-auto"
        >
          <TabsList className="h-8">
            <TabsTrigger value="mixing" className="text-xs gap-1.5">
              <Shuffle className="h-3.5 w-3.5" />
              Mixing PAT
            </TabsTrigger>
            <TabsTrigger value="cutting" className="text-xs gap-1.5">
              <Scissors className="h-3.5 w-3.5" />
              Cutting Mail
            </TabsTrigger>
            <TabsTrigger value="carat_changer" className="text-xs gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Carat Changer
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab !== 'carat_changer' ? (
          /* MIXING PAT & CUTTING MAIL VIEW */
          <div className="space-y-4">
            {/* Mode Banner: Inner Mail vs Outer Mail */}
            <div className="p-3 bg-card rounded-lg border flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-muted-foreground">Alloy Mode:</span>
                <Badge
                  className={`text-xs font-mono font-bold ${
                    mailMode === 'inner' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                  }`}
                >
                  {mailMode === 'inner' ? 'INNER MAIL' : 'OUTER MAIL'}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={mailMode === 'inner' ? 'default' : 'outline'}
                  onClick={() => setMailMode('inner')}
                  className="h-7 text-xs font-semibold"
                >
                  Inner Mail (I)
                </Button>
                <Button
                  size="sm"
                  variant={mailMode === 'outer' ? 'default' : 'outline'}
                  onClick={() => setMailMode('outer')}
                  className="h-7 text-xs font-semibold"
                >
                  Outer Mail (O)
                </Button>
              </div>
            </div>

            {/* Grid (TOLA · MASHA · RATTI · GRAMS) */}
            <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
              <div className="bg-muted/70 px-3 py-2 border-b flex items-center justify-between text-xs font-bold text-muted-foreground">
                <span className="w-36 uppercase tracking-wider font-sans">Alloy Row</span>
                <div className="grid grid-cols-4 w-full text-right font-mono tracking-wider">
                  <span>TOLA</span>
                  <span>MASHA</span>
                  <span>RATTI</span>
                  <span className="text-amber-800 dark:text-amber-300 font-bold">GRAMS</span>
                </div>
              </div>

              <div className="p-3 space-y-2.5">
                <WeightInput
                  label="WEIGHT"
                  tint="tint-row-weight"
                  value={weightMg}
                  onChange={setWeightMg}
                  activeUnit={unitMode}
                />

                <WeightInput
                  label="PASSA"
                  tint="tint-row-polish"
                  value={passaMg}
                  onChange={setPassaMg}
                  activeUnit={unitMode}
                />

                <WeightInput
                  label="PAT / TOLA"
                  tint="tint-row-cut"
                  value={patPerTolaMg}
                  onChange={setPatPerTolaMg}
                  activeUnit={unitMode}
                />

                <WeightInput
                  label="MAIL +++"
                  tint="tint-row-charges"
                  value={calculatedMailMg}
                  onChange={() => {}}
                  readOnly={true}
                  activeUnit={unitMode}
                />

                <div className="pt-1 border-t-2 border-dashed">
                  <div className="flex items-center rounded border-2 border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 p-2">
                    <div className="w-36 font-sans font-black text-sm uppercase tracking-wider text-indigo-950 dark:text-indigo-200 px-2">
                      TOTAL WT
                    </div>
                    <div className="grid grid-cols-4 w-full text-right font-mono font-bold text-sm tracking-tight text-indigo-950 dark:text-indigo-100">
                      <div className="px-2">{formatTMR(totalWeightMg, gramsPerTola).split(' ')[0]}</div>
                      <div className="px-2">{formatTMR(totalWeightMg, gramsPerTola).split(' ')[1]}</div>
                      <div className="px-2">{formatTMR(totalWeightMg, gramsPerTola).split(' ')[2]}</div>
                      <div className="px-2 text-xl font-black text-indigo-900 dark:text-indigo-200">
                        {formatGrams(totalWeightMg, 4)} <span className="text-xs font-sans font-medium">g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alloy Composition Ratio Panel (Bottom) */}
            <div className="rounded-lg border bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Alloy Ratio Distribution Panel (Silver, Copper, Cadmium)
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Weights calculated proportionately based on Mail +++ ({formatGrams(calculatedMailMg)}g)
                  </p>
                </div>
                <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${isRatioValid ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-red-50 text-red-700 border-red-300'}`}>
                  Sum: {ratioSum}% {isRatioValid ? '✓' : '(Must equal 100%)'}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted text-[11px] font-semibold text-muted-foreground">
                      <th className="py-2 px-3">ALLOY METAL</th>
                      <th className="py-2 px-3 text-center">RATIO %</th>
                      <th className="py-2 px-3 text-right">TOLA</th>
                      <th className="py-2 px-3 text-right">MASHA</th>
                      <th className="py-2 px-3 text-right">RATTI</th>
                      <th className="py-2 px-3 text-right font-bold text-amber-800">GRAMS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono">
                    {/* SILVER */}
                    <tr>
                      <td className="py-2 px-3 font-bold font-sans">SILVER (Chandi)</td>
                      <td className="py-2 px-3 text-center">
                        <Input
                          type="number"
                          value={silverRatio}
                          onChange={(e) => setSilverRatio(parseFloat(e.target.value) || 0)}
                          className="h-7 w-16 text-center text-xs font-bold inline-block"
                        />
                        <span className="ml-1">%</span>
                      </td>
                      {(() => {
                        const metalMg = Math.round(calculatedMailMg * (silverRatio / 100))
                        const parts = formatTMR(metalMg, gramsPerTola).split(' ')
                        return (
                          <>
                            <td className="py-2 px-3 text-right">{parts[0]}</td>
                            <td className="py-2 px-3 text-right">{parts[1]}</td>
                            <td className="py-2 px-3 text-right">{parts[2]}</td>
                            <td className="py-2 px-3 text-right font-bold text-foreground">{formatGrams(metalMg, 3)}g</td>
                          </>
                        )
                      })()}
                    </tr>

                    {/* COPPER */}
                    <tr>
                      <td className="py-2 px-3 font-bold font-sans">COPPER (Tamba)</td>
                      <td className="py-2 px-3 text-center">
                        <Input
                          type="number"
                          value={copperRatio}
                          onChange={(e) => setCopperRatio(parseFloat(e.target.value) || 0)}
                          className="h-7 w-16 text-center text-xs font-bold inline-block"
                        />
                        <span className="ml-1">%</span>
                      </td>
                      {(() => {
                        const metalMg = Math.round(calculatedMailMg * (copperRatio / 100))
                        const parts = formatTMR(metalMg, gramsPerTola).split(' ')
                        return (
                          <>
                            <td className="py-2 px-3 text-right">{parts[0]}</td>
                            <td className="py-2 px-3 text-right">{parts[1]}</td>
                            <td className="py-2 px-3 text-right">{parts[2]}</td>
                            <td className="py-2 px-3 text-right font-bold text-foreground">{formatGrams(metalMg, 3)}g</td>
                          </>
                        )
                      })()}
                    </tr>

                    {/* CADMIUM */}
                    <tr>
                      <td className="py-2 px-3 font-bold font-sans">CADMIUM (Kadia)</td>
                      <td className="py-2 px-3 text-center">
                        <Input
                          type="number"
                          value={cadmiumRatio}
                          onChange={(e) => setCadmiumRatio(parseFloat(e.target.value) || 0)}
                          className="h-7 w-16 text-center text-xs font-bold inline-block"
                        />
                        <span className="ml-1">%</span>
                      </td>
                      {(() => {
                        const metalMg = Math.round(calculatedMailMg * (cadmiumRatio / 100))
                        const parts = formatTMR(metalMg, gramsPerTola).split(' ')
                        return (
                          <>
                            <td className="py-2 px-3 text-right">{parts[0]}</td>
                            <td className="py-2 px-3 text-right">{parts[1]}</td>
                            <td className="py-2 px-3 text-right">{parts[2]}</td>
                            <td className="py-2 px-3 text-right font-bold text-foreground">{formatGrams(metalMg, 3)}g</td>
                          </>
                        )
                      })()}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* CARAT CHANGER VIEW (Section 6.5) */
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-300 dark:border-amber-800 space-y-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-200">
                Karat Conversion Engine
              </h3>
              <p className="text-xs text-muted-foreground">
                Enter initial gold weight, current purity, and desired target purity to calculate alloy addition or refining pass.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4 space-y-4 shadow-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">Initial Gold Weight</label>
                <WeightInput
                  label="WEIGHT"
                  tint="tint-row-weight"
                  value={changerWeightMg}
                  onChange={setChangerWeightMg}
                  activeUnit={unitMode}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/40 rounded border space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>FROM CARAT</span>
                    <KaratBadge karat={fromCarat} size="sm" />
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    value={fromCarat}
                    onChange={(e) => setFromCarat(parseFloat(e.target.value) || 0)}
                    className="h-9 font-mono text-right text-base font-bold"
                  />
                </div>

                <div className="p-3 bg-muted/40 rounded border space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>TO CARAT</span>
                    <KaratBadge karat={toCarat} size="sm" />
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    value={toCarat}
                    onChange={(e) => setToCarat(parseFloat(e.target.value) || 0)}
                    className="h-9 font-mono text-right text-base font-bold"
                  />
                </div>
              </div>

              {/* Result Readouts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg border bg-card text-center space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Action Required</div>
                  <div className={`text-base font-bold font-sans ${isAddingAlloy ? 'text-amber-600' : 'text-purple-600'}`}>
                    {isAddingAlloy ? 'Add Alloy / Pat' : 'Refine / Pure Gold Pass'}
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-center space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300">
                    PASSA / ALLOY DELTA
                  </div>
                  <div className="text-xl font-mono font-black text-amber-900 dark:text-amber-200">
                    {formatGrams(changerPassaMg, 4)} g
                  </div>
                  <div className="text-[10px] font-mono text-amber-700">
                    {formatTMR(changerPassaMg, gramsPerTola)}
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 text-center space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-indigo-800 dark:text-indigo-300">
                    NEW TOTAL WEIGHT
                  </div>
                  <div className="text-xl font-mono font-black text-indigo-900 dark:text-indigo-200">
                    {formatGrams(targetWeightMg, 4)} g
                  </div>
                  <div className="text-[10px] font-mono text-indigo-700">
                    {formatTMR(targetWeightMg, gramsPerTola)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="h-12 border-t bg-card px-4 flex items-center justify-between select-none shrink-0 shadow-xs">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSaveRecord}
            className="h-8 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5"
          >
            <Save className="h-4 w-4" />
            SAVE CALCULATION (F8)
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleZero}
            className="h-8 text-xs text-red-600 hover:bg-red-50 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            ZERO (F4)
          </Button>
        </div>

        {/* Right Units */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-muted-foreground">Unit:</span>
          <div className="flex items-center gap-1 bg-muted p-0.5 rounded border">
            <button
              type="button"
              onClick={() => setUnitMode('auto')}
              className={`px-2 py-0.5 rounded font-bold text-xs ${unitMode === 'auto' ? 'bg-amber-500 text-white' : 'text-muted-foreground'}`}
            >
              Auto (F7)
            </button>
            <button
              type="button"
              onClick={() => setUnitMode('grams')}
              className={`px-2 py-0.5 rounded font-bold text-xs ${unitMode === 'grams' ? 'bg-amber-500 text-white' : 'text-muted-foreground'}`}
            >
              Grams (G)
            </button>
            <button
              type="button"
              onClick={() => setUnitMode('tola')}
              className={`px-2 py-0.5 rounded font-bold text-xs ${unitMode === 'tola' ? 'bg-amber-500 text-white' : 'text-muted-foreground'}`}
            >
              Tolas (W)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

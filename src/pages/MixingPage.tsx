import React from 'react'
import { PageTitle } from '@/components/shared/PageTitle'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Shuffle, Scissors, Sparkles, ArrowLeft } from 'lucide-react'
import { useMixingForm } from '@/hooks/useMixingForm'
import { MixingPatTab } from '@/components/mixing/MixingPatTab'
import { CaratChangerTab } from '@/components/mixing/CaratChangerTab'

export const MixingPage: React.FC = () => {
  const form = useMixingForm()

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <PageTitle
            title="Gold Mixing & Carat Changer"
            description="Calculate PAT, Passa, Mail alloy ratios and convert karat standards"
          >
            <div className="flex items-center gap-3">
              <Tabs
                value={form.activeTab}
                onValueChange={(v) => form.setActiveMixingSubtype(v as any)}
                className="w-auto"
              >
                <TabsList className="h-9 bg-muted p-1">
                  <TabsTrigger value="mixing" className="text-xs font-semibold gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Shuffle className="h-3.5 w-3.5" />
                    Mixing PAT
                  </TabsTrigger>
                  <TabsTrigger value="cutting" className="text-xs font-semibold gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Scissors className="h-3.5 w-3.5" />
                    Cutting Mail
                  </TabsTrigger>
                  <TabsTrigger value="carat_changer" className="text-xs font-semibold gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                    Carat Changer
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button
                size="sm"
                variant="outline"
                onClick={() => form.setCurrentPage('billing')}
                className="h-9 gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                Main Form
              </Button>
            </div>
          </PageTitle>

          {form.activeTab !== 'carat_changer' ? (
            <MixingPatTab form={form} />
          ) : (
            <CaratChangerTab form={form} />
          )}
        </div>
      </div>
    </div>
  )
}

export default MixingPage

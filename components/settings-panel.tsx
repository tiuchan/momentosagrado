"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sun, Moon, Monitor, Type } from "lucide-react"
import { loadPreferences, savePreferences, type UserPreferences } from "@/lib/preferences"

interface SettingsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPreferencesChange: (preferences: UserPreferences) => void
}

export function SettingsPanel({ open, onOpenChange, onPreferencesChange }: SettingsPanelProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences())

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    const updated = { ...preferences, [key]: value }
    setPreferences(updated)
    savePreferences(updated)
    onPreferencesChange(updated)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Tema</Label>
              <RadioGroup value={preferences.theme} onValueChange={(value: any) => updatePreference("theme", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                    <Sun className="w-4 h-4" />
                    Claro
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                    <Moon className="w-4 h-4" />
                    Escuro
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                    <Monitor className="w-4 h-4" />
                    Sistema
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Tamanho da Fonte</Label>
              <RadioGroup
                value={preferences.fontSize}
                onValueChange={(value: any) => updatePreference("fontSize", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small" className="flex items-center gap-2 cursor-pointer">
                    <Type className="w-3 h-3" />
                    Pequeno
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="flex items-center gap-2 cursor-pointer">
                    <Type className="w-4 h-4" />
                    Médio
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large" className="flex items-center gap-2 cursor-pointer">
                    <Type className="w-5 h-5" />
                    Grande
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

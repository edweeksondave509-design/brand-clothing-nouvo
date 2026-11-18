'use client'

import { Heart, Snowflake, Sparkles, Sun, Tag } from 'lucide-react'
import type { Theme } from '@/lib/store-types'
import { useStore } from './store-provider'

const THEME_ICON: Record<Theme, React.ComponentType<{ className?: string }>> = {
  normal: Sparkles,
  christmas: Snowflake,
  valentine: Heart,
  blackfriday: Tag,
  summer: Sun,
}

export function SeasonBar() {
  const { settings } = useStore()
  if (!settings.seasonMessage.trim()) return null
  const Icon = THEME_ICON[settings.theme]

  return (
    <div className="bg-brand px-4 py-2 text-center text-sm font-medium text-brand-foreground">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2">
        <Icon className="size-4 shrink-0" />
        <span>{settings.seasonMessage}</span>
        <Icon className="size-4 shrink-0" />
      </p>
    </div>
  )
}

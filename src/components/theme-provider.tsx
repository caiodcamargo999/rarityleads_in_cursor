"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// No type import available for ThemeProviderProps

export function ThemeProvider({ children, ...props }: React.PropsWithChildren<any>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
} 
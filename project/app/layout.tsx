import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', weight: ['500', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'Brand Clothing | Stil ou, Fyète ou',
  description:
    'Brand Clothing — rad, soulye ak akseswa pou yon stil ki pa konn limit. Peye ak MonCash, Natcash, Zelle, PayPal oswa kat. Kòmande sou WhatsApp.',
  generator: 'v0.app',
  icons: { icon: '/images/logo.png', apple: '/images/logo.png' },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1A1A1A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ht" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

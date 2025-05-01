import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Employee Profile Viewer',
  description: 'We manage employee information appropriately. This is a platform that comprehensively stores basic information, business information, private information, and related information of employees belonging to the company.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

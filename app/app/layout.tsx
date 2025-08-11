import type React from "react"
import ClientAppLayout from "./ClientAppLayout"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientAppLayout>{children}</ClientAppLayout>
      </body>
    </html>
  )
}

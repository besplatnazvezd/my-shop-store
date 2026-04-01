export const metadata = {
  title: 'BOSS STORE',
  description: 'Digital Agency',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, backgroundColor: '#000' }}>{children}</body>
    </html>
  )
}

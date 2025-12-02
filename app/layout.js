```jsx
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Electricista - Cotizador',
  description: 'Instalaciones eléctricas y cableado estructurado - Cotizá online',
}

export default function RootLayout({ children }){
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-800">
        <Header />
        <main className="max-w-6xl mx-auto p-6">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

```jsx
export default function Header(){
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-white">EL</div>
          <div>
            <h1 className="text-xl font-bold">Electricista & Cableado - TuNombre</h1>
            <p className="text-sm text-gray-500">Instalaciones eléctricas y cableado estructurado para hogares y pymes</p>
          </div>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <a href="#servicios" className="hover:underline">Servicios</a>
          <a href="#portafolio" className="hover:underline">Portafolio</a>
          <a href="#cotizador" className="hover:underline">Cotizar</a>
          <a href="#contacto" className="bg-green-600 text-white px-3 py-2 rounded-md">Contactar</a>
        </nav>
      </div>
    </header>
  )
}
```

```jsx
import dynamic from 'next/dynamic'
const Cotizador = dynamic(() => import('../components/Cotizador'), { ssr:false })

export default function Page(){
  return (
    <>
      <section className="bg-white rounded-2xl p-8 mt-6 shadow-sm">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-3xl font-extrabold">Instalaciones eléctricas y cableado estructurado confiable</h2>
            <p className="mt-3 text-gray-600">Atención profesional para tu casa u oficina. Cotizá online y obtené un precio aproximado al instante.</p>
            <div className="mt-6 flex gap-3">
              <a href="#cotizador" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">Cotizar ahora</a>
              <a href="#contacto" className="border border-gray-300 px-4 py-2 rounded-lg">Contactar</a>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-gray-600">
              <li>🔌 Instalaciones y reparaciones</li>
              <li>🖧 Cableado estructurado (Cat5e/Cat6)</li>
              <li>📶 Redes domésticas y oficinas</li>
              <li>🛠️ Mantenimiento y ampliaciones</li>
            </ul>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="/hero-cableado.jpg" alt="trabajo" className="w-full h-56 object-cover rounded-lg" />
          </div>
        </div>
      </section>

      <section id="servicios" className="mt-8">
        <h3 className="text-2xl font-bold">Servicios</h3>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold">Instalaciones eléctricas</h4>
            <p className="text-sm text-gray-600 mt-2">Nuevas instalaciones, ampliaciones, tableros y puesta a tierra.</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold">Reparaciones y mantenimiento</h4>
            <p className="text-sm text-gray-600 mt-2">Detectamos y solucionamos fallas, cortocircuitos y pérdidas.</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold">Cableado estructurado</h4>
            <p className="text-sm text-gray-600 mt-2">Puntos de red, patch panels, racks y certificación básica.</p>
          </div>
        </div>
      </section>

      <section id="portafolio" className="mt-8">
        <h3 className="text-2xl font-bold">Portafolio</h3>
        <p className="text-sm text-gray-600 mt-2">Algunos trabajos recientes (instalaciones y cableado).</p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i=> (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img src={`/portfolio-${i}.jpg`} alt={`Trabajo ${i}`} className="w-full h-40 object-cover" />
              <div className="p-3 text-sm">Trabajo #{i} — instalación y terminaciones</div>
            </div>
          ))}
        </div>
      </section>

      <Cotizador />

      <section id="contacto" className="mt-8 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-2xl font-bold">Contacto</h3>
        <p className="text-sm text-gray-600 mt-1">Consultas, visitas técnicas y presupuestos.</p>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Teléfono / WhatsApp</p>
            <p className="text-sm">+54 9 11 2345 6789</p>
            <p className="font-semibold mt-4">Email</p>
            <p className="text-sm">tuemail@dominio.com</p>
            <p className="font-semibold mt-4">Zona de trabajo</p>
            <p className="text-sm">Ciudad / Partido y alrededores — mencionar si hacés viajes fuera de zona</p>
          </div>
          <form className="space-y-3" onSubmit={e=>e.preventDefault()}>
            <input className="w-full p-2 border rounded-md" placeholder="Nombre" />
            <input className="w-full p-2 border rounded-md" placeholder="Email o teléfono" />
            <textarea className="w-full p-2 border rounded-md" placeholder="Mensaje: describí el trabajo" rows={4} />
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-2 rounded-md">Enviar</button>
              <button className="border px-3 py-2 rounded-md">Limpiar</button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
```

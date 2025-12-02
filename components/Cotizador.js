```jsx
'use client'
import { useState } from 'react'

export default function Cotizador(){
  const [jobType,setJobType] = useState('electrico')
  const [metros,setMetros] = useState(0)
  const [tomas,setTomas] = useState(0)
  const [llaves,setLlaves] = useState(0)
  const [puntosRed,setPuntosRed] = useState(0)
  const [horas,setHoras] = useState(0)
  const [calidad,setCalidad] = useState('estandar')
  const [status,setStatus] = useState(null)

  const precios = {
    electrico: { cablePorMetro:1200, toma:3500, llave:2800, manoHora:2500, minimo:5000 },
    cableado: { cablePorMetro:800, punto:4000, terminoPorPunto:700, manoHora:2000, minimo:6000 }
  }

  const calcularTotal = () => {
    let total = 0
    if(jobType==='electrico'){
      total += metros * precios.electrico.cablePorMetro
      total += tomas * precios.electrico.toma
      total += llaves * precios.electrico.llave
      total += horas * precios.electrico.manoHora
    } else {
      total += metros * precios.cableado.cablePorMetro
      total += puntosRed * precios.cableado.punto
      total += puntosRed * precios.cableado.terminoPorPunto
      total += horas * precios.cableado.manoHora
    }
    const calidadMult = calidad==='premium'?1.25:calidad==='alta'?1.1:1.0
    total = Math.max(Math.round(total*calidadMult), jobType==='electrico'?precios.electrico.minimo:precios.cableado.minimo)
    return { total, min: Math.round(total*0.9), max: Math.round(total*1.1) }
  }

  const resultado = calcularTotal()

  const enviarCotizacion = async () => {
    setStatus('sending')
    const payload = { jobType, metros, tomas, llaves, puntosRed, horas, calidad, resultado }
    try{
      const res = await fetch('/api/quote', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      const data = await res.json()
      if(res.ok){ setStatus('ok') } else { setStatus('error: '+(data?.error||'unknown')) }
    }catch(e){ setStatus('error: '+e.message) }
  }

  return (
    <section id="cotizador" className="mt-8 bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-2xl font-bold">Cotizador online</h3>
      <p className="text-sm text-gray-600 mt-1">El resultado es aproximado. Para un presupuesto cerrado podemos coordinar una visita técnica.</p>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Tipo de trabajo</label>
          <select value={jobType} onChange={(e)=>setJobType(e.target.value)} className="w-full p-2 border rounded-md mt-1">
            <option value="electrico">Instalación / reparación eléctrica</option>
            <option value="cableado">Cableado estructurado (Cat5e/Cat6)</option>
          </select>

          <div className="mt-3 space-y-3">
            <div>
              <label className="text-sm">Metros estimados de cableado</label>
              <input type="number" value={metros} onChange={(e)=>setMetros(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1" />
            </div>

            {jobType==='electrico' && (
              <>
                <div>
                  <label className="text-sm">Cantidad de tomas</label>
                  <input type="number" value={tomas} onChange={(e)=>setTomas(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1" />
                </div>

                <div>
                  <label className="text-sm">Cantidad de llaves de luz</label>
                  <input type="number" value={llaves} onChange={(e)=>setLlaves(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1" />
                </div>
              </>
            )}

            {jobType==='cableado' && (
              <>
                <div>
                  <label className="text-sm">Puntos de red (RJ45)</label>
                  <input type="number" value={puntosRed} onChange={(e)=>setPuntosRed(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1" />
                </div>

                <div>
                  <label className="text-sm">¿Necesitás patch panel / rack?</label>
                  <div className="mt-1 text-sm text-gray-600">Incluye montaje y terminaciones básicas</div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm">Horas estimadas de trabajo (mano de obra)</label>
              <input type="number" value={horas} onChange={(e)=>setHoras(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1" />
            </div>

            <div>
              <label className="text-sm">Calidad de materiales</label>
              <select value={calidad} onChange={(e)=>setCalidad(e.target.value)} className="w-full p-2 border rounded-md mt-1">
                <option value="estandar">Estándar (económico)</option>
                <option value="alta">Alta (mejores marcas)</option>
                <option value="premium">Premium (marcas premium / garantía extendida)</option>
              </select>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button onClick={enviarCotizacion} className="block text-center bg-blue-600 text-white py-2 rounded-md">Enviar cotización</button>
              <a href="https://wa.me/5491123456789?text=Hola%20quiero%20cotizar" className="block text-center border border-gray-300 py-2 rounded-md">Contactar por WhatsApp</a>
              <a href="mailto:tuemail@dominio.com?subject=Cotización%20trabajo" className="block text-center border border-gray-300 py-2 rounded-md">Enviar solicitud por email</a>
            </div>

            <div className="mt-6 text-sm text-gray-600">Si querés, podés copiar este resumen y enviármelo por WhatsApp para que coordine una visita técnica.</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold">Resumen y estimación</h4>
          <div className="mt-3 text-sm text-gray-700">
            <p>Tipo: <strong>{jobType === "electrico" ? "Eléctrico" : "Cableado"}</strong></p>
            <p>Calidad: <strong>{calidad}</strong></p>
            <p className="mt-3">Estimación aproximada: </p>

            <div className="mt-2 bg-white p-3 rounded-md shadow-sm">
              <div className="text-lg font-bold">ARS {resultado.total.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Rango estimado: ARS {resultado.min.toLocaleString()} - ARS {resultado.max.toLocaleString()}</div>
            </div>

            <p className="mt-3 text-xs text-gray-500">Nota: este cálculo usa precios de referencia para dar una idea. Para presupuesto cerrado se realiza visita técnica.</p>

            <div className="mt-4 flex flex-col gap-2">
              <a href={`https://wa.me/5491123456789?text=${encodeURIComponent('Hola, quiero cotizar: '+JSON.stringify(resultado))}`} className="block text-center bg-green-600 text-white py-2 rounded-md">Contactar por WhatsApp</a>
              <a href="mailto:tuemail@dominio.com?subject=Cotización%20trabajo" className="block text-center border border-gray-300 py-2 rounded-md">Enviar solicitud por email</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

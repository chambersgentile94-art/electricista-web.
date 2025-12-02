# Next.js - Sitio Electricista (Listo para Vercel)

Este repositorio contiene un proyecto **Next.js** listo para desplegar en Vercel con API routes para recibir y procesar cotizaciones (opción B: SSR / API Routes). Incluye: sitio público (home, servicios, portafolio, cotizador) y una API /api/quote que puede enviar la cotización por email vía SMTP o guardar en MongoDB Atlas si configurás las variables de entorno.

---

## Estructura de archivos (resumen)

```
/ (root)
  package.json
  next.config.js
  .env.example
  pages/
    _app.js
    index.js
    api/
      quote.js
  public/
    hero-cableado.jpg
    portfolio-1.jpg ... portfolio-6.jpg
  README.md (este archivo)
```

---

## package.json

```json
{
  "name": "electricista-nextjs",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "13.5.6",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "nodemailer": "6.9.4",
    "mongodb": "5.8.0"
  }
}
```

> Nota: las versiones son recomendadas; Vercel instalará automáticamente. Podes ajustar si querés.

---

## pages/_app.js

```jsx
import '../styles/globals.css'
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

> En este ejemplo se asume que vas a usar Tailwind (opcional). Si no querés Tailwind, podés remplazar estilos por CSS tradicional.

---

## pages/index.js (sitio + cotizador)

```jsx
import { useState } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <Hero />
        <Services />
        <Portfolio />
        <Cotizador />
        <Contacto />
      </main>
      <Footer />
    </div>
  )
}

function Header(){ /* mismo componente que tenías; mantenido por brevedad */
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

/* -- Mantén el resto de componentes (Hero, Services, Portfolio, Footer) tal como los tenías en el documento anterior. -- */

function Cotizador(){
  const [jobType,setJobType] = useState('electrico')
  const [metros,setMetros] = useState(0)
  const [tomas,setTomas] = useState(0)
  const [llaves,setLlaves] = useState(0)
  const [puntosRed,setPuntosRed] = useState(0)
  const [horas,setHoras] = useState(0)
  const [calidad,setCalidad] = useState('estandar')
  const [status,setStatus] = useState(null)

  // precios referencia (podés cambiar)
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
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <label>Tipo de trabajo</label>
          <select value={jobType} onChange={e=>setJobType(e.target.value)} className="w-full p-2 border rounded-md mt-1">
            <option value="electrico">Instalación / reparación eléctrica</option>
            <option value="cableado">Cableado estructurado (Cat5e/Cat6)</option>
          </select>

          <div className="mt-3 space-y-3">
            <div>
              <label>Metros estimados de cableado</label>
              <input type="number" value={metros} onChange={e=>setMetros(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1" />
            </div>
            {jobType==='electrico' && (
              <>
                <div>
                  <label>Cantidad de tomas</label>
                  <input type="number" value={tomas} onChange={e=>setTomas(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div>
                  <label>Cantidad de llaves de luz</label>
                  <input type="number" value={llaves} onChange={e=>setLlaves(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1" />
                </div>
              </>
            )}
            {jobType==='cableado' && (
              <div>
                <label>Puntos de red (RJ45)</label>
                <input type="number" value={puntosRed} onChange={e=>setPuntosRed(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1" />
              </div>
            )}

            <div>
              <label>Horas estimadas (mano de obra)</label>
              <input type="number" value={horas} onChange={e=>setHoras(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1" />
            </div>

            <div>
              <label>Calidad de materiales</label>
              <select value={calidad} onChange={e=>setCalidad(e.target.value)} className="w-full p-2 border rounded-md mt-1">
                <option value="estandar">Estándar</option>
                <option value="alta">Alta</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={enviarCotizacion} className="bg-blue-600 text-white px-3 py-2 rounded-md">Enviar cotización</button>
              <a className="border px-3 py-2 rounded-md" href={`https://wa.me/5491123456789?text=${encodeURIComponent('Hola, quiero cotizar: '+JSON.stringify(resultado))}`}>Enviar por WhatsApp</a>
            </div>

            <div className="mt-2 text-sm">Estado: {status || 'sin enviar'}</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold">Resumen</h4>
          <div className="mt-3">
            <div className="text-lg font-bold">ARS {resultado.total.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Rango: ARS {resultado.min.toLocaleString()} - ARS {resultado.max.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## pages/api/quote.js (API route)

Este archivo recibe POST con la cotización. Según variables de entorno va a:
- guardar en MongoDB (si `MONGODB_URI` está configurada), o
- enviar por email usando SMTP (si `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` están configuradas), o
- devolver OK y logs (modo de desarrollo).

```js
// pages/api/quote.js
import nodemailer from 'nodemailer'
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT || 587
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const TO_EMAIL = process.env.TO_EMAIL || process.env.SMTP_USER

let cachedClient = null

async function saveToMongo(doc){
  if(!MONGODB_URI) throw new Error('MONGODB_URI not set')
  if(!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI)
    await cachedClient.connect()
  }
  const db = cachedClient.db()
  const col = db.collection('cotizaciones')
  await col.insertOne({...doc, createdAt: new Date()})
}

async function sendEmail(subject, html){
  if(!SMTP_HOST || !SMTP_USER || !SMTP_PASS) throw new Error('SMTP settings not set')
  const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: SMTP_PORT==465, auth:{ user: SMTP_USER, pass: SMTP_PASS } })
  await transporter.sendMail({ from: SMTP_USER, to: TO_EMAIL, subject, html })
}

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ error:'method not allowed' })
  try{
    const body = req.body
    // Basic validation
    if(!body) return res.status(400).json({ error:'empty body' })

    // Save to Mongo if configured
    if(MONGODB_URI){
      await saveToMongo(body)
    }

    // Send email if SMTP configured
    if(SMTP_HOST && SMTP_USER && SMTP_PASS){
      const subject = `Nueva cotización - ${body.jobType}`
      const html = `<pre>${JSON.stringify(body, null, 2)}</pre>`
      await sendEmail(subject, html)
    }

    // Response
    return res.status(200).json({ ok:true })
  }catch(e){
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}
```

> Importante: Vercel ejecuta funciones serverless. Guardar en fichero local no es persistente. Por eso recomendamos MongoDB Atlas (o cualquier DB) o enviar por SMTP.

---

## .env.example (variables de entorno)

```
# MongoDB Atlas (opcional)
MONGODB_URI=mongodb+srv://usuario:pass@cluster0.mongodb.net/mydb?retryWrites=true&w=majority

# SMTP (opcional — para recibir email con la cotización)
SMTP_HOST=smtp.tudominio.com
SMTP_PORT=587
SMTP_USER=usuario@tudominio.com
SMTP_PASS=secreto
TO_EMAIL=tuemail@dominio.com
```

---




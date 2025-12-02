
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

export async function POST(req){
  try{
    const body = await req.json()
    if(!body) return new Response(JSON.stringify({ error:'empty body' }), { status:400 })

    if(MONGODB_URI){
      await saveToMongo(body)
    }
    if(SMTP_HOST && SMTP_USER && SMTP_PASS){
      const subject = `Nueva cotización - ${body.jobType}`
      const html = `<pre>${JSON.stringify(body, null, 2)}</pre>`
      await sendEmail(subject, html)
    }

    return new Response(JSON.stringify({ ok:true }), { status:200 })
  }catch(e){
    console.error(e)
    return new Response(JSON.stringify({ error: e.message }), { status:500 })
  }
}


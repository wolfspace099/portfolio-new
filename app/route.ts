import fs from 'fs'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const htmlPath = './app/index.html'
  const html = fs.readFileSync(htmlPath, 'utf8')
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
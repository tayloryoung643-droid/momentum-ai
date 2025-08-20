import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`)
    }

    const data = await response.json()
    const calendars = data.items?.map((cal: { id: string; summary: string; primary?: boolean }) => ({
      id: cal.id,
      name: cal.summary,
      primary: cal.primary || false
    })) || []

    return NextResponse.json({ 
      success: true,
      calendars,
      total: calendars.length 
    })
  } catch (error) {
    console.error('Calendar API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch calendars',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
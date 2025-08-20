import { NextRequest, NextResponse } from 'next/server'

// TypeScript interface for calendar event data from Zapier
interface ZapierWebhookData {
  eventId?: string
  title?: string
  description?: string
  startTime?: string
  endTime?: string
  attendees?: string[]
  location?: string
  organizerEmail?: string
  meetingUrl?: string
  // Additional fields that might come from Zapier
  [key: string]: any
}

// POST handler for Zapier webhook
export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON data
    const data: ZapierWebhookData = await request.json()
    
    // Log the incoming webhook data for debugging
    console.log('📨 Zapier webhook received:', {
      timestamp: new Date().toISOString(),
      eventId: data.eventId,
      title: data.title,
      startTime: data.startTime,
      data: data
    })

    // Validate required fields
    if (!data.title || !data.startTime) {
      console.error('❌ Missing required fields in webhook data')
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          message: 'Event title and start time are required' 
        },
        { status: 400 }
      )
    }

    // TODO: Process the calendar event data
    // This is where you would:
    // 1. Save event to database
    // 2. Trigger AI prep sheet generation
    // 3. Send notifications
    // 4. Update calendar with prep sheet links

    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: 'Webhook processed successfully',
        eventId: data.eventId,
        receivedAt: new Date().toISOString()
      },
      { status: 200 }
    )

  } catch (error) {
    // Handle parsing errors and other exceptions
    console.error('💥 Zapier webhook error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process webhook data' 
      },
      { status: 500 }
    )
  }
}

// Reject non-POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
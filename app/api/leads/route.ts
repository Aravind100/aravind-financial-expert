import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.phone || !body.service) {
      return NextResponse.json(
        { error: 'Name, phone and service are required.' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { error } = await supabase.from('leads').insert([
      {
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        service: body.service,
        message: body.message || null,
        status: 'New',
      },
    ]);

    if (error) {
      console.error('Supabase lead insert error:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Lead API error:', e);
    return NextResponse.json(
      { error: 'Unable to save enquiry. Check Supabase configuration.' },
      { status: 500 }
    );
  }
}

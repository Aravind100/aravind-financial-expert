import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const key = new URL(req.url).searchParams.get('key');

    if (!key || key !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Invalid admin key.' },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin()
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase admin leads error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ leads: data });
  } catch (e) {
    console.error('Admin leads API error:', e);
    return NextResponse.json(
      { error: 'Unable to load leads. Check Supabase configuration.' },
      { status: 500 }
    );
  }
}

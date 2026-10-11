import { supabaseAdmin } from '@/integrations/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('role', 'admin')
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check password from env or database
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    let isValid = password === adminPassword;
    if (!isValid && data.password_hash) {
      try {
        isValid = await bcrypt.compare(password, data.password_hash);
      } catch {
        // bcrypt comparison failed, keep isValid as false
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create a session token (in production, use proper JWT)
    const sessionToken = Buffer.from(`${data.id}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      },
      token: sessionToken,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

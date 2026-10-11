import { supabaseAdmin } from '@/integrations/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let query = supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, category, sizes, colors, images, stock } = body;

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        description,
        price,
        category,
        sizes,
        colors,
        images,
        stock,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

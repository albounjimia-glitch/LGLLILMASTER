import { supabaseAdmin } from '@/integrations/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// WhatsApp notification function
async function sendWhatsAppNotification(order: {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: Array<{
    product_name: string;
    quantity: number;
    size: string;
    color: string;
  }>;
  total: number;
}) {
  const whatsappNumber = process.env.WHATSAPP_NUMBER;

  if (!whatsappNumber) {
    console.log('WhatsApp number not configured, skipping notification');
    return;
  }

  const itemsList = order.items
    .map((item) => `• ${item.product_name} (x${item.quantity}) - Size: ${item.size}, Color: ${item.color}`)
    .join('\n');

  const message = `🛒 *New Order Received!*

*Order ID:* ${order.id.slice(0, 8).toUpperCase()}

*Customer:* ${order.customer_name}
*Phone:* ${order.customer_phone}
*Address:* ${order.customer_address}

*Items:*
${itemsList}

*Total:* ${order.total} MAD

Order placed on LGLLILMASTER`;

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  console.log('WhatsApp notification URL:', whatsappUrl);
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_email, customer_address, items, subtotal, total } = body;

    // Validate required fields
    if (!customer_name || !customer_phone || !customer_address || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create order using server admin client (bypasses RLS)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name,
        customer_phone,
        customer_email: customer_email || null,
        customer_address,
        subtotal,
        total,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item: { product_id: string; product_name: string; product_price: number; quantity: number; size: string; color: string }) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Rollback order if items fail
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    // Send WhatsApp notification
    await sendWhatsAppNotification({
      id: order.id,
      customer_name,
      customer_phone,
      customer_address,
      items: orderItems,
      total,
    });

    return NextResponse.json({ id: order.id, ...order });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

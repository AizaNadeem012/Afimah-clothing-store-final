import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  cart_id: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  billing_address?: object;
  payment_method?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get user from JWT
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { cart_id, shipping_address, billing_address, payment_method }: CheckoutRequest =
      await req.json();

    // Get cart items
    const { data: cartItems, error: cartError } = await supabaseClient
      .from("cart_items")
      .select(`
        *,
        products (
          id,
          name,
          price,
          images
        ),
        product_variants (
          id,
          name,
          price,
          sku
        )
      `)
      .eq("cart_id", cart_id);

    if (cartError || !cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty or not found");
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = cartItems.map((item: any) => {
      const price = item.variant_id ? item.product_variants.price : item.products.price;
      const itemTotal = Number(price) * item.quantity;
      subtotal += itemTotal;

      return {
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.products.name,
        variant_name: item.variant_id ? item.product_variants.name : null,
        sku: item.variant_id ? item.product_variants.sku : item.products.sku,
        quantity: item.quantity,
        price: price,
        total: itemTotal,
      };
    });

    // Calculate shipping and tax (you can customize this logic)
    const shipping_cost = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping_cost + tax;

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        user_id: user.id,
        email: user.email,
        subtotal,
        shipping_cost,
        tax,
        total,
        shipping_address,
        billing_address: billing_address || shipping_address,
        payment_method: payment_method || "card",
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw new Error("Failed to create order");
    }

    // Insert order items
    const orderItemsWithOrderId = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabaseClient
      .from("order_items")
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      throw new Error("Failed to create order items");
    }

    // Clear cart
    await supabaseClient.from("cart_items").delete().eq("cart_id", cart_id);

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          order_number: order.order_number,
          total: order.total,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

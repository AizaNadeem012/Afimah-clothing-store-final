import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    // Get or create cart for user
    let { data: cart, error: cartError } = await supabaseClient
      .from("carts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!cart) {
      // Create new cart
      const { data: newCart, error: createError } = await supabaseClient
        .from("carts")
        .insert({ user_id: user.id })
        .select()
        .single();

      if (createError) {
        throw new Error("Failed to create cart");
      }
      cart = newCart;
    }

    // Get cart items with product details
    const { data: cartItems, error: itemsError } = await supabaseClient
      .from("cart_items")
      .select(`
        *,
        products (
          id,
          name,
          slug,
          price,
          images,
          quantity
        ),
        product_variants (
          id,
          name,
          price,
          sku,
          quantity,
          option1,
          option2,
          option3
        )
      `)
      .eq("cart_id", cart.id);

    if (itemsError) {
      throw new Error("Failed to fetch cart items");
    }

    // Calculate cart summary
    const summary = {
      items_count: cartItems?.length || 0,
      subtotal: cartItems?.reduce((sum: number, item: any) => {
        const price = item.variant_id ? item.product_variants.price : item.products.price;
        return sum + (Number(price) * item.quantity);
      }, 0) || 0,
    };

    return new Response(
      JSON.stringify({
        cart: {
          id: cart.id,
          items: cartItems || [],
          summary,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Get cart error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

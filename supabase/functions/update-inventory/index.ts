import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InventoryUpdate {
  product_id?: string;
  variant_id?: string;
  quantity: number;
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

    const { product_id, variant_id, quantity }: InventoryUpdate = await req.json();

    if (!product_id && !variant_id) {
      throw new Error("Either product_id or variant_id is required");
    }

    let updateResult;

    if (variant_id) {
      // Update variant inventory
      updateResult = await supabaseClient
        .from("product_variants")
        .update({ quantity })
        .eq("id", variant_id)
        .select();
    } else if (product_id) {
      // Update product inventory
      updateResult = await supabaseClient
        .from("products")
        .update({ quantity })
        .eq("id", product_id)
        .select();
    }

    if (updateResult?.error) {
      throw new Error("Failed to update inventory");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Inventory updated successfully",
        data: updateResult?.data || null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Update inventory error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

//---------------------------------------------------//
// created: 26/02/2026                               //
// updated: 06/03/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: supabase/get-hazard/index.ts             //
// use    : as a data broker/bridge between front-end//
//          and nsw transport api                    //
//---------------------------------------------------//

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

//------------------------------------------------------------//

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export const translateRegion = (rawRegion: string): string => {
  const region = rawRegion?.toUpperCase() || "";
  if (region.startsWith("SYD")) return "Sydney";
  if (region === "HUNTER" || region === "NEWCASTLE") return "Hunter";
  if (region === "CENTRAL_COAST") return "Central Coast";
  if (region === "REG_NORTH") return "North Coast NSW";
  if (region === "REG_SOUTH") return "South Coast";
  if (region === "REG_WEST") return "Central NSW";
  return rawRegion; // Fallback
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const hazardType = url.searchParams.get("hazardType") || "all";
    const apiKey = Deno.env.get("HAZARD_API_KEY");

    const nswUrl =
      `https://api.transport.nsw.gov.au/v1/live/hazards/${hazardType}/all`;
    const response = await fetch(nswUrl, {
      headers: {
        "Authorization": `apikey ${apiKey}`,
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (data.features) {
      data.features = data.features.map((feature: any) => {
        const rawRegion = feature.properties?.region || "";
        // FIX: You must assign the result to the property!
        feature.properties.region = translateRegion(rawRegion);
        return feature;
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

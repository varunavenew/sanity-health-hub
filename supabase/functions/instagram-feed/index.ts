import { corsHeaders } from "@supabase/supabase-js/cors";

const INSTAGRAM_GRAPH_URL = "https://graph.instagram.com/me/media";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get("INSTAGRAM_ACCESS_TOKEN");

    if (!token) {
      console.error("INSTAGRAM_ACCESS_TOKEN not set");
      return new Response(
        JSON.stringify({ error: "Instagram not configured", posts: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
    const limit = 6;
    const url = `${INSTAGRAM_GRAPH_URL}?fields=${fields}&limit=${limit}&access_token=${token}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Instagram API error:", response.status, errorData);
      return new Response(
        JSON.stringify({ error: "Failed to fetch Instagram posts", posts: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    const posts = (data.data || [])
      .filter((post: any) => post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM")
      .map((post: any) => ({
        id: post.id,
        image: post.media_url,
        caption: post.caption || "",
        permalink: post.permalink,
        timestamp: post.timestamp,
      }));

    return new Response(
      JSON.stringify({ posts }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", posts: [] }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

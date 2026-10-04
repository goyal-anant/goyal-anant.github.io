// Reaction counts for blog posts: GET returns a post's counts, POST adds one reaction.
const KINDS = ["like", "heart", "insightful"];
const ORIGINS = ["https://goyal-anant.github.io", "https://anantgo.pages.dev"];
// post and rant paths only, e.g. /blog/2026/09/26/why-is-an-apple-red/; the last part is whatever Jekyll
// makes of the filename, which can keep capitals, underscores, dots and percent-encoded characters
const POST_PATH = /^\/(blog\/\d{4}\/\d{2}\/\d{2}|rant)\/[^\/?#\s]{1,100}\/$/;

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin");
    // counts are public, so any page (localhost previews included) may read them; only writes check the origin
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST" };
    const reply = (body, status = 200) =>
      typeof body === "string"
        ? new Response(body, { status, headers: cors })
        : Response.json(body, { status, headers: cors });

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const url = new URL(req.url);
    const post = url.searchParams.get("post");
    if (!post || !POST_PATH.test(post)) return reply("bad post", 400);

    if (req.method === "POST") {
      // CORS alone doesn't stop a plain POST from running, so writes check the origin here.
      // This also keeps localhost and draft previews from adding to the real counts (they can still read them).
      if (!ORIGINS.includes(origin)) return reply("forbidden", 403);
      const kind = url.searchParams.get("kind");
      if (!KINDS.includes(kind)) return reply("bad kind", 400);
      const { success } = await env.LIMITER.limit({ key: req.headers.get("CF-Connecting-IP") || "unknown" });
      if (!success) return reply("slow down", 429);
      await env.DB.prepare(
        "INSERT INTO reactions (post, kind, count) VALUES (?1, ?2, 1) ON CONFLICT (post, kind) DO UPDATE SET count = count + 1"
      ).bind(post, kind).run();
    } else if (req.method !== "GET") {
      return reply("method not allowed", 405);
    }

    const { results } = await env.DB.prepare("SELECT kind, count FROM reactions WHERE post = ?1").bind(post).all();
    return reply(Object.fromEntries(results.map((r) => [r.kind, r.count])));
  },
};

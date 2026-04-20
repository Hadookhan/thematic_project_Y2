import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-e82f3bbc/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all movies
app.get("/make-server-e82f3bbc/movies", async (c) => {
  try {
    const movies = await kv.getByPrefix("movie:");
    return c.json({ movies: movies || [] });
  } catch (error) {
    console.log("Error fetching movies:", error);
    return c.json({ error: "Failed to fetch movies", details: String(error) }, 500);
  }
});

// Get single movie by ID
app.get("/make-server-e82f3bbc/movies/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const movie = await kv.get(`movie:${id}`);
    if (!movie) {
      return c.json({ error: "Movie not found" }, 404);
    }
    return c.json({ movie });
  } catch (error) {
    console.log("Error fetching movie:", error);
    return c.json({ error: "Failed to fetch movie", details: String(error) }, 500);
  }
});

// Get person by ID
app.get("/make-server-e82f3bbc/people/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const person = await kv.get(`person:${id}`);
    if (!person) {
      return c.json({ error: "Person not found" }, 404);
    }
    return c.json({ person });
  } catch (error) {
    console.log("Error fetching person:", error);
    return c.json({ error: "Failed to fetch person", details: String(error) }, 500);
  }
});

// Search movies
app.get("/make-server-e82f3bbc/search", async (c) => {
  try {
    const query = c.req.query("q")?.toLowerCase() || "";
    const movies = await kv.getByPrefix("movie:");
    const filtered = movies.filter((movie: any) => 
      movie.title?.toLowerCase().includes(query)
    );
    return c.json({ results: filtered });
  } catch (error) {
    console.log("Error searching movies:", error);
    return c.json({ error: "Failed to search", details: String(error) }, 500);
  }
});

// Add to watchlist
app.post("/make-server-e82f3bbc/watchlist", async (c) => {
  try {
    const { userId, movieId } = await c.req.json();
    const watchlistKey = `watchlist:${userId}`;
    const watchlist = await kv.get(watchlistKey) || [];
    if (!watchlist.includes(movieId)) {
      watchlist.push(movieId);
      await kv.set(watchlistKey, watchlist);
    }
    return c.json({ success: true });
  } catch (error) {
    console.log("Error adding to watchlist:", error);
    return c.json({ error: "Failed to add to watchlist", details: String(error) }, 500);
  }
});

// Get user watchlist
app.get("/make-server-e82f3bbc/watchlist/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const movieIds = await kv.get(`watchlist:${userId}`) || [];
    const movies = await Promise.all(
      movieIds.map((id: string) => kv.get(`movie:${id}`))
    );
    return c.json({ watchlist: movies.filter(Boolean) });
  } catch (error) {
    console.log("Error fetching watchlist:", error);
    return c.json({ error: "Failed to fetch watchlist", details: String(error) }, 500);
  }
});

// Remove from watchlist
app.delete("/make-server-e82f3bbc/watchlist/:userId/:movieId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const movieId = c.req.param("movieId");
    const watchlistKey = `watchlist:${userId}`;
    const watchlist = await kv.get(watchlistKey) || [];
    const updated = watchlist.filter((id: string) => id !== movieId);
    await kv.set(watchlistKey, updated);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error removing from watchlist:", error);
    return c.json({ error: "Failed to remove from watchlist", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
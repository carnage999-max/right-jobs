import { headers } from "next/headers";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (not shared across serverless instances, but effective for local/single-server)
const store: RateLimitStore = {};

export async function rateLimit(limit: number = 5, windowMs: number = 60000) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "anonymous";
  
  const now = Date.now();
  
  if (!store[ip] || now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { success: true, count: 1 };
  }

  store[ip].count++;

  if (store[ip].count > limit) {
    return { success: false, count: store[ip].count };
  }

  return { success: true, count: store[ip].count };
}

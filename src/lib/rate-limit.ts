import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(
    10, 
    '1 m' 
  ),
  prefix: '@upstash/ratelimit',
  analytics: true
})

// Allow 10 requests per minute per IP

// Use sliding window algorithm

// Work globally with Redis cache

// Auto-block abusive requests

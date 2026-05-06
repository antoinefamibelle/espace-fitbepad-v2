interface RateLimitResult {
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
}

class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        success: true,
        limit: this.maxAttempts,
        remaining: this.maxAttempts - 1,
        reset: now + this.windowMs,
      };
    }

    if (record.count >= this.maxAttempts) {
      return {
        success: false,
        limit: this.maxAttempts,
        remaining: 0,
        reset: record.resetTime,
      };
    }

    record.count++;
    return {
      success: true,
      limit: this.maxAttempts,
      remaining: this.maxAttempts - record.count,
      reset: record.resetTime,
    };
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  clear(): void {
    this.attempts.clear();
  }
}

export const rateLimiter = new RateLimiter();
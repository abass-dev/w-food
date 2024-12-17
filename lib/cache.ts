import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 600 }) // Cache for 10 minutes

export function getFromCache<T>(key: string): T | undefined {
    return cache.get<T>(key)
}

export function setCache<T>(key: string, value: T, ttl?: number): boolean {
    return cache.set(key, value, ttl)
}

export function clearCache(key: string): void {
    cache.del(key)
}


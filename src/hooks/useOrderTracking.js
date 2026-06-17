import { useState, useEffect, useCallback, useRef } from 'react'
import { subscribeToOrderUpdates } from '../services/api'

/**
 * Polls a fetcher function on an interval and also re-fetches immediately
 * whenever the mock API's order-update "push" fires. This is the pattern
 * used for real-time order tracking: in production, the subscribe call
 * would instead listen on a WebSocket / SSE channel from the backend.
 */
export function useOrderTracking(fetcher, intervalMs = 5000, deps = []) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refresh = useCallback(async () => {
    try {
      const result = await fetcherRef.current()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, intervalMs)
    const unsubscribe = subscribeToOrderUpdates(refresh)
    return () => {
      clearInterval(interval)
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { orders: data, loading, error, refresh }
}

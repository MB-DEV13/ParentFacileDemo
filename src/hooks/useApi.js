import { useEffect, useState } from 'react'

export default function useApi(fn, deps=[]) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    fn().then(d => { if (isMounted) setData(d) })
      .catch(e => { if (isMounted) setError(e) })
      .finally(() => { if (isMounted) setLoading(false) })
    return () => { isMounted = false }
  }, deps)
  return { data, loading, error }
}
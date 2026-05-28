'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ShopStatus, SiomaiType, ProductWithOptions } from '@/types'

interface RealtimeState {
  shopStatus: ShopStatus | null
  siomaiTypes: SiomaiType[]
  products: ProductWithOptions[]
}

interface RealtimeProviderProps {
  initial: RealtimeState
  children: (state: RealtimeState) => React.ReactNode
}

export function RealtimeProvider({ initial, children }: RealtimeProviderProps) {
  const [state, setState] = useState<RealtimeState>(initial)

  const updateState = useCallback((patch: Partial<RealtimeState>) => {
    setState(prev => ({ ...prev, ...patch }))
  }, [])

  useEffect(() => {
    const supabase = createClient()

    // shop_status changes
    const shopChannel = supabase
      .channel('shop_status_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'shop_status' },
        (payload) => {
          updateState({ shopStatus: payload.new as ShopStatus })
        }
      )
      .subscribe()

    // siomai_types changes
    const siomaiChannel = supabase
      .channel('siomai_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'siomai_types' },
        () => {
          // Refetch all siomai types on any change
          supabase
            .from('siomai_types')
            .select('*')
            .then(({ data }) => {
              if (data) updateState({ siomaiTypes: data })
            })
        }
      )
      .subscribe()

    // products availability changes
    const productsChannel = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => {
          setState(prev => ({
            ...prev,
            products: prev.products.map(p =>
              p.id === payload.new.id ? { ...p, ...payload.new } : p
            ),
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(shopChannel)
      supabase.removeChannel(siomaiChannel)
      supabase.removeChannel(productsChannel)
    }
  }, [updateState])

  return <>{children(state)}</>
}

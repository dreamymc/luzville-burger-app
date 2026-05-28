'use client'

import { useState } from 'react'
import type { Product, ProductOptionsGroup, ProductOption } from '@/types'
import { getAvailabilityStatus } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { ProductOptionsModal } from './ProductOptionsModal'

interface ProductCardProps {
  product: Product & {
    option_groups?: (ProductOptionsGroup & { options: ProductOption[] })[]
  }
  animationDelay?: number
}

export function ProductCard({ product, animationDelay = 0 }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const status = getAvailabilityStatus(product.is_available, product.stock_count)
  const hasOptions = (product.option_groups?.length ?? 0) > 0

  return (
    <>
      <article
        className="card card-reveal"
        style={{
          padding: '1.125rem',
          cursor: hasOptions ? 'pointer' : 'default',
          animationDelay: `${animationDelay}ms`,
          opacity: status === 'sold-out' ? 0.6 : 1,
        }}
        onClick={() => hasOptions && status !== 'sold-out' && setModalOpen(true)}
        role={hasOptions ? 'button' : undefined}
        tabIndex={hasOptions ? 0 : undefined}
        aria-label={hasOptions ? `${product.name} — tap to see options` : undefined}
        onKeyDown={e => {
          if (hasOptions && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            setModalOpen(true)
          }
        }}
      >
        {/* Availability badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Badge status={status} />
          {hasOptions && status !== 'sold-out' && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--color-accent)',
              fontWeight: 600,
            }}>
              Tap for options ›
            </span>
          )}
        </div>

        {/* Product name */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1rem, 3vw, 1.125rem)',
          color: 'var(--color-ink)',
          margin: '0.375rem 0',
          lineHeight: 1.2,
        }}>
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: 'var(--color-ink-2)',
            margin: '0 0 0.75rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.description}
          </p>
        )}

        {/* Price + stock */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{
            fontFamily: 'var(--font-outlier)',
            fontSize: '1.125rem',
            fontWeight: 500,
            color: 'var(--color-ink)',
          }}>
            ₱{Number(product.price).toFixed(2)}
          </span>
          {product.stock_count !== null && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--color-ink-3)',
            }}>
              {product.stock_count} in stock
            </span>
          )}
        </div>
      </article>

      {modalOpen && hasOptions && (
        <ProductOptionsModal
          product={product}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import type { Product, ProductOptionsGroup, ProductOption } from '@/types'

interface ProductOptionsModalProps {
  product: Product & {
    option_groups?: (ProductOptionsGroup & { options: ProductOption[] })[]
  }
  onClose: () => void
}

export function ProductOptionsModal({ product, onClose }: ProductOptionsModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Focus trap + ESC close
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement
    panelRef.current?.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      prevFocus?.focus()
    }
  }, [onClose])

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={`Options for ${product.name}`}
    >
      <div
        ref={panelRef}
        className="modal-panel"
        tabIndex={-1}
        style={{ outline: 'none' }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.25rem 0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.375rem',
              color: 'var(--color-ink)',
              margin: 0,
            }}>
              {product.name}
            </h2>
            <p style={{
              fontFamily: 'var(--font-outlier)',
              fontSize: '1.125rem',
              color: 'var(--color-accent)',
              margin: '0.25rem 0 0',
            }}>
              ₱{Number(product.price).toFixed(2)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ flexShrink: 0, padding: '0.375rem 0.75rem' }}
            aria-label="Close options"
          >
            ✕
          </button>
        </div>

        {product.description && (
          <p style={{
            padding: '0.5rem 1.25rem 0',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--color-ink-2)',
            margin: 0,
          }}>
            {product.description}
          </p>
        )}

        {/* Option groups */}
        <div style={{ padding: '1rem 1.25rem 1.5rem' }}>
          {product.option_groups?.map(group => (
            <div key={group.id} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <h3 style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: 'var(--color-ink)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {group.group_name}
                </h3>
                {group.is_required && (
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: 'var(--color-accent-2)',
                    backgroundColor: 'var(--color-closed-bg)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                  }}>
                    Required
                  </span>
                )}
                {group.max_select > 1 && (
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6875rem',
                    color: 'var(--color-ink-3)',
                  }}>
                    Pick up to {group.max_select}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {group.options?.map(option => (
                  <div
                    key={option.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.625rem 0.875rem',
                      backgroundColor: 'var(--color-paper-2)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9375rem',
                      color: 'var(--color-ink)',
                    }}>
                      {option.option_name}
                    </span>
                    {option.additional_price > 0 && (
                      <span style={{
                        fontFamily: 'var(--font-outlier)',
                        fontSize: '0.875rem',
                        color: 'var(--color-open)',
                        fontWeight: 500,
                      }}>
                        +₱{Number(option.additional_price).toFixed(2)}
                      </span>
                    )}
                    {option.additional_price === 0 && (
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        color: 'var(--color-ink-3)',
                      }}>
                        No charge
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: 'var(--color-ink-3)',
            textAlign: 'center',
            marginTop: '0.75rem',
            marginBottom: 0,
          }}>
            Tell the seller your choices when ordering.
          </p>
        </div>
      </div>
    </div>
  )
}

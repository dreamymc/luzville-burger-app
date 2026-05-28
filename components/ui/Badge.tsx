import type { AvailabilityStatus } from '@/types'

interface BadgeProps {
  status: AvailabilityStatus
  className?: string
}

const config: Record<AvailabilityStatus, { label: string; style: string }> = {
  available: {
    label: 'Available',
    style: 'badge--available',
  },
  limited: {
    label: 'Limited',
    style: 'badge--limited',
  },
  'sold-out': {
    label: 'Sold Out',
    style: 'badge--sold-out',
  },
}

export function Badge({ status, className = '' }: BadgeProps) {
  const { label, style } = config[status]
  return (
    <span className={`badge ${style} ${className}`} aria-label={label}>
      {label}
    </span>
  )
}

interface SiomaiCountBadgeProps {
  count: number
  isAvailable: boolean
}

export function SiomaiCountBadge({ count, isAvailable }: SiomaiCountBadgeProps) {
  if (!isAvailable || count === 0) {
    return <span className="badge badge--sold-out">Sold Out</span>
  }
  if (count <= 10) {
    return <span className="badge badge--limited">{count} left</span>
  }
  return <span className="badge badge--available">{count} available</span>
}

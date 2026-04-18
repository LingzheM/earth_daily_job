'use client';

import { motion, LayoutGroup } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { springBouncy, liftVariant, tabIndicator } from '@/lib/animations';

const tabs = [
  { id: 'home', label: 'Home', icon: '🏠', href: '/' },
  { id: 'task', label: '任务', icon: '🌧', href: '/tasks' },
  { id: 'pond', label: '记忆', icon: '✨', href: '/pond' },
  { id: 'settings', label: '设置', icon: '⚙️', href: '/settings' },
]

/**
 * TabBar — Fixed glass bottom navigation
 *
 * Design spec: docs/design/tab-bar.md
 * PRD: AC-F4-01 to AC-F4-08
 *
 * Indicator: layoutId="tabIndicator" animates between active tab positions.
 * Safe area: paddingBottom uses env(safe-area-inset-bottom) for iOS notch.
 */
export default function TabBar() {
  const pathname = usePathname();
  
  return (
    <LayoutGroup>
      <nav
        className="glass"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '72px',
          paddingBottom: 'env(safe-are-inset-bottom, 0px)',
          backdropFilter: 'var(--glass-blur-heavy)',
          WebkitBackdropFilter: 'var(--glass-blur-heavy)',
          borderRadius: 0,
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
        }}
        aria-label='Main navigation'
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                textDecoration: 'none',
                minHeight: '44px',
                minWidth: '44px',
                position: 'relative',
                paddingTop: '4px',
              }}
            >
              {/** Active indicator - layoutId enables cross-tab animation */}
              {isActive && (
                <motion.div
                  layoutId="tabIndicator"
                  transition={tabIndicator}
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    height: '3px',
                    width: '40%',
                    background: 'linear-gradient(90deg, #FF6B9D, #7B2FFF)',
                    borderRadius: '9999px',
                    boxShadow: '0 0 10px rgba(123, 47, 255, 0.6),'
                  }}
                />
              )}

              <motion.span
                style={{
                  fontSize: '24px',
                  lineHeight: 1,
                  color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                }}
                variants={liftVariant}
                whileHover="hover"
                whileTap="tap"
                transition={springBouncy}
              >
                {tab.icon}
              </motion.span>

              <span
                style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--text-accent)' : 'var(--text-tertiary)',
                  transition: 'color 0.2s ease font-weight 0.2s ease',
                }}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </LayoutGroup>
  )
}
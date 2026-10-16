import { test, expect } from 'claude-code/testing'

import { bar, colorFor, resetsIn } from './register'

test('bar fills in proportion and clamps', () => {
  expect(bar(0, 10)).toBe('░░░░░░░░░░')
  expect(bar(50, 10)).toBe('█████░░░░░')
  expect(bar(150, 10)).toBe('██████████')
})

test('color steps up with usage', () => {
  expect(colorFor(10)).toBe('green')
  expect(colorFor(75)).toBe('yellow')
  expect(colorFor(95)).toBe('red')
})

test('reset countdown', () => {
  const now = Date.parse('2026-10-17T10:00:00Z')
  expect(resetsIn('2026-10-17T12:15:00Z', now)).toBe(' · resets in 2h 15m')
  expect(resetsIn('2026-10-20T13:00:00Z', now)).toBe(' · resets in 3d 3h')
  expect(resetsIn('2026-10-17T10:05:00Z', now)).toBe(' · resets in 5m')
  expect(resetsIn(undefined, now)).toBe('')
})

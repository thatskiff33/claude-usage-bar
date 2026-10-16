import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionRateLimit } from 'claude-code'

import type { Window } from '../types'

const fiveHour = atom({ plugin: 'usage-bar', key: 'fiveHour' } as const, null as Window)
const sevenDay = atom({ plugin: 'usage-bar', key: 'sevenDay' } as const, null as Window)

export const bar = (percent: number, width: number) => {
  const filled = Math.round((Math.min(Math.max(percent, 0), 100) / 100) * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

export const colorFor = (percent: number) =>
  percent >= 90 ? 'red' : percent >= 70 ? 'yellow' : 'green'

export const resetsIn = (resetsAt: string | undefined, now: number) => {
  if (!resetsAt) return ''
  const minutes = Math.max(0, Math.round((Date.parse(resetsAt) - now) / 60000))
  const d = Math.floor(minutes / 1440)
  const h = Math.floor((minutes % 1440) / 60)
  const m = minutes % 60
  const parts = d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`
  return ` · resets in ${parts}`
}

const pick = (limits: SessionRateLimit[], kind: string) =>
  limits.find(l => l.kind === kind) ?? null

const store = async ($: EngineInterface, limits: SessionRateLimit[]) => {
  await update($, fiveHour, () => pick(limits, 'five_hour'))
  await update($, sevenDay, () => pick(limits, 'seven_day'))
}

export const register: Register = (on, options) => {
  const showWeekly = options.showWeekly === true

  on('session.start', async ($, e, next) => {
    const result = await next(e)
    await store($, (await $.session.usage()).rateLimits)
    return result
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('rateLimits')) {
      await store($, e.rateLimits)
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const windows = [
      { label: '5h', window: await read($, fiveHour) },
      ...(showWeekly ? [{ label: '7d', window: await read($, sevenDay) }] : []),
    ].filter(w => w.window !== null)

    if (e.props.hasSurvey || windows.length === 0) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const now = await $.clock.now()
    const width = windows.length > 1 ? 15 : 30

    return (
      <Box>
        {windows.map(({ label, window }, i) => {
          const percent = window!.percentUsed
          return (
            <Box key={label}>
              <Text dimColor>{i > 0 ? '   ' : ''}{label} </Text>
              <Text color={colorFor(percent)}>{bar(percent, width)}</Text>
              <Text> {percent}%</Text>
              <Text dimColor>{resetsIn(window!.resetsAt, now)}</Text>
            </Box>
          )
        })}
      </Box>
    )
  })
}

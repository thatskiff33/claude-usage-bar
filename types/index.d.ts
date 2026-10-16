export type Window = { kind: string; percentUsed: number; resetsAt?: string } | null

declare module 'claude-code' {
  interface PluginState {
    'usage-bar': { fiveHour: Window; sevenDay: Window }
  }
}

export type TeamId = 1 | 2 | 3 | 4

export type TeamColors = {
  primary: string
  shadow: string
  highlight: string
}

const DEFAULT_TEAM_COLORS: Record<TeamId, TeamColors> = {
  1: { primary: '#e63946', shadow: '#9f1d29', highlight: '#ff7b87' }, // red
  2: { primary: '#2563eb', shadow: '#1e3a8a', highlight: '#60a5fa' }, // blue
  3: { primary: '#eab308', shadow: '#a16207', highlight: '#fde047' }, // yellow
  4: { primary: '#22c55e', shadow: '#166534', highlight: '#86efac' }, // green
}

let teamColorState: Record<TeamId, TeamColors> = { ...DEFAULT_TEAM_COLORS }

function normalizeTeam(team: number): TeamId {
  const n = Math.round(team)
  if (n >= 1 && n <= 4) return n as TeamId
  const wrapped = ((n - 1) % 4 + 4) % 4
  return (wrapped + 1) as TeamId
}

export function getTeamColors(team: number): TeamColors {
  return teamColorState[normalizeTeam(team)]
}

export function setTeamColors(
  overrides: Partial<Record<TeamId, Partial<TeamColors>>>
): void {
  const next = { ...teamColorState }
  for (const key of [1, 2, 3, 4] as TeamId[]) {
    const patch = overrides[key]
    if (!patch) continue
    next[key] = { ...next[key], ...patch }
  }
  teamColorState = next
}

export function resetTeamColors(): void {
  teamColorState = { ...DEFAULT_TEAM_COLORS }
}

export const NEUTRAL_UNIT_COLORS = {
  metalDark: '#374151',
  metal: '#6b7280',
  metalLight: '#9ca3af',
  skin: '#f2c19b',
  tracks: '#2f2f2f',
  glass: '#8ecae6',
  accent: '#f59e0b',
}

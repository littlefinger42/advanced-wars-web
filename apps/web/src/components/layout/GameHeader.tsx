import { Button, Flex, Typography } from 'antd'

interface GameHeaderProps {
  roomCode?: string
  onBack: () => void
  turn?: number
  currentPlayer?: 1 | 2
  funds?: number
  onEndTurn?: () => void
  endTurnDisabled?: boolean
}

export default function GameHeader({
  roomCode,
  onBack,
  turn,
  currentPlayer,
  funds,
  onEndTurn,
  endTurnDisabled,
}: GameHeaderProps) {
  const showGameInfo = turn !== undefined && currentPlayer !== undefined && funds !== undefined

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        padding: '12px 16px',
        background: '#1e293b',
        flexShrink: 0,
        gap: 8,
      }}
    >
      <Button type="text" onClick={onBack} style={{ color: 'rgba(255,255,255,0.65)' }}>
        ← Back
      </Button>
      <Flex align="center" gap={16}>
        {roomCode && (
          <Typography.Text style={{ color: 'rgba(255,255,255,0.85)' }}>
            Room: {roomCode}
          </Typography.Text>
        )}
        {showGameInfo && (
          <>
            <Typography.Text style={{ color: 'rgba(255,255,255,0.85)' }}>
              Turn {turn}
            </Typography.Text>
            <Typography.Text
              strong
              style={{
                color: currentPlayer === 1 ? '#f87171' : '#60a5fa',
              }}
            >
              P{currentPlayer}
            </Typography.Text>
            <Typography.Text style={{ color: 'rgba(255,255,255,0.85)' }}>
              ${funds}
            </Typography.Text>
          </>
        )}
      </Flex>
      {onEndTurn ? (
        <Button type="primary" onClick={onEndTurn} disabled={endTurnDisabled}>
          End Turn
        </Button>
      ) : (
        <div style={{ width: 90 }} />
      )}
    </Flex>
  )
}

import { getUnitDefinition } from 'game-engine'
import type { Unit } from 'game-engine'
import { Card, Button, Descriptions, Typography } from 'antd'

interface UnitPanelProps {
  unit: Unit | null
  funds: number
  canCapture?: boolean
  onClose: () => void
  onCapture?: () => void
}

export default function UnitPanel({ unit, funds, canCapture, onClose, onCapture }: UnitPanelProps) {
  if (!unit) {
    return (
      <Card
        title="Unit"
        style={{ width: 240, flexShrink: 0, height: 'fit-content' }}
        styles={{ body: { textAlign: 'center', color: 'rgba(255,255,255,0.45)' } }}
      >
        <Typography.Text>Select a unit to view details</Typography.Text>
      </Card>
    )
  }

  const def = getUnitDefinition(unit.type)

  return (
    <Card
      title={def?.name ?? unit.type}
      extra={
        <Button type="text" size="small" onClick={onClose}>
          ×
        </Button>
      }
      style={{ width: 240, flexShrink: 0, height: 'fit-content' }}
      styles={{ body: { paddingTop: 16 } }}
    >
      <Descriptions column={1} size="small">
        <Descriptions.Item label="HP">{unit.hp}/10</Descriptions.Item>
        {def && def.ammo > 0 && (
          <Descriptions.Item label="Ammo">
            {unit.ammo}/{def.ammo}
          </Descriptions.Item>
        )}
        {def && (
          <Descriptions.Item label="Movement">{def.movementType}</Descriptions.Item>
        )}
        {def && (
          <Descriptions.Item label="Cost">${def.cost}</Descriptions.Item>
        )}
      </Descriptions>
      {canCapture && onCapture && (
        <Button type="primary" block size="large" onClick={onCapture} style={{ marginTop: 16 }}>
          Capture
        </Button>
      )}
      <Typography.Text
        strong
        style={{
          display: 'block',
          marginTop: 16,
          paddingTop: 12,
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        Funds: ${funds}
      </Typography.Text>
    </Card>
  )
}

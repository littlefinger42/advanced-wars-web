import { getUnitDefinition } from 'game-engine'
import type { Unit } from 'game-engine'
import styles from './UnitPanel.module.css'

interface UnitPanelProps {
  unit: Unit | null
  funds: number
  canCapture?: boolean
  onClose: () => void
  onCapture?: () => void
}

export default function UnitPanel({ unit, funds, canCapture, onClose, onCapture }: UnitPanelProps) {
  if (!unit) return null

  const def = getUnitDefinition(unit.type)

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>{def?.name ?? unit.type}</h3>
        <button className={styles.close} onClick={onClose}>
          ×
        </button>
      </div>
      <div className={styles.stats}>
        <div>HP: {unit.hp}/10</div>
        {def && def.ammo > 0 && <div>Ammo: {unit.ammo}/{def.ammo}</div>}
        {def && <div>Movement: {def.movementType}</div>}
        {def && <div>Cost: ${def.cost}</div>}
      </div>
      {canCapture && onCapture && (
        <button className={styles.capture} onClick={onCapture}>
          Capture
        </button>
      )}
      <div className={styles.funds}>
        Funds: ${funds}
      </div>
    </div>
  )
}

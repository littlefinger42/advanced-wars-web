import { getUnitDefinition, getUnitsProducibleAt } from 'game-engine'
import styles from './ProductionPanel.module.css'

interface ProductionPanelProps {
  propertyType: string
  x: number
  y: number
  funds: number
  onProduce: (unitType: string) => void
  onClose: () => void
}

export default function ProductionPanel({
  propertyType,
  funds,
  onProduce,
  onClose,
}: ProductionPanelProps) {
  const unitTypes = getUnitsProducibleAt(propertyType)

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Produce Unit</h3>
        <button className={styles.close} onClick={onClose}>
          ×
        </button>
      </div>
      <div className={styles.units}>
        {unitTypes.map((type) => {
          const def = getUnitDefinition(type)
          if (!def) return null
          const canAfford = funds >= def.cost
          return (
            <button
              key={type}
              className={styles.unitButton}
              onClick={() => canAfford && onProduce(type)}
              disabled={!canAfford}
            >
              <span>{def.name}</span>
              <span>${def.cost}</span>
            </button>
          )
        })}
      </div>
      <div className={styles.funds}>Funds: ${funds}</div>
    </div>
  )
}

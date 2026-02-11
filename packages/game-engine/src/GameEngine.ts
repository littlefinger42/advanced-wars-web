import { resolveCombat } from './combat.js'
import { getReachableTiles, getAttackableTiles } from './movement.js'
import type { GameState, GameAction, Unit, MapData, PlayerId } from './types.js'
import { getUnitDefinition, getUnitsProducibleAt } from './units.js'
import { canAttack } from './damageTable.js'
function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const INCOME_PER_CITY = 1000

export class GameEngine {
  private state: GameState

  constructor(map: MapData, initialUnits: Unit[] = []) {
    this.state = this.createInitialState(map, initialUnits)
  }

  private createInitialState(map: MapData, units: Unit[]): GameState {
    const funds: Record<PlayerId, number> = { 1: 0, 2: 0 }

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.tiles[y][x]
        if (tile.owner && tile.property === 'city') {
          funds[tile.owner] = (funds[tile.owner] ?? 0) + INCOME_PER_CITY
        }
      }
    }

    return {
      map,
      units,
      currentPlayer: 1,
      turn: 1,
      funds,
      day: 1,
      weather: 'clear',
      winner: null,
      phase: 'move',
    }
  }

  getState(): GameState {
    return { ...this.state }
  }

  getUnits(): Unit[] {
    return [...this.state.units]
  }

  getUnitAt(x: number, y: number): Unit | undefined {
    return this.state.units.find((u) => u.x === x && u.y === y)
  }

  processIncome(): void {
    for (const p of [1, 2] as PlayerId[]) {
      let cities = 0
      for (let y = 0; y < this.state.map.height; y++) {
        for (let x = 0; x < this.state.map.width; x++) {
          const tile = this.state.map.tiles[y][x]
          if (tile.owner === p && tile.property === 'city') cities++
        }
      }
      this.state.funds[p] = (this.state.funds[p] ?? 0) + cities * INCOME_PER_CITY
    }
  }

  resetUnitFlags(): void {
    for (const u of this.state.units) {
      u.hasMoved = false
      u.hasAttacked = false
    }
  }

  endTurn(): void {
    if (this.state.winner) return

    this.state.currentPlayer = this.state.currentPlayer === 1 ? 2 : 1
    this.resetUnitFlags()
    if (this.state.currentPlayer === 1) {
      this.state.turn++
      this.state.day++
      this.processIncome()
    }
    this.state.phase = 'move'
  }

  validateMove(unitId: string, x: number, y: number): string | null {
    const unit = this.state.units.find((u) => u.id === unitId)
    if (!unit) return 'Unit not found'
    if (unit.player !== this.state.currentPlayer) return 'Not your turn'
    if (unit.hasMoved) return 'Unit already moved'

    const reachable = getReachableTiles(
      this.state.map,
      unit,
      this.state.units,
      this.state.weather
    )
    const key = y * this.state.map.width + x
    if (!reachable.has(key)) return 'Tile not reachable'

    const existing = this.getUnitAt(x, y)
    if (existing) return 'Tile occupied'

    return null
  }

  move(unitId: string, x: number, y: number): string | null {
    const err = this.validateMove(unitId, x, y)
    if (err) return err

    const unit = this.state.units.find((u) => u.id === unitId)!
    unit.x = x
    unit.y = y
    unit.hasMoved = true

    return null
  }

  validateAttack(attackerId: string, defenderId: string): string | null {
    const attacker = this.state.units.find((u) => u.id === attackerId)
    const defender = this.state.units.find((u) => u.id === defenderId)
    if (!attacker || !defender) return 'Unit not found'
    if (attacker.player !== this.state.currentPlayer) return 'Not your turn'
    if (attacker.player === defender.player) return 'Cannot attack own unit'
    if (attacker.hasAttacked) return 'Unit already attacked'

    const def = getUnitDefinition(attacker.type)
    if (!def || !canAttack(attacker.type, defender.type)) return 'Cannot attack this unit'

    if (def.ammo > 0 && attacker.ammo <= 0) return 'No ammo'

    const reachable = getReachableTiles(
      this.state.map,
      attacker,
      this.state.units,
      this.state.weather
    )
    const attackable = getAttackableTiles(
      this.state.map,
      attacker,
      this.state.units
    )

    const canAttackPos = attackable.some((t) => t.x === defender.x && t.y === defender.y)
    if (!canAttackPos) return 'Target out of range'

    return null
  }

  attack(attackerId: string, defenderId: string): string | null {
    const err = this.validateAttack(attackerId, defenderId)
    if (err) return err

    const attacker = this.state.units.find((u) => u.id === attackerId)!
    const defender = this.state.units.find((u) => u.id === defenderId)!

    const result = resolveCombat(this.state, attacker, defender)

    attacker.hp = result.attackerHpAfter
    if (attacker.hp <= 0) {
      this.state.units = this.state.units.filter((u) => u.id !== attackerId)
    }

    defender.hp = result.defenderHpAfter
    if (result.defenderDestroyed) {
      this.state.units = this.state.units.filter((u) => u.id !== defenderId)
    }

    const def = getUnitDefinition(attacker.type)
    if (def && def.ammo > 0) attacker.ammo--

    attacker.hasAttacked = true

    this.checkWinCondition()
    return null
  }

  validateCapture(unitId: string): string | null {
    const unit = this.state.units.find((u) => u.id === unitId)
    if (!unit) return 'Unit not found'
    if (unit.player !== this.state.currentPlayer) return 'Not your turn'
    if (unit.hasAttacked) return 'Unit already acted'

    const def = getUnitDefinition(unit.type)
    if (!def || !def.canCapture) return 'Unit cannot capture'

    const tile = this.state.map.tiles[unit.y]?.[unit.x]
    if (!tile || !tile.property || tile.property === 'hq') return 'Nothing to capture'
    if (tile.owner === unit.player) return 'Already yours'

    return null
  }

  capture(unitId: string): string | null {
    const err = this.validateCapture(unitId)
    if (err) return err

    const unit = this.state.units.find((u) => u.id === unitId)!
    const tile = this.state.map.tiles[unit.y]![unit.x]!

    const captureAmount = Math.min(unit.hp * 2, tile.capturePoints)
    tile.capturePoints -= captureAmount

    if (tile.capturePoints <= 0) {
      tile.owner = unit.player
      tile.capturePoints = 20
    }

    unit.hasAttacked = true
    return null
  }

  validateProduce(propertyX: number, propertyY: number, unitType: string): string | null {
    const tile = this.state.map.tiles[propertyY]?.[propertyX]
    if (!tile || !tile.property) return 'Not a property'
    if (tile.owner !== this.state.currentPlayer) return 'Not your property'

    const producible = getUnitsProducibleAt(tile.property)
    if (!producible.includes(unitType as never)) return 'Cannot produce this unit here'

    const def = getUnitDefinition(unitType)
    if (!def) return 'Invalid unit type'

    const cost = def.cost
    const funds = this.state.funds[this.state.currentPlayer] ?? 0
    if (funds < cost) return 'Insufficient funds'

    const existing = this.getUnitAt(propertyX, propertyY)
    if (existing) return 'Property occupied'

    return null
  }

  produce(propertyX: number, propertyY: number, unitType: string): string | null {
    const err = this.validateProduce(propertyX, propertyY, unitType)
    if (err) return err

    const def = getUnitDefinition(unitType)!

    this.state.funds[this.state.currentPlayer]! -= def.cost

    const unit: Unit = {
      id: uuid(),
      type: unitType as Unit['type'],
      player: this.state.currentPlayer,
      x: propertyX,
      y: propertyY,
      hp: 10,
      ammo: def.ammo,
      fuel: def.fuel,
      hasMoved: true,
      hasAttacked: true,
    }

    this.state.units.push(unit)
    return null
  }

  processAction(action: GameAction): string | null {
    switch (action.type) {
      case 'move':
        return this.move(action.unitId, action.x, action.y)
      case 'attack':
        return this.attack(action.attackerId, action.defenderId)
      case 'capture':
        return this.capture(action.unitId)
      case 'produce':
        return this.produce(action.propertyX, action.propertyY, action.unitType)
      case 'end_turn':
        this.endTurn()
        return null
      default:
        return 'Unknown action'
    }
  }

  private checkWinCondition(): void {
    const p1Units = this.state.units.filter((u) => u.player === 1)
    const p2Units = this.state.units.filter((u) => u.player === 2)

    let p1Hq = false
    let p2Hq = false
    for (let y = 0; y < this.state.map.height; y++) {
      for (let x = 0; x < this.state.map.width; x++) {
        const t = this.state.map.tiles[y][x]
        if (t.property === 'hq') {
          if (t.owner === 1) p1Hq = true
          if (t.owner === 2) p2Hq = true
        }
      }
    }

    if (!p2Hq || p2Units.length === 0) this.state.winner = 1
    else if (!p1Hq || p1Units.length === 0) this.state.winner = 2
  }

  getReachableTiles(unit: Unit): Map<number, number> {
    return getReachableTiles(
      this.state.map,
      unit,
      this.state.units,
      this.state.weather
    )
  }

  getAttackableTiles(unit: Unit): { x: number; y: number }[] {
    return getAttackableTiles(
      this.state.map,
      unit,
      this.state.units
    )
  }
}

import { describe, expect, it } from 'vitest'
import { checkGoal, initialBoard, solvedBoard } from './FlowBoard'
import { GOAL_ORDER, supplierCatalog, vendorApi } from './scenarios'

describe('FlowBoard goal checks', () => {
  for (const sc of [vendorApi, supplierCatalog]) {
    it(`${sc.id}: untouched board completes no goals except none`, () => {
      const b = initialBoard(sc)
      for (const g of GOAL_ORDER) expect(checkGoal(g, sc, b).ok).toBe(false)
    })
    it(`${sc.id}: solved board passes every goal except update`, () => {
      const b = solvedBoard(sc, GOAL_ORDER)
      for (const g of GOAL_ORDER.filter((x) => x !== 'update')) expect(checkGoal(g, sc, b).issues).toEqual([])
    })
  }
  it('rejects wrong escalation target and late due date', () => {
    const b = solvedBoard(vendorApi, ['escalate', 'assign'])
    b.risk.to = 'Dana Whitfield'; b.tasks.find((t) => t.id === 't3')!.due = '2025-04-01'
    expect(checkGoal('escalate', vendorApi, b).ok).toBe(false)
    expect(checkGoal('assign', vendorApi, b).ok).toBe(false)
  })
  it('accepts a concise update and rejects a long one', () => {
    const b = initialBoard(vendorApi)
    b.update = 'Status: At risk. Vendor sandbox access is 5 days overdue, so the connector cannot start and the 21 March milestone is threatened. Decision needed: Maya to ask Dana to prompt the vendor today.'
    expect(checkGoal('update', vendorApi, b).ok).toBe(true)
    b.update += ' filler'.repeat(60)
    expect(checkGoal('update', vendorApi, b).ok).toBe(false)
  })
})

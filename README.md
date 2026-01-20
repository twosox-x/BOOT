# Liquidity Bootstrapping Terminal

This UI is ready to receive real data from the backend via the global `window.lbpConsole` helper.

## Data contract

```ts
window.lbpConsole.updateHistory([
  {
    timestamp: string,
    amount: string,
    status: string,
    txHash: string,
    explorerUrl?: string,
  },
]);

window.lbpConsole.updateStatusBar({
  tokenMint?: string,
  poolAddress?: string,
  isRunning?: boolean,
  timeUntilNextCycle?: string,
});

window.lbpConsole.updateService({
  tokenMint?: string,
  poolAddress?: string,
  cycleIntervalMinutes?: number,
  timeUntilNextCycle?: string,
});

window.lbpConsole.updateDepositTotals({
  totalSolDeposited?: number | string,
  totalTokensDeposited?: number | string,
  totalLpTokensDeposited?: number | string,
});

window.lbpConsole.updateNextCycle({
  nextCycleTime?: string | number | Date,
  timeUntilNextCycle?: string,
  cycleIntervalMinutes?: number,
  isRunning?: boolean,
});

window.lbpConsole.updateLatestCycle({
  cycleNumber?: number,
  status?: string,
  withdrawnSol?: number | string,
  solForSwap?: number | string,
  solForLp?: number | string,
  swapTxSignature?: string,
  depositTxSignature?: string,
});

window.lbpConsole.updateTotals({
  totalCycles?: number,
  totalWithdrawnSol?: number | string,
  totalTokensBought?: number | string,
  totalDeposits?: number,
});
```

All fields are optional partial updates. Timestamps should be ISO strings so the countdown stays accurate.

## Initialization

The page sets default placeholder values and immediately starts the countdown loop. When your backend payload arrives, call the update helpers above. Example:

```js
fetch("/api/lbp-cycle/state")
  .then((res) => res.json())
  .then((data) => {
    lbpConsole.updateStatusBar(data.service);
    lbpConsole.updateService(data.service);
    lbpConsole.updateDepositTotals(data.totals);
    lbpConsole.updateNextCycle({
      nextCycleTime: data.service.nextCycleTime,
      timeUntilNextCycle: data.service.timeUntilNextCycle,
      cycleIntervalMinutes: data.service.cycleIntervalMinutes,
      isRunning: data.service.isRunning,
    });
    lbpConsole.updateLatestCycle(data.latestCycle);
    lbpConsole.updateTotals(data.totals);
    lbpConsole.updateHistory(history);
  });
```

On load, the UI automatically calls `/api/lp-cycle/status` (no caching). If the request fails, it falls back to the sample payload defined in `script.js` so the terminal always displays meaningful data. Replace the fetch URL or shape as needed, but preserve the helper calls so every panel stays in sync.

## History rendering notes

- Table rows are rebuilt every time `updateHistory` is called.
- Each entry automatically links to Solscan unless an explicit `explorerUrl` is provided.
- When no entries are passed, the table shows a "WAITING FOR DATA" placeholder.

## Styling hooks

- Countdown gains the `active` class when the target time elapses (`EXECUTING`).
- Cursor highlight variables (`--glow-*`) already respond to pointer position; no backend work required.
- Status, service, deposit totals, latest cycle, and aggregates panels read directly from the helper methods above.

Feel free to connect your preferred state manager or event bus—just ensure the helper is invoked on every update. The UI is otherwise static and requires no additional build tooling.

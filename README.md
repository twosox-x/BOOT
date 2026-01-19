# Liquidity Bootstrapping Terminal

This UI is ready to receive real data from the backend via the global `window.lbpConsole` helper.

## Data contract

```ts
window.lbpConsole.updateStatus({
  sessionId?: string,
  uptime?: string,
  statusLabel?: string,
  online?: boolean,
});

window.lbpConsole.updateFunds({
  total?: string,
  creator?: string,
  reserve?: string,
});

window.lbpConsole.updateNextInjection({
  windowTimestamp?: string | number | Date, // ISO timestamp preferred
  amount?: string,
  executionMode?: string,
});

window.lbpConsole.updateHistory([
  {
    timestamp: string,
    amount: string,
    status: string,
    txHash: string,
    explorerUrl?: string,
  },
]);
```

All fields are optional partial updates. Timestamps should be ISO strings so the countdown stays accurate.

## Initialization

The page sets default placeholder values and immediately starts the countdown loop. When your backend payload arrives, call the update helpers above. Example:

```js
fetch("/api/lbp/state")
  .then((res) => res.json())
  .then((data) => {
    const {
      sessionId,
      uptime,
      status,
      online,
      funds,
      nextInjection,
      history,
    } = data;

    lbpConsole.updateStatus({
      sessionId,
      uptime,
      statusLabel: status,
      online,
    });

    lbpConsole.updateFunds(funds);
    lbpConsole.updateNextInjection(nextInjection);
    lbpConsole.updateHistory(history);
  });
```

## History rendering notes

- Table rows are rebuilt every time `updateHistory` is called.
- Each entry automatically links to Solscan unless an explicit `explorerUrl` is provided.
- When no entries are passed, the table shows a "WAITING FOR DATA" placeholder.

## Styling hooks

- `#status-indicator` toggles the `offline` class when `online` is false (optional CSS can use this).
- Countdown gains the `active` class when the target time elapses (`EXECUTING`).
- Cursor highlight variables (`--glow-*`) already respond to pointer position; no backend work required.

Feel free to connect your preferred state manager or event bus—just ensure the helper is invoked on every update. The UI is otherwise static and requires no additional build tooling.

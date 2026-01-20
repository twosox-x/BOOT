const countdownEl = document.getElementById("countdown");
const nextTimestampEl = document.getElementById("next-timestamp");
const historyLogEl = document.getElementById("history-log");
const statusMintEl = document.getElementById("status-mint");
const statusPoolEl = document.getElementById("status-pool");
const statusStateEl = document.getElementById("status-state");
const statusEtaEl = document.getElementById("status-eta");
const serviceMintEl = document.getElementById("service-mint");
const servicePoolEl = document.getElementById("service-pool");
const serviceIntervalEl = document.getElementById("service-interval");
const serviceNextCycleEl = document.getElementById("service-next-cycle");
const nextTimeUntilEl = document.getElementById("next-time-until");
const nextIntervalEl = document.getElementById("next-interval");
const nextServiceStateEl = document.getElementById("next-service-state");
const latestCycleNumberEl = document.getElementById("latest-cycle-number");
const latestCycleStatusEl = document.getElementById("latest-cycle-status");
const latestWithdrawnEl = document.getElementById("latest-withdrawn");
const latestSwapEl = document.getElementById("latest-swap");
const latestLpEl = document.getElementById("latest-lp");
const latestSwapTxEl = document.getElementById("latest-swap-tx");
const latestDepositTxEl = document.getElementById("latest-deposit-tx");
const totalsCyclesEl = document.getElementById("totals-cycles");
const totalsSolEl = document.getElementById("totals-sol");
const totalsTokensEl = document.getElementById("totals-tokens");
const totalsDepositsEl = document.getElementById("totals-deposits");
const totalsSolDepositedEl = document.getElementById("totals-sol-deposited");
const totalsTokensDepositedEl = document.getElementById("totals-tokens-deposited");
const totalsLpDepositedEl = document.getElementById("totals-lp-deposited");

let countdownTarget = new Date("2026-01-22T14:30:00Z");

const SAMPLE_STATUS_RESPONSE = {
  "service": {
    "isRunning": true,
    "nextCycleTime": 1735689600000,
    "timeUntilNextCycle": "32m 15s",
    "timeUntilNextCycleMs": 1935000,
    "cycleIntervalMinutes": 60,
    "tokenMint": "7HcZz4segTW8rLM6m5bR7ZQ8KamTm1MJ3jhdDNirpump",
    "poolAddress": "8xKXTG2wJ4Qbd7E1F4Y5L9vN3mP6qR2sT1uV4wX7yZ9aB",
    "currentCycle": null
  },
  "latestCycle": {
    "cycleNumber": 12,
    "startedAt": "2024-12-31T14:00:00.000Z",
    "completedAt": "2024-12-31T14:03:45.000Z",
    "status": "completed",
    "withdrawnSol": 2.456789,
    "tokensBought": "1250000000",
    "solForSwap": 1.203394,
    "solForLp": 1.203394,
    "lpTokensReceived": null,
    "swapTxSignature": "5KJ8mN3pQ7rT2vW9xY4zA6bC1dE8fG2hI5jL7kM9nO3qR6sT4uV8wX1yZ5aB2cD",
    "depositTxSignature": "3mP6qR2sT1uV4wX7yZ9aB8xKXTG2wJ4Qbd7E1F4Y5L9vN3mP6qR2sT1uV4wX7yZ",
    "errorMessage": null,
    "deposits": [
      {
        "txSignature": "3mP6qR2sT1uV4wX7yZ9aB8xKXTG2wJ4Qbd7E1F4Y5L9vN3mP6qR2sT1uV4wX7yZ",
        "solAmount": 1.203394,
        "tokenAmount": "1250000000",
        "lpTokens": "0",
        "poolAddress": "8xKXTG2wJ4Qbd7E1F4Y5L9vN3mP6qR2sT1uV4wX7yZ9aB",
        "tokenMint": "7HcZz4segTW8rLM6m5bR7ZQ8KamTm1MJ3jhdDNirpump",
        "createdAt": "2024-12-31T14:03:45.123Z"
      }
    ]
  },
  "totals": {
    "totalCycles": 12,
    "totalWithdrawnSol": 28.345678,
    "totalTokensBought": "14500000000",
    "totalLpTokensReceived": "0",
    "totalDeposits": 12,
    "totalSolDeposited": 14.172839,
    "totalTokensDeposited": "14500000000",
    "totalLpTokensDeposited": "0"
  },
  "statistics": {
    "cycles": {
      "total": 12,
      "totalWithdrawnSol": 28.345678,
      "totalTokensBought": "14500000000",
      "totalLpTokens": "0",
      "latestCycleNumber": 12,
      "firstCycleAt": "2024-12-30T14:00:00.000Z",
      "lastCycleAt": "2024-12-31T14:00:00.000Z"
    },
    "deposits": {
      "total": 12,
      "totalSolDeposited": 14.172839,
      "totalTokensDeposited": "14500000000",
      "totalLpTokensDeposited": "0"
    }
  }
};

const formatTimestamp = (date) =>
  date.toISOString().replace("T", " ").replace(".000Z", " UTC");

const formatAbbrev = (value = "", head = 4, tail = 3) => {
  if (!value) return "--";
  if (value.length <= head + tail) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
};

const setCountdownTarget = (input) => {
  if (!input) return;
  const newTarget = new Date(input);
  if (Number.isNaN(newTarget.getTime())) return;
  countdownTarget = newTarget;
  nextTimestampEl.textContent = formatTimestamp(newTarget);
};

const updateCountdown = () => {
  const now = new Date();
  const diff = countdownTarget - now;

  if (diff <= 0) {
    countdownEl.textContent = "EXECUTING";
    countdownEl.classList.add("active");
    return;
  }

  countdownEl.classList.remove("active");
  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
  countdownEl.textContent = `${hours}:${minutes}:${seconds}`;
};

updateCountdown();
setInterval(updateCountdown, 1000);

const formatHash = (hash = "") => {
  if (hash.length <= 10) return hash || "--";
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const buildHistoryTable = (entries = []) => {
  if (!entries.length) {
    return [
      "╔══════════════════════╦════════════╦════════════╦════════════════════════════╗",
      "║      TIMESTAMP       ║   AMOUNT   ║   STATUS   ║          TX HASH           ║",
      "╠══════════════════════╬════════════╬════════════╬════════════════════════════╣",
      "║  WAITING FOR DATA    ║     --     ║     --     ║  --                        ║",
      "╚══════════════════════╩════════════╩════════════╩════════════════════════════╝",
    ].join("\n");
  }

  const rows = entries
    .map(({ timestamp = "--", amount = "--", status = "--", txHash = "--", explorerUrl }) => {
      const paddedTs = timestamp.padEnd(20, " ");
      const paddedAmount = amount.toString().padStart(10, " ");
      const paddedStatus = status.toString().padStart(10, " ");
      const hashDisplay = formatHash(txHash).padEnd(12, " ");
      const linkHref = explorerUrl || (txHash && `https://solscan.io/tx/${txHash}`);
      const link = linkHref
        ? `<span class="tx-entry">${hashDisplay} <a href="${linkHref}" target="_blank" rel="noopener" class="tx-link">solscan</a></span>`
        : hashDisplay;
      return `║ ${paddedTs} ║ ${paddedAmount} ║ ${paddedStatus} ║  ${link}           ║`;
    })
    .join("\n");

  return [
    "╔══════════════════════╦════════════╦════════════╦════════════════════════════╗",
    "║      TIMESTAMP       ║   AMOUNT   ║   STATUS   ║          TX HASH           ║",
    "╠══════════════════════╬════════════╬════════════╬════════════════════════════╣",
    rows,
    "╚══════════════════════╩════════════╩════════════╩════════════════════════════╝",
  ].join("\n");
};

const applyStatusBar = ({ tokenMint, poolAddress, isRunning, timeUntilNextCycle } = {}) => {
  if (tokenMint) statusMintEl.textContent = formatAbbrev(tokenMint, 4, 4);
  if (poolAddress) statusPoolEl.textContent = formatAbbrev(poolAddress, 4, 4);
  if (typeof isRunning !== "undefined") statusStateEl.textContent = isRunning ? "RUNNING" : "PAUSED";
  if (timeUntilNextCycle) statusEtaEl.textContent = timeUntilNextCycle;
};

const applyDepositTotals = ({ totalSolDeposited, totalTokensDeposited, totalLpTokensDeposited } = {}) => {
  if (typeof totalSolDeposited !== "undefined") {
    totalsSolDepositedEl.textContent = `Ξ ${Number(totalSolDeposited).toFixed(6)}`;
  }
  if (typeof totalTokensDeposited !== "undefined") {
    totalsTokensDepositedEl.textContent = Number(totalTokensDeposited).toLocaleString();
  }
  if (typeof totalLpTokensDeposited !== "undefined") {
    totalsLpDepositedEl.textContent = Number(totalLpTokensDeposited).toLocaleString();
  }
};

const applyNextCycleTracker = ({ nextCycleTime, timeUntilNextCycle, cycleIntervalMinutes, isRunning } = {}) => {
  if (nextCycleTime) setCountdownTarget(nextCycleTime);
  if (timeUntilNextCycle) nextTimeUntilEl.textContent = timeUntilNextCycle;
  if (cycleIntervalMinutes) nextIntervalEl.textContent = `${cycleIntervalMinutes} min`;
  if (typeof isRunning !== "undefined") nextServiceStateEl.textContent = isRunning ? "RUNNING" : "PAUSED";
};

const applyHistory = (entries) => {
  historyLogEl.innerHTML = buildHistoryTable(entries);
};

const applyService = ({ tokenMint, poolAddress, cycleIntervalMinutes, timeUntilNextCycle } = {}) => {
  if (tokenMint) serviceMintEl.textContent = formatAbbrev(tokenMint, 4, 4);
  if (poolAddress) servicePoolEl.textContent = formatAbbrev(poolAddress, 4, 4);
  if (cycleIntervalMinutes) serviceIntervalEl.textContent = `${cycleIntervalMinutes} min`;
  if (timeUntilNextCycle) serviceNextCycleEl.textContent = timeUntilNextCycle;
};

const applyLatestCycle = ({
  cycleNumber,
  status,
  withdrawnSol,
  solForSwap,
  solForLp,
  swapTxSignature,
  depositTxSignature,
} = {}) => {
  if (typeof cycleNumber !== "undefined") latestCycleNumberEl.textContent = cycleNumber;
  if (status) latestCycleStatusEl.textContent = status.toUpperCase();
  if (typeof withdrawnSol !== "undefined") latestWithdrawnEl.textContent = `Ξ ${Number(withdrawnSol).toFixed(6)}`;
  if (typeof solForSwap !== "undefined") latestSwapEl.textContent = `Ξ ${Number(solForSwap).toFixed(6)}`;
  if (typeof solForLp !== "undefined") latestLpEl.textContent = `Ξ ${Number(solForLp).toFixed(6)}`;
  if (swapTxSignature) latestSwapTxEl.textContent = formatAbbrev(swapTxSignature, 4, 3);
  if (depositTxSignature) latestDepositTxEl.textContent = formatAbbrev(depositTxSignature, 4, 3);
};

const applyTotals = ({ totalCycles, totalWithdrawnSol, totalTokensBought, totalDeposits } = {}) => {
  if (typeof totalCycles !== "undefined") totalsCyclesEl.textContent = totalCycles;
  if (typeof totalWithdrawnSol !== "undefined") totalsSolEl.textContent = `Ξ ${Number(totalWithdrawnSol).toFixed(6)}`;
  if (typeof totalTokensBought !== "undefined") totalsTokensEl.textContent = Number(totalTokensBought).toLocaleString();
  if (typeof totalDeposits !== "undefined") totalsDepositsEl.textContent = totalDeposits;
};

const normalizeHistoryEntries = (latestCycle = {}) => {
  const entries = [];
  if (!latestCycle) return entries;

  const baseTimestamp = latestCycle.completedAt || latestCycle.startedAt;
  if (latestCycle.depositTxSignature) {
    entries.push({
      timestamp: baseTimestamp ? formatTimestamp(new Date(baseTimestamp)) : "--",
      amount: latestCycle.withdrawnSol ? `Ξ ${Number(latestCycle.withdrawnSol).toFixed(6)}` : "--",
      status: (latestCycle.status || "").toUpperCase() || "--",
      txHash: latestCycle.depositTxSignature,
      explorerUrl: `https://solscan.io/tx/${latestCycle.depositTxSignature}`,
    });
  }

  if (Array.isArray(latestCycle.deposits)) {
    latestCycle.deposits.forEach((deposit) => {
      entries.push({
        timestamp: deposit.createdAt ? formatTimestamp(new Date(deposit.createdAt)) : baseTimestamp || "--",
        amount: deposit.solAmount ? `Ξ ${Number(deposit.solAmount).toFixed(6)}` : "--",
        status: "DEPOSIT",
        txHash: deposit.txSignature,
        explorerUrl: deposit.txSignature ? `https://solscan.io/tx/${deposit.txSignature}` : undefined,
      });
    });
  }

  return entries;
};

const hydrateFromStatusPayload = (payload = SAMPLE_STATUS_RESPONSE) => {
  const { service = {}, latestCycle = {}, totals = {} } = payload;

  applyStatusBar(service);
  applyService(service);
  applyDepositTotals(totals);
  applyNextCycleTracker({
    nextCycleTime: service.nextCycleTime,
    timeUntilNextCycle: service.timeUntilNextCycle,
    cycleIntervalMinutes: service.cycleIntervalMinutes,
    isRunning: service.isRunning,
  });
  applyLatestCycle(latestCycle);
  applyTotals({
    totalCycles: totals.totalCycles,
    totalWithdrawnSol: totals.totalWithdrawnSol,
    totalTokensBought: totals.totalTokensBought,
    totalDeposits: totals.totalDeposits,
  });

  applyHistory(normalizeHistoryEntries(latestCycle));
};

const fetchStatusPayload = async () => {
  try {
    const response = await fetch("/api/lp-cycle/status", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("Falling back to sample LP status", error);
    return SAMPLE_STATUS_RESPONSE;
  }
};

const lbpConsole = {
  updateStatusBar: applyStatusBar,
  updateService: applyService,
  updateDepositTotals: applyDepositTotals,
  updateNextCycle: applyNextCycleTracker,
  updateLatestCycle: applyLatestCycle,
  updateTotals: applyTotals,
  updateHistory: applyHistory,
  setCountdownTarget,
};

window.lbpConsole = lbpConsole;

const bootstrapConsole = async () => {
  const payload = await fetchStatusPayload();
  hydrateFromStatusPayload(payload);
};

bootstrapConsole();

const root = document.documentElement;
const updateGlow = (x, y) => {
  const boundedX = Math.max(5, Math.min(window.innerWidth - 5, x));
  const boundedY = Math.max(5, Math.min(window.innerHeight - 5, y));
  const xRatio = boundedX / window.innerWidth;
  const yRatio = boundedY / window.innerHeight;
  const horizEdge = Math.max(0, 1 - Math.min(xRatio, 1 - xRatio) * 2);
  const vertEdge = Math.max(0, 1 - Math.min(yRatio, 1 - yRatio) * 2);
  const radiusX = Math.max(140, 520 + vertEdge * 260 - horizEdge * 360);
  const radiusY = Math.max(90, 320 + horizEdge * 340 - vertEdge * 220);

  root.style.setProperty("--glow-x", `${xRatio * 100}%`);
  root.style.setProperty("--glow-y", `${yRatio * 100}%`);
  root.style.setProperty("--glow-radius-x", `${radiusX}px`);
  root.style.setProperty("--glow-radius-y", `${radiusY}px`);
};

window.addEventListener("pointermove", (e) => updateGlow(e.clientX, e.clientY));
window.addEventListener("pointerleave", () => updateGlow(window.innerWidth / 2, window.innerHeight / 2));

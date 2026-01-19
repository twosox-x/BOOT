const countdownEl = document.getElementById("countdown");
const nextTimestampEl = document.getElementById("next-timestamp");
const sessionIdEl = document.getElementById("session-id");
const statusIndicatorEl = document.getElementById("status-indicator");
const statusLabelEl = document.getElementById("status-label");
const uptimeEl = document.getElementById("uptime");
const fundsTotalEl = document.getElementById("funds-total");
const fundsCreatorEl = document.getElementById("funds-creator");
const fundsReserveEl = document.getElementById("funds-reserve");
const nextAmountEl = document.getElementById("next-amount");
const executionModeEl = document.getElementById("execution-mode");
const historyLogEl = document.getElementById("history-log");

let countdownTarget = new Date("2026-01-22T14:30:00Z");

const formatTimestamp = (date) =>
  date.toISOString().replace("T", " ").replace(".000Z", " UTC");

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

const applyStatus = ({ sessionId, uptime, statusLabel = "ONLINE", online = true } = {}) => {
  if (sessionId) sessionIdEl.textContent = sessionId;
  if (uptime) uptimeEl.textContent = uptime;
  statusLabelEl.textContent = statusLabel;
  statusIndicatorEl.textContent = online ? "■" : "□";
  statusIndicatorEl.classList.toggle("offline", !online);
};

const applyFunds = ({ total, creator, reserve } = {}) => {
  if (typeof total !== "undefined") fundsTotalEl.textContent = total;
  if (typeof creator !== "undefined") fundsCreatorEl.textContent = creator;
  if (typeof reserve !== "undefined") fundsReserveEl.textContent = reserve;
};

const applyNextInjection = ({ windowTimestamp, amount, executionMode } = {}) => {
  if (windowTimestamp) setCountdownTarget(windowTimestamp);
  if (typeof amount !== "undefined") nextAmountEl.textContent = amount;
  if (executionMode) executionModeEl.textContent = executionMode;
};

const applyHistory = (entries) => {
  historyLogEl.innerHTML = buildHistoryTable(entries);
};

const lbpConsole = {
  updateStatus: applyStatus,
  updateFunds: applyFunds,
  updateNextInjection: applyNextInjection,
  updateHistory: applyHistory,
  setCountdownTarget,
};

window.lbpConsole = lbpConsole;

lbpConsole.updateStatus({ sessionId: "LBP-CTRL-01", uptime: "47d 12h 33m", statusLabel: "ONLINE", online: true });
lbpConsole.updateFunds({ total: "Ξ 1,245.33", creator: "Ξ 482.10", reserve: "Ξ 613.00" });
lbpConsole.updateNextInjection({ windowTimestamp: countdownTarget.toISOString(), amount: "Ξ 250.00", executionMode: "AUTO" });
lbpConsole.updateHistory();

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

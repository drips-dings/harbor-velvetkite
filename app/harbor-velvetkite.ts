import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import {
  createPublicClient,
  http,
  formatEther,
  isAddress,
  parseAbi,
  formatUnits,
} from "viem";
import { base, baseSepolia } from "viem/chains";

type Net = {
  chain: typeof base;
  chainId: number;
  rpc: string;
  explorer: string;
  label: string;
};

const NETS: Net[] = [
  {
    chain: baseSepolia,
    chainId: 84532,
    rpc: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    label: "Base Sepolia",
  },
  {
    chain: base,
    chainId: 8453,
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    label: "Base Mainnet",
  },
];

let active = NETS[0];

const sdk = new CoinbaseWalletSDK({
  appName: "Harbor Velvetkite (Built for Base)",
  appLogoUrl: "https://base.org/favicon.ico",
});

const ERC20_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
]);

type Session = { address: `0x${string}`; chainId: number } | null;
let session: Session = null;

const out = document.createElement("pre");
out.style.whiteSpace = "pre-wrap";
out.style.wordBreak = "break-word";
out.style.background = "#0b0f1a";
out.style.color = "#dbe7ff";
out.style.padding = "14px";
out.style.borderRadius = "14px";
out.style.border = "1px solid rgba(255,255,255,0.12)";
out.style.minHeight = "460px";

function print(lines: string[]) {
  out.textContent = lines.join("\n");
}

function pc() {
  return createPublicClient({ chain: active.chain, transport: http(active.rpc) });
}

function asAddr(v: string): `0x${string}` {
  if (!isAddress(v)) throw new Error("Invalid address");
  return v as `0x${string}`;
}

function targetOrWallet(v: string): `0x${string}` {
  const t = v.trim();
  if (t) return asAddr(t);
  if (session?.address) return session.address;
  throw new Error("Provide an address or connect a wallet first");
}

async function connectWallet() {
  const provider = sdk.makeWeb3Provider(active.rpc, active.chainId);
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  const a = accounts?.[0];
  if (!a) throw new Error("No address returned from wallet");

  const chainHex = (await provider.request({ method: "eth_chainId" })) as string;
  session = { address: asAddr(a), chainId: parseInt(chainHex, 16) };

  const c = pc();
  const [bal, bn, nonce] = await Promise.all([
    c.getBalance({ address: session.address }),
    c.getBlockNumber(),
    c.getTransactionCount({ address: session.address }),
  ]);

  print([
    "Wallet session established",
    `Network: ${active.label}`,
    `chainId: ${session.chainId}`,
    `Address: ${session.address}`,
    `ETH balance: ${formatEther(bal)} ETH`,
    `Transaction count: ${nonce}`,
    `Latest block: ${bn}`,
    `Basescan: ${active.explorer}/address/${session.address}`,
  ]);
}

async function networkPulse() {
  const c = pc();
  const [reportedChainId, bn, gasPrice, block] = await Promise.all([
    c.getChainId(),
    c.getBlockNumber(),
    c.getGasPrice(),
    c.getBlock(),
  ]);

  const ok = reportedChainId === 8453 || reportedChainId === 84532;

  print([
    "Network pulse",
    `Network: ${active.label}`,
    `Reported chainId: ${reportedChainId} (${ok ? "Base-compatible" : "unexpected"})`,
    `Block height: ${bn}`,
    `Timestamp: ${block.timestamp}`,
    `Gas price (wei): ${gasPrice.toString()}`,
    `Gas used: ${block.gasUsed}`,
    `Gas limit: ${block.gasLimit}`,
    `Basescan: ${active.explorer}/block/${bn}`,
  ]);
}

async function addressProbe(input: string) {
  const a = targetOrWallet(input);
  const c = pc();

  const [bal, nonce, code] = await Promise.all([
    c.getBalance({ address: a }),
    c.getTransactionCount({ address: a }),
    c.getBytecode({ address: a }),
  ]);

  const hasCode = !!code && code !== "0x";

  print([
    "Address probe",
    `Network: ${active.label}`,
    `Address: ${a}`,
    `ETH balance: ${formatEther(bal)} ETH`,
    `Transaction count: ${nonce}`,
    `Contract bytecode present: ${hasCode ? "yes" : "no"}`,
    `Basescan: ${active.explorer}/address/${a}`,
  ]);
}

async function erc20Probe(tokenInput: string, holderInput: string) {
  const token = asAddr(tokenInput.trim());
  const holder = targetOrWallet(holderInput);
  const c = pc();

  const [name, symbol, decimals, supply, bal] = await Promise.all([
    c.readContract({ address: token, abi: ERC20_ABI, functionName: "name" }),
    c.readContract({ address: token, abi: ERC20_ABI, functionName: "symbol" }),
    c.readContract({ address: token, abi: ERC20_ABI, functionName: "decimals" }),
    c.readContract({ address: token, abi: ERC20_ABI, functionName: "totalSupply" }),
    c.readContract({
      address: token,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [holder],
    }),
  ]);

  const d = Number(decimals);

  print([
    "ERC-20 probe (read-only)",
    `Network: ${active.label}`,
    `Token: ${token}`,
    `Holder: ${holder}`,
    `Name: ${String(name)}`,
    `Symbol: ${String(symbol)}`,
    `Decimals: ${d}`,
    `Total supply: ${formatUnits(supply as bigint, d)}`,
    `Holder balance: ${formatUnits(bal as bigint, d)}`,
    `Token on Basescan: ${active.explorer}/address/${token}`,
    `Holder on Basescan: ${active.explorer}/address/${holder}`,
  ]);
}

function toggleNetwork() {
  active = active.chainId === 84532 ? NETS[1] : NETS[0];
  session = null;
  print([`Switched to ${active.label}. Reconnect wallet to refresh.`]);
}

function mount() {
  const root = document.createElement("div");
  root.style.maxWidth = "1180px";
  root.style.margin = "24px auto";
  root.style.fontFamily = "ui-sans-serif, system-ui";

  const h1 = document.createElement("h1");
  h1.textContent = "Harbor Velvetkite";

  const blurb = document.createElement("div");
  blurb.textContent =
    "Built for Base: wallet connection, chainId validation, and read-only probes (network, address, ERC-20) with Basescan references.";
  blurb.style.opacity = "0.8";
  blurb.style.marginBottom = "12px";

  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.flexWrap = "wrap";
  row.style.gap = "10px";
  row.style.marginBottom = "10px";

  const row2 = document.createElement("div");
  row2.style.display = "flex";
  row2.style.flexWrap = "wrap";
  row2.style.gap = "10px";
  row2.style.marginBottom = "12px";

  function btn(label: string, fn: () => void | Promise<void>) {
    const b = document.createElement("button");
    b.textContent = label;
    b.style.padding = "8px 10px";
    b.onclick = () => Promise.resolve(fn()).catch((e) => print([`Error: ${e?.message ?? String(e)}`]));
    return b;
  }

  const addrInput = document.createElement("input");
  addrInput.placeholder = "0x… address (optional; defaults to wallet)";
  addrInput.style.minWidth = "430px";
  addrInput.style.padding = "8px 10px";

  const tokenInput = document.createElement("input");
  tokenInput.placeholder = "0x… ERC-20 token address";
  tokenInput.style.minWidth = "430px";
  tokenInput.style.padding = "8px 10px";

  row.append(
    btn("Connect Wallet", connectWallet),
    btn("Toggle Network", toggleNetwork),
    btn("Network Pulse", networkPulse),
  );

  row2.append(
    addrInput,
    btn("Probe Address", () => addressProbe(addrInput.value)),
    tokenInput,
    btn("Probe ERC-20", () => erc20Probe(tokenInput.value, addrInput.value)),
  );

  root.append(h1, blurb, row, row2, out);
  document.body.appendChild(root);

  print(["Ready", `Active network: ${active.label}`, "Connect wallet to begin (read-only)."]);
}

mount();

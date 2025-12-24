# Harbor Velvetkite — Architecture Notes

Short design notes covering Base alignment, read-only behavior, and dependency choices.

---

## Base Alignment

Harbor Velvetkite is **Base-first**:

- Supports Base Mainnet and Base Sepolia only
- Uses official public Base RPC endpoints
- Explorer links are derived from BaseScan
- All network metadata lives in `config/base.networks.json`

No chain IDs, RPC URLs, or explorers should be hardcoded in code.

---

## Read-only Approach

The project is intentionally scoped to **read-only operations**:

- Native ETH balance checks
- Contract code existence checks
- Block and chain metadata inspection
- Optional token metadata reads

This minimizes risk and keeps validation deterministic.

---

## Dependency Choices

Guiding principles:
- Prefer Base ecosystem or Base-compatible libraries
- Keep dependencies minimal and clearly justified
- Avoid overlapping libraries with the same responsibility
- Treat network data as configuration, not logic

Any new dependency should be easy to remove if requirements change.

---

## Tradeoffs

- ✅ Simple validation and auditing
- ✅ Low operational risk
- ❌ No transaction execution paths
- ❌ Limited write-side coverage

These tradeoffs are intentional for the current scope.

---

_Last updated: initial scaffold_

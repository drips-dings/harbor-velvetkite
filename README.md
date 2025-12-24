# Harbor Velvetkite (Built for Base)

Deployed on Base Mainnet.

Harbor Velvetkite is a developer-facing Base console that prioritizes verification. It connects a Coinbase Wallet, confirms the active Base chainId (8453 / 84532), and runs read-only probes that point back to Basescan for independent cross-checking.

## Base networks

Base Sepolia  
chainId (decimal): 84532  
Explorer: https://sepolia.basescan.org  

Base Mainnet  
chainId (decimal): 8453  
Explorer: https://basescan.org  

Base Mainnet onchain references (verification placeholders):
- https://basescan.org/address/your_address
- https://basescan.org/address/your_address#code  

## What you can do with it

- Establish an EIP-1193 wallet session via Coinbase Wallet SDK  
- Validate chain identity against Base chainIds  
- Pull a “network pulse” (block height, timestamp, gas signals)  
- Probe an address (balance, nonce, bytecode presence)  
- Probe an ERC-20 contract (metadata, supply, holder balance)  
- Follow Basescan links for quick verification  

All operations are strictly read-only. No transactions are signed or broadcast.

## Repository layout

- app.harbor-velvetkite.ts  
  Browser script that renders a tiny UI and performs Base RPC reads.

- config/base.networks.json  
  Static configuration for Base Mainnet/Base Sepolia (chainIds, RPC URLs, explorers).

- docs/architecture.md  
  Short design notes on Base alignment, the read-only approach, and dependency choices.

- docs/validation-notes.md  
  Testnet validation notes and explorer checks recorded during Base Sepolia runs.

- scripts/sample-addresses.json  
  Example addresses/tokens for repeatable probing.

- contracts/  
  Solidity contracts deployed to Base Sepolia for testnet validation:
  - your_contract.sol — minimal contract used to validate deployment and verification flow  
  - your_contract.sol — simple stateful contract for interaction testing  
  - your_contract.sol — lightweight registry contract used for read-only queries  

- package.json  
  Dependency manifest referencing Base + Coinbase repositories.

- README.md  
  Technical documentation and deployment records.

## Dependency map

This repository intentionally references both ecosystems:
- @coinbase/wallet-sdk for wallet connectivity  
- @coinbase/onchainkit as a Base-aligned SDK reference surface  
- viem for typed, efficient RPC reads  
- Multiple Base and Coinbase GitHub repositories included as direct dependencies  

## License

MIT License

Copyright (c) 2025 YOUR_NAME

## Author

GitHub: https://github.com/your-handle  
Email: you@example.com  
Public contact: https://x.com/your-handle  

## Testnet Deployment (Base Sepolia)

As part of pre-production validation, one or more contracts may be deployed to the Base Sepolia test network to confirm correct behavior and tooling compatibility.

Network: Base Sepolia  
chainId (decimal): 84532  
Explorer: https://sepolia.basescan.org  

Contract #1 address:  
your_address

Deployment and verification:
- https://sepolia.basescan.org/address/your_adress
- https://sepolia.basescan.org/your_address/0#code  

Contract #2 address:  
your_address

Deployment and verification:
- https://sepolia.basescan.org/address/your_address
- https://sepolia.basescan.org/your_address/0#code  

Contract #3 address:  
your_address

Deployment and verification:
- https://sepolia.basescan.org/address/your_address
- https://sepolia.basescan.org/your_address/0#code 
These testnet deployments provide a controlled environment for validating Base tooling, account abstraction flows, and read-only onchain interactions prior to Base Mainnet usage.

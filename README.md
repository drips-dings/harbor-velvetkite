# Harbor Velvetkite (Built for Base)

Harbor Velvetkite is a developer-facing Base console that prioritizes verification. It connects a Coinbase Wallet, confirms the active Base chainId (8453 / 84532), and runs read-only probes that point back to Basescan for independent cross-checking.

## Base networks

Base Sepolia  
chainId (decimal): 84532  
Explorer: https://sepolia.basescan.org  

Base Mainnet  
chainId (decimal): 8453  
Explorer: https://basescan.org  

## What you can do with it

- Establish an EIP-1193 wallet session via Coinbase Wallet SDK  
- Validate chain identity against Base chainIds  
- Pull a “network pulse” (block height, timestamp, gas signals)  
- Probe an address (balance, nonce, bytecode presence)  
- Probe an ERC-20 contract (metadata, supply, holder balance)  
- Follow Basescan links for quick verification  

All operations are strictly read-only. No transactions are signed or broadcast.

## Repository layout

- app/harbor-velvetkite.ts  
  Browser script that renders a tiny UI and performs Base RPC reads.

- config/base.networks.json  
  Static configuration for Base Mainnet/Base Sepolia (chainIds, RPC URLs, explorers).

- docs/architecture.md  
  Short design notes on Base alignment, the read-only approach, and dependency choices.

- scripts/sample-addresses.json  
  Example addresses/tokens for repeatable probing.

- contracts/  
  Solidity contracts deployed to Base Sepolia for testnet validation:
  - ERC721.sol — smart contract that implements the ERC-721 (NFT) standard

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

GitHub: https://github.com/drips-dings

Email: drips_dings_0q@icloud.com 

Public contact: https://x.com/nancy_bx58 

## Testnet Deployment (Base Sepolia)

As part of pre-production validation, one or more contracts may be deployed to the Base Sepolia test network to confirm correct behavior and tooling compatibility.

Network: Base Sepolia  
chainId (decimal): 84532  
Explorer: https://sepolia.basescan.org  

Contract ERC721.sol address:  
0x1370F5C79512562d943f3B05BD603dEF2B7cCeba

Deployment and verification:
- https://sepolia.basescan.org/address/0x1370F5C79512562d943f3B05BD603dEF2B7cCeba
- https://sepolia.basescan.org/0x1370F5C79512562d943f3B05BD603dEF2B7cCeba/0#code  

These testnet deployments provide a controlled environment for validating Base tooling, account abstraction flows, and read-only onchain interactions prior to Base Mainnet usage.

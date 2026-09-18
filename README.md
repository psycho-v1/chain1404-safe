# Chain 1404 Safe

Deploy official Safe v1.4.1 on the BlockDAG community network and open an N-of-M wallet.

**Not affiliated with Safe{Wallet} / app.safe.global.** This is the on-chain contracts plus a thin create page. It is not the hosted Safe UI.

Canonical network (bdag.community):

- RPC: `https://rpc.blockdag.engineering`
- Explorer: `https://explorer.blockdag.engineering`
- Chain ID: `1404`
- Do not use `rpc.bdagscan.com`

## What is already on chain 1404

Safe Singleton Factory is live:

`0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7`

The v1.4.1 singletons are not. This repo deploys them through that factory so the addresses match Ethereum if the official creation bytecode and salt `0x00…00` are used.

| Contract | Expected address |
| --- | --- |
| SafeL2 | `0x29fcB43b46531BcA003ddC8FCB67FFE91900C762` |
| SafeProxyFactory | `0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67` |
| CompatibilityFallbackHandler | `0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99` |
| MultiSend | `0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526` |
| MultiSendCallOnly | `0x9641d764fc13c8B624c04430C7356C1C7C8102e2` |

Bytecode is the Sourcify on-chain creation bytecode from Ethereum for those addresses. Solidity 0.7.6, optimizer off. No PUSH0.

## Use

1. Enable GitHub Pages on this repo (root / `main`) or `python3 -m http.server 8080`.
2. Connect a wallet that holds BDAG on the community network.
3. Deploy infrastructure (one tx per missing contract).
4. Enter owners + threshold. Create Safe.

Gas is not cheap. SafeL2 is large. Fund the deployer first.

Write confirmed addresses into `addresses/1404.json`.

## What this will not do

- Put your Safe in app.safe.global
- Ask for a seed
- Use a bdagscan RPC
- Recompile Safe

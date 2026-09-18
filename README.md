# Chain 1404 Safe

This repo is published. The publisher does not create a Safe and does not hold keys.

Whoever needs the wallet opens the page, connects **their** wallet, deploys, and pastes **their** owner addresses.

Live page (MetaMask browser):

https://raw.githack.com/psycho-v1/chain1404-safe/main/index.html

Repo: https://github.com/psycho-v1/chain1404-safe

Official Safe v1.4.1 bytecode on the BlockDAG **community** network ([bdag.community](https://bdag.community)). Not affiliated with Safe{Wallet} / app.safe.global. Not affiliated with previous BDAG presales.

## Custody

| Role | Does |
| --- | --- |
| Publisher (`psycho-v1`) | Hosts this repo and page. No seed. Not an owner unless an address from this account is pasted in the owner box. |
| Gas payer | Connects, pays BDAG for infrastructure + `createProxyWithNonce`. Not an owner unless listed. |
| Owners | Public addresses pasted at create time. Only they can later sign Safe txs. |

Do not send private keys or seeds to this repo, to issues, or to the publisher.

## Network

- RPC: `https://rpc.blockdag.engineering`
- Explorer: `https://explorer.blockdag.engineering`
- Chain ID: `1404`
- Do not use `rpc.bdagscan.com`

## Team runbook

1. Each signer posts **an address only**.
2. Agree threshold (example: 5 people, threshold 3). Do not use `1-of-N` unless you mean a single wallet.
3. One person funds a deployer with BDAG on community 1404.
4. Open the live page. Connect. Factory pill should read live.
5. **Deploy infrastructure** if the table says empty. Skip if it already says `code`.
6. Paste owner addresses. Set threshold. Create Safe.
7. PR the Safe address, owners, and threshold into `addresses/1404.json`.
8. Dust test from two owners. Then fund it.

A later DAO does not take this Safe by itself. When that executor exists, current owners `swapOwner` / `addOwnerWithThreshold`.

## Already on chain

Factory: `0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7`

Expected CREATE2 addresses if salt `0x00…00` matches this factory:

| Contract | Address |
| --- | --- |
| SafeL2 | `0x29fcB43b46531BcA003ddC8FCB67FFE91900C762` |
| SafeProxyFactory | `0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67` |
| CompatibilityFallbackHandler | `0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99` |
| MultiSend | `0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526` |
| MultiSendCallOnly | `0x9641d764fc13c8B624c04430C7356C1C7C8102e2` |

Bytecode is Ethereum Sourcify creation code for those addresses. solc 0.7.6, optimizer off.

## Local

```bash
git clone https://github.com/psycho-v1/chain1404-safe
cd chain1404-safe
python3 -m http.server 8080
```

`http://127.0.0.1:8080` still needs a wallet on chain 1404.

Optional: Settings → Pages → `main` / root → `https://psycho-v1.github.io/chain1404-safe/`

## Out of scope

- app.safe.global
- bdagscan RPC
- Recompiling Safe
- Publisher as owner
- Collecting anyone's private key

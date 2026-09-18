# Chain 1404 Safe

Official Safe v1.4.1 on the BlockDAG **community** network (bdag.community).

Not affiliated with Safe{Wallet} / app.safe.global. Not affiliated with previous BDAG presales.

Live page (open in MetaMask browser):

https://raw.githack.com/psycho-v1/chain1404-safe/main/index.html

## Network

- RPC: `https://rpc.blockdag.engineering`
- Explorer: `https://explorer.blockdag.engineering`
- Chain ID: `1404`
- Do not use `rpc.bdagscan.com`

## What this repo is for

Anyone with BDAG on the community chain can:

1. Deploy the Safe **infrastructure** once (singleton + factory + handlers).
2. Create **their** Safe and put **their** addresses in the owner list.

The person who clicks deploy only pays gas. They do not become owner unless their address is in the owner box.

Do not send seeds. Owners are public addresses only.

## Team runbook

1. Each signer creates (or already has) a wallet. They post **the address only**.
2. Agree threshold. Example: 5 people, threshold 3.
3. One person funds a deployer wallet with BDAG on community 1404.
4. That person opens the live page above, Connect, checks factory pill is live.
5. **Deploy infrastructure** if the table still says empty. Skip if it already says `code`.
6. Paste the owner addresses. Set threshold. Create Safe.
7. Publish the Safe address + owner list + threshold in `addresses/1404.json` (PR) and on the explorer link.
8. Send a dust amount. Two owners execute a test tx. Then fund it.

If a later DAO should take this Safe, add that as a written rule now and `swapOwner` / `addOwnerWithThreshold` when the DAO executor exists. The repo cannot do that automatically.

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

Then `http://127.0.0.1:8080` — still needs a wallet on chain 1404.

Optional: repo Settings → Pages → `main` / root → `https://psycho-v1.github.io/chain1404-safe/`

## Out of scope

- app.safe.global
- bdagscan RPC
- Recompiling Safe
- Collecting anyone's private key

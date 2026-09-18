window.C1404 = {
  chainId: 1404,
  chainIdHex: "0x57c",
  name: "BlockDAG Community",
  symbol: "BDAG",
  explorer: "https://explorer.blockdag.engineering",
  site: "https://bdag.community",
  rpc: "https://rpc.blockdag.engineering",
  fallbacks: [
    "https://rpc.welshdag.trade",
    "https://rpc.capedag.com",
    "https://rpc.dvdmining.com",
    "https://rpc.east.bdag-us.org",
    "https://rpc.west.bdag-us.org"
  ],
  denied: ["rpc.bdagscan.com", "rpc.blockdag.works", "bdagscan.com"],
  factory: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7",
  salt: "0x0000000000000000000000000000000000000000000000000000000000000000",
  suite: [
    { name: "SafeL2", eth: "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762" },
    { name: "SafeProxyFactory", eth: "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67" },
    { name: "CompatibilityFallbackHandler", eth: "0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99" },
    { name: "MultiSend", eth: "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526" },
    { name: "MultiSendCallOnly", eth: "0x9641d764fc13c8B624c04430C7356C1C7C8102e2" }
  ]
};

window.C1404.isDenied = function (url) {
  var u = String(url || "").toLowerCase();
  return window.C1404.denied.some(function (h) { return u.indexOf(h) !== -1; });
};

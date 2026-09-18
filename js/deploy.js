(function () {
  var C = window.C1404;
  var artifacts = {};
  var provider, signer, account;

  function log(msg) {
    var el = document.getElementById("log");
    var line = document.createElement("div");
    line.textContent = msg;
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
  }

  function expl(addr) {
    return C.explorer.replace(/\/$/, "") + "/address/" + addr;
  }

  async function loadOne(item) {
    var local = "artifacts/v1.4.1/" + item.name + ".json";
    try {
      var res = await fetch(local);
      if (res.ok) {
        var j = await res.json();
        if (j.creationBytecode && j.abi) return j;
      }
    } catch (e) {}
    var url = "https://sourcify.dev/server/v2/contract/1/" + item.eth + "?fields=creationBytecode,abi";
    var res2 = await fetch(url);
    if (!res2.ok) throw new Error("cannot load bytecode for " + item.name);
    var raw = await res2.json();
    var creation = raw.creationBytecode && (raw.creationBytecode.onchainBytecode || raw.creationBytecode.recompiledBytecode);
    if (!creation || !raw.abi) throw new Error("sourcify missing fields for " + item.name);
    return { name: item.name, canonical: item.eth, creationBytecode: creation, abi: raw.abi };
  }

  async function loadArtifacts() {
    for (var i = 0; i < C.suite.length; i++) {
      var item = C.suite[i];
      artifacts[item.name] = await loadOne(item);
      log("bytecode " + item.name);
    }
  }

  async function jsonRpc(url, method, params) {
    if (C.isDenied(url)) throw new Error("denied RPC");
    var res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: method, params: params || [] })
    });
    var j = await res.json();
    if (j.error) throw new Error(j.error.message || method);
    return j.result;
  }

  async function pickRpc() {
    var list = [C.rpc].concat(C.fallbacks);
    for (var i = 0; i < list.length; i++) {
      try {
        var id = await jsonRpc(list[i], "eth_chainId", []);
        if (parseInt(id, 16) === 1404) {
          log("rpc ok " + list[i]);
          return list[i];
        }
      } catch (e) {
        log("rpc miss " + list[i] + " — " + e.message);
      }
    }
    throw new Error("no community RPC answered chain 1404");
  }

  async function getCode(addr, rpc) {
    return jsonRpc(rpc, "eth_getCode", [addr, "latest"]);
  }

  function predicted(creation) {
    return ethers.getCreate2Address(C.factory, C.salt, ethers.keccak256(creation));
  }

  async function refreshStatus(rpc) {
    var body = document.getElementById("status-body");
    body.innerHTML = "";
    for (var i = 0; i < C.suite.length; i++) {
      var name = C.suite[i].name;
      var art = artifacts[name];
      var pred = predicted(art.creationBytecode);
      var code = "0x";
      try { code = await getCode(pred, rpc); } catch (e) { code = "err"; }
      var live = code && code !== "0x" && code !== "0x0" && code.length > 4;
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + name + "</td>" +
        "<td class='mono'><a href='" + expl(pred) + "' target='_blank' rel='noreferrer'>" + pred + "</a></td>" +
        "<td>" + (live ? "<span class='pill pill-ok'>code</span>" : "<span class='pill pill-no'>empty</span>") + "</td>";
      body.appendChild(tr);
    }
    var fcode = await getCode(C.factory, rpc);
    document.getElementById("factory-pill").className = "pill " + (fcode && fcode.length > 4 ? "pill-ok" : "pill-no");
    document.getElementById("factory-pill").textContent = fcode && fcode.length > 4 ? "factory live" : "factory missing";
  }

  async function ensureChain() {
    var eth = window.ethereum;
    if (!eth) throw new Error("no injected wallet");
    var id = await eth.request({ method: "eth_chainId" });
    if (parseInt(id, 16) === 1404) return;
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: C.chainIdHex }]
      });
    } catch (e) {
      if (e.code !== 4902 && e.code !== -32603) throw e;
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: C.chainIdHex,
          chainName: C.name,
          nativeCurrency: { name: "BDAG", symbol: "BDAG", decimals: 18 },
          rpcUrls: [C.rpc].concat(C.fallbacks),
          blockExplorerUrls: [C.explorer]
        }]
      });
    }
  }

  async function connect() {
    await ensureChain();
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    account = await signer.getAddress();
    var net = await provider.getNetwork();
    if (Number(net.chainId) !== 1404) throw new Error("wallet is not on 1404");
    document.getElementById("account").textContent = account;
    log("connected " + account);
  }

  async function deployOne(name, rpc) {
    var art = artifacts[name];
    var pred = predicted(art.creationBytecode);
    var code = await getCode(pred, rpc);
    if (code && code.length > 4) {
      log(name + " already at " + pred);
      return pred;
    }
    var data = C.salt + art.creationBytecode.slice(2);
    log("deploy " + name + " via factory → " + pred);
    var tx = await signer.sendTransaction({ to: C.factory, data: data });
    log("tx " + tx.hash);
    await tx.wait();
    var after = await getCode(pred, rpc);
    if (!after || after.length <= 4) throw new Error(name + " did not land at predicted address");
    log(name + " live");
    return pred;
  }

  async function deploySuite() {
    var rpc = await pickRpc();
    for (var i = 0; i < C.suite.length; i++) {
      await deployOne(C.suite[i].name, rpc);
    }
    await refreshStatus(rpc);
  }

  function parseOwners() {
    var raw = document.getElementById("owners").value.split(/\s|,|;/).map(function (s) { return s.trim(); }).filter(Boolean);
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      if (!ethers.isAddress(raw[i])) throw new Error("bad owner " + raw[i]);
      var a = ethers.getAddress(raw[i]);
      if (out.indexOf(a) >= 0) throw new Error("duplicate owner " + a);
      out.push(a);
    }
    if (!out.length) throw new Error("need at least one owner");
    return out;
  }

  async function createSafe() {
    var rpc = await pickRpc();
    var owners = parseOwners();
    var threshold = Number(document.getElementById("threshold").value);
    if (!threshold || threshold < 1 || threshold > owners.length) throw new Error("threshold must be 1.." + owners.length);
    var saltNonce = BigInt(document.getElementById("saltNonce").value || "0");
    var l2 = predicted(artifacts.SafeL2.creationBytecode);
    var factoryAddr = predicted(artifacts.SafeProxyFactory.creationBytecode);
    var handler = predicted(artifacts.CompatibilityFallbackHandler.creationBytecode);
    if ((await getCode(l2, rpc)).length <= 4) throw new Error("deploy infrastructure first — SafeL2 empty");
    if ((await getCode(factoryAddr, rpc)).length <= 4) throw new Error("deploy infrastructure first — factory empty");
    var safeIface = new ethers.Interface(artifacts.SafeL2.abi);
    var initializer = safeIface.encodeFunctionData("setup", [
      owners, threshold, ethers.ZeroAddress, "0x", handler, ethers.ZeroAddress, 0, ethers.ZeroAddress
    ]);
    var fac = new ethers.Contract(factoryAddr, artifacts.SafeProxyFactory.abi, signer);
    var predSafe;
    try { predSafe = await fac.createProxyWithNonce.staticCall(l2, initializer, saltNonce); } catch (e) { predSafe = null; }
    log("creating Safe threshold " + threshold + "/" + owners.length);
    var tx = await fac.createProxyWithNonce(l2, initializer, saltNonce);
    log("tx " + tx.hash);
    var rec = await tx.wait();
    var created = predSafe;
    if (!created && rec && rec.logs) {
      for (var i = 0; i < rec.logs.length; i++) {
        try {
          var parsed = fac.interface.parseLog(rec.logs[i]);
          if (parsed && parsed.args && parsed.args.proxy) created = parsed.args.proxy;
        } catch (e) {}
      }
    }
    if (created) {
      document.getElementById("safe-out").innerHTML =
        "<span class='pill pill-ok'>safe</span> <a class='mono' href='" + expl(created) + "' target='_blank' rel='noreferrer'>" + created + "</a>";
      log("Safe " + created);
    } else {
      log("created — check the receipt on the explorer");
    }
  }

  async function boot() {
    try {
      await loadArtifacts();
      var rpc = await pickRpc();
      await refreshStatus(rpc);
    } catch (e) {
      log(String(e.message || e));
    }
  }

  document.getElementById("btn-connect").addEventListener("click", function () {
    connect().catch(function (e) { log(String(e.message || e)); });
  });
  document.getElementById("btn-infra").addEventListener("click", function () {
    deploySuite().catch(function (e) { log(String(e.message || e)); });
  });
  document.getElementById("btn-safe").addEventListener("click", function () {
    createSafe().catch(function (e) { log(String(e.message || e)); });
  });

  boot();
})();

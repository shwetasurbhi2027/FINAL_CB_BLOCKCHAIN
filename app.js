const contractAddress = "0x508219C5B697cc983ED8C1f536adEa69BB9025d9";
const sepoliaChainId = 11155111;
const sepoliaHexChainId = "0xaa36a7";
const publicRpcUrl = "https://ethereum-sepolia-rpc.publicnode.com";

const contractAbi = [
  "function addCertificate(string memory _certHash) public",
  "function verifyCertificate(string memory _certHash) public view returns (bool isValid, address issuer, uint256 issuedAt)"
];

let provider;
let signer;
let writeContract;
const readProvider = new ethers.JsonRpcProvider(publicRpcUrl);
const readContract = new ethers.Contract(contractAddress, contractAbi, readProvider);

const connectWalletBtn = document.getElementById("connectWalletBtn");
const switchNetworkBtn = document.getElementById("switchNetworkBtn");
const walletStatus = document.getElementById("walletStatus");
const certificateFileInput = document.getElementById("certificateFileInput");
const generateHashBtn = document.getElementById("generateHashBtn");
const copyHashBtn = document.getElementById("copyHashBtn");
const hashStatus = document.getElementById("hashStatus");
const generatedHashValue = document.getElementById("generatedHashValue");
const addHashInput = document.getElementById("addHashInput");
const addCertificateBtn = document.getElementById("addCertificateBtn");
const addStatus = document.getElementById("addStatus");
const verifyHashInput = document.getElementById("verifyHashInput");
const verifyCertificateBtn = document.getElementById("verifyCertificateBtn");
const verifyResult = document.getElementById("verifyResult");

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function normalizeHash(hash) {
  const trimmedHash = hash.trim();
  return trimmedHash.startsWith("0x") ? trimmedHash : `0x${trimmedHash}`;
}

function isValidHash(hash) {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

async function requestSepoliaSwitch() {
  if (!window.ethereum) {
    walletStatus.textContent = "MetaMask not found. Verification can still work without wallet.";
    return false;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: sepoliaHexChainId }]
    });
    return true;
  } catch (error) {
    walletStatus.textContent = "Please switch to Sepolia in your wallet manually.";
    return false;
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    walletStatus.textContent = "MetaMask not found. You can still verify hashes without connecting a wallet.";
    return;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();

    const network = await provider.getNetwork();
    if (Number(network.chainId) !== sepoliaChainId) {
      const switched = await requestSepoliaSwitch();
      if (!switched) {
        return;
      }
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
    }

    writeContract = new ethers.Contract(contractAddress, contractAbi, signer);
    const address = await signer.getAddress();
    walletStatus.textContent = `Connected on Sepolia: ${address}`;
  } catch (error) {
    walletStatus.textContent = `Connection failed: ${error.message}`;
  }
}

async function generateFileHash() {
  const [file] = certificateFileInput.files || [];

  if (!file) {
    hashStatus.textContent = "Select a certificate file first.";
    generatedHashValue.textContent = "Hash will appear here.";
    return;
  }

  try {
    hashStatus.textContent = `Hashing ${file.name} locally in your browser...`;
    const fileBuffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", fileBuffer);
    const hash = `0x${bytesToHex(new Uint8Array(digest))}`;

    generatedHashValue.textContent = hash;
    addHashInput.value = hash;
    verifyHashInput.value = hash;
    hashStatus.textContent = "Hash ready. You can now add or verify this certificate.";
  } catch (error) {
    hashStatus.textContent = `Hash generation failed: ${error.message}`;
    generatedHashValue.textContent = "Hash will appear here.";
  }
}

async function copyHash() {
  const hash = generatedHashValue.textContent.trim();

  if (!hash || hash === "Hash will appear here.") {
    hashStatus.textContent = "Generate a hash first.";
    return;
  }

  try {
    await navigator.clipboard.writeText(hash);
    hashStatus.textContent = "Hash copied to clipboard.";
  } catch (error) {
    hashStatus.textContent = "Copy failed. You can still copy it manually.";
  }
}

async function addCertificate() {
  const hash = normalizeHash(addHashInput.value);

  if (!writeContract) {
    addStatus.textContent = "Connect MetaMask on Sepolia first to add a certificate.";
    return;
  }

  if (!addHashInput.value.trim()) {
    addStatus.textContent = "Please enter a certificate hash.";
    return;
  }

  if (!isValidHash(hash)) {
    addStatus.textContent = "Enter a valid SHA-256 hash with 64 hexadecimal characters.";
    return;
  }

  try {
    addStatus.textContent = "Transaction sent. Waiting for blockchain confirmation...";
    const tx = await writeContract.addCertificate(hash);
    await tx.wait();
    addStatus.textContent = `Certificate added successfully. Tx: ${tx.hash}`;
  } catch (error) {
    addStatus.textContent = `Transaction failed: ${error.reason || error.message}`;
  }
}

function formatTimestamp(unixSeconds) {
  if (!unixSeconds || unixSeconds === 0n) {
    return "Not available";
  }

  return new Date(Number(unixSeconds) * 1000).toLocaleString();
}

async function verifyCertificate() {
  const hash = normalizeHash(verifyHashInput.value);

  if (!verifyHashInput.value.trim()) {
    verifyResult.innerHTML = "<p>Please enter a certificate hash.</p>";
    return;
  }

  if (!isValidHash(hash)) {
    verifyResult.innerHTML = "<p>Enter a valid SHA-256 hash with 64 hexadecimal characters.</p>";
    return;
  }

  try {
    verifyResult.innerHTML = "<p>Checking Sepolia for this proof hash...</p>";
    const contractForRead = writeContract || readContract;
    const result = await contractForRead.verifyCertificate(hash);
    const validityText = result.isValid ? "Yes, found on-chain" : "No, hash not registered";
    verifyResult.innerHTML = `
      <p><strong>Valid:</strong> ${validityText}</p>
      <p><strong>Issuer:</strong> ${result.issuer}</p>
      <p><strong>Issued At:</strong> ${formatTimestamp(result.issuedAt)}</p>
      <p><strong>Network:</strong> Ethereum Sepolia</p>
    `;
  } catch (error) {
    verifyResult.innerHTML = `<p>Verification failed: ${error.reason || error.message}</p>`;
  }
}

connectWalletBtn.addEventListener("click", connectWallet);
switchNetworkBtn.addEventListener("click", requestSepoliaSwitch);
generateHashBtn.addEventListener("click", generateFileHash);
copyHashBtn.addEventListener("click", copyHash);
addCertificateBtn.addEventListener("click", addCertificate);
verifyCertificateBtn.addEventListener("click", verifyCertificate);

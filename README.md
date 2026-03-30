# CertiChain

CertiChain is a blockchain-based certificate verification system built on Ethereum Sepolia. Instead of storing full certificate files on-chain, it stores only a SHA-256 proof hash, making the verification process transparent, tamper-resistant, and more practical for real-world use.

## Overview

Fake or edited certificates are often difficult to verify quickly. CertiChain solves this by turning each certificate into a unique hash and using blockchain as a proof layer.

This means:

- the actual certificate stays off-chain
- only the proof hash is recorded on-chain
- anyone with the same file or hash can verify authenticity
- the app can show who issued the proof and when it was recorded

## Problem Statement

In colleges, events, workshops, and recruitment processes, certificates are easy to share but hard to trust instantly. Manual checking takes time, and forged certificates can slip through.

CertiChain improves this process by creating a verifiable on-chain proof for each certificate.

## How It Works

1. A user uploads a certificate file in the frontend.
2. The browser generates a SHA-256 hash locally using the file content.
3. That hash acts as the certificate's unique digital proof.
4. The proof hash can be added on-chain through the smart contract.
5. The same hash can later be checked on Sepolia to verify whether it exists.
6. The app returns the verification result, issuer wallet, and timestamp.

## Why Blockchain Is Used

Blockchain is not being used here as file storage. It is being used as a trust layer.

CertiChain uses blockchain because it provides:

- tamper-resistant proof storage
- transparent verification
- issuer traceability
- reliable timestamps

This makes the project more meaningful than simply uploading files to a server.

## Core Features

- Generate a SHA-256 proof hash locally in the browser
- Add certificate proof hash on-chain using MetaMask
- Verify certificate proof on Ethereum Sepolia
- Show issuer address and recorded timestamp
- Use a polished dark UI for a better demo experience
- Support read-only verification flow even when wallet setup is inconsistent

## Smart Contract Logic

The smart contract stores and checks certificate hashes.

Main functions:

- `addCertificate(string _certHash)`
  Stores a certificate proof hash on-chain.

- `verifyCertificate(string _certHash)`
  Checks whether the proof hash exists and returns:
  - validity
  - issuer wallet
  - timestamp

The repository also includes an improved contract version with stronger issuer-control logic for later final deployment.

## Frontend Flow

### 1. Generate Hash

- Upload a certificate file
- Generate a SHA-256 hash locally
- Copy or auto-fill the hash into the next steps

### 2. Add Certificate

- Connect MetaMask
- Use the generated proof hash
- Add the proof on-chain

### 3. Verify Certificate

- Paste the same proof hash
- Check whether it exists on Sepolia
- View the result, issuer, and timestamp

## Project Progress

### Day 3

- Smart contract written and deployed on Sepolia
- Add and verify flow tested in Remix

### Day 4

- Basic frontend created
- User interaction flow defined
- Contract connection logic added

### Day 5

- Local SHA-256 file hashing added
- Project logic improved to focus on proof-based storage
- Stronger contract structure prepared in the repository

### Day 6

- Frontend redesigned to feel more demo-ready
- Better content structure and user flow
- Read-only verification improved
- Wallet interaction flow improved for Sepolia usage

## Tech Stack

- Solidity
- Ethereum Sepolia Testnet
- Remix IDE
- MetaMask
- HTML
- CSS
- JavaScript
- ethers.js
- Web Crypto API

## Project Structure

- `contract.sol` - smart contract source code
- `index.html` - app interface
- `style.css` - app styling
- `app.js` - frontend logic for hashing, wallet connection, and verification
- `README.md` - project documentation

## Contract Details

- Network: Ethereum Sepolia
- Current frontend contract address: `0x508219C5B697cc983ED8C1f536adEa69BB9025d9`

## How To Run

1. Open `index.html` in a browser or run it with Live Server.
2. Upload a sample certificate file.
3. Click **Generate SHA-256 Hash**.
4. Use **Verify On Sepolia** to test verification.
5. If wallet support works properly in your browser, connect MetaMask and use **Add Certificate On-Chain**.

## Demo Flow

The project UI follows a simple certificate verification journey:

### 1. Landing Screen

The user first sees the CertiChain home screen with:

- the project title and intro
- key feature tags like smart verification and proof-first storage
- buttons for wallet connection and switching to Sepolia

At this stage, the user understands what the app does before interacting with the contract.

### 2. Wallet Connection State

After clicking **Connect MetaMask**, the UI shows the connected Sepolia wallet address.

This confirms that the app is ready for write actions such as adding a new certificate hash on-chain.

### 3. Main Working Interface

The main interaction area is divided into three clear sections:

- **Generate Hash**
  The user uploads a certificate file and generates a SHA-256 proof hash locally in the browser.

- **Add Certificate**
  The generated hash is used to store proof on-chain through the smart contract.

- **Verify Certificate**
  The same hash can be checked on Sepolia to see whether the certificate proof already exists.

This flow makes the project easy to understand during a demo.

### 4. Verification Result State

After a successful verification, the app shows:

- whether the certificate is valid
- the issuer wallet address
- the issued timestamp
- the network used for verification

If the certificate is already stored, the UI also makes that clear while trying to add it again.

## Demo Notes

- Verification is the strongest part of the current demo flow.
- Wallet behavior may vary depending on browser wallet conflicts.
- The repository contains a stronger contract version that can be redeployed as the final version later.

## Screenshots

### Home Screen

![Home UI](./screenshots/home-before-connect.png.jpeg)

### Wallet Connected

![Wallet Connected](./screenshots/home-after-connect.png.jpeg)

### Main Interface

![Main Flow](./screenshots/main-interface.png.jpeg)

### Verification Result

![Verification Result](./screenshots/verification-success.png.jpeg)

Suggested screenshot sequence for the repo:

1. Home / hero section before wallet connection
2. Hero section after wallet connection
3. Main interface before interaction
4. Main interface after hash generation and verification

Once screenshots are added to the repo, this section can be updated like:

## Future Scope

- Redeploy the upgraded smart contract
- Add issuer-only admin controls in the final live version
- Add QR-based certificate verification
- Build a complete React version
- Add downloadable verification reports

## Author Note

This project was built as part of a blockchain learning challenge to move from understanding blockchain concepts to building a working certificate verification product.

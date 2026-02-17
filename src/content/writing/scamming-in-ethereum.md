---
title: "Scamming in Ethereum is Easy"
date: 2018-06-20
description: "How to avoid falling for simple Ethereum scams — from copycat dApps to unverified smart contracts."
tags: ["ethereum", "crypto", "security"]
---

![Oldest trick in the book](/images/writing/scamming-in-ethereum/shell-game.gif)

#### Intro

Ethereum is in the earliest stages of usability. Transaction costs are high, the network gets DDOS'd by kitty cats, and the tools have abysmal UIs. But the biggest risk right now is just how easy it is to pull off scams.

The entire selling point of crypto is the ability to send money without a middleman. But that comes with a cost: transactions are permanent and non-reversible. There's no credit card company to issue a chargeback. There's no 1-800 number to call. Once you sign a transaction, it's done.

This article focuses on a specific type of scam in the Ethereum ecosystem and what you can do to protect yourself.

#### The Setup

When you interact with a Smart Contract on Ethereum, you call a function on that contract and optionally send money along with it. This is generally done through a dApp website combined with MetaMask.

![Screenshot from eth.rip](/images/writing/scamming-in-ethereum/eth-rip-screenshot.png)

Blindly signing transactions is the easiest way to lose your money. Copycat and phishing websites are trivially easy to set up. Even "legitimate" looking companies can be nothing more than fancy marketing designed to steal your funds.

#### Simple Scam

Triple check the **amount** and the **destination account** every single time.

The easiest trick in the book: tell someone they're interacting with the real CryptoGiraffes website, but swap the destination address to a scam account. It takes seconds to set up and preys on people who don't verify what they're signing.

Check every time. Never blindly sign.

#### Scam 2: Github Links Don't Prove Anything

A common move is for a project to post links to Github claiming the source code matches their deployed smart contract. Don't fall for it. A code snippet or a Github repo is not proof of anything.

*There is absolutely no guarantee that the code posted to Github is the actual code deployed onto the blockchain.*

Anyone can post clean-looking code to Github while deploying something completely different on-chain.

#### How Code Verification on Etherscan Works

When Solidity is compiled, it produces EVM bytecode. Looking at raw EVM instructions is practically impossible to audit.

![EVM instructions: Good luck auditing my smart contract](/images/writing/scamming-in-ethereum/evm-instructions.png)

The way verification works: a developer provides their source code, you compile it, and verify that it produces the same EVM bytecode as what's deployed on-chain. Etherscan makes this process straightforward.

![Etherscan's interface showing "Exact Match"](/images/writing/scamming-in-ethereum/etherscan-exact-match.png)

**Demand** that developers provide actual source code and verify it matches their deployed contracts. If they won't do it, walk away.

#### Why This May Not Be Enough

Even with verified source code, you're not completely safe. Take eth.rip as an example: it has one payable function called `burn()`. But a malicious developer could easily add a `stealYourMoney()` function alongside it.

Here's where MetaMask has a critical flaw:

![100 bytes of scam city](/images/writing/scamming-in-ethereum/metamask-bytes.png)

MetaMask **only** tells you **how many** bytes of data you're sending. It doesn't tell you whether you're calling `burn()` or `thanksForYourMoneyIdiot()`. This is a huge issue with contracts that have thousands of lines of code and subtly hidden nefarious functions.

#### MetaMask Needs to Get This Done ASAP

There's an open issue tracking this: [MetaMask #2847](https://github.com/MetaMask/metamask-extension/issues/2847)

The entire point of blockchains is trustless systems. **I'm optimistic about the future we are building.** When organizations say "Trust us", we say "Code or GTFO".

#### Go Burn Some ETH

I built [eth.rip](http://www.eth.rip) as a way to provably burn ETH while attaching an immortal message to the blockchain. Go verify the code yourself.

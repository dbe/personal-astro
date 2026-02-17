---
title: "Localcoins and Micro Economies"
date: 2019-01-30
description: "Useful application of programmable money — from Diablo 2's Stone of Jordan to ETHDenver's buffiDai."
tags: ["crypto", "ethereum", "economics", "ethdenver"]
---

If you've ever played a video game with an economy, you've already experienced the dynamics that make crypto so interesting. Games like Eve Online, Runescape, and Diablo 2 have all produced rich, complex economies entirely within virtual worlds.

In Diablo 2, the in-game gold was so inflated and useless that players organically adopted a rare item as the de facto currency: the Stone of Jordan.

![Stone of Jordan](/images/writing/localcoins-and-micro-economies/stone-of-jordan.jpeg)

A unique ring with useful stats, the Stone of Jordan (SoJ) became the unit of account for all high-value trading. It was scarce, recognizable, and universally valued. Players priced everything in SoJs. It was a grassroots monetary standard born entirely from necessity within a digital world.

### What Can We Learn From Virtual Worlds?

Game economies have central game developers who control supply, inflation, and rules — much like central banks. But what happens when you remove the central authority and give the tools of monetary policy to the participants themselves?

That's the promise of programmable money. With Ethereum and smart contracts, you can create fine-grained crypto-economic systems with rules baked directly into the code. No central bank, no game developer pulling strings behind the scenes. Just transparent, auditable rules that everyone can verify.

This opens the door to something fascinating: micro economies designed for specific communities, events, or purposes.

### ETHDenver

[ETHDenver](https://www.ethdenver.com/) is one of the largest Ethereum hackathons in the world. For the 2019 event, we designed a local currency called **buffiDai** to power the event's internal economy.

The design goals were:

1. Give attendees a hands-on experience with crypto
2. Create a closed-loop economy within the event
3. Make it dead simple to use
4. Make it economically meaningful, not just a toy

**Why not just airdrop DAI?** If you give people real money with no strings attached, they'll just cash it out. There's no reason to spend it at the event when you can withdraw it to your bank account later. That defeats the purpose of creating a local economy.

**Why not a valueless ERC20 token?** If the token has no real value, people won't care about it. There's no incentive to engage with the economy. It becomes a novelty that gets ignored after the first hour.

### Localcoins

The solution was **buffiDai**: an ERC20 token backed 1:1 by DAI, but with a critical constraint. You could only cash out buffiDai to real DAI through a **whitelisted set of vendors**. Think of it like a food court gift card: it's worth real money, but only at participating vendors.

The smart contract acted as a "VendingMachine" — you put DAI in, you get buffiDai out. To convert back, you had to spend it at a whitelisted vendor (food trucks, merch booths, etc.), and the vendor could then redeem the buffiDai for real DAI.

This created a genuine local economy. The tokens had real value but could only circulate within the event ecosystem. Vendors were incentivized to participate because they could cash out to real money. Attendees were incentivized to spend because that was the only way the value could leave the system.

### Cypherpunk Speakeasies

Building on the [Boulder Blockchain beer experiment](/writing/did-crypto-become-useful), we also designed the **BURN** token for Cypherpunk Speakeasy events.

The concept was simple: everyone received $10 worth of BURN tokens. A beer cost $6.50. That left people with some leftover tokens to play with. And that's where things got interesting.

People started trading BURN tokens for favors, bets, and other things entirely outside the original scope. One person haggled with Kevin Owocki convincing him to send a Gitcoin Kudos in exchange for their BURN.

The network graph of BURN token transfers after two speakeasy events shows how organic economic activity emerged from a simple starting point:

![Network graph of the BURN token after 2 speakeasies](/images/writing/localcoins-and-micro-economies/burn-network-graph.png)

People pooled leftover money, made side bets, and created their own micro-transactions. It was a tiny economy that emerged naturally from giving people programmable tokens and getting out of the way.

### Just the Beginning

The concepts behind buffiDai and BURN are just scratching the surface. You could extend these ideas in countless directions:

- Event-specific loyalty tokens that reward repeat attendees
- Community currencies for local neighborhoods or co-ops
- Incentive tokens for open source contributions
- Time-limited currencies that expire if not spent (demurrage)
- Tokens that can only be spent on specific categories of goods

The tooling for creating these micro economies is getting better every day. What used to require a team of engineers can now be done by a single developer in an afternoon.

### How to Get Involved

If you're in Colorado, come to [ETHDenver](https://www.ethdenver.com/). It's one of the best events in the Ethereum ecosystem and a great place to see these ideas in action.

The code for buffiDai and the VendingMachine contracts is open source on GitHub. Fork it, modify it, deploy your own localcoin for your community.

### Many Thanks

This work wouldn't have been possible without the incredible Colorado blockchain community. Special thanks to the ETHDenver organizers, John Paller, Austin Griffith for the Burner Wallet infrastructure, and everyone who participated in the Cypherpunk Speakeasies and helped stress-test these ideas in the real world.

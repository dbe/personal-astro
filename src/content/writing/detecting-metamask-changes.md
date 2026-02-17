---
title: "Detecting Metamask Account or Network Change in Javascript Using Web3 1.0.0"
date: 2018-05-21
description: "Stop polling every 100ms — use Web3 1.0.0's publicConfigStore to detect Metamask account and network changes."
tags: ["ethereum", "javascript", "web3", "tutorial"]
---

![Metamask](/images/writing/detecting-metamask/hero.jpeg)

A common issue in dApp development is detecting which Metamask account the user plans to use, and reacting when they switch accounts or networks. Even the Metamask documentation suggests polling every 100 milliseconds. Eww.

```javascript
// Not a fun pattern to have to use
var account = web3.eth.accounts[0];
var accountInterval = setInterval(function() {
  if (web3.eth.accounts[0] !== account) {
    account = web3.eth.accounts[0];
    updateInterface();
  }
}, 100);
```

Polling at 100ms is wasteful and inelegant. There's a better way.

#### publicConfigStore to the rescue

In Web3 1.0.0, the Metamask provider exposes a `publicConfigStore` that emits an `update` event whenever the user changes their account or network:

```javascript
web3.currentProvider.publicConfigStore.on('update', callback);
```

The callback receives an object containing `selectedAddress` and `networkVersion`. You can use these values to listen for changes and update your UI accordingly, without any polling.

#### Caveat

At the time of writing, `publicConfigStore` is an unstable feature. It works, but it's not part of any official spec and could change or be removed in future versions. Use at your own discretion.

---
title: "Ganache EADDRINUSE: Address Already in Use"
date: 2019-01-21
description: "Quick fix for when Ganache or geth didn't shut down gracefully and the port is still in use."
tags: ["ethereum", "development", "tutorial"]
---

![Ganache error](/images/writing/ganache-eaddrinuse/ganache-error.png)

While developing Ethereum dApps, you'll inevitably run into the situation where your local blockchain (geth or Ganache) didn't shut down gracefully. Maybe your terminal crashed, maybe you force-quit something, or maybe you just forgot it was running.

The next time you try to start it up, you get the dreaded EADDRINUSE error:

```
Ganache CLI v6.2.5 (ganache-core: 2.3.3)
listen EADDRINUSE: address already in use 127.0.0.1:8545
```

The fix is simple. Find the process that's still holding onto the port using `lsof`:

```bash
lsof -i :8545
```

You'll see output like this:

```
COMMAND     PID USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
Ganache   45624  dbe   32u  IPv4 0x2870b9f699b92777      0t0  TCP localhost:64105->localhost:8545 (ESTABLISHED)
```

Make sure the process isn't something crucial, then kill it using the PID from the output:

```bash
kill 45624
```

That's it. Start Ganache again and you're back in business.

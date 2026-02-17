---
title: "Is Your WordPress Blog Being Used as a Weapon?"
date: 2016-10-16
description: "Dealing with the XML-RPC / pingback DDOS attack that may be turning your WordPress blog into an unwitting participant in DDoS attacks."
tags: ["security", "wordpress", "web-development"]
---

![DDoS](/images/writing/wordpress-weapon/hero.jpeg)

If you have a WordPress blog, there's a decent chance you're unknowingly DDOSing people right now.

#### What is DDOSing?

DDOS stands for Distributed Denial of Service. The basic idea is simple: a bot net or large number of servers spam a target with so many requests that the target gets overloaded and goes down.

#### How does WordPress play into this?

I discovered a tricky DDOS technique that exploits WordPress's built-in XML-RPC `pingback.ping` function. My site had been sluggish for a few days, so I started digging through the Apache access logs. I found lines like this:

```
191.96.249.80 "POST /xmlrpc.php HTTP/1.0" 200 370 "-" "Mozilla/4.0 (compatible: MSIE 7.0; Windows NT 6.0)"
```

Thousands of them.

#### Getting to the bottom of the exploit

I installed `mod_dumpio` to inspect the actual POST parameters being sent to my server. What I found was a stream of `pingback.ping` calls, each targeting a different domain.

The attack works like this: an attacker sends a `pingback.ping` request to your WordPress blog with a target URL. Your blog then dutifully reaches out to that URL to verify the pingback. Multiply that across hundreds of thousands of WordPress blogs, and you've got yourself a distributed denial of service attack -- powered entirely by other people's servers.

It's a simple and elegant hack. The attacker offloads all the spamming to an army of WordPress blogs that have no idea they're participating.

#### How to check if your blog is being attacked

Do a quick grep through your web server access logs for repeated POST requests to `/xmlrpc.php`. If you see a flood of them from various IPs, your blog is likely being used as a weapon.

#### How to fix the problem

This is a well-known exploit, so the fix is straightforward.

First, I hard banned the offending IP via iptables to stop the immediate bleeding.

Then I disabled the `pingback.ping` functionality entirely using the **Disable XML-RPC Pingback** WordPress plugin. Unless you specifically need pingbacks (most people don't), there's no reason to leave this attack surface open.

#### What was the common denominator in targeted sites?

Here's the full list of sites my blog was being used to attack:

```
http://177.54.156.113/
http://213.32.16.114/
http://ahmii.buyweb.us/
http://anarchy.minetexas.com/
http://churchofsatan.com/
http://clan-lt.com/community
http://deodat.entmip.fr/
http://dream-community.de
http://dxyy.fx120.net/
http://ent.ac-poitiers.fr/
http://foxcasino9.club/
http://infohomegranada.com
http://mft25.pw/Enter.php
http://nafix.co.il/
http://nextdaygear.biz
http://p.bemanicn.com/
http://plm.zoossoft.net/LR/Chatpre.aspx?id=PLM31671888&lng=cn
http://pr.trinitascollege.nl/
http://ragnapocket.com.br/site/
http://ragnapocket.com.br/
http://royaltypvp.org/forums/index.php?articles/
http://royaltypvp.org/
https://armoowasright.nl/
https://irc.ipredator.se
https://knolpower.nl/
https://mlsmyhome.com
https://soar.gg/
http://star-bkash.com
https://tiboinshape.com/shop/
http://store.royaltypvp.co/
https://www.beastnode.com/
https://www.interasistmen.se/
https://www.worldcannabis.net/
http://techruiz.webs.com/
http://unitymc.us/
http://weedwomen.ca/
http://www.a3laneia.com/
http://www.budgirl.com/
http://www.dumpert.nl/
http://www.edline.net/pages/CCSD93
http://www.fifaproclubs.com/
http://www.knjhair.fr/index.php/tissages-naturels.html
http://www.mc-market.org/
http://www.pukmedia.com/
http://www.scotland.police.uk/
http://www.vg.no/
http://www.xn------ozecp6ar0ag8cvfjklaic7a5e.com/
```

The internet is a weird place.

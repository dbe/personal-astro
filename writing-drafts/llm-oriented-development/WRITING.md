# The Machine is the New User

## Why AI will kill "developer-friendly" languages and birth a new way to build software

I just built a Bitcoin key scanner in Rust. It walks every file on a Mac, extracts candidate private keys from raw bytes, validates them cryptographically, derives addresses across four BIP standards, and checks those addresses against a bloom filter loaded with 55 million funded Bitcoin addresses. The whole thing is checkpoint-resumable, parallel, and handles archives within archives.

I didn't write any of it by hand.

I described what I wanted to an LLM, and it wrote ~2,000 lines of Rust, compiled it, hit errors, fixed them, tested it against sample data, found a bug in a test vector, debugged that, and then ran the tool across my entire home directory -- 633,000 files -- while monitoring the output to make sure nothing stalled. When it needed data, it researched UTXO dump sources, downloaded 1.4 GB of address data, built a bloom filter, and re-ran the scan. The whole thing took about an hour of wall-clock time. I sent maybe 10 messages.

This experience crystallized something I've been thinking about for a while. Two related ideas that I think are going to reshape how software gets built.

## The Death of "Developer-Friendly"

For the last 30 years, programming language design has been driven by one question: **how do we make this easier for humans to write?**

Python won because it reads like English. JavaScript won because it was already in the browser and you could hack something together in an afternoon. Ruby won (briefly) because DHH made it poetic. The entire trajectory of language design has been about reducing friction for the person at the keyboard.

But what happens when the person at the keyboard isn't a person anymore?

When an LLM writes your code, the calculus changes completely. The LLM doesn't care if the syntax is pretty. It doesn't get confused by Rust's borrow checker. It doesn't need the hand-holding of dynamic typing to feel productive. What it does care about is whether the language has a strong, unambiguous type system that catches errors at compile time. Whether the compiler gives clear, actionable error messages. Whether the language has a single correct way to do things rather than fifteen footguns disguised as flexibility.

Rust is an interesting case study here. Humans famously struggle with Rust's learning curve. The borrow checker, lifetimes, trait bounds -- these are concepts that take experienced programmers weeks or months to internalize. But for an LLM? The borrow checker is a gift. It's a verification layer that catches an entire class of bugs before the code ever runs. Every compiler error is a specific, actionable piece of feedback that the LLM can read and fix in seconds. The steep learning curve that makes Rust painful for humans makes it *better* for machines.

I'm not saying Rust is the endgame. I think we'll see languages designed from scratch for LLM ergonomics. Languages where the type system is even more expressive, where the compiler errors are even more structured, where the output is optimized for machine execution rather than human readability. Languages that would be absolute hell for a person to write by hand, but that produce faster, safer, more correct programs when an LLM is doing the writing.

Early on in the LLM era, training data mix mattered a lot. Models wrote better Python because there was more Python in the training data. But as we get stronger general reasoning capabilities, as synthetic data and chain-of-thought improve, that advantage fades. The model doesn't need to have seen a million examples of a language to write it well -- it just needs to understand the semantics. And when it does, the inherent properties of the language start to dominate. Strong types beat weak types. Compiled beats interpreted. Explicit beats implicit.

**We've been designing programming languages for human convenience. The next generation will be designed for machine efficiency.** And the humans won't mind, because they won't be reading the code anyway.

## CLI as Steering Wheel

The second idea is about how the LLM actually orchestrates work. And this one I can point to with a very specific example, because I just lived it.

Here's what happened during the Bitcoin scanner build. The LLM wrote all the code, compiled it, and got four compiler errors. It read the errors, fixed them, recompiled. Clean build. Then it ran the tool against test data and got 3 out of 4 key types detected. The extended private key wasn't working. So it added debug output, re-ran, saw the regex was matching but the parser was failing with a checksum error. Traced it to two extra characters in the test vector. Fixed it. Re-ran. 4 out of 4.

Then it ran a full scan of 633,000 files. But it didn't just fire and forget -- it ran the scan in the background and periodically queried the SQLite checkpoint database to see how many files had been processed, how many findings existed, and whether the throughput was healthy. When it noticed the scan was progressing at ~1,500 files/second, it calculated the ETA and adjusted its check-in frequency. It was *steering*.

This is the pattern I think is going to eat the world: **the LLM captures logic in deterministic code, then uses the CLI output as a feedback loop to steer.**

Think about what's happening here. The expensive, non-deterministic part -- figuring out what to build, how to structure it, what to do when things break -- that's the LLM. The cheap, deterministic part -- actually scanning files, hashing bytes, checking bloom filters -- that's compiled code running natively. The CLI is the interface between these two worlds. It's not designed for a human to sit and watch. It's designed to emit just enough structured information for the LLM to know whether things are on track or broken.

This is fundamentally different from how we think about CLI tools today. Traditional CLIs are designed for human operators. They have `--help` flags, man pages, colorized output, interactive prompts. LLM-oriented CLIs don't need any of that. What they need is:

- **Structured, parseable output.** Not pretty tables, but counts, percentages, and status codes the LLM can reason about.
- **Strong idempotency.** The LLM needs to be able to stop, think, and re-run without corrupting state. Checkpoint everything.
- **Clear error messages.** Not stack traces, but enough context for the LLM to diagnose and fix the issue.
- **Composability.** Small tools that do one thing, so the LLM can chain them together as needed.

In the Bitcoin scanner, the checkpoint database is the key piece. Every file scanned gets recorded with its path, size, and modification time. If the process crashes, gets killed, or the LLM decides to stop and investigate, it can just re-run and pick up where it left off. The LLM doesn't have to maintain state in its context window -- the state lives in the database, and the CLI provides a window into it.

## The Ephemeral Program

There's a corollary to this that I think is underappreciated. When an LLM can write and compile a program in seconds, **programs become ephemeral.** You don't need to maintain a codebase for a one-off task. You describe what you need, the LLM writes it, runs it, and the program has served its purpose.

The Bitcoin scanner is actually a hybrid. The core tool is something you'd want to keep around -- it has a clear purpose, it's well-structured, it handles edge cases. But the process of building it involved dozens of throwaway moments. A tiny Rust program to generate a valid xprv key. Debug print statements added and removed. One-off SQLite queries to check progress. These are programs that existed for minutes and then were deleted.

I think this pattern -- durable tools orchestrated by ephemeral glue -- is where a lot of software development is heading. The LLM becomes the runtime for the glue layer. It observes, decides, acts, observes again. The durable tools provide the determinism and performance. The ephemeral programs fill in the gaps.

## What this means for developers

I don't think this means developers go away. But I think the job description changes pretty dramatically.

Right now, a senior engineer's value is largely in knowing how to write code efficiently and correctly. In the LLM-oriented world, the value shifts to knowing **what to build** and **whether it's working.** You become the person who understands the domain well enough to describe the right tool, and who can look at the output and tell whether the result makes sense.

In the Bitcoin scanner project, the human contribution was: "build a tool that scans files for Bitcoin key material, checks addresses against a UTXO bloom filter, and makes the whole thing resumable." That's the hard part -- knowing that this is the right thing to build, knowing what address derivation paths matter, knowing that you need a bloom filter and not an API call for 137,000 results. The actual implementation -- file walking, regex matching, cryptographic validation, BIP32 derivation -- that's the part the machine did better and faster than any human could.

The developers who thrive in this world will be the ones who think in systems rather than syntax. Who can describe a correct program without writing one. Who understand the domain deeply enough to evaluate machine-generated output rather than machine-generated code.

## Not the future -- the present

The thing that's most striking to me about all of this is that it's not hypothetical. I didn't describe a future where LLMs might be good enough to do this. I described a Tuesday.

The tools are alpha. The patterns are nascent. There's a lot of rough edges and failure modes. But the core loop -- describe, generate, compile, run, observe, steer -- is working right now, today, for real tasks that produce real results.

We are building the future of software development, and the direction is clear. Languages will get harder for humans and better for machines. CLIs will become the primary interface between AI reasoning and deterministic execution. Programs will be written in seconds and discarded in minutes. And the developers who adapt to this -- who learn to think at a higher level of abstraction, who embrace the machine as a collaborator rather than a tool -- will build things that would have been impossible a year ago.

I know this because I just watched it happen.

From August 2023 to January 2024 I worked as an AI Trainer at Scale AI. My job was to rate AI responses for accuracy, quality and instruction-following, write prompts, and give feedback that would help improve the models. I can't share project details, but the habits I built there changed how I review work as an engineer.

## 1. "Sounds right" is not the same as "is right"

The hardest responses to rate weren't the obviously bad ones. They were the fluent, confident answers with one wrong fact or one skipped requirement buried in the middle. Rating them well meant checking claims instead of trusting the tone.

I now apply the same rule to code reviews and status updates. A polished pull request description or a confident "it's fixed" still needs to be checked against what actually happens.

## 2. Instruction-following is its own skill

A response can be accurate and well written and still fail, because it ignored part of the request: the wrong format, a missing constraint, an answer to a slightly different question.

In engineering this is the gap between "the feature works" and "the feature does what the client asked for." Before reviewing anything, I re-read the original requirement first.

## 3. Guidelines make judgment consistent

We rated against detailed guidelines. At first they felt rigid, but they made it possible for many people to rate the same way. Without a shared standard, quality turns into personal taste.

For a team, the equivalent is a clear definition of done, review checklists and written conventions. They make quality predictable, and they make feedback feel fair, not personal.

## 4. Good feedback is specific and actionable

"This answer is bad" doesn't help anyone improve. Useful feedback names the exact problem, explains why it matters, and shows what a better result looks like.

I use the same structure when I review work today:

- **What** is wrong, pointing to the exact place.
- **Why** it matters: a bug, a missed requirement, a confusing experience.
- **What good looks like**, so the fix is clear.

## 5. Document errors so they can be fixed

Part of the job was documenting errors and inconsistencies clearly, so the people improving the models could act on them. A vague report wastes everyone's time; a clear one, with the input, the output and what was expected, gets fixed.

That's exactly what a good bug report is: steps to reproduce, what happened, what should have happened.

## 6. Quality and deadlines can coexist

The work had both quality standards and deadlines. The way to meet both was consistency: a repeatable process for each item, instead of deciding from scratch every time.

## Why this matters now

AI tools are becoming part of everyday software work. Knowing how to evaluate their output carefully, and not just accept it, is becoming an engineering skill in its own right. My time at Scale AI gave me a head start on that habit, and I use it every day.

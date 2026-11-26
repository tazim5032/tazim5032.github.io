My earlier post explained how [Pixel Streaming](post.html?slug=pixel-streaming-explained) works. This one is about the other half of the job: managing it as a product. Streaming Unreal Engine apps to a browser looks like a technical problem, but most of the hard decisions are product decisions.

## The product is a session, not a page

With a normal web app, a user loads a page and the work is done. With Pixel Streaming, every visitor gets a live session on a GPU server that has to start, stay smooth and shut down cleanly. So the questions I ask most are about sessions:

- **How long until the first frame?** A visitor who stares at a spinner for 20 seconds leaves, however good the 3D is.
- **Did the session work at all?** A black screen on a corporate network counts as a failure, even if the server was fine.
- **How did it feel?** Input lag and dropped frames matter more than resolution.
- **What did it cost?** A GPU instance costs money for every minute it runs, including the minutes nobody is using it.

If I could keep only one dashboard, it would show session success rate, time to first frame and cost per session hour, side by side. Improving one often hurts another, and seeing all three keeps the trade-offs honest.

## Reliability comes before features

Clients judge the product by their worst session, not their average one. A car configurator that works for 95 out of 100 visitors still means five people saw a broken brand experience. That changes how I prioritise:

1. **Make it work everywhere first.** Network edge cases, TURN relays and browser quirks come before new features.
2. **Make failures visible.** When a session fails, we need to know where: the app, the encoder, the signalling step, the network or the browser. Logs that tell that story save more time than any new feature.
3. **Then make it nicer.** Better quality controls, branding and analytics are worth building once the basics hold.

## Cost is a product decision

Every Pixel Streaming product has to choose between speed and cost. Keeping instances warm means visitors connect instantly, but you pay for idle GPUs. Starting instances on demand is cheaper, but the first visitor waits. A queue protects the budget but frustrates people at peak times.

There is no single right answer. A showroom that runs during a product launch needs warm capacity. An internal training tool used a few times a day doesn't. Part of the job is helping each client pick the right setup for how their audience actually behaves, and making the trade-off clear before the bill arrives, not after.

## Clients are not all the same

The people who use Pixel Streaming want very different things:

- **Product configurators** care about first impressions and mobile visitors.
- **Architectural walkthroughs** care about visual quality and smooth movement.
- **Training simulations** care about long, stable sessions and predictable cost.

Writing the requirements down for each type stops the roadmap from being pulled in every direction by whoever asked last.

## Saying no, and saying when

Many requests are reasonable on their own but would make the product harder to run for everyone. I try to answer each one with a clear "yes, and here is when", "not now, because", or "no, but here is what we can do instead". Clients take a quick, honest answer better than a slow, vague one. That is also why fast support matters so much in this space: when a stream breaks during a client's demo, an answer in hours is worth more than a perfect fix next week.

## What I've learned

Managing a streaming product means caring about the whole path from the GPU to the visitor's screen. The 3D content is the client's; my job is to make sure it reaches every visitor quickly, reliably and at a cost that makes sense. Most of that work is choosing what to measure, what to fix first and what to leave out.

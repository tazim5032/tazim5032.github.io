High-end 3D experiences usually need a powerful GPU on the user's machine. **Pixel Streaming** flips that around: the Unreal Engine application runs on a server with a GPU, and the user just opens a link in a browser. Here's how it works, and what matters when you run it for real clients.

## The idea in one sentence

The server renders the frames, encodes them as video and streams them to the browser over **WebRTC**. The browser sends mouse, keyboard and touch input back, so it feels like the app is running locally.

## The moving parts

A Pixel Streaming setup has a few components:

1. **The Unreal Engine application.** It's packaged with the Pixel Streaming plugin enabled and runs on a machine with a GPU. It renders the scene and uses the GPU's hardware video encoder to compress frames as they're rendered.
2. **The signalling server.** Before any video flows, the browser and the Unreal app need to find each other and agree on how to connect. The signalling server, which ships with Unreal's Pixel Streaming infrastructure, passes those connection messages between them.
3. **STUN and TURN servers.** These help the connection get through firewalls and home routers. STUN helps each side discover its public address. TURN relays the traffic when a direct connection isn't possible, which is common on strict corporate networks.
4. **The web player.** A web page that receives the video stream, shows it, and captures user input to send back over a WebRTC data channel.
5. **A matchmaker (for scale).** With more than one user, each session needs its own app instance. A matchmaker sends each new visitor to a free instance.

## Why teams use it

- **Any device works.** A phone, a low-end laptop or a tablet can run a photorealistic experience, because the device only plays video.
- **Nothing to install.** Users click a link. That matters a lot for product configurators, architectural walkthroughs, virtual showrooms and training simulations.
- **The content stays on the server.** The 3D assets never get downloaded to the user's device.

## What makes it hard in practice

Pixel Streaming demos are easy. Running it reliably for clients takes more care:

- **Latency.** Every input has to travel to the server and the resulting frame has to come back. The server region should be close to the users, and the network path matters as much as raw GPU power.
- **Cost.** Usually each concurrent user needs their own app instance, and GPU instances are expensive. Planning capacity, and shutting idle instances down quickly, has a big effect on the bill.
- **Networking.** If TURN isn't set up correctly, some users, often the ones on corporate networks, simply get a black screen.
- **Quality versus bandwidth.** Resolution, frame rate and bitrate have to adapt to each user's connection. A stream that looks perfect on fibre can stutter on mobile data.
- **Debugging across layers.** When something goes wrong, the cause could be in the Unreal app, the encoder, the signalling server, TURN, the browser or the user's network. A methodical approach, reproducing the issue and isolating one layer at a time, saves hours.

## Takeaway

Pixel Streaming makes high-end 3D accessible from any browser. The rendering is Unreal's job; most of the real-world work is in infrastructure, networking and making sessions reliable. That mix of real-time 3D and web engineering is a big part of why I enjoy working with it.

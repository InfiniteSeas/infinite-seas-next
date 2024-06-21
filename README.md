# Infinite Seas Game Next.js Project

## Introduction

We are creating a maritime trading, managing, and battling diplomatic fully on-chain game.
we believe the best fully onchain games should be fun and infinite (define by games that are non-session and infinitely large map) with an open economy design.
![image](https://hackmd.io/_uploads/H1yiNQVkA.jpg)

### why open economy?

- blockchain offers a great environment for microtransactions between players. We aim to create a game that players are encouraged to trade game assets with each other just like real world maritime trading between ports and ports. Ports trading are building with our AMM infrastructure.
- players are required to stake chain native coins to get ownership of islands. Players can make diplomatic treaty with others to join the alliance. Winners take the orignal stakes of the loser stakes. and game continues.
- The game is designed with mmorpg elements in mind. Our goal is to create a world that players want to live in. We have planting, mining, fishing, cooking, crafting, smithing, building for the pve parts, as well as trading, battling, thieving, and sailing for the pvp parts.

![WechatIMG189-2](https://hackmd.io/_uploads/Hk2vS7V1R.jpg)

### why infnite game?

- non-session: blockchain as a autonomous backend should be used to create games that are running continously and in a trustless way.
- infinitely big map: infinite big map works like cross-sever games in traditional gaming. Infinitely big map is the cornerstone of creating a new-comer friendly open world pvp game. New-comers are able to join games anywhere on the map. they can choose a island coordinates that they feel secure to start the journey.

![WechatIMG181-2](https://hackmd.io/_uploads/S1P5HmVkC.jpg)

### What types of players fit into our game?

- achievers, motivated mainly by increasing their skill levels, achieving goals, and collecting craftables.
- explorers, motivated by exploring the game world and learning how it works. They may interested in thieving which involves to explore hidden information.
- socializers, motivated by trading, working with other players, joining alliance, creating treaty
- killers, motivated by competition, victory, domination, and also trolling

![image](https://hackmd.io/_uploads/H1qdwXEkC.png)

### what's fun about our game?

- we believe the fun comes from 4 aspects: inter-player social, backstabbing, hidden information, randomness, and deep game system

- social elements: the core game loop is truly "diplomatic" game, by which we mean one in which negotiation and alliances are vital important during play. Because the infinite map and all the islands are roughly equal resources and power at the start, **no player can reasonably expect to conquer the entire island section alone. To overcome another power, player need an ally**. And because units may support moves by other players, alliances are effective.

- Backstabbing: The game also supports backstabbing. **Players can break the alliance treaty at any time with a cost.** Thus, gamers can never be certain that, one the next move, the ally will do as he has promised.

- Hidden Information: When the player A arrives on players B island or ships, they can choose from 3 game actions - battle, trade, and thieve. Among the 3 pvp actions, thieving is the most cost efficient way of gaining resources; **thieving records are hidden information; however, if thieving is failed, it will reveal the record and increase aggression.**

- randomness. The game introduce randomness to enhance the player UX. **The production of finished product has a failure rate. The failure rate can be reduced with more practices of the skills and better equipments.** In the PVP part, **the randomness inherent in the system makes it uncertain**: players might still win against odds, or lose despite them. Consequently, warfare, except when there is a major technological disparity between the opponents, is always tense. **It is implemented with block hash**

- **The depth and variety of the game system make achieving the objectives uncertain**. While information about the economy is exposed, it is often difficult to judge what to build in an island next, what skill sets will develop next. As players gain experience, they learn the ins and outs of the system, but it is still sufficiently complex to be hard to master.

## Getting Started

First, clone the Github repository:

```bash
$ git clone https://github.com/InfiniteSeas/infinite-seas-next.git
```

Next, install dependencies:

```bash
$ yarn install
```

For development mode:

```bash
$ yarn dev
```

Finally, for the production server:

```bash
$ yarn build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Developer Reference Guide

### Structure of the project

The project uses version 14+ and App Router Next.js framework written in TypeScript.

The **app** folder serves as the root directory for the entire project, and no **src** directory has been added. The routing is computed based on file paths. Next.js official docs: [https://nextjs.org/docs](https://nextjs.org/docs). You can learn what is app router and differences from page router here.

The **components** folder contains various component subfolders:

- The **game** folder contains the game core canvas and the client-side game component.
- The **shared** folder holds shared components such as the topbar and sidebar.
- The **menus** folder is dedicated to menu components.
- The **form** folder is dedicated to client-side form components, which will handle with signing and executing the programmable transaction blocks.
- The **ui** folder contains form components like buttons and input fields.

The **actions** folder handles all server actions with data fetching and API calls.

The **utils** folder handles all util functions with the game and other tools.

### API calls (blockchain side & backend)

#### Sui API and GET methods

Next.js defaults to server-side components for default components, allowing data fetching during SSR (Server-Side Rendering), significantly improving webpage efficiency. Consequently, Sui API and GET methods can be implemented in any page file. If client-side components require this data, it can be passed to them as props. We can add a folder named **actions** that contains these server action independently.

Learn data fetching with Next.js here: [https://nextjs.org/docs/app/building-your-application/data-fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

Learn Sui API here: [https://docs.sui.io/sui-api-ref#sui_getobject](https://docs.sui.io/sui-api-ref#sui_getobject)

#### Sign and execute progammable transaction blocks and POST methods

In the **components/form/** directory, you will find numerous client-side component forms. Since Next.js automatically implements SSR (Server-Side Rendering), each form has been individually encapsulated as a client-side component for two primary reasons. Firstly, to enhance the efficiency of SSR. Secondly, it facilitates the use of server actions for those API calls.

As a result, all implementations of signing and executing programmable transaction blocks and POST methods are located within these form files. Inside each file, you will find an asynchronous function named something like **someAction**, where you can handle API calls.

Sign and execute programmable transaction block example:

```typescript
async function someAction(formData: FormData) {
  // Get form data
  const data1 = Number(formData.get("data1"));
  const data2 = String(formData.get("data2"));
  const data3 = Number(formData.get("data3"));

  // Build a programmable transaction block
  try {
    const tx = new Transaction();

    tx.moveCall({
      target: "packageId::moduleName::functionName",
      arguments: [
        tx.object(someObjectId),
        tx.pure.u64(someData),
        // ... and more
      ],
      typeArguments: [someType],
    });

    const { digest } = await client.signAndExecuteTransaction({ transaction: tx });
    toast.custom(<TxToast title="Something done successfully!" digest={digest} />);
  } catch (error: any) {
    // Popup some err msg
  }
}
```

Learn Sui programmable transaction block here: [https://docs.sui.io/concepts/transactions/prog-txn-blocks](https://docs.sui.io/concepts/transactions/prog-txn-blocks)

Learn how to build a programmable transaction block with TS SDK here: [https://sdk.mystenlabs.com/typescript/transaction-building/basics](https://sdk.mystenlabs.com/typescript/transaction-building/basics)

POST api call example:

```typescript
async function someAction(formData: FormData) {
  // Get form data
  const data1 = Number(formData.get("data1"));
  const data2 = String(formData.get("data2"));
  const data3 = Number(formData.get("data3"));

  // API calls goes here...
  try {
    await fetch("example.com/api/endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  } catch (error) {
    // Popup some err msg
  }
}
```

Learn how to build a composition pattern here: [https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

### Game library (engine) THREE.js

THREE.js is the world's most popular JavaScript framework for displaying 3D content on the web.

With THREE.js, you no longer need a fancy gaming PC or console to display photorealistic 3D graphics. You don't even need to download a special application. Now everyone can experience stunning 3D applications in the palm of their hand using nothing more than a smartphone and a web browser.

This amazing library and the vibrant community that surrounds are all you need to create games, music videos, scientific and data visualizations, or pretty much anything else you can imagine, right in your browser, on your laptop, tablet, or smartphone!

Learn THREE.js here: [https://threejs.org/docs/index.html#manual/en/introduction/Installation](https://threejs.org/docs/index.html#manual/en/introduction/Installation)

You can create a THREE.js (game) scene like this:

```typescript
import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
```

### Decentralized wallet connection

You may find a component named **ConnectWalletBtn** in the **components/wallet/** directory. It is also a client-side component capable of accessing the browser-injected provider, checking connection status, and invoking methods for connecting and disconnecting.

### Styling with Tailwindcss

The styling of this project is done using **Tailwindcss**. You can configure custom settings in **tailwind.config.ts**, although currently, there are no specific configurations. You can find global styles in the app/global.css file.

Tailwindcss official docs: [https://tailwindcss.com/docs](https://tailwindcss.com/docs).

## Localhost https dev mode

You need to establish a https mode to make your localhost use zkLogin / OAuth. If you use a macOS, please follow the steps bellow.

Step 1, install mkcert:

```bash
$ brew install mkcert
$ brew install nss # if use FireFox
```

Step 2, generate local cert:

```bash
$ mkcert -install
$ mkcert localhost
```

Step 3, run dev mode:

```bash
$ yarn dev:https
```

You can check out **package.json** to find out other command.

## Deployment

### Deploy with a node.js server on Ubuntu22.04 Server

Step 1, install Node.js, Nginx, and Yarn:

```bash
$ sudo apt update
$ sudo apt upgrade

$ sudo apt install nginx

$ sudo apt install nodejs npm
$ sudo npm install -g yarn
```

Step 2, install PM2 to manage project process at backend:

```bash
$ sudo yarn global add pm2
```

Step 3, clone the Github repository at a custom path:

```bash
$ git clone https://github.com/InfiniteSeas/infinite-seas-next.git
$ cd infinite-seas-next
```

Step 4, install dependencies and pack:

```bash
$ yarn install
$ yarn build
```

Step 5, start the project with PM2:

```bash
$ pm2 start yarn --name "infinite-seas-next" -- start -p 3000
```

Step 6, Nginx reference configuration:

```nginx
server {
	listen 443 ssl;
	listen [::]:443 ssl;

	server_name www.example.com;

	root path/to/this/project;

	ssl_certificate www.example.com_bundle.crt;
	ssl_certificate_key www.example.com.key;
	ssl_session_timeout 5m;
	ssl_protocols TLSv1.2 TLSv1.3;
	ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
	ssl_prefer_server_ciphers on;

	location / {
		proxy_pass http://localhost:3000;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
}
```

Step 7, create a soft link and enable Nginx:

```bash
$ sudo ln -s /etc/nginx/sites-available/your_nextjs_app /etc/nginx/sites-enabled/
$ sudo nginx -t
$ sudo service nginx start
```

### Other deployment options such as deploying with Docker

Check out this: [https://nextjs.org/docs/app/building-your-application/deploying](https://nextjs.org/docs/app/building-your-application/deploying)

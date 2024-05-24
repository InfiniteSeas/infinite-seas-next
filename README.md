# Infinite Seas Game Next.js Project

## Introduction

Infinite seas is a on-chain game that... **(Edit the description here)** Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos odio ipsa in, quaerat ipsum, necessitatibus aspernatur, harum vel assumenda ut reprehenderit velit voluptate! Ab, deleniti ducimus? Dolor, voluptatibus eos. Debitis?

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

### API calls (backend & blockchain side)

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
    const txb = new TransactionBlock();

    txb.setGasBudget(100000000);

    txb.moveCall({
      target: "packageId::moduleName::functionName",
      arguments: [
        txb.object(someObjectId),
        txb.pure.u64(someData),
        // ... and more
      ],
      typeArguments: [someType],
    });

    const res = await signAndExecuteTransactionBlock({
      transactionBlock: txb as any,
    });
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

You may find a component named **ConnectWalletBtn** in the **components/ui/** directory. It is also a client-side component capable of accessing the browser-injected provider, checking connection status, and invoking methods for connecting and disconnecting.

### Styling with Tailwindcss

The styling of this project is done using **Tailwindcss**. You can configure custom settings in **tailwind.config.ts**, although currently, there are no specific configurations. You can find global styles in the app/global.css file.

Tailwindcss official docs: [https://tailwindcss.com/docs](https://tailwindcss.com/docs).

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

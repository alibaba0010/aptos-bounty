<p align="center">
  <a href="" rel="noopener">
 <img src="https://shorturl.at/mhcYV" alt="Aptos logo"></a>
</p>
<h3 align="center">APTOS BOUNTY CHALLENGE</h3>

<div align="center">

[![Hackathon](https://img.shields.io/badge/hackathon-name-orange.svg)](https://shorturl.at/gChca)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/alibaba0010/aptos-bounty/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/alibaba0010/aptos-bounty/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

</div>

---

<p align="center"> Few lines describing your project.
    <br> 
</p>

## 📝 Table of Contents

- [Bounty Challenge](#bounty_challenge)
- [Idea / Solution](#idea)
- [Dependencies / Limitations](#limitations)
- [Future Scope](#future_scope)
- [Setting up a local environment](#getting_started)
- [Usage](#usage)
- [Technology Stack](#tech_stack)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgments)

## 🧐 Bounty Challenge <a name = "bounty_challenge"></a>

In this Aptos bounty, the foundations from Quest 2 was taken a level higher and the marketplace dApp was pushed to the next level

## 💡 Idea / Solution <a name = "idea"></a>

This section described the functionality added to the project.

- Auction System: Implement an auction feature for NFTs, allowing users to place bids over a set period, with the highest bidder winning the NFT. Ensure the smart contract logic supports tracking and updating bids securely.

- Offer System: Create a feature that allows users to make offers on NFTs listed in the marketplace, enabling sellers to accept or decline incoming offers for their assets.

## ⛓️ Limitations <a name = "limitations"></a>

- Inabilty to handle fees using escrow method: When a user makes an offer, the offer price should be recieved by an escrow account or contract address but couldn't be used n this project. This makes the project subject to review in the future if it has to be deploed to mainnet.

## 🚀 Future Scope <a name = "future_scope"></a>

- Player vs. Player Auctions: Create a head-to-head auction feature where two users can compete to win an NFT by placing escalating bids, with a countdown timer to intensify the competition.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development
and testing purposes.

- Git cLone the project

### Prerequisites

Install Aptos CLI on your local machine using the following command

```
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

You can check that your installation is working by running the following command.

```
aptos info
```

## Running the project

### ‼️‼️‼️ Copy your wallet address and insert into the

- Move.toml
- NFTMarketplace.move and
- NFTProvider.tsx files

  in the insert_address option

```
cd /smart-contract/contracts run
aptos init
and follow the instruction as shown below to configure your contract for deployment

Still in the directory run
aptos move publish
follow the instructions as shown below
```

```
cd /client run npm install to install all package dependencies for the project
Run
npm start
when packages are installed
```

Example:
![](./imgs/new.png)

```

## 🎈 Usage <a name="usage"></a>

Add notes about how to use the system.

## ⛏️ Built With <a name = "tech_stack"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [VueJs](https://vuejs.org/) - Web Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@kylelobo](https://github.com/kylelobo) - Idea & Initial work

See also the list of [contributors](https://github.com/kylelobo/The-Documentation-Compendium/contributors)
who participated in this project.

## 🎉 Acknowledgments <a name = "acknowledgments"></a>

- Hat tip to anyone whose code was used
- Inspiration
- References
```

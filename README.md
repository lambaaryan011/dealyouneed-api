# DealYouNeed API

Mini SaaS backend using Node.js, Express, and MongoDB.

##  Features

- **User**
  - `POST /user` – create user (`walletBalance = 100`, empty `claimedDeals`)
  - `GET /user/:id` – get user info

- **Deals**
  - `POST /deals` – add a deal (`id`, `title`, `price`, `category`, `partner`)
  - `GET /deals` – list all deals
  - `GET /deals?category=XYZ` – filter by category

- **Claim**
  - `POST /deals/claim/:userId/:dealId` – claim if enough balance, deduct and track claim

##  Setup

1. Install:
   ```bash
   npm install
2. Add .env with:
   ```bash
MONGO_URI="your-mongodb-connection-string"

3. Start server:
   ```bash
  npm run dev

4. Visit http://localhost:3000/ to confirm the app is running.

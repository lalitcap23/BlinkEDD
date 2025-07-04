
# 🚀 BlinkEDD — Solana Payment Link Generator & Sharer

**BlinkEDD** is a sleek, privacy-first Solana payment tool that allows users to create and share **universal Solana payment links**. It provides a frictionless payment experience via wallet-compatible URLs and QR codes.

Built with **Next.js 14**, **Tailwind CSS**, BlinkEDD is optimized for speed, simplicity, and wide wallet compatibility — especially for the 📱 **Mobile Use Case**.

---

## 🌟 Features

* 🔗 **Universal Payment Link Generation**
* 📋 **Copy-to-Clipboard Button with Feedback**
* 📱 **Native Share Button** *(PWA supported)*
* 📷 **QR Code Display & Copyable URL**
* 🛠️ **Advanced Options Toggle**
* 💬 Optional **Labels**, **Messages**, and **Amount** Presets

---

## 💡 Use Cases

| Use Case                        | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| Freelancers & Devs              | Share Solana wallet payment links with clients or collaborators          |
| IRL Events / Hackathons         | Generate payment QR codes for quick donations                            |
| Web3 Creators & Streamers       | Add “Pay Me” links to bios or streams                                    |
| DAOs / Community Funds          | Share universal links to a shared treasury                               |
| Telegram / WhatsApp Integration | Shareable Solana Pay links that open in wallet-supported mobile browsers |

---

## 🔧 Tech Stack

* **Framework**: Next.js 14 (App Router)
* **Styling**: Tailwind CSS
* **UI Icons**: Lucide React
* **QR**: `qrcode.react`
* **Clipboard**: Custom logic using `navigator.clipboard`

---

## 🚦 Live Demo

🔗 [https://blinked-two.vercel.app](https://blinked-two.vercel.app)
Try it now — **no login required!**

---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/lalitcap23/blinked-.git
cd blinked-
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the Dev Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧠 Project Structure (Partial)

```
/src
  /app
    /api                      # Server-side routes 
    /components               # Reusable React components
    /fonts                    # Custom fonts 
    /pay
      - page.tsx              # Payment page route
      - PayClientPage.tsx     # Main client page component
    /styles
      - globals.css           # Global styles 
    /utils
      - deepLinks.ts              # Handle custom deep links
      - generateBlink.ts          # Create BlinkEDD-compatible URLs
      - solanaAddress.ts          # Wallet validation utilities
      - solanaPay.ts              # Solana Pay URL generation
      - universalPayment.ts       # Payment link composer
      - walletDetection.ts        # Client-side wallet checks
    layout.tsx                # App layout component
    page.tsx                  # Main landing/home page

.env                          # Environment variables
tailwind.config.ts            # Tailwind CSS config
postcss.config.js             # PostCSS config
next.config.mjs               # Next.js config
tsconfig.json                 # TypeScript config
README.md                     # Project README
```

---

## 🪙 How It Works

1. User enters **wallet address**, **amount**, **label**, and **message**
2. System generates a **Solana Pay-compatible URL**
3. User can:

   * Copy the link
   * Share via native share dialog (mobile-ready)
   * Show as a QR Code
4. Recipient opens the link using a **Solana-compatible wallet** to pay

---

## 📦 Deployment

BlinkEDD is deployed on **Vercel** for top-tier performance and reliability.

> Easily deploy using the `vercel` CLI or by connecting your GitHub repo to the [Vercel Dashboard](https://vercel.com).

---

## 🙌 Contributing

Open issues or submit pull requests — all contributions are welcome!

---


---

## 📄 License

**MIT License** — feel free to use, modify, and share.

---


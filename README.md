
# 🚀 BlinkEDD — Solana Payment Link Generator & Sharer

BlinkEDD is a sleek, privacy-first Solana payment tool that allows users to create and share **universal Solana payment links**. It provides a frictionless payment experience via wallet-compatible URLs and QR codes.

Built with **Next.js 14**, **Tailwind CSS**, and **Solana Pay**, BlinkEDD is optimized for speed, simplicity, and wide wallet compatibility.

---

## 🌟 Features

- 🔗 **Universal Payment Link Generation**
- 📋 **Copy-to-Clipboard Button with Feedback**
- 📱 **Native Share Button (PWA supported)**
- 📷 **QR Code Display & Copyable URL**
- 🛠️ **Advanced Options Toggle**
- 💬 Optional **labels**, **messages**, and **amount** presets

---

## 💡 Use Cases

| Use Case                          | Description                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| Freelancers & Devs               | Share Solana wallet payment links with clients or collaborators            |
| IRL Events / Hackathons          | Generate payment QR codes for quick donations                              |
| Web3 Creators & Streamers        | Add “Pay Me” links to bios or streams                                      |
| DAOs / Community Funds           | Share universal links to a shared treasury                                 |
| Telegram / WhatsApp Integration | Shareable Solana Pay links that open in wallet-supported mobile browsers   |

---

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Icons**: Lucide React
- **QR**: `qrcode.react`
- **Clipboard**: Custom logic using `navigator.clipboard`

---

## 🚦 Live Demo

🔗 [https://blinked-two.vercel.app](https://blinked-two.vercel.app)

Try it now — no login required!

---

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/lalitcap23/blinked-.git
cd blinked-
````

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the dev server

```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧠 Project Structure (Partial)

```
/src
  /app
    /api                  # Server-side routes (if any)
    /components           # Reusable React components
    /fonts                # Custom fonts (if used)
    /pay
      - page.tsx          # Payment page route
      - PayClientPage.tsx # Main client page component
    /styles
      - globals.css       # Global styles (Tailwind base)
    /utils
      - deepLinks.ts           # Handle custom deep links
      - generateBlink.ts       # Create BlinkEDD-compatible URLs
      - solanaAddress.ts       # Wallet validation utilities
      - solanaPay.ts           # Solana Pay URL generation
      - universalPayment.ts    # Payment link composer
      - walletDetection.ts     # Client-side wallet checks
    layout.tsx            # App layout component
    page.tsx              # Main landing/home page
.env                      # Environment variables

tailwind.config.ts        # Tailwind CSS config
postcss.config.js         # PostCSS config
next.config.mjs           # Next.js config
README.md                 # Project README
tsconfig.json             # TypeScript config

---

## 🪙 How it Works

1. User enters **wallet address**, **amount**, **label**, and **message**
2. System generates a **Solana Pay-compatible URL**
3. User can:

   * Copy the link
   * Share it via native share dialog
   * Show a QR Code
4. Others open the link in any Solana-compatible wallet/browser to pay

---

## 📦 Deployment

BlinkEDD is deployed on **Vercel** for best performance.

> Easily deploy using `vercel` CLI or push to GitHub + connect to Vercel dashboard.

---

## 🙌 Contributing

Contributions are welcome. Open issues or submit pull requests!

---

## 🧑‍💻 Author

* **Lalit Rajput** – [@lalitcap23](https://github.com/lalitcap23)

---

## 📄 License

MIT License – feel free to use, modify, and share.

---

```

---

Let me know if you want:

- Shields (e.g., Vercel | MIT | Stars)
- Screenshots in the README
- Hindi summary section
- `env.example` setup

Want me to commit it directly formatted for your GitHub `README.md` too?
```

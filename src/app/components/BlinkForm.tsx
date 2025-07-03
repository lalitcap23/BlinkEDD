'use client';
import React, { useState, useEffect } from 'react';
import StatusAlert from './StatusAlert';
import WalletButton from './WalletButton';
import ShareableLinks from './ShareableLinks';
import { Globe } from 'lucide-react';
import {
validateSolanaAddress,
detectMobilePlatform,
detectAvailableWallets,
formatSolAmount,
generateSolanaPayURL
} from '../utils/generateBlink';

export default function BlinkForm() {
const [recipient, setRecipient] = useState('');
const [amount, setAmount] = useState<number>(0.001);
const [label, setLabel] = useState('Support Me');
const [message, setMessage] = useState('');
const [universalPaymentLink, setUniversalPaymentLink] = useState('');
const [solanaPayURL, setSolanaPayURL] = useState('');
const [availableWallets, setAvailableWallets] = useState<string[]>([]);
const [isGenerating, setIsGenerating] = useState(false);
const [copied, setCopied] = useState<{ [key: string]: boolean }>({});
const [error, setError] = useState('');
const [status, setStatus] = useState('');
const [showQR, setShowQR] = useState(false);
const [showAdvanced, setShowAdvanced] = useState(false);
const [isMobile, setIsMobile] = useState(false);
const [showWallets, setShowWallets] = useState(false);

const handleGenerate = async () => {
setError('');
setStatus('');
if (!recipient.trim()) return setError('Wallet address is required');
if (!validateSolanaAddress(recipient.trim())) return setError('Invalid Solana wallet address');
if (amount <= 0) return setError('Amount must be greater than 0');
if (amount > 1000) return setError('Amount seems too large. Please double-check.');

setIsGenerating(true);
try {
const platform = detectMobilePlatform();
setIsMobile(platform.isMobile);

// Generate universal payment link
const universalLink = `${window.location.origin}/pay?recipient=${encodeURIComponent(recipient.trim())}&amount=${amount}&label=${encodeURIComponent(label.trim())}&message=${encodeURIComponent(message.trim())}`;
setUniversalPaymentLink(universalLink);

// Generate Solana Pay URL
setSolanaPayURL(generateSolanaPayURL(recipient.trim(), amount, label.trim(), message.trim()));

// Set status to show success
setStatus('✅ Universal payment links generated successfully!');

// Note: We're NOT calling detectAvailableWallets() here to avoid triggering wallet connections
// We'll only detect wallets when user clicks "Show Wallets" button
} catch (err) {
setError(err instanceof Error ? err.message : 'Failed to generate payment links');
} finally {
setIsGenerating(false);
}
};

const handleShowWallets = async () => {
if (availableWallets.length === 0) {
setStatus('Detecting available wallets...');
try {
const wallets = await detectAvailableWallets();
setAvailableWallets(wallets);
setStatus('');
} catch (err) {
setStatus('Could not detect wallets. You can still use the universal links.');
}
}
setShowWallets(true);
};

const copyToClipboard = async (text: string, type: string) => {
try {
await navigator.clipboard.writeText(text);
setCopied(prev => ({ ...prev, [type]: true }));
setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
} catch {
const textArea = document.createElement('textarea');
textArea.value = text;
document.body.appendChild(textArea);
textArea.select();
document.execCommand('copy');
document.body.removeChild(textArea);
setCopied(prev => ({ ...prev, [type]: true }));
setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
}
};

const updateStatus = (newStatus: string) => setStatus(newStatus);

return (
<div className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20">
<div className="text-center mb-8">
<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
⚡ Universal Solana Payment Links
</h1>
<p className="text-gray-600">Create shareable payment links that work seamlessly across all devices and wallets</p>
<div className="flex justify-center gap-2 mt-2 text-xs text-gray-500">
<span>✅ Universal Links</span>
<span>✅ Auto-Detection</span>
<span>✅ All Wallets</span>
<span>✅ Cross-Platform</span>
</div>
</div>

<div className="space-y-6">
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Wallet Address *</label>
<input
type="text"
placeholder="Enter Solana wallet address (44 characters)"
className="w-full border text-black border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm font-mono"
value={recipient}
onChange={e => setRecipient(e.target.value)}
/>
{recipient && !validateSolanaAddress(recipient) && (
<p className="text-xs text-red-500 mt-1">Invalid Solana address format</p>
)}
</div>

<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">Amount (SOL) *</label>
<input
type="number"
placeholder="0.001"
className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black"
value={amount}
onChange={e => setAmount(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))}
min="0"
step="0.001"
/>
<div className="flex justify-between text-xs text-gray-500 mt-1">
<span>Min: 0.001 SOL</span>
<span>{formatSolAmount(amount)}</span>
</div>
</div>

<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">Payment Label</label>
<input
type="text"
placeholder="e.g., Buy me a coffee, Tip for content"
className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black"
value={label}
onChange={e => setLabel(e.target.value)}
/>
</div>

<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
<textarea
placeholder="Add a personal message..."
className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-black"
rows={3}
value={message}
onChange={e => setMessage(e.target.value)}
/>
</div>

<StatusAlert type={error ? 'error' : 'status'} message={error || status} />

<button
onClick={handleGenerate}
disabled={isGenerating || !recipient.trim() || amount <= 0 || !validateSolanaAddress(recipient)}
className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
>
{isGenerating ? (
<>
<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
Generating Universal Links...
</>
) : (
<>
<Globe className="w-5 h-5" />
Generate Universal Payment Links
</>
)}
</button>
</div>

{universalPaymentLink && (
<div className="mt-8 space-y-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
<div className="text-center">
<h3 className="text-lg font-semibold text-gray-800 mb-2">🎉 Universal Payment Links Generated!</h3>
<p className="text-sm text-gray-600">Amount: <strong>{formatSolAmount(amount)}</strong></p>
<p className="text-xs text-gray-500 mt-1">
{isMobile ? 'Tap buttons to open wallet apps directly' : 'Share links or use QR codes for mobile payments'}
</p>
</div>

<ShareableLinks
universalPaymentLink={universalPaymentLink}
solanaPayURL={solanaPayURL}
copied={copied}
copyToClipboard={copyToClipboard}
amount={amount}
showAdvanced={showAdvanced}
setShowAdvanced={setShowAdvanced}
showQR={showQR}
setShowQR={setShowQR}
label={label}
message={message}
/>

<button 
className="mt-4 w-full bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition-all" 
onClick={handleShowWallets}
>
Show Wallets
</button>

{showWallets && (
<div className="mt-4 space-y-4">
<WalletButton
recipient={recipient.trim()}
amount={amount}
label={label.trim()}
message={message.trim()}
walletName="Universal"
isMobile={isMobile}
onCopy={copyToClipboard}
onStatusUpdate={updateStatus}
/>
{isMobile && availableWallets.length > 0 && (
<div className="grid grid-cols-2 gap-3">
{availableWallets.slice(0, 4).map(wallet => (
<div key={wallet} className="col-span-1">
<WalletButton
recipient={recipient.trim()}
amount={amount}
label={label.trim()}
message={message.trim()}
walletName={wallet.charAt(0).toUpperCase() + wallet.slice(1)}
isMobile={isMobile}
onCopy={copyToClipboard}
onStatusUpdate={updateStatus}
/>
</div>
))}
</div>
)}
</div>
)}

{Object.keys(copied).some(key => copied[key]) && (
<div className="text-center">
<div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
Copied!
</div>
</div>
)}
</div>
)}
</div>
);
}
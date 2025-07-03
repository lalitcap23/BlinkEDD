'use client';
import React, { useState, useEffect } from 'react';
import StatusAlert from './StatusAlert';
import WalletButton from './WalletButton';
import ShareableLinks from './ShareableLinks';
import { Globe, Sparkles, ArrowRight } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto">
            {/* Main Form Card */}
            <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="w-8 h-8" />
                            <h2 className="text-3xl md:text-4xl font-bold">Payment Link Generator</h2>
                        </div>
                        <p className="text-purple-100 text-lg">
                            Create universal payment links in seconds
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
                            <span className="bg-white/20 px-3 py-1 rounded-full">✅ All Wallets</span>
                            <span className="bg-white/20 px-3 py-1 rounded-full">✅ All Devices</span>
                            <span className="bg-white/20 px-3 py-1 rounded-full">✅ Instant</span>
                            <span className="bg-white/20 px-3 py-1 rounded-full">✅ Free</span>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8 md:p-12">
                    <div className="space-y-8">
                        {/* Recipient Address */}
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3">
                                Recipient Wallet Address *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Solana wallet address (44 characters)"
                                    className="w-full border-2 border-gray-200 text-black p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm font-mono bg-gray-50 hover:bg-white"
                                    value={recipient}
                                    onChange={e => setRecipient(e.target.value)}
                                />
                                {recipient && validateSolanaAddress(recipient) && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {recipient && !validateSolanaAddress(recipient) && (
                                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                    <span>⚠️</span>
                                    Invalid Solana address format
                                </p>
                            )}
                        </div>

                        {/* Amount and Label Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-3">
                                    Amount (SOL) *
                                </label>
                                <input
                                    type="number"
                                    placeholder="0.001"
                                    className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-black bg-gray-50 hover:bg-white"
                                    value={amount}
                                    onChange={e => setAmount(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))}
                                    min="0"
                                    step="0.001"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>Min: 0.001 SOL</span>
                                    <span className="font-semibold">{formatSolAmount(amount)}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-3">
                                    Payment Label
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Buy me a coffee, Tip for content"
                                    className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-black bg-gray-50 hover:bg-white"
                                    value={label}
                                    onChange={e => setLabel(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3">
                                Message (Optional)
                            </label>
                            <textarea
                                placeholder="Add a personal message for your payment request..."
                                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none text-black bg-gray-50 hover:bg-white"
                                rows={4}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />
                        </div>

                        {/* Status Alert */}
                        <StatusAlert type={error ? 'error' : 'status'} message={error || status} />

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !recipient.trim() || amount <= 0 || !validateSolanaAddress(recipient)}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3 text-lg"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Generating Universal Links...
                                </>
                            ) : (
                                <>
                                    <Globe className="w-6 h-6" />
                                    Generate Universal Payment Links
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {universalPaymentLink && (
                <div className="mt-8 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-3xl border-2 border-green-200 overflow-hidden">
                    {/* Success Header */}
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🎉</div>
                            <h3 className="text-2xl font-bold mb-2">Payment Links Generated!</h3>
                            <p className="text-green-100">
                                Amount: <strong>{formatSolAmount(amount)}</strong>
                            </p>
                            <p className="text-xs text-green-100 mt-2">
                                {isMobile ? 'Tap buttons to open wallet apps directly' : 'Share links or use QR codes for mobile payments'}
                            </p>
                        </div>
                    </div>

                    {/* Links Content */}
                    <div className="p-8">
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
                            className="mt-6 w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                            onClick={handleShowWallets}
                        >
                            {showWallets ? 'Hide Wallet Options' : 'Show Wallet Options'}
                        </button>

                        {showWallets && (
                            <div className="mt-6 space-y-4">
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {availableWallets.slice(0, 4).map(wallet => (
                                            <WalletButton
                                                key={wallet}
                                                recipient={recipient.trim()}
                                                amount={amount}
                                                label={label.trim()}
                                                message={message.trim()}
                                                walletName={wallet.charAt(0).toUpperCase() + wallet.slice(1)}
                                                isMobile={isMobile}
                                                onCopy={copyToClipboard}
                                                onStatusUpdate={updateStatus}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {Object.keys(copied).some(key => copied[key]) && (
                            <div className="text-center mt-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    ✅ Copied to clipboard!
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
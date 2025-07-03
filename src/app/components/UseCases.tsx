import React from 'react';
import { 
  Users, 
  Coffee, 
  Mic, 
  Heart, 
  Gift, 
  Gamepad2,
  Music,
  Camera,
  BookOpen,
  Utensils
} from 'lucide-react';

export default function UseCases() {
  const useCases = [
    {
      icon: Users,
      title: "Meetups & Events",
      description: "Perfect for Solana meetups, conferences, and community events. Share payment links for tickets, donations, or tips.",
      examples: ["Event tickets", "Speaker tips", "Community donations"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Coffee,
      title: "Content Creator Tips",
      description: "Enable your audience to tip you instantly on Twitter, YouTube, or any social platform.",
      examples: ["Twitter tips", "YouTube support", "Blog donations"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Mic,
      title: "Live Streaming",
      description: "Receive real-time tips during live streams with instant notifications and easy sharing.",
      examples: ["Twitch donations", "Live tips", "Stream support"],
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Heart,
      title: "Charity & Fundraising",
      description: "Create transparent, instant donation links for causes and charitable organizations.",
      examples: ["Charity drives", "Emergency funds", "Community support"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Gift,
      title: "Personal Payments",
      description: "Send payment requests to friends and family for shared expenses or gifts.",
      examples: ["Split bills", "Gift requests", "Shared expenses"],
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Gamepad2,
      title: "Gaming & NFTs",
      description: "Perfect for gaming communities, NFT sales, and digital collectible transactions.",
      examples: ["NFT sales", "Gaming tips", "Digital collectibles"],
      color: "from-pink-500 to-pink-600"
    }
  ];

  const platforms = [
    { name: "Twitter", icon: "🐦" },
    { name: "Discord", icon: "💬" },
    { name: "Telegram", icon: "✈️" },
    { name: "Reddit", icon: "🤖" },
    { name: "Instagram", icon: "📸" },
    { name: "TikTok", icon: "🎵" },
    { name: "YouTube", icon: "📺" },
    { name: "Twitch", icon: "🎮" }
  ];

  return (
    <section id="use-cases" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Endless Use Cases
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From meetups to social media, our universal payment links work everywhere you need them
          </p>
        </div>

        {/* Main Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-14 h-14 bg-gradient-to-r ${useCase.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <useCase.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{useCase.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{useCase.description}</p>
              <div className="space-y-2">
                {useCase.examples.map((example, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Platform Compatibility */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Works On All Platforms
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Share your payment links anywhere and everywhere. Our universal links work seamlessly across all social media platforms and messaging apps.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-2xl mb-2">{platform.icon}</div>
                <div className="text-sm font-medium text-gray-700">{platform.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            Real Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎪</div>
              <h4 className="font-semibold mb-2">Solana Meetup NYC</h4>
              <p className="text-gray-600 text-sm">Raised $2,500 in tips for speakers using QR codes at their monthly meetup</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="font-semibold mb-2">NFT Artist</h4>
              <p className="text-gray-600 text-sm">Increased Twitter engagement by 300% using payment links for art commissions</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎮</div>
              <h4 className="font-semibold mb-2">Gaming Streamer</h4>
              <p className="text-gray-600 text-sm">Simplified donations and increased viewer support by 150% on Twitch</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
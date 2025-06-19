import BlinkForm from './components/BlinkForm';

export const metadata = {
  title: 'Blink Maker | Solana Tips',
  description: 'Create and share Solana blink payment links with ease.',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-purple-100 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <BlinkForm />
        <footer className="text-center mt-6 text-sm text-gray-600">
          Built with ❤️ on Solana • <a href="https://github.com/lalitcap23" className="underline hover:text-purple-600" target="_blank" rel="noreferrer">GitHub</a>
        </footer>
      </div>
    </main>
  );
}

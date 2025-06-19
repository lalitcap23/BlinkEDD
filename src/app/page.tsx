import Head from 'next/head'
import BlinkForm from './components/BlinkForm'

export default function Home() {
  return (
    <>
      <Head>
        <title>Blink Maker - Solana</title>
      </Head>
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <BlinkForm />
      </main>
    </>
  )
}

import HostGame from '@/components/HostGame';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Feed the Kraken Companion</h1>
      <div className="flex justify-center">
        <HostGame />
      </div>
    </main>
  );
}

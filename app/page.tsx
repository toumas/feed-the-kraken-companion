import HostGame from '@/components/HostGame';
import JoinGame from '@/components/JoinGame';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Feed the Kraken Companion</h1>
      <div className="flex justify-center gap-8">
        <HostGame />
        <JoinGame />
      </div>
    </main>
  );
}

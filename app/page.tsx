import HostGame from '@/components/HostGame';
import JoinGame from '@/components/JoinGame';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Feed the Kraken Companion</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 @container">
        <div className="@[400px]:w-[350px] @[400px]:mx-auto w-full">
          <JoinGame />
        </div>
        <div className="@[400px]:w-[350px] @[400px]:mx-auto w-full">
          <HostGame />
        </div>
      </div>
    </main>
  );
}

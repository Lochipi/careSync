import { Button } from "~/components/ui/button";

export default function Home() {

  return (
    <main className="bg-gray-200 text-black flex h-screen flex-col items-center justify-center">
      <Button variant="outline">
        Go to tRPC
      </Button>
    </main>
  );
}

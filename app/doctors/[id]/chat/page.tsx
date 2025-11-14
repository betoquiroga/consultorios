import { ChatInterface } from "../../../components/doctors/ChatInterface";
import { AppHeader } from "../../../components/shared/AppHeader";

type ChatPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-black">
      <AppHeader />
      <div className="pt-24 flex-1 flex flex-col">
        <div className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Chat con Doctor
          </h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface doctorId={id} />
        </div>
      </div>
    </div>
  );
}


import { useParams } from "react-router-dom";

import { ChatView } from "@/components/chat/chat-view";
import { RequireAuth } from "@/components/providers/require-auth";

export default function ChatPage() {
  const { repoId = "" } = useParams<{ repoId: string }>();

  return (
    <RequireAuth>
      <ChatView repoId={repoId} />
    </RequireAuth>
  );
}

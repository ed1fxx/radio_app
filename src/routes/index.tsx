import { createFileRoute } from "@tanstack/react-router";
import { RadioChat } from "@/components/radio-chat";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Home,
});

function Home() {
  return <RadioChat />;
}

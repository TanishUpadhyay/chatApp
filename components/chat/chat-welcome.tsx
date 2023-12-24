import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
};

export const ChatWelcome = ({
  name,
  type
}: ChatWelcomeProps) => {
  return (
    <div className="space-y-2.5 px-6 mb-6">
      {type === "channel" && (
        <div className="h-[50px] w-[50px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-4xl font-bold">
        {type === "channel" ? "Welcome to #" : ""}{name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === "channel"
          ? ` Start #${name} channel.`
          : ` Start conversation with ${name}`
        }
      </p>
    </div>
  )
}
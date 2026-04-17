import type { Message } from "@langchain/langgraph-sdk";
import { CoinsIcon } from "lucide-react";

import { useI18n } from "@/core/i18n/hooks";
import {
  accumulateUsage,
  formatTokenCount,
  getUsageMetadata,
  type TokenUsage,
} from "@/core/messages/usage";
import { cn } from "@/lib/utils";

export function MessageTokenUsage({
  className,
  enabled = false,
  isLoading = false,
  message,
}: {
  className?: string;
  enabled?: boolean;
  isLoading?: boolean;
  message: Message;
}) {
  if (!enabled || isLoading || message.type !== "ai") {
    return null;
  }

  const usage = getUsageMetadata(message);

  return <TokenUsageBadge className={className} usage={usage} />;
}

export function MessageTokenUsageList({
  className,
  enabled = false,
  isLoading = false,
  messages,
}: {
  className?: string;
  enabled?: boolean;
  isLoading?: boolean;
  messages: Message[];
}) {
  if (!enabled || isLoading) {
    return null;
  }

  const usage = accumulateUsage(messages);
  const hasAIMessage = messages.some((message) => message.type === "ai");

  if (!hasAIMessage) {
    return null;
  }

  return <TokenUsageBadge className={className} usage={usage} />;
}

function TokenUsageBadge({
  className,
  usage,
}: {
  className?: string;
  usage: TokenUsage | null;
}) {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        "text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-[11px]",
        className,
      )}
    >
      <div className="border-border/60 bg-background/70 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border px-3 py-1.5">
        <span className="inline-flex items-center gap-1 font-medium">
          <CoinsIcon className="size-3" />
          {t.tokenUsage.label}
        </span>
        {usage ? (
          <>
            <span>
              {t.tokenUsage.input}: {formatTokenCount(usage.inputTokens)}
            </span>
            <span>
              {t.tokenUsage.output}: {formatTokenCount(usage.outputTokens)}
            </span>
            <span className="font-medium">
              {t.tokenUsage.total}: {formatTokenCount(usage.totalTokens)}
            </span>
          </>
        ) : (
          <span>{t.tokenUsage.unavailableShort}</span>
        )}
      </div>
    </div>
  );
}

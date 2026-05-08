import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { formatDate } from "@/data/sessions";

interface SessionDetailHeaderProps {
  title: string;
  date: string;
  duration: string;
  onBack: () => void;
}

export function SessionDetailHeader({
  title,
  date,
  duration,
  onBack,
}: SessionDetailHeaderProps) {
  return (
    <div className="mb-6">
      <div className="mb-4">
        <EvenStarButton variant="ghost" size="sm" onClick={onBack} className="text-ink-3 hover:text-ace px-0 mb-3 -ml-1">
          ← Back
        </EvenStarButton>
        <EvenStarText as="h1" variant="display" className="leading-tight mb-1">
          {title}
        </EvenStarText>
        <EvenStarText as="p" variant="meta" tone="muted">
          {formatDate(date)} · {duration}
        </EvenStarText>
      </div>
    </div>
  );
}

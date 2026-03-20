import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ConditionalSectionProps {
  title: string;
  show: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function ConditionalSection({ title, show, defaultOpen = true, children }: ConditionalSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!show) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface SelectOption {
  value: number | string;
  label: string;
  description?: string;
}

interface SelectCardProps {
  label: string;
  options: readonly SelectOption[];
  value: number | string;
  onChange: (value: number | string) => void;
  tooltipKey?: string;
  tooltipText?: string;
  layout?: 'horizontal' | 'vertical';
}

export function SelectCard({
  label, options, value, onChange, layout = 'horizontal',
}: SelectCardProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className={`flex gap-2 ${layout === 'vertical' ? 'flex-col' : 'flex-wrap'}`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex-1 min-w-[80px] rounded-lg border-2 px-3 py-2 text-sm text-left transition-all
                ${isSelected
                  ? 'border-[#2D7D46] bg-[#2D7D46]/5 text-[#2D7D46] font-medium'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
            >
              <div className="font-medium">{option.label}</div>
              {option.description && (
                <div className="text-xs mt-0.5 opacity-70">{option.description}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

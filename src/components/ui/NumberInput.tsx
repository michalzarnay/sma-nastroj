import { Tooltip } from './Tooltip';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  tooltipKey?: string;
  tooltipText?: string;
  disabled?: boolean;
  className?: string;
}

export function NumberInput({
  label, value, onChange, unit, min = 0, max, step = 1,
  placeholder, tooltipKey, tooltipText, disabled = false, className = '',
}: NumberInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="flex items-center text-sm font-medium text-gray-700">
        {label}
        {(tooltipKey || tooltipText) && <Tooltip glossaryKey={tooltipKey} text={tooltipText} />}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => {
            const v = e.target.value === '' ? 0 : parseFloat(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder || '0'}
          disabled={disabled}
          style={unit ? { paddingRight: `${unit.length * 0.6 + 1.5}rem` } : undefined}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D7D46] focus:ring-2 focus:ring-[#2D7D46]/20 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

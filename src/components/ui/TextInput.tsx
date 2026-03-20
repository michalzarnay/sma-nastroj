import { Tooltip } from './Tooltip';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  tooltipKey?: string;
  tooltipText?: string;
  multiline?: boolean;
  className?: string;
}

export function TextInput({
  label, value, onChange, placeholder, tooltipKey, tooltipText, multiline = false, className = '',
}: TextInputProps) {
  const inputClasses = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D7D46] focus:ring-2 focus:ring-[#2D7D46]/20 focus:outline-none";

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="flex items-center text-sm font-medium text-gray-700">
        {label}
        {(tooltipKey || tooltipText) && <Tooltip glossaryKey={tooltipKey} text={tooltipText} />}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={inputClasses}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
}

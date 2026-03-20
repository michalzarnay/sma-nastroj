import { Camera } from 'lucide-react';

// TODO: Future AI integration - photo analysis using Anthropic Claude Vision API
export function PhotoAnalyzer() {
  return (
    <button
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
      onClick={() => alert('Táto funkcia bude dostupná čoskoro. Budete môcť nahrať fotku a AI automaticky rozpozná typ strechy, stav budovy a pod.')}
    >
      <Camera className="w-4 h-4" />
      Nahrať fotku (čoskoro)
    </button>
  );
}

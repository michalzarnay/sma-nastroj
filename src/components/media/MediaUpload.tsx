import { useRef, useState } from 'react';
import { Camera, Film, Trash2, Upload, AlertCircle } from 'lucide-react';
import { MediaItem } from '../../types/areal';

const MAX_FOTO_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 50;

interface MediaUploadProps {
  media: MediaItem[];
  onAdd: (item: MediaItem) => void;
  onUpdate: (id: string, data: Partial<MediaItem>) => void;
  onRemove: (id: string) => void;
}

export function MediaUpload({ media, onAdd, onUpdate, onRemove }: MediaUploadProps) {
  const fotoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [chyba, setChyba] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const spracujSubory = async (files: FileList | null) => {
    if (!files) return;
    setChyba(null);
    setLoading(true);

    for (const file of Array.from(files)) {
      const jeVideo = file.type.startsWith('video/');
      const jeFoto = file.type.startsWith('image/');

      if (!jeFoto && !jeVideo) {
        setChyba(`Nepodporovaný formát: ${file.name}`);
        continue;
      }

      const maxMB = jeVideo ? MAX_VIDEO_SIZE_MB : MAX_FOTO_SIZE_MB;
      if (file.size > maxMB * 1024 * 1024) {
        setChyba(`${file.name} prekračuje limit ${maxMB} MB`);
        continue;
      }

      if (jeFoto) {
        const dataUrl = await nacitajAkoBase64(file);
        onAdd({
          id: crypto.randomUUID(),
          nazov: file.name,
          typ: 'foto',
          dataUrl,
          velkost: file.size,
          popis: '',
          datumNahratia: new Date().toISOString(),
        });
      } else {
        // Video: uložíme iba metadáta, nie binárne dáta (príliš veľké pre localStorage)
        onAdd({
          id: crypto.randomUUID(),
          nazov: file.name,
          typ: 'video',
          dataUrl: '',
          velkost: file.size,
          popis: '',
          datumNahratia: new Date().toISOString(),
        });
      }
    }

    setLoading(false);
  };

  const nacitajAkoBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    spracujSubory(e.dataTransfer.files);
  };

  const formatVelkost = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Drop zóna */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#2D7D46] transition-colors"
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 font-medium">Pretiahnite súbory sem alebo</p>
        <div className="flex justify-center gap-2 mt-3">
          <button
            type="button"
            onClick={() => fotoRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2D7D46] border border-[#2D7D46] rounded-lg hover:bg-[#2D7D46]/5"
          >
            <Camera className="w-3.5 h-3.5" />
            Pridať foto
          </button>
          <button
            type="button"
            onClick={() => videoRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-400 rounded-lg hover:bg-blue-50"
          >
            <Film className="w-3.5 h-3.5" />
            Pridať video
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Foto: max {MAX_FOTO_SIZE_MB} MB · Video: max {MAX_VIDEO_SIZE_MB} MB (iba metadáta)
        </p>
        <input
          ref={fotoRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => spracujSubory(e.target.files)}
        />
        <input
          ref={videoRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => spracujSubory(e.target.files)}
        />
      </div>

      {chyba && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {chyba}
        </div>
      )}

      {loading && (
        <p className="text-xs text-gray-500 text-center">Spracovávam súbory…</p>
      )}

      {/* Galéria */}
      {media.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Nahraté médiá ({media.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {media.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onPopis={(popis) => onUpdate(item.id, { popis })}
                onRemove={() => onRemove(item.id)}
                formatVelkost={formatVelkost}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MediaCard({
  item,
  onPopis,
  onRemove,
  formatVelkost,
}: {
  item: MediaItem;
  onPopis: (p: string) => void;
  onRemove: () => void;
  formatVelkost: (b: number) => string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden group">
      {/* Náhľad */}
      <div className="relative bg-gray-100 h-28 flex items-center justify-center">
        {item.typ === 'foto' && item.dataUrl ? (
          <img
            src={item.dataUrl}
            alt={item.nazov}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <Film className="w-8 h-8" />
            <span className="text-xs">video</span>
          </div>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 p-1 rounded-full bg-white/90 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info */}
      <div className="p-2 space-y-1">
        <p className="text-xs font-medium text-gray-700 truncate" title={item.nazov}>
          {item.nazov}
        </p>
        <p className="text-[10px] text-gray-400">{formatVelkost(item.velkost)}</p>
        <input
          type="text"
          value={item.popis}
          onChange={(e) => onPopis(e.target.value)}
          placeholder="Popis…"
          className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:border-[#2D7D46]"
        />
      </div>
    </div>
  );
}

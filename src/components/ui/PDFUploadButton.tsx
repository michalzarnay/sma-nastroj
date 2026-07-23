import { useRef, useState } from 'react';
import { FileText, Loader2, CheckCircle, AlertCircle, X, ChevronRight } from 'lucide-react';
import {
  parseDocument,
  ParsedDocument,
  DocumentType,
} from '../../utils/pdfParser';

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  lv: 'List vlastníctva',
  energetickyCertifikat: 'Energetický certifikát',
  projektovaDokumentacia: 'Projektová dokumentácia',
  auditSprava: 'Správa z auditu',
  neznamy: 'Neznámy typ dokumentu',
};

interface FieldPreview {
  label: string;
  value: string;
}

interface PDFUploadButtonProps {
  /** Which document types are accepted here. Others trigger a warning. */
  acceptTypes?: DocumentType[];
  /** Called with the parsed result when user confirms */
  onParsed: (doc: ParsedDocument) => void;
  label?: string;
}

export function PDFUploadButton({
  acceptTypes,
  onParsed,
  label = 'Nahrať PDF',
}: PDFUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'preview' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [parsed, setParsed] = useState<ParsedDocument | null>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Vyberte súbor vo formáte PDF.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const doc = await parseDocument(file);
      setParsed(doc);
      setStatus('preview');
    } catch (e) {
      console.error(e);
      setErrorMsg('PDF sa nepodarilo načítať. Je súbor textový (nie skenovaný)?');
      setStatus('error');
    }
    // Reset input so same file can be selected again
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleConfirm = () => {
    if (parsed) onParsed(parsed);
    setStatus('idle');
    setParsed(null);
  };

  const handleClose = () => {
    setStatus('idle');
    setParsed(null);
  };

  const fields = parsed ? buildPreview(parsed) : [];
  const wrongType =
    parsed && acceptTypes && !acceptTypes.includes(parsed.typ) && parsed.typ !== 'neznamy';

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === 'loading'}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 border border-purple-300 rounded-xl hover:bg-purple-50 disabled:opacity-50 transition-colors"
      >
        {status === 'loading' ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <FileText className="w-3.5 h-3.5" />
        )}
        {status === 'loading' ? 'Číta PDF…' : label}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {status === 'error' && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {errorMsg}
        </p>
      )}

      {/* Preview modal */}
      {status === 'preview' && parsed && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {DOC_TYPE_LABELS[parsed.typ]}
                  </p>
                  <p className="text-xs text-gray-400">Rozpoznané z PDF</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Warning: wrong type */}
            {wrongType && (
              <div className="mx-4 mt-3 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Dokument vyzerá ako <strong>{DOC_TYPE_LABELS[parsed.typ]}</strong>, nie ako
                  {' '}{acceptTypes!.map(t => DOC_TYPE_LABELS[t]).join(' alebo ')}.
                  Môžeš ho napriek tomu použiť.
                </span>
              </div>
            )}

            {/* Unknown type */}
            {parsed.typ === 'neznamy' && (
              <div className="mx-4 mt-3 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Typ dokumentu sa nepodarilo rozoznať. Skontroluj extrahované hodnoty.
              </div>
            )}

            {/* Extracted fields */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {fields.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  Z dokumentu sa nepodarilo extrahovať žiadne štruktúrované údaje.
                  <br />
                  <span className="text-xs">Dokument môže byť skenovaný alebo v neočakávanom formáte.</span>
                </p>
              ) : (
                <>
                  <p className="text-xs text-gray-500 mb-2">
                    Nasledujúce hodnoty sa vyplnia do formulára:
                  </p>
                  {fields.map((f, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-500 flex-shrink-0">{f.label}</span>
                      <span className="text-xs font-medium text-gray-800 text-right">{f.value}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 p-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Zrušiť
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={fields.length === 0}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                Vyplniť formulár
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Build human-readable preview from parsed doc ──────────────────────────────

function buildPreview(doc: ParsedDocument): FieldPreview[] {
  const fields: FieldPreview[] = [];

  if (doc.lv) {
    const { lv } = doc;
    if (lv.cisloLV) fields.push({ label: 'Číslo LV', value: lv.cisloLV });
    if (lv.obec) fields.push({ label: 'Obec', value: lv.obec });
    if (lv.okres) fields.push({ label: 'Okres', value: lv.okres });
    if (lv.katastralneUzemie) fields.push({ label: 'Katastrálne územie', value: lv.katastralneUzemie });
    lv.parcely.forEach((p) =>
      fields.push({ label: `Parcela ${p.cislo}`, value: `${p.vymeraMsq.toLocaleString('sk')} m² – ${p.druh}` })
    );
  }

  if (doc.certifikat) {
    const { certifikat: c } = doc;
    if (c.energetickaTrieda) fields.push({ label: 'Energetická trieda', value: c.energetickaTrieda });
    if (c.celkovaPlochaMsq) fields.push({ label: 'Celková plocha', value: `${c.celkovaPlochaMsq} m²` });
    if (c.potrebaEnergieKurenie) fields.push({ label: 'Spotreba – vykurovanie', value: `${c.potrebaEnergieKurenie} kWh/(m²·a)` });
    if (c.potrebaEnergieVoda) fields.push({ label: 'Spotreba – teplá voda', value: `${c.potrebaEnergieVoda} kWh/(m²·a)` });
    if (c.primarnaEnergia) fields.push({ label: 'Primárna energia', value: `${c.primarnaEnergia} kWh/(m²·a)` });
    if (c.typVykurovania) fields.push({ label: 'Typ vykurovania', value: c.typVykurovania });
  }

  if (doc.projekt) {
    const { projekt: p } = doc;
    if (p.nazovStavby) fields.push({ label: 'Názov stavby', value: p.nazovStavby });
    if (p.rokVystavby) fields.push({ label: 'Rok výstavby', value: String(p.rokVystavby) });
    if (p.uzitkovaPlocha) fields.push({ label: 'Úžitková plocha', value: `${p.uzitkovaPlocha} m²` });
    if (p.zastavanahPlocha) fields.push({ label: 'Zastavaná plocha', value: `${p.zastavanahPlocha} m²` });
    if (p.pocetNadzemPodlazi) fields.push({ label: 'Nadzemné podlažia', value: String(p.pocetNadzemPodlazi) });
    if (p.pocetPodzemnychPodlazi) fields.push({ label: 'Podzemné podlažia', value: String(p.pocetPodzemnychPodlazi) });
    if (p.typStrechy) fields.push({ label: 'Typ strechy', value: p.typStrechy });
    if (p.obvodoveStenyMaterial) fields.push({ label: 'Obvodové steny', value: p.obvodoveStenyMaterial });
  }

  if (doc.audit) {
    const { audit: a } = doc;
    if (a.celkovaSpotreba) fields.push({ label: 'Celková spotreba', value: `${a.celkovaSpotreba} kWh` });
    if (a.spotrebaElektrina) fields.push({ label: 'Spotreba – elektrina', value: `${a.spotrebaElektrina} kWh` });
    if (a.spotrebaPlyn) fields.push({ label: 'Spotreba – plyn', value: `${a.spotrebaPlyn} kWh` });
  }

  return fields;
}

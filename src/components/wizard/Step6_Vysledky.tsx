import { BarChart3, Download, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Areal } from '../../types/areal';
import { useScoring } from '../../hooks/useScoring';
import { useRecommendations } from '../../hooks/useRecommendations';
import { ScoreGauge } from '../ui/ScoreGauge';
import { getScoreLevel } from '../../types/scoring';
import { Odporucanie } from '../../types/catalog';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer,
} from 'recharts';

interface Step6Props {
  areal: Areal;
}

export function Step6_Vysledky({ areal }: Step6Props) {
  const score = useScoring(areal);
  const recommendations = useRecommendations(areal);

  const radarData = [
    { subject: 'MZI', value: score.mzi.celkove, fullMark: 100 },
    { subject: 'OZE', value: score.oze.celkove, fullMark: 100 },
    { subject: 'Energia', value: score.energia.celkove, fullMark: 100 },
  ];

  const handleExportCSV = () => {
    const BOM = '\uFEFF';
    const rows: string[][] = [
      ['Areál', areal.nazov],
      ['Adresa', areal.adresa],
      ['Obec', areal.obec],
      ['Región', areal.region],
      [''],
      ['Celkové skóre', String(score.celkove)],
      ['MZI skóre', String(score.mzi.celkove)],
      ['OZE skóre', String(score.oze.celkove)],
      ['Energetika skóre', String(score.energia.celkove)],
      [''],
      ['Pozemky', String(areal.pozemky.length)],
      ['Budovy', String(areal.budovy.length)],
      [''],
      ['Odporúčania:'],
      ...recommendations.map((r) => [r.opatrenie.nazov, r.priorita, r.dovod]),
    ];
    const csv = BOM + rows.map((r) => r.map((c) => `"${c}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${areal.nazov || 'areal'}-hodnotenie.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    let y = 20;
    doc.setFontSize(18);
    doc.text('Hodnotenie adaptacnych opatreni', 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Areal: ${areal.nazov}`, 20, y);
    y += 7;
    doc.text(`Adresa: ${areal.adresa}, ${areal.obec}`, 20, y);
    y += 7;
    doc.text(`Datum: ${new Date().toLocaleDateString('sk')}`, 20, y);
    y += 15;

    doc.setFontSize(14);
    doc.text('Celkove skore', 20, y);
    y += 8;
    doc.setFontSize(24);
    doc.text(`${score.celkove} / 100`, 20, y);
    y += 12;
    doc.setFontSize(11);
    doc.text(`MZI: ${score.mzi.celkove}/100   OZE: ${score.oze.celkove}/100   Energia: ${score.energia.celkove}/100`, 20, y);
    y += 15;

    doc.setFontSize(14);
    doc.text('Odporucania', 20, y);
    y += 8;
    doc.setFontSize(10);
    for (const rec of recommendations.slice(0, 10)) {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`[${rec.priorita}] ${rec.opatrenie.nazov}`, 20, y);
      y += 5;
      doc.setTextColor(100);
      doc.text(`  ${rec.dovod}`, 22, y);
      doc.setTextColor(0);
      y += 7;
    }

    y += 10;
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text('Toto hodnotenie je orientacne. Pre presny navrh kontaktujte odbornika.', 20, y);

    doc.save(`${areal.nazov || 'areal'}-hodnotenie.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-[#2D7D46]/10 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-[#2D7D46]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Výsledky hodnotenia</h2>
          <p className="text-xs text-gray-500">
            {areal.nazov && `${areal.nazov} – `}Celkové skóre a odporúčané opatrenia
          </p>
        </div>
      </div>

      {/* Score Gauges */}
      <div className="flex flex-wrap justify-center gap-8">
        <ScoreGauge score={score.celkove} label="Celkové skóre" size="lg" />
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        <ScoreGauge score={score.mzi.celkove} label="Modro-zelená infraštruktúra" size="md" />
        <ScoreGauge score={score.oze.celkove} label="Obnoviteľné zdroje energie" size="md" />
        <ScoreGauge score={score.energia.celkove} label="Energetická efektivita" size="md" />
      </div>

      {/* Radar Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Porovnanie oblastí</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar
                dataKey="value"
                stroke="#2D7D46"
                fill="#2D7D46"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score Detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScoreDetail
          title="MZI"
          items={[
            { label: 'Priepustné plochy', score: score.mzi.podielPriepustnychPloch, max: 25 },
            { label: 'Existujúce opatrenia', score: score.mzi.existujuceOpatrenia, max: 25 },
            { label: 'Stav zelene', score: score.mzi.stavZelene, max: 25 },
            { label: 'Potenciál zlepšenia', score: score.mzi.potencialZlepsenia, max: 25 },
          ]}
        />
        <ScoreDetail
          title="OZE"
          items={[
            { label: 'Vhodnosť strechy', score: score.oze.vhodnostStrechyPreSolar, max: 30 },
            { label: 'Existujúce OZE', score: score.oze.existujuceOZE, max: 20 },
            { label: 'Potenciál TČ', score: score.oze.potencialTepelnehoCerpadla, max: 25 },
            { label: 'Potenciál ďalších OZE', score: score.oze.potencialDalsichOZE, max: 25 },
          ]}
        />
        <ScoreDetail
          title="Energetika"
          items={[
            { label: 'Zateplenie', score: score.energia.zateplenie, max: 30 },
            { label: 'Kvalita okien', score: score.energia.kvalitaOkien, max: 20 },
            { label: 'Vykurovací systém', score: score.energia.vykurovaciSystem, max: 25 },
            { label: 'Vetranie/LED', score: score.energia.vetranie, max: 25 },
          ]}
        />
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Odporúčané opatrenia ({recommendations.length})
        </h3>
        {recommendations.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Zadajte viac údajov o areáli, aby sme mohli vygenerovať odporúčania.
          </p>
        ) : (
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <RecommendationCard key={rec.opatrenie.id} rec={rec} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Export */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2D7D46] border border-[#2D7D46] rounded-lg hover:bg-[#2D7D46]/5 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportovať CSV
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2D7D46] rounded-lg hover:bg-[#2D7D46]/90 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Stiahnuť PDF report
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center italic">
        Toto hodnotenie je orientačné. Pre presný návrh kontaktujte odborníka.
      </p>
    </div>
  );
}

function ScoreDetail({ title, items }: { title: string; items: { label: string; score: number; max: number }[] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-medium">{item.score}/{item.max}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${(item.score / item.max) * 100}%`,
                backgroundColor: getScoreLevel((item.score / item.max) * 100).color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecommendationCard({ rec, index }: { rec: Odporucanie; index: number }) {
  const [isOpen, setIsOpen] = useState(index < 3);

  const priorityColors = {
    'vysoká': 'bg-red-100 text-red-700',
    'stredná': 'bg-amber-100 text-amber-700',
    'nízka': 'bg-blue-100 text-blue-700',
  };

  const categoryColors = {
    'MZI': 'bg-[#2D7D46]/10 text-[#2D7D46]',
    'OZE': 'bg-[#2196F3]/10 text-[#2196F3]',
    'ENERGETIKA': 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-400 w-6">{index + 1}.</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-800">{rec.opatrenie.nazov}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityColors[rec.priorita]}`}>
              {rec.priorita}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${categoryColors[rec.opatrenie.kategoria]}`}>
              {rec.opatrenie.kategoria}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{rec.dovod}</p>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-700">{rec.opatrenie.popis}</p>
          {rec.potencial && (
            <p className="text-sm text-[#2D7D46] font-medium">{rec.potencial}</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-gray-500">Orientačná cena</span>
              <p className="font-medium text-gray-700">{rec.opatrenie.orientacnaCena}</p>
            </div>
            <div>
              <span className="text-gray-500">Návratnosť</span>
              <p className="font-medium text-gray-700">{rec.opatrenie.navratnost}</p>
            </div>
            <div>
              <span className="text-gray-500">Náročnosť</span>
              <p className="font-medium text-gray-700">{rec.opatrenie.narocnostRealizacie}</p>
            </div>
            <div>
              <span className="text-gray-500">Dotácie</span>
              <p className="font-medium text-gray-700">{rec.opatrenie.dotacie}</p>
            </div>
          </div>
          {rec.opatrenie.benefity.length > 0 && (
            <div>
              <span className="text-xs text-gray-500">Benefity:</span>
              <ul className="mt-1 space-y-0.5">
                {rec.opatrenie.benefity.map((b, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                    <span className="text-[#2D7D46] mt-0.5">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {rec.opatrenie.krokyRealizacie.length > 0 && (
            <div>
              <span className="text-xs text-gray-500">Kroky realizácie:</span>
              <ol className="mt-1 space-y-0.5 list-decimal list-inside">
                {rec.opatrenie.krokyRealizacie.map((k, i) => (
                  <li key={i} className="text-xs text-gray-600">{k}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

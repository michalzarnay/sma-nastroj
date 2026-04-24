import { useCallback, useState } from 'react';
import { Areal, createEmptyAreal } from '../types/areal';

export interface Session {
  id: string;
  nazov: string;
  areal: Areal;
  datumUlozenia: string;
}

const SESSIONS_KEY = 'sma-nastroj-sessions';

function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: Session[]): void {
  try {
    // Ukladáme bez media base64 dat aby sme šetrili miesto — len metadata
    const light = sessions.map((s) => ({
      ...s,
      areal: {
        ...s.areal,
        media: s.areal.media.map((m) => ({
          ...m,
          dataUrl: m.typ === 'foto' ? m.dataUrl : '', // video blobs nie sú persistovateľné
        })),
      },
    }));
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(light));
  } catch (e) {
    console.warn('Nepodarilo sa uložiť relácie:', e);
  }
}

export function useSessionManager() {
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions());

  const saveSession = useCallback((nazov: string, areal: Areal): Session => {
    const session: Session = {
      id: crypto.randomUUID(),
      nazov,
      areal: { ...areal, id: areal.id || crypto.randomUUID() },
      datumUlozenia: new Date().toISOString(),
    };
    setSessions((prev) => {
      const updated = [session, ...prev];
      saveSessions(updated);
      return updated;
    });
    return session;
  }, []);

  const updateSession = useCallback((id: string, areal: Areal) => {
    setSessions((prev) => {
      const updated = prev.map((s) =>
        s.id === id
          ? { ...s, areal, datumUlozenia: new Date().toISOString() }
          : s
      );
      saveSessions(updated);
      return updated;
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveSessions(updated);
      return updated;
    });
  }, []);

  const exportSession = useCallback((session: Session) => {
    const json = JSON.stringify(session, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.nazov || 'areal'}-${session.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importSession = useCallback((file: File): Promise<Areal> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          // Môže byť celá Session alebo iba Areal
          const areal: Areal = data.areal ?? data;
          const empty = createEmptyAreal();
          resolve({
            ...empty,
            ...areal,
            media: areal.media ?? [],
            vahy: areal.vahy ?? { mzi: 1, oze: 1, energia: 1 },
          });
        } catch {
          reject(new Error('Neplatný súbor relácie'));
        }
      };
      reader.onerror = () => reject(new Error('Chyba čítania súboru'));
      reader.readAsText(file);
    });
  }, []);

  return { sessions, saveSession, updateSession, deleteSession, exportSession, importSession };
}

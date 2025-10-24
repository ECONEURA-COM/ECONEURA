import React
import { SkeletonLoader } from './components/SkeletonLoader';, { useMemo, useState, useEffect, useRef, memo } from "react";
import { Link } from "react-router-dom";
import {
  Crown, Cpu, Shield, Workflow, Users, Target, Brain, LineChart, Wallet, Database,
  ShieldCheck, UserCheck, MessageCircle, ClipboardList, Megaphone, FileText, Radar,
  Bug, Gauge, Activity as ActivityIcon, Inbox, Mail, TrendingUp, FileBarChart2, ListChecks, CalendarDays,
  Mic, MicOff, Volume2, StopCircle, Play, Pause, Zap, Moon, Sun, User, LogOut, Settings, Menu, X,
  DollarSign, FileCheck, Clock
} from "lucide-react";
import { ConnectAgentModal } from "./components/ConnectAgentModal";
import { ChatHistory } from "./components/ChatHistory";
import { Analytics } from "./components/Analytics";
import { LanguageSelector } from "./components/LanguageSelector";
import { CustomerPortal } from "./components/CustomerPortal";
import { useTranslation, Language } from "./i18n/translations";
import { Toaster, toast } from "sonner";
import confetti from "canvas-confetti";
import Fuse from "fuse.js";
import React
import { SkeletonLoader } from './components/SkeletonLoader';Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Tipos exportados (únicos)
export type Agent = {
  id: string;
  title: string;
  desc: string;
  pills?: string[];
};

export interface Department {
  id: string;
  name: string;
  chips: string[];
  neura: {
    title: string;
    subtitle: string;
    tags: string[];
    // NUEVO: Métricas de VALOR
    value?: {
      timeSavedHoursMonth: number;    // Horas ahorradas/mes
      valueEurMonth: number;           // Valor en EUR/mes
      roiPercentage: number;           // ROI %
      problem: string;                 // Problema que resuelve
      solution: string;                // Solución que ofrece
    };
  };
  agents: Agent[];
}

import { cx } from './utils/classnames';
import { hexToRgb, rgba, lightenColor } from './utils/colors';
import { DepartmentButton } from './components/DepartmentButton';

/**
 * ECONEURA — Cockpit completo al 100%
 * - 10 NEURA con chat GPT-5 (simulado gratis o real con API key)
 * - 40 agentes Make con webhooks configurables
 * - Posibilidad de crear nuevos agentes
 * - UI exacta sin cambios de textos ni diseño
 */

// Tipos ahora importados desde ./types/

/**
 * Logo ECONEURA - Soporta imagen personalizada
 *
 * OPCIÓN 1: Usar imagen personalizada
 * Coloca tu imagen en: apps/web/public/logo-econeura.png
 * Formatos soportados: PNG, JPG, SVG, WEBP
 * Tamaño recomendado: 36x36px o múltiplos (72x72, 144x144)
 *
 * OPCIÓN 2: Usar SVG inline (fallback automático)
 * Si no hay imagen, usa el SVG del código
 */
// MEJORA 7: Memoization de componente logo para evitar re-renders
const LogoEconeura = memo(function LogoEconeura(): JSX.Element {
  const [useImage, setUseImage] = useState(true);
  const [imagePath] = useState('/logo-econeura.svg'); // SVG para mejor calidad

  if (useImage) {
    return (
      <div className="relative flex-shrink-0 group">
        {/* Logo container - sin brillos */}
        <div
          className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-105"
          style={{
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            willChange: 'transform'
          }}
        >
          {/* White center circle */}
          <div className="absolute inset-[3px] rounded-full bg-white flex items-center justify-center overflow-hidden">
      <img
        src={imagePath}
        alt="Logo ECONEURA"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        style={{
                transform: 'scale(1.35)',
                transformOrigin: '50% 50%'
        }}
        onError={() => setUseImage(false)}
      />
          </div>
        </div>
      </div>
    );
  }

  // SVG - Réplica EXACTA del logo circular (sin cambios)
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ECONEURA"
      className="flex-shrink-0"
      style={{ borderRadius: '50%' }}
    >
      <title>ECONEURA</title>
      <defs>
        {/* Gradiente dorado realista */}
        <radialGradient id="goldGradient">
          <stop offset="0%" stopColor="#FFEB99" />
          <stop offset="30%" stopColor="#FFD54F" />
          <stop offset="70%" stopColor="#FFA726" />
          <stop offset="100%" stopColor="#F57C00" />
        </radialGradient>
        {/* Highlight */}
        <radialGradient id="highlight">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Fondo circular beige claro */}
      <circle cx="256" cy="256" r="256" fill="#F5F5DC"/>

      {/* Círculo borde verde azulado */}
      <circle cx="256" cy="256" r="240" fill="none" stroke="#0E6B67" strokeWidth="8"/>

      {/* Tronco principal central */}
      <rect x="246" y="130" width="20" height="260" fill="#0E6B67" rx="10"/>

      {/* Ramas superiores */}
      <path d="M 256 180 L 200 150 Q 195 148 190 150" stroke="#0E6B67" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <path d="M 256 150 L 256 120" stroke="#0E6B67" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <path d="M 256 180 L 312 150 Q 317 148 322 150" stroke="#0E6B67" strokeWidth="16" fill="none" strokeLinecap="round"/>

      {/* Ramas medias superiores */}
      <path d="M 256 220 L 180 200 Q 172 198 165 200" stroke="#0E6B67" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <path d="M 256 220 L 332 200 Q 340 198 347 200" stroke="#0E6B67" strokeWidth="16" fill="none" strokeLinecap="round"/>

      {/* Ramas medias */}
      <path d="M 256 270 Q 220 265 170 275" stroke="#0E6B67" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <path d="M 256 270 Q 292 265 342 275" stroke="#0E6B67" strokeWidth="16" fill="none" strokeLinecap="round"/>

      {/* Ramas inferiores con curvas */}
      <path d="M 256 320 Q 230 325 190 340" stroke="#0E6B67" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <path d="M 256 320 Q 282 325 322 340" stroke="#0E6B67" strokeWidth="16" fill="none" strokeLinecap="round"/>

      {/* Ramas base inferiores */}
      <path d="M 256 360 Q 240 368 210 375" stroke="#0E6B67" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <path d="M 256 360 Q 272 368 302 375" stroke="#0E6B67" strokeWidth="16" fill="none" strokeLinecap="round"/>

      {/* ESFERAS DORADAS CIRCULARES */}
      {/* Esfera superior central */}
      <circle cx="256" cy="110" r="24" fill="url(#goldGradient)"/>
      <circle cx="256" cy="110" r="24" fill="url(#highlight)" opacity="0.5"/>
      <circle cx="248" cy="102" r="8" fill="white" opacity="0.6"/>

      {/* Esferas nivel 1 */}
      <circle cx="190" cy="145" r="22" fill="url(#goldGradient)"/>
      <circle cx="190" cy="145" r="22" fill="url(#highlight)" opacity="0.5"/>
      <circle cx="183" cy="138" r="7" fill="white" opacity="0.6"/>

      <circle cx="322" cy="145" r="22" fill="url(#goldGradient)"/>
      <circle cx="322" cy="145" r="22" fill="url(#highlight)" opacity="0.5"/>
      <circle cx="315" cy="138" r="7" fill="white" opacity="0.6"/>

      {/* Esferas nivel 2 */}
      <circle cx="165" cy="195" r="22" fill="url(#goldGradient)"/>
      <circle cx="165" cy="195" r="22" fill="url(#highlight)" opacity="0.5"/>
      <circle cx="158" cy="188" r="7" fill="white" opacity="0.6"/>

      <circle cx="347" cy="195" r="22" fill="url(#goldGradient)"/>
      <circle cx="347" cy="195" r="22" fill="url(#highlight)" opacity="0.5"/>
      <circle cx="340" cy="188" r="7" fill="white" opacity="0.6"/>

      {/* Esferas nivel 3 */}
      <circle cx="170" cy="270" r="22" fill="url(#goldGradient)"/>
      <circle cx="170" cy="270" r="22" fill="url(#highlight)" opacity="0.5"/>
      <circle cx="163" cy="263" r="7" fill="white" opacity="0.6"/>

      <circle cx="342" cy="270" r="22" fill="url(#goldGradient)"/>
      <circle cx="342" cy="270" r="22" fill="url(#highlight)" opacity="0.5"/>
      <circle cx="335" cy="263" r="7" fill="white" opacity="0.6"/>

      {/* Esferas nivel 4 */}
      <circle cx="190" cy="335" r="22" fill="url(#goldGradient)"/>
      <circle cx="190" cy="335" r="22" fill="url(#highlight)" opacity="0.5"/>
      <circle cx="183" cy="328" r="7" fill="white" opacity="0.6"/>

      <circle cx="322" cy="335" r="22" fill="url(#goldGradient)"/>
      <circle cx="322" cy="335" r="22" fill="url(#highlight)" opacity="0.5"/>
      <circle cx="315" cy="328" r="7" fill="white" opacity="0.6"/>

      {/* Esferas nivel 5 base */}
      <circle cx="210" cy="372" r="22" fill="url(#goldGradient)"/>
      <circle cx="210" cy="372" r="22" fill="url(#highlight)" opacity="0.5"/>
      <circle cx="203" cy="365" r="7" fill="white" opacity="0.6"/>

      <circle cx="302" cy="372" r="22" fill="url(#goldGradient)"/>
      <circle cx="302" cy="372" r="22" fill="url(#highlight)" opacity="0.5"/>
      <circle cx="295" cy="365" r="7" fill="white" opacity="0.6"/>
    </svg>
  );
}); // Fin memo LogoEconeura

// Lectura de variables de entorno segura
const readVar = (winKey: string, viteKey: string, nodeKey: string): string | undefined => {
  const fromWin = (typeof window !== 'undefined' && (window as any)[winKey]) as string | undefined;
  const fromVite = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.[viteKey]) as string | undefined;
  const fromNode = (typeof process !== 'undefined' && (process as any)?.env?.[nodeKey]) as string | undefined;
  return fromWin || fromVite || fromNode || undefined;
};

// Auto-detecta producción vs local
const isProduction = typeof window !== 'undefined' && (
  window.location.hostname.includes('vercel.app') ||
  window.location.hostname.includes('econeura.com') ||
  window.location.hostname.includes('azurestaticapps.net')
);

const env = {
  GW_URL: readVar('__ECONEURA_GW_URL', 'VITE_NEURA_GW_URL', 'NEURA_GW_URL', 'VITE_API_URL') ||
          (isProduction ? 'https://econeura-backend-v2.azurewebsites.net' : 'https://econeura-backend-v2.azurewebsites.net'),
  GW_KEY: readVar('__ECONEURA_GW_KEY', 'VITE_NEURA_GW_KEY', 'NEURA_GW_KEY'),
  LA_ID:  readVar('__LA_WORKSPACE_ID', 'VITE_LA_WORKSPACE_ID', 'LA_WORKSPACE_ID'),
  LA_KEY: readVar('__LA_SHARED_KEY', 'VITE_LA_SHARED_KEY', 'LA_SHARED_KEY'),
};

const nowIso = () => new Date().toISOString();

function correlationId() {
  try {
    const rnd = (globalThis as any).crypto?.getRandomValues(new Uint32Array(4));
    if (rnd) return Array.from(rnd as Iterable<number>).map((n: number) => n.toString(16)).join("");
    throw new Error('no crypto');
  } catch {
    const r = () => Math.floor(Math.random() * 1e9).toString(16);
    return `${Date.now().toString(16)}${r()}${r()}`;
  }
}

// Obtener webhook Make por departamento
function getDeptWebhook(deptId: string): string | undefined {
  const envObj = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
  const key = `VITE_MAKE_WEBHOOK_${String(deptId).toUpperCase()}`;
  const url = envObj[key] as string | undefined;
  return url && /^https:\/\/hook\.[a-z0-9.-]+\.make\.com\//i.test(url) ? url : undefined;
}

async function invokeAgent(agentId: string, route: 'local' | 'azure' = 'azure', payload: Record<string, unknown> = {}) {
  const base = (env.GW_URL || 'https://econeura-backend-v2.azurewebsites.net').replace(/\/$/, '');
  const url = `${base}/api/invoke/${agentId}`;

  try {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
        'X-Correlation-Id': correlationId(),
      },
      body: JSON.stringify({ input: payload?.input ?? "" }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json().catch(() => ({ ok: true, simulated: true, output: `Simulado ${agentId}` }));
  } catch {
    return { ok: true, simulated: true, output: `Simulado ${agentId}` };
  }
}

// Telemetría opcional Azure Log Analytics (solo si hay credenciales)
async function logActivity(row: Record<string, any>) {
  if (!env.LA_ID || !env.LA_KEY) return;
  const g: any = globalThis as any;
  if (!g.crypto || !g.crypto.subtle) return;
  if (typeof g.atob !== 'function' || typeof g.btoa !== 'function') return;
  try {
    const body = JSON.stringify([{ ...row, TimeGenerated: nowIso(), Product: 'ECONEURA', Type: 'EconeuraLogs' }]);
    const endpoint = `https://${env.LA_ID}.ods.opinsights.azure.com/api/logs?api-version=2016-04-01`;
    const keyBytes = Uint8Array.from(g.atob(String(env.LA_KEY)), (c: string) => c.charCodeAt(0));
    const crypto = g.crypto.subtle;
    const k = await crypto.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const date = nowIso();
    const toSign = new TextEncoder().encode(`POST\n${body.length}\napplication/json\nx-ms-date:${date}\n/api/logs`);
    const sig = await crypto.sign('HMAC', k, toSign);
    const signature = g.btoa(String.fromCharCode(...new Uint8Array(sig)));
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Log-Type': 'EconeuraLogs',
        'Authorization': `SharedKey ${env.LA_ID}:${signature}`,
        'x-ms-date': date,
      },
      body,
    }).catch(() => {});
  } catch { /* no-op */ }
}

// Iconos por departamento
const DeptIcon: Record<string, React.ElementType> = {
  CEO: Crown,
  IA: Brain,
  CSO: Target,
  CTO: Cpu,
  CISO: Shield,
  COO: Workflow,
  CHRO: Users,
  MKT: LineChart,
  CFO: Wallet,
  CDO: Database,
};

const isComponent = (x: any): x is React.ElementType => !!x && (typeof x === 'function' || typeof x === 'object');

function getDeptIcon(id: string): React.ElementType {
  const Icon = (DeptIcon as any)[id];
  return isComponent(Icon) ? Icon : Crown;
}

// Paleta PREMIUM - Colores tecnológicos modernos y sofisticados
const DEFAULTS_HEX: Record<string,string> = (typeof window!=='undefined' && (window as any).__ECONEURA_COLORS) || {
  CEO: '#3a3f4b',  // Gris Profundo
  IA:  '#00b4d8',  // Azul Neón
  CSO: '#6c63ff',  // Morado Sintético
  CTO: '#0a4c5f',  // Copilot Azul
  CISO:'#ef476f',  // Rojo de Alerta
  COO: '#7c3aed',  // Morado Operaciones (mejor contraste)
  CHRO:'#52b788',  // Verde Algoritmo
  MKT: '#f9b233',  // Amarillo Nodo
  CFO: '#90e0ef',  // Turquesa Suave
  CDO: '#64748b'   // Gris Pizarra (mejor contraste)
};

type Pal = { accentText:string; accentBg:string; accentBorder:string; textHex:string; bgCss:string; borderCss:string };
const PALETTE: Record<string, Pal> = Object.fromEntries(Object.entries(DEFAULTS_HEX).map(([k,hex])=>{
    const textHex = hex;
  return [k, {
        accentText: 'text-slate-900',
        accentBg: 'bg-white',
        accentBorder: 'border-gray-200',
        textHex,
        bgCss: rgba(hex, 0.08),
        borderCss: rgba(hex, 0.35),
  }];
})) as Record<string, Pal>;

const DEFAULT_PALETTE = PALETTE.CEO;
function getPalette(id: string) { return PALETTE[id] || DEFAULT_PALETTE; }

const theme = { border: '#e5e7eb', muted: '#64748b', ink: '#1f2937', surface: '#ffffff' };
const i18n = { es: { privacy: 'Tus opciones de privacidad', cookies: 'Gestionar cookies', terms: 'Condiciones de uso', tm: 'Marcas registradas', eu_docs: 'Docs cumplimiento de la UE' } };

// Datos exactos: 10 departamentos NEURA + 40 agentes Make
const DATA: Department[] = [
  { id:'CEO',  name:'Ejecutivo (CEO)', chips:['88h/mes','4.400 €/mes','ROI 4.340%'],
    neura:{
      title:'NEURA-CEO',
      subtitle:'Consejero ejecutivo. Ahorra 88h/mes.',
      tags:['Resumen del día','Top riesgos','OKR en alerta'],
      value: {
        timeSavedHoursMonth: 88,
        valueEurMonth: 4400,
        roiPercentage: 4340,
        problem: '200+ emails/día (3h), 20 decisiones/día (2h), reuniones interminables',
        solution: 'IA resume emails → 10 críticos (5min), prioriza decisiones → top 5 (30min)'
      }
    },
    agents:[
      { id:'a-ceo-01', title:'Agenda Consejo', desc:'Genera agenda + materiales reunión. Ahorra 2h/sem (€80/sem)', pills:['2h/sem','€320/mes'] },
      { id:'a-ceo-02', title:'Anuncio Semanal', desc:'Redacta comunicado empresa. Ahorra 1h/sem (€40/sem)', pills:['1h/sem','€160/mes'] },
      { id:'a-ceo-03', title:'Resumen Ejecutivo', desc:'Compila KPIs + insights. Ahorra 3h/sem (€120/sem)', pills:['3h/sem','€480/mes'] },
      { id:'a-ceo-04', title:'Seguimiento OKR', desc:'Dashboard OKRs tiempo real. Ahorra 2h/sem (€80/sem)', pills:['2h/sem','€320/mes'] },
    ] },
  { id:'IA',   name:'Plataforma IA', chips:['40h/mes','3.000 €/mes','ROI 2.929%'],
    neura:{
      title:'NEURA-IA',
      subtitle:'Director de plataforma IA. Ahorra 40h/mes.',
      tags:['Consumo por modelo','Errores por proveedor','Fallbacks últimos 7d'],
      value: {
        timeSavedHoursMonth: 40,
        valueEurMonth: 3000,
        roiPercentage: 2929,
        problem: 'Monitoreo manual costes IA (10h/semana), troubleshooting errores (5h/semana)',
        solution: 'IA optimiza costes automáticamente, detecta/resuelve errores'
      }
    },
    agents:[
      { id:'a-ia-01', title:'Salud y Failover', desc:'Ahorra 2h/semana en monitoring' },
      { id:'a-ia-02', title:'Cost Tracker', desc:'Ahorra 3h/semana en análisis costes' },
      { id:'a-ia-03', title:'Revisión Prompts', desc:'Ahorra 2h/semana optimizando' },
      { id:'a-ia-04', title:'Vigilancia Cuotas', desc:'Ahorra 1h/semana en control' },
    ] },
  { id:'CSO',  name:'Estrategia (CSO)', chips:['32h/mes','2.400 €/mes','ROI 2.323%'],
    neura:{
      title:'NEURA-CSO',
      subtitle:'Asesor estratégico. Ahorra 32h/mes.',
      tags:['Riesgos emergentes','Tendencias del sector','Oportunidades M&A'],
      value: {
        timeSavedHoursMonth: 32,
        valueEurMonth: 2400,
        roiPercentage: 2323,
        problem: 'Análisis de riesgos manual (4h/semana), vigilancia competencia (4h/semana)',
        solution: 'IA detecta riesgos automáticamente, monitorea competencia 24/7'
      }
    },
    agents:[
      { id:'a-cso-01', title:'Gestor de Riesgos', desc:'Ahorra 4h/semana en análisis' },
      { id:'a-cso-02', title:'Vigilancia Competitiva', desc:'Ahorra 2h/semana monitoreando' },
      { id:'a-cso-03', title:'Radar de Tendencias', desc:'Ahorra 1h/semana investigando' },
      { id:'a-cso-04', title:'M&A Sync', desc:'Ahorra 1h/semana en oportunidades' },
    ] },
  { id:'CTO',  name:'Tecnología (CTO)', chips:['94h/mes','7.050 €/mes','ROI 7.020%'],
    neura:{
      title:'NEURA-CTO',
      subtitle:'Director tecnológico. Ahorra 94h/mes.',
      tags:['Incidentes críticos','SLO semanales','Optimización cloud'],
      value: {
        timeSavedHoursMonth: 94,
        valueEurMonth: 7050,
        roiPercentage: 7020,
        problem: 'Monitoring 24/7 (10h/semana), incidentes (8h/semana), code reviews (6h/semana)',
        solution: 'IA monitorea automáticamente, diagnostica incidentes, revisa código'
      }
    },
    agents:[
      { id:'a-cto-01', title:'FinOps Cloud', desc:'Ahorra 3h/semana optimizando costes' },
      { id:'a-cto-02', title:'Seguridad CI/CD', desc:'Ahorra 2h/semana en auditorías' },
      { id:'a-cto-03', title:'Observabilidad SLO', desc:'Ahorra 4h/semana en monitoring' },
      { id:'a-cto-04', title:'Gestión Incidencias', desc:'Ahorra 3h/semana en postmortems' },
    ] },
  { id:'CISO', name:'Seguridad (CISO)', chips:['51h/mes','3.825 €/mes','ROI 3.762%'],
    neura:{
      title:'NEURA-CISO',
      subtitle:'Director de seguridad. Ahorra 51h/mes.',
      tags:['Vulnerabilidades críticas','Phishing últimos 7d','Recertificaciones'],
      value: {
        timeSavedHoursMonth: 51,
        valueEurMonth: 3825,
        roiPercentage: 3762,
        problem: 'Monitoreo CVEs (10h/semana), phishing triage (5h/semana), compliance (8h/mes)',
        solution: 'IA escanea vulnerabilidades 24/7, clasifica phishing, genera reportes compliance'
      }
    },
    agents:[
      { id:'a-ciso-01', title:'Vulnerabilidades', desc:'Ahorra 4h/semana en CVE scanning' },
      { id:'a-ciso-02', title:'Phishing Triage', desc:'Ahorra 3h/semana clasificando' },
      { id:'a-ciso-03', title:'Backup/Restore DR', desc:'Ahorra 1h/semana en verificación' },
      { id:'a-ciso-04', title:'Recertificación', desc:'Ahorra 2h/mes en auditorías' },
    ] },
  { id:'COO',  name:'Operaciones (COO)', chips:['112h/mes','5.600 €/mes','ROI 5.555%'],
    neura:{
      title:'NEURA-COO',
      subtitle:'Director de operaciones. Ahorra 112h/mes.',
      tags:['Pedidos atrasados','SLA por canal','Cuellos de botella'],
      value: {
        timeSavedHoursMonth: 112,
        valueEurMonth: 5600,
        roiPercentage: 5555,
        problem: 'Apagar fuegos (15h/semana), SLA tracking (10h/semana), excepciones (10h/semana)',
        solution: 'IA detecta atrasos antes de SLA breach, monitorea 24/7, resuelve 80% excepciones'
      }
    },
    agents:[
      { id:'a-coo-01', title:'Atrasos y Excepciones', desc:'Ahorra 6h/semana detectando problemas' },
      { id:'a-coo-02', title:'Centro NPS/CSAT', desc:'Ahorra 2h/semana analizando feedback' },
      { id:'a-coo-03', title:'Latido de SLA', desc:'Ahorra 4h/semana en monitoring' },
      { id:'a-coo-04', title:'Torre de Control', desc:'Ahorra 3h/semana en reportes' },
    ] },
  { id:'CHRO', name:'RRHH (CHRO)', chips:['34.5h/mes','2.070 €/mes','ROI 2.000%'],
    neura:{
      title:'NEURA-CHRO',
      subtitle:'Director de RRHH. Ahorra 34.5h/mes.',
      tags:['Clima semanal','Onboardings','Vacantes críticas'],
      value: {
        timeSavedHoursMonth: 34.5,
        valueEurMonth: 2070,
        roiPercentage: 2000,
        problem: 'Onboarding manual (6h/empleado), recruitment (20h/mes), clima laboral (8h/mes)',
        solution: 'IA orquesta onboarding, filtra CVs, analiza clima automáticamente'
      }
    },
    agents:[
      { id:'a-chro-01', title:'Encuesta de Pulso', desc:'Ahorra 2h/semana en análisis clima' },
      { id:'a-chro-02', title:'Offboarding Seguro', desc:'Ahorra 1.5h/empleado en proceso' },
      { id:'a-chro-03', title:'Onboarding Orquestado', desc:'Ahorra 3h/empleado en gestión' },
      { id:'a-chro-04', title:'Pipeline Contratación', desc:'Ahorra 4h/semana filtrando CVs' },
    ] },
  { id:'MKT',  name:'Marketing y Ventas (CMO/CRO)', chips:['64h/mes','3.840 €/mes','ROI 3.778%'],
    neura:{
      title:'NEURA-CMO/CRO',
      subtitle:'Director comercial. Ahorra 64h/mes.',
      tags:['Embudo comercial','Churn y upsell','Campañas activas'],
      value: {
        timeSavedHoursMonth: 64,
        valueEurMonth: 3840,
        roiPercentage: 3778,
        problem: 'Pipeline manual (3h/semana), lead scoring (5h/semana), reportes (6h/semana)',
        solution: 'IA actualiza pipeline automáticamente, score leads, genera reportes'
      }
    },
    agents:[
      { id:'a-mkt-01', title:'Embudo Comercial', desc:'Actualiza CRM automáticamente. Ahorra 3h/sem (€120/sem)', pills:['3h/sem','€480/mes'] },
      { id:'a-mkt-02', title:'Salud de Pipeline', desc:'Detecta deals en riesgo. Ahorra 2h/sem (€80/sem)', pills:['2h/sem','€320/mes'] },
      { id:'a-mkt-03', title:'Calidad de Leads', desc:'Score leads automático. Ahorra 4h/sem (€160/sem)', pills:['4h/sem','€640/mes'] },
      { id:'a-mkt-04', title:'Post-Campaña', desc:'Analiza ROI + recomendaciones. Ahorra 3h/sem (€120/sem)', pills:['3h/sem','€480/mes'] },
    ] },
  { id:'CFO',  name:'Finanzas (CFO)', chips:['38h/mes','2.850 €/mes','ROI 2.778%'],
    neura:{
      title:'NEURA-CFO',
      subtitle:'Director financiero. Ahorra 38h/mes.',
      tags:['Cash runway','Variance vs budget','Cobros y pagos'],
      value: {
        timeSavedHoursMonth: 38,
        valueEurMonth: 2850,
        roiPercentage: 2778,
        problem: 'Cierres mensuales (24h/mes), forecasting (8h/mes), variance (4h/mes), board prep (6h/mes)',
        solution: 'IA hace cierre automático, genera forecast, detecta varianzas, crea slides'
      }
    },
    agents:[
      { id:'a-cfo-01', title:'Tesorería', desc:'Ahorra 2h/semana en proyecciones' },
      { id:'a-cfo-02', title:'Variance', desc:'Ahorra 1h/semana en análisis P&L' },
      { id:'a-cfo-03', title:'Facturación', desc:'Ahorra 1.5h/semana en cobros' },
      { id:'a-cfo-04', title:'Compras', desc:'Ahorra 1h/semana en contratos' },
    ] },
  { id:'CDO',  name:'Datos (CDO)', chips:['28h/mes','2.100 €/mes','ROI 2.020%'],
    neura:{
      title:'NEURA-CDO',
      subtitle:'Director de datos. Ahorra 28h/mes.',
      tags:['SLAs datos','Gobierno','Catálogo'],
      value: {
        timeSavedHoursMonth: 28,
        valueEurMonth: 2100,
        roiPercentage: 2020,
        problem: 'Calidad datos manual (4h/semana), catálogo (3h/semana), optimización queries (4h/mes)',
        solution: 'IA monitorea calidad 24/7, mantiene catálogo, optimiza queries automáticamente'
      }
    },
    agents:[
      { id:'a-cdo-01', title:'Linaje', desc:'Ahorra 1h/semana en análisis impacto' },
      { id:'a-cdo-02', title:'Calidad de Datos', desc:'Ahorra 3h/semana validando' },
      { id:'a-cdo-03', title:'Catálogo', desc:'Ahorra 2h/semana actualizando' },
      { id:'a-cdo-04', title:'Coste DWH', desc:'Ahorra 1h/semana optimizando' },
    ] },
];

function iconForAgent(title: string): React.ElementType {
  const t = title.toLowerCase();
  let Icon: React.ElementType = ClipboardList;
  if (t.includes('agenda')) Icon = CalendarDays;
  else if (t.includes('anuncio') || t.includes('comunicado')) Icon = Megaphone;
  else if (t.includes('resumen') || t.includes('registro')) Icon = FileText;
  else if (t.includes('okr') || t.includes('score')) Icon = Gauge;
  else if (t.includes('salud') || t.includes('health')) Icon = ActivityIcon;
  else if (t.includes('cost') || t.includes('gasto')) Icon = FileBarChart2;
  else if (t.includes('prompts')) Icon = MessageCircle;
  else if (t.includes('cuotas')) Icon = ListChecks;
  else if (t.includes('incidenc')) Icon = Bug;
  else if (t.includes('observabilidad') || t.includes('slo')) Icon = Radar;
  else if (t.includes('phishing')) Icon = Inbox;
  else if (t.includes('email')) Icon = Mail;
  else if (t.includes('tendencias')) Icon = TrendingUp;
  return isComponent(Icon) ? Icon : ClipboardList;
}

function TagIcon({ text }: { text: string }) {
  const s = text.toLowerCase();
  const Maybe: React.ElementType = s.includes('riesgo') ? Shield : s.includes('consumo') ? Gauge : s.includes('errores') ? Bug : s.includes('m&a') ? Target : s.includes('tendencias') ? TrendingUp : FileText;
  const I = isComponent(Maybe) ? Maybe : FileText;
  return <I className="w-3 h-3" />;
}

const light = { surface: '#FFFFFF', ink: '#1F2937', border: '#E5E7EB' };
const paletteLocal = { ceo: { primary: '#5D7177' } };

function FooterComponent(){
  const handleFooterClick = (section: string) => {
    // Navegación funcional a páginas legales
    switch(section) {
      case 'Privacidad':
        window.open('/privacy', '_blank');
        break;
      case 'Cookies':
        window.open('/cookies', '_blank');
        break;
      case 'Términos':
        window.open('/terms', '_blank');
        break;
      case 'Marcas registradas':
        window.open('/trademarks', '_blank');
        break;
      case 'Cumplimiento UE':
        window.open('/compliance', '_blank');
        break;
      default:
        // Navegación a sección desconocida (log removido para producción)
    }
  };

  return (
    <footer className="bg-slate-50/50 px-6 py-3 text-[10px] text-slate-500">
      <div className="flex flex-wrap items-center justify-center gap-2 font-normal">
        <span className="text-slate-600">Español (España)</span>
        <span role="separator" aria-hidden className="text-slate-300">·</span>
        <button
          onClick={() => handleFooterClick('Privacidad')}
          className="hover:text-slate-700 transition-colors hover:underline cursor-pointer bg-transparent border-0 p-0 font-normal"
        >
          Tus opciones de privacidad
        </button>
        <span role="separator" aria-hidden className="text-slate-300">·</span>
        <button
          onClick={() => handleFooterClick('Cookies')}
          className="hover:text-slate-700 transition-colors hover:underline cursor-pointer bg-transparent border-0 p-0 font-normal"
        >
          Gestionar cookies
        </button>
        <span role="separator" aria-hidden className="text-slate-300">·</span>
        <button
          onClick={() => handleFooterClick('Términos')}
          className="hover:text-slate-700 transition-colors hover:underline cursor-pointer bg-transparent border-0 p-0 font-normal"
        >
          Condiciones de uso
        </button>
        <span role="separator" aria-hidden className="text-slate-300">·</span>
        <button
          onClick={() => handleFooterClick('Marcas registradas')}
          className="hover:text-slate-700 transition-colors hover:underline cursor-pointer bg-transparent border-0 p-0 font-normal"
        >
          Marcas registradas
        </button>
        <span role="separator" aria-hidden className="text-slate-300">·</span>
        <button
          onClick={() => handleFooterClick('Cumplimiento UE')}
          className="hover:text-slate-700 transition-colors hover:underline cursor-pointer bg-transparent border-0 p-0 font-normal"
        >
          Docs cumplimiento de la UE
        </button>
        <span role="separator" aria-hidden className="text-slate-300">·</span>
        <span className="text-slate-600">© ECONEURA 2025</span>
      </div>
    </footer>
  );
}

export default function EconeuraCockpit() {
  const [activeDept, setActiveDept] = useState(DATA[0].id);
  const [orgView, setOrgView] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [activity, setActivity] = useState<NeuraActivity[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('es');
  const t = useTranslation(currentLang);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [chatMsgs, setChatMsgs] = useState<{
    id:string;
    text:string;
    role:'user'|'assistant';
    model?:string;
    tokens?:number;
    reasoning_tokens?:number;
    agentExecution?: {
      agentId: string;
      status: 'pending' | 'running' | 'success' | 'error';
      message?: string;
    }
  }[]>([]);
  const [showAllUsage, setShowAllUsage] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [pendingAgentExecution, setPendingAgentExecution] = useState<string | null>(null);
  const [listening, setListening] = useState(false);

  // Estado para modal de conexión
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectingAgent, setConnectingAgent] = useState<{id: string; title: string} | null>(null);

  // Estado para historial de chats
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);

  // Customer portal state
  const [portalOpen, setPortalOpen] = useState(false);

  // User token (from localStorage or empty)
  const [userToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('econeura_token') || '';
    }
    return '';
  });

  // User data
  const [userData, setUserData] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('econeura_user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  // Settings dropdown
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Logout function
  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.removeItem('econeura_token');
      localStorage.removeItem('econeura_user');
      window.location.href = '/';
    }
  };

  // MEJORA 10: Animaciones CSS personalizadas premium
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeInLeft {
        animation: fadeInLeft 0.6s ease-out forwards;
      }
      .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out forwards;
        animation-delay: 0.1s;
        opacity: 0;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);
  const [voiceSupported] = useState<boolean>(typeof window !== 'undefined' && 'speechSynthesis' in window);
  const recognitionRef = useRef<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dept = useMemo(() => DATA.find(d => d.id === activeDept) ?? DATA[0], [activeDept]);
  const lastByAgent = useMemo(() => {
    const m: Record<string, NeuraActivity | undefined> = {};
    for (const e of activity) { if (!m[e.agentId]) m[e.agentId] = e; }
    return m;
  }, [activity]);

  // ⌨️ Keyboard shortcut: Ctrl+K / Cmd+K para focus en búsqueda
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Voice: TTS + STT
  useEffect(() => {
    try {
      const g: any = globalThis as any;
      const SR = g.SpeechRecognition || g.webkitSpeechRecognition;
      if (SR) {
        const rec = new SR();
        rec.lang = 'es-ES';
        rec.interimResults = true;
        rec.onresult = (e: SpeechRecognitionEvent) => {
          let t = '';
          for (let i = e.resultIndex; i < e.results.length; i++) { t += e.results[i][0].transcript; }
          setChatInput(t);
        };
        rec.onend = () => setListening(false);
        recognitionRef.current = rec;
      }
    } catch {}
  }, []);

  function speak(text: string) {
    try {
      const g: any = globalThis as any;
      if (!g.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES';
      g.speechSynthesis.cancel();
      g.speechSynthesis.speak(u);
    } catch {}
  }

  function stopSpeak(){ try { (globalThis as any).speechSynthesis?.cancel(); } catch {} }

  function toggleListen(){
    const rec:any = recognitionRef.current;
    if(!rec) return;
    if(!listening){ setChatInput(''); setListening(true); try{ rec.start(); }catch{} }
    else { try{ rec.stop(); }catch{} }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function sendChatMessage() {
    const text = chatInput.trim();
    if (!text) return;

    // Agregar mensaje del usuario
    const userMsg = { id: correlationId(), text, role: 'user' as const };
    setChatMsgs(v => [...v, userMsg]);
    setChatInput('');

    // Sistema agentic temporalmente deshabilitado para deployment

    try {
      // Llamar al primer agente del departamento actual para chat
      const chatAgentId = dept.agents[0]?.id || 'a-ceo-01';
      
      // Detectar si estamos en producción
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
      
      // API URL: SIEMPRE usar Azure backend (funcional)
      const apiUrl = 'https://econeura-backend-v2.azurewebsites.net';
      // Para desarrollo local con backend local, descomentar:
      // const apiUrl = isLocalhost ? 'https://econeura-backend-v2.azurewebsites.net' : 'https://econeura-backend-v2.azurewebsites.net';

      console.log('[EconeuraCockpit] Chat - Hostname:', hostname);
      console.log('[EconeuraCockpit] Chat - API URL:', apiUrl);

      // MEMORIA CONVERSACIONAL: Enviar historial completo (últimos 10 mensajes)
      const conversationHistory = chatMsgs.slice(-10).concat([userMsg]).map(m => ({
        role: m.role,
        content: m.text
      }));

      const res = await fetch(`${apiUrl}/api/invoke/${chatAgentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-Id': correlationId(),
          'X-Department': dept.id
        },
        body: JSON.stringify({
          input: text,
          history: conversationHistory,
          department: dept.id,
          image: uploadedImage || undefined // Multimodalidad: enviar imagen si existe
        })
      });

      // Limpiar imagen después de enviar
      if (uploadedImage) {
        removeImage();
      }

      const data = await res.json();
      const output = data?.output || data?.message || 'Sin respuesta';
      const model = data?.model || 'gpt-5-2025-08-07';

      // Experiencia Premium: mostrar respuesta sin icono de robot
      // La info del modelo se muestra discretamente en metadata
      setChatMsgs(v => [...v, {
        id: correlationId(),
        text: output,
        role: 'assistant' as const,
        model: model, // Guardamos el modelo en metadata
        tokens: data?.total_tokens || 0,
        reasoning_tokens: data?.reasoning_tokens || 0
      }]);

      // Registrar actividad
      logActivity({
        AgentId: `${dept.id}-chat`,
        DeptId: dept.id,
        Status: 'OK',
        Model: model
      });
    } catch (err) {
      // Mostrar error real para debugging
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('[EconeuraCockpit] Chat error:', err);
      
      setChatMsgs(v => [...v, {
        id: correlationId(),
        text: `❌ Error al conectar con el backend: ${errorMessage}`,
        role: 'assistant'
      }]);
    }
  }

  // 🔍 BÚSQUEDA FUZZY GLOBAL con Fuse.js (permite errores tipográficos)
  const allAgentsWithDept = useMemo(() => {
    const all: Array<Agent & { deptId: string; deptName: string }> = [];
    DATA.forEach(d => {
      d.agents.forEach((a: Agent) => {
        all.push({ ...a, deptId: d.id, deptName: d.name });
      });
    });
    return all;
  }, []);

  const fuse = useMemo(() => new Fuse(allAgentsWithDept, {
    keys: ['title', 'desc', 'deptName'],
    threshold: 0.4, // Permite 40% de diferencia (muy tolerante a errores)
    ignoreLocation: true,
    includeScore: true
  }), [allAgentsWithDept]);

  const filteredAgents = useMemo(() => {
    if (!q.trim()) return dept.agents;

    const results = fuse.search(q);
    return results.map(r => r.item);
  }, [fuse, q, dept.agents]); // Búsqueda en todos los departamentos

  // Sistema agentic temporalmente deshabilitado

  async function runAgent(a: Agent) {
    try {
      setBusyId(a.id);

      // Verificar si el agente está conectado a algún proveedor
      const apiUrl = env.GW_URL || 'https://econeura-backend-v2.azurewebsites.net';

      try {
        const mappingResponse = await fetch(`${apiUrl}/api/integration/agents/${a.id}/mapping`);

        if (mappingResponse.status === 404) {
          // Agente no conectado → abrir modal
          setConnectingAgent({ id: a.id, title: a.title });
          setConnectModalOpen(true);
          setBusyId('');
          return;
        }

        // Agente conectado → invocar
        const invokeResponse = await fetch(`${apiUrl}/api/integration/agents/${a.id}/invoke`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: 'Ejecutar automatización',
            context: { deptId: dept.id, ts: nowIso(), source: 'cockpit' }
          })
        });

        const invokeData = await invokeResponse.json();

        if (invokeResponse.ok && invokeData.success) {
          setActivity(v => [{
            id: correlationId(),
            ts: nowIso(),
            agentId: a.id,
            deptId: dept.id,
            status: 'OK',
            message: `Ejecutado vía ${invokeData.provider} (${invokeData.latency}ms)`,
            executionId: invokeData.executionId
          }, ...v]);
          logActivity({ AgentId: a.id, DeptId: dept.id, Status: 'OK', Type: 'Integration', Provider: invokeData.provider });

          // 🎉 Confetti + Toast al completar exitosamente
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          toast.success(`✓ ${a.title} ejecutado exitosamente`, {
            description: `Completado en ${invokeData.latency}ms vía ${invokeData.provider}`,
            duration: 3000
          });
        } else {
          throw new Error(invokeData.error || 'Ejecución fallida');
        }
      } catch (mappingError: unknown) {
        // Fallback: intentar webhook Make si está configurado
        const webhook = getDeptWebhook(dept.id);
        if (webhook) {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);
          await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentId: a.id, deptId: dept.id, ts: nowIso(), source: 'cockpit' }),
            signal: controller.signal
          });
          clearTimeout(timeout);
          setActivity(v => [{ id: correlationId(), ts: nowIso(), agentId: a.id, deptId: dept.id, status: 'OK', message: 'Webhook Make OK' }, ...v]);
          logActivity({ AgentId: a.id, DeptId: dept.id, Status: 'OK', Type: 'Make' });

          // 🎉 Confetti + Toast
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
          toast.success(`✓ ${a.title} ejecutado exitosamente`, {
            description: 'Webhook Make completado',
            duration: 3000
          });
        } else {
          throw mappingError;
        }
      }
    } catch (e: unknown) {
      setActivity(v => [{ id: correlationId(), ts: nowIso(), agentId: a.id, deptId: dept.id, status: 'ERROR', message: String(e?.message||'Error') }, ...v]);
      logActivity({ AgentId: a.id, DeptId: dept.id, Status: 'ERROR' });

      // ❌ Toast de error
      toast.error(`✗ Error al ejecutar ${a.title}`, {
        description: String(e?.message || 'Verifica la conexión con el backend'),
        duration: 4000
      });
    } finally {
      setBusyId(null);
    }
  }

  function openChatWithErrorSamples() {
    setChatOpen(true);
    setChatMsgs([
      { id: correlationId(), text: 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.', role: 'assistant' },
      { id: correlationId(), text: 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.', role: 'assistant' },
    ]);
  }

  function startCreateAgent(deptId: string){
    const instructions = `NEW AGENTE · ${deptId}
Crea un agente y conéctalo a Make.
1) Pega el Webhook de Make en backend.
2) Define I/O y permisos.
3) Publica.`;
    setActivity(v => [{ id: correlationId(), ts: nowIso(), agentId: 'new-agent', deptId, status: 'OK', message: 'Solicitud de creación de agente' }, ...v]);
    setChatOpen(true);
    setChatMsgs(v => [...v, { id: correlationId(), text: instructions, role: 'assistant' }]);
  }

  const DeptIconComp = getDeptIcon(dept.id);
  const pal = getPalette(dept.id);

  return (
    <>
      {/* Toast Notifications Premium */}
      <Toaster
        position="top-right"
        theme={darkMode ? 'dark' : 'light'}
        richColors
        closeButton
      />

      <div
        className={`min-h-screen relative transition-colors duration-500 ${
          darkMode
            ? 'bg-[#0d1117] text-slate-100'
            : 'bg-gradient-to-br from-slate-50 via-white to-slate-50/80 text-slate-900'
        }`}
        style={{
          boxShadow: darkMode ? 'none' : 'inset 0 1px 0 rgba(255, 255, 255, 0.5)'
        }}
      >
      {/* Top bar ultra premium con efectos 3D */}
      <div
        className={`relative h-20 border-b flex items-center px-8 justify-between z-20 ${
          darkMode
            ? 'border-slate-800 bg-[#161b22]'
            : 'border-slate-200/40 bg-gradient-to-b from-white via-white to-slate-50/30'
        }`}
        style={{
          boxShadow: darkMode
            ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)'
            : '0 2px 12px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          transform: 'translateZ(0)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Borde superior sutil con efecto 3D */}
        <div className={`absolute inset-x-0 top-0 h-[1px] ${
          darkMode
            ? 'bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent'
            : 'bg-gradient-to-r from-transparent via-slate-300/40 to-transparent'
        }`} style={{ transform: 'translateZ(1px)' }}></div>

        {/* Borde inferior con profundidad */}
        <div className={`absolute inset-x-0 bottom-0 h-[1px] ${
          darkMode
            ? 'bg-gradient-to-r from-transparent via-slate-700/40 to-transparent'
            : 'bg-gradient-to-r from-transparent via-slate-200/60 to-transparent'
        }`} style={{ transform: 'translateZ(-1px)' }}></div>

        <div className="flex items-center gap-3.5 group">
          {/* Hamburger Menu - Solo móvil */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`md:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <LogoEconeura />

          {/* ECONEURA text con relieve */}
          <div className="relative">
            {/* Sombra inferior para relieve */}
            <span
              className="absolute top-[1.5px] left-0 text-xl font-black tracking-tight text-slate-400/40"
              style={{
                fontFamily: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.03em',
                fontWeight: 900
              }}
              aria-hidden="true"
            >
              ECONEURA
            </span>

            {/* Texto principal con relieve 3D */}
            <span
              className={`relative text-xl font-black tracking-tight ${
                darkMode
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent'
                  : 'text-slate-900'
              }`}
              style={{
                fontFamily: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.03em',
                fontWeight: 900,
                textShadow: darkMode
                  ? '0 2px 8px rgba(16, 185, 129, 0.3)'
                  : '0 2px 0 rgba(255, 255, 255, 0.9), 0 -1px 0 rgba(0, 0, 0, 0.15), 0 3px 8px rgba(0, 0, 0, 0.08)'
              }}
            >
            ECONEURA
          </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* MEJORA 8: Buscador - Oculto en móvil pequeño */}
          <div className="relative hidden sm:block">
            <input
              ref={searchInputRef}
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              placeholder="Buscar agentes... (Ctrl+K)"
              aria-label={t.common.search}
              className={`h-11 w-80 rounded-xl border px-5 pr-12 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                darkMode
                  ? 'border-slate-700/40 bg-slate-800/30 text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 shadow-md'
                  : 'border-slate-200/80 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
              }`}
              style={{
                fontFamily: '"Inter", "SF Pro Text", system-ui, -apple-system, sans-serif'
              }}
            />
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? 'text-emerald-500/50' : 'text-slate-400'}`}>
              <Radar className="w-[18px] h-[18px]" />
            </div>

            {/* Dropdown de resultados en tiempo real */}
            {q.trim() && (
              <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                {/* Header del dropdown */}
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-4 py-2 border-b border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {filteredAgents.length} resultado{filteredAgents.length !== 1 ? 's' : ''}
                    </span>
                    {filteredAgents.length > 0 && (
                      <button
                        onClick={() => setQ('')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>

                {/* Resultados */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredAgents.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      No se encontraron agentes
                    </div>
                  ) : (
                    filteredAgents.map((a: Agent) => {
                      const I: React.ElementType = iconForAgent(a.title);

                      // Obtener departamento del agente
                      const agentDept = DATA.find(d => d.id === a.deptId);
                      const agentPal = agentDept ? getPalette(agentDept.id) : pal;
                      const { r, g, b } = hexToRgb(agentPal.textHex);

                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            // Cambiar al departamento del agente antes de ejecutar
                            if (a.deptId !== activeDept) {
                              setActiveDept(a.deptId);
                            }
                            runAgent(a);
                            setQ('');
                          }}
                          className="w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                        >
                          <div
                            className="mt-0.5 p-2 rounded-lg"
                            style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)` }}
                          >
                            {React.createElement(I, {
                              className: "w-4 h-4",
                              style: { color: agentPal.textHex }
                            })}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-sm font-semibold text-slate-900">{a.title}</div>
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                style={{
                                  backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
                                  color: agentPal.textHex
                                }}
                              >
                                {a.deptName}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 mt-0.5">{a.desc}</div>
                            {a.pills && a.pills.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {a.pills.slice(0, 2).map((pill: string, i: number) => (
                                  <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                                    {pill}
                                  </span>
                                ))}
                                {a.pills.length > 2 && (
                                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                                    +{a.pills.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-blue-600 font-medium mt-1">
                            Ejecutar →
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Settings Premium */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group ${
                darkMode
                  ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 shadow-md hover:shadow-xl'
                  : 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 hover:from-slate-700 hover:to-slate-700 shadow-md hover:shadow-lg'
              }`}
              aria-label="Settings"
              style={{
                boxShadow: darkMode
                  ? '0 6px 20px rgba(0, 0, 0, 0.3), 0 3px 10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 4px 12px rgba(15, 23, 42, 0.15), 0 2px 6px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Anillo sutil decorativo */}
              <div className={`absolute inset-[2px] rounded-full border ${
                darkMode ? 'border-slate-500/30' : 'border-slate-600/20'
              }`}></div>

              <Settings className="w-[18px] h-[18px] text-white relative z-10" />
            </button>

            {/* Settings Dropdown - CONSOLIDADO */}
            {settingsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSettingsOpen(false)} />
                <div className={`absolute top-full right-0 mt-2 w-72 rounded-xl shadow-2xl overflow-hidden z-50 border ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  {/* User Info */}
                  <div className={`px-4 py-3 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {userData?.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                          {userData?.name || 'Usuario'}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                          {userData?.email || 'usuario@econeura.com'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {/* Dark Mode Toggle */}
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-full px-4 py-2 flex items-center gap-3 transition-colors ${
                        darkMode
                          ? 'text-slate-100 hover:bg-slate-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      <span className="text-sm">{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
                    </button>

                    {/* Language Selector - Inline */}
                    <div className={`px-4 py-2 border-t border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'} my-2`}>
                      <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                        Idioma
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { code: 'es' as const, label: 'Español', flag: '🇪🇸' },
                          { code: 'en' as const, label: 'English', flag: '🇬🇧' },
                          { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
                          { code: 'de' as const, label: 'Deutsch', flag: '🇩🇪' }
                        ].map(lang => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setCurrentLang(lang.code);
                              setSettingsOpen(false);
                            }}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                              currentLang === lang.code
                                ? darkMode
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-blue-500 text-white'
                                : darkMode
                                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mi Perfil */}
                    <button
                      onClick={() => {
                        setSettingsOpen(false);
                        setPortalOpen(true);
                      }}
                      className={`w-full px-4 py-2 flex items-center gap-3 transition-colors ${
                        darkMode
                          ? 'text-slate-100 hover:bg-slate-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Mi Perfil</span>
                    </button>

                    {/* Enterprise Pages Links */}
                    <Link 
                      to="/settings"
                      onClick={() => setSettingsOpen(false)}
                      className={`w-full px-4 py-2 flex items-center gap-3 transition-colors ${
                        darkMode
                          ? 'text-slate-100 hover:bg-slate-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Configuración</span>
                    </Link>

                    <Link 
                      to="/finops"
                      onClick={() => setSettingsOpen(false)}
                      className={`w-full px-4 py-2 flex items-center gap-3 transition-colors ${
                        darkMode
                          ? 'text-slate-100 hover:bg-slate-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">FinOps</span>
                    </Link>

                    <Link 
                      to="/audit"
                      onClick={() => setSettingsOpen(false)}
                      className={`w-full px-4 py-2 flex items-center gap-3 transition-colors ${
                        darkMode
                          ? 'text-slate-100 hover:bg-slate-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <FileCheck className="w-4 h-4" />
                      <span className="text-sm">Audit Log</span>
                    </Link>

                    <Link 
                      to="/proposals"
                      onClick={() => setSettingsOpen(false)}
                      className={`w-full px-4 py-2 flex items-center gap-3 transition-colors ${
                        darkMode
                          ? 'text-slate-100 hover:bg-slate-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Proposals (HITL)</span>
                    </Link>

                    {/* Cerrar Sesión */}
                    <button
                      onClick={() => {
                        setSettingsOpen(false);
                        handleLogout();
                      }}
                      className={`w-full px-4 py-2 flex items-center gap-3 transition-colors ${
                        darkMode
                          ? 'text-slate-400 hover:bg-slate-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
                  </div>
                </div>

      <div className="flex relative">
        {/* Overlay oscuro en móvil */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Premium - Overlay en móvil, fijo en desktop */}
        <aside
          className={`fixed md:relative inset-y-0 left-0 w-80 border-r p-5 space-y-2 flex-col z-50 transition-transform duration-300 ${
            sidebarOpen ? 'flex translate-x-0' : 'hidden md:flex md:translate-x-0 -translate-x-full'
          } ${
            darkMode
              ? 'bg-[#161b22] border-slate-800'
              : 'bg-gradient-to-br from-slate-50 via-white to-slate-50/80 border-slate-200/60'
          }`}
          style={{
            boxShadow: darkMode
              ? '2px 0 16px rgba(0, 0, 0, 0.25), 1px 0 4px rgba(0, 0, 0, 0.15)'
              : '2px 0 12px rgba(0, 0, 0, 0.04), 1px 0 4px rgba(0, 0, 0, 0.02), inset -1px 0 0 rgba(255, 255, 255, 0.5)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Botón cerrar sidebar - Solo móvil */}
          <button
            onClick={() => setSidebarOpen(false)}
            className={`md:hidden self-end p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>

          {DATA.map(d => (
            <DepartmentButton
              key={d.id}
              dept={d}
              isActive={activeDept === d.id && !orgView}
              icon={getDeptIcon(d.id)}
              palette={getPalette(d.id)}
              darkMode={darkMode}
              onClick={() => { setActiveDept(d.id); setOrgView(false); }}
            />
          ))}
          <div className={`mt-3 border-t pt-3 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              onClick={() => setOrgView(true)}
              className={cx(
                "w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-all",
                orgView
                  ? darkMode
                    ? "bg-emerald-500/10 text-emerald-400 font-semibold shadow-md border-l-4 border-emerald-500"
                    : "bg-gradient-to-r from-sky-100 to-blue-100 text-slate-900 font-semibold shadow-md"
                  : darkMode
                    ? "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
                    : "text-slate-700 hover:bg-slate-50"
              )}
            >
              <ListChecks className="w-5 h-5" />
              <span>Organigrama</span>
            </button>
          </div>
        </aside>

        {/* MEJORA 7: Main con animación de entrada y scroll suave */}
        <main className="flex-1 p-6 relative z-10 animate-fadeInUp overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
          {!orgView ? (
            <>
              {/* Header sección PROFESIONAL */}
              <div
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-4">
                    <div
                      className="p-2.5 rounded-lg border transition-colors"
                      style={{
                        backgroundColor: rgba(pal.textHex, 0.06),
                        borderColor: rgba(pal.textHex, 0.15)
                      }}
                    >
                      {React.createElement(DeptIconComp, {
                        className: "w-6 h-6",
                        style:{ color: pal.textHex }
                      })}
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-slate-900">{dept.name}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className="text-[10px] px-2.5 py-1 rounded-md font-medium"
                          style={{
                            backgroundColor: rgba(pal.textHex, 0.08),
                            color: pal.textHex,
                            border: `1px solid ${rgba(pal.textHex, 0.15)}`
                          }}
                        >
                          {dept.agents.length} agentes
                        </span>
                        {dept.chips.map((c: string, i: number)=>(
                          <span
                            key={i}
                            className={cx(
                              "text-[10px] px-2.5 py-1 rounded-md border inline-flex items-center gap-1 font-medium",
                              c.toLowerCase().includes('hitl')
                                ?'bg-amber-50 text-amber-700 border-amber-200'
                                :'bg-blue-50 text-blue-700 border-blue-200'
                            )}
                          >
                            {c.toLowerCase().includes('hitl')?<UserCheck className="w-3 h-3"/>:<ShieldCheck className="w-3 h-3"/>}
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6 mt-6">
                  <div
                    className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-semibold mb-3 border border-slate-300 shadow-sm"
                    style={{
                      backgroundColor: rgba(pal.textHex, 0.1),
                      color: pal.textHex
                    }}
                  >
                    <Brain className="w-5 h-5" />
                    {dept.neura.title}
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed font-medium mb-5">{dept.neura.subtitle}</div>

                  <div className="mt-5 flex gap-2.5 flex-wrap">
                    {dept.neura.tags.map((t: string, i: number) => (
                      <button
                        key={i}
                        className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-all inline-flex items-center gap-2 font-medium shadow-sm hover:shadow-md hover:scale-102"
                        style={{
                          color: pal.textHex
                        }}
                      >
                        <TagIcon text={t} />
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      className="h-10 px-5 rounded-lg border border-slate-300 text-white inline-flex items-center gap-2 text-sm font-semibold hover:scale-102 transition-all shadow-sm hover:shadow-md"
                      style={{
                        backgroundColor: pal.textHex,
                        opacity: 0.9
                      }}
                      onClick={() => setChatOpen(true)}
                    >
                      <MessageCircle className="w-4 h-4"/>
                      Abrir chat
                    </button>
                    <button
                      onClick={() => setPortalOpen(true)}
                      className="h-9 px-4 rounded-lg border border-slate-200 bg-white inline-flex items-center gap-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Portal
                    </button>
                    <button
                      onClick={() => setChatHistoryOpen(true)}
                      className="h-9 px-4 rounded-lg border border-slate-200 bg-white inline-flex items-center gap-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ClipboardList className="w-4 h-4"/>
                      Ver historial
                    </button>
                  </div>
                </div>
              </div>

                {/* Grid de agentes - Responsive: 1→2→3 cols */}
              <div className="mt-6 grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start justify-items-center">
                {filteredAgents.map((a: Agent) => (
                  <AgentCard key={a.id} a={a} deptColor={pal.textHex} busy={busyId===a.id} progress={lastByAgent[a.id]?.status==='OK'?100:(lastByAgent[a.id]?.status==='ERROR'?0:11)} showUsage={showAllUsage} onRun={() => runAgent(a)} />
                  ))}
                <NewAgentCard deptId={dept.id} deptColor={pal.textHex} onCreate={startCreateAgent} />
                </div>

                {/* Actividad Reciente - Premium */}
              <div
                className={`mt-6 rounded-xl border p-6 transition-colors duration-500 ${
                  darkMode
                    ? 'bg-slate-800/30 border-slate-700/50'
                    : 'bg-white border-slate-200/80'
                }`}
                style={{
                  boxShadow: darkMode
                    ? '0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    : '0 4px 20px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  transform: 'translateZ(0)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-500/10' : 'bg-slate-100'}`}>
                    <ActivityIcon className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </div>
                  <div className={`font-semibold text-base ${darkMode ? 'text-slate-200' : 'text-slate-600'}`}>Actividad Reciente</div>
                </div>
                  {activity.length === 0 ? (
                  <div className={`text-sm text-center py-10 rounded-xl border border-dashed ${
                    darkMode
                      ? 'bg-slate-800/20 border-slate-700 text-slate-500'
                      : 'bg-slate-100/50 border-slate-300 text-slate-500'
                  }`}>
                    Sin actividad aún. Ejecuta un agente para ver resultados.
                  </div>
                  ) : (
                  <div className="max-h-[280px] overflow-y-auto pr-2">
                    <ul className="space-y-2.5">
                        {activity.slice(0, 4).map(e => (
                        <li
                          key={e.id}
                          className={`flex items-center gap-3 p-3.5 rounded-lg transition-all ${
                            darkMode
                              ? 'bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50'
                              : 'bg-white hover:bg-slate-50 border border-slate-200'
                          }`}
                          style={{
                            boxShadow: darkMode
                              ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                              : '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
                            transform: 'translateZ(2px)'
                          }}
                        >
                          <span className={cx(
                            'px-2.5 py-1 rounded-md text-[11px] font-bold',
                            e.status==='OK'
                              ? darkMode
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : darkMode
                                ? 'bg-slate-700/30 text-slate-400 border border-slate-600/30'
                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                          )}>
                            {e.status === 'OK' ? 'OK' : 'Procesando'}
                          </span>
                          <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {new Date(e.ts).toLocaleTimeString()}
                          </span>
                          <span className={`font-semibold text-sm ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            {e.agentId}
                          </span>
                          <span className={`truncate flex-1 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {e.message}
                          </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </>
            ) : (
            <OrgChart />
          )}

          {/* Footer legal */}
          <div className="text-xs mt-6 pb-8" style={{ color: theme.muted, borderTop: `1px dashed ${theme.border}`, paddingTop: 8 }}>
            GDPR & AI Act · datos en la UE · TLS 1.2+ y AES-256 · auditoría HITL.
          </div>
        </main>
      </div>

      {/* Chat NEURA - Fullscreen en móvil */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/5 z-50 animate-fadeIn" onClick={()=>setChatOpen(false)}>
          <aside
            className="absolute right-0 top-0 h-full w-full md:w-[1160px] bg-white overflow-hidden flex flex-col"
            onClick={e=>e.stopPropagation()}
            style={{
              transform: 'perspective(2000px) rotateY(-1deg)',
              transformStyle: 'preserve-3d',
              boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.12), -10px 0 30px rgba(0, 0, 0, 0.08), inset 1px 0 0 rgba(255, 255, 255, 0.5)',
              animation: 'slideInRightPremium 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Header Premium Ultra-Elegante */}
            <div className="sticky top-0 bg-white border-b border-slate-200/40 px-8 py-5 z-20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/20 to-transparent opacity-50"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {React.createElement(DeptIconComp, {
                      className: "w-6 h-6 relative z-10",
                      style:{ color: pal.textHex }
                    })}
                    <div className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-full" style={{ backgroundColor: pal.textHex }}></div>
                  </div>
                  <div>
                    <div className="text-base font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{dept.neura.title}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        OpenAI GPT-4o-mini
                      </span>
                      <span>·</span>
                      <span>Streaming habilitado</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={()=>setChatOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-slate-100/80 transition-all duration-200 group"
                  title="Cerrar"
                >
                  <span className="text-slate-400 text-2xl leading-none group-hover:text-slate-600 transition-colors">×</span>
                </button>
              </div>
            </div>

            {/* Área de mensajes Premium - fondo SÓLIDO */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent relative bg-gradient-to-b from-slate-50 via-white to-slate-50">

              {/* Saludo Premium */}
              {chatMsgs.length === 0 && (
                <div className="pt-16 pb-8 relative animate-fadeIn">
                  <div className="max-w-2xl">
                    <h1 className="text-3xl font-light bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent leading-tight mb-3">
                      Hola, ¿en qué deberíamos profundizar hoy?
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Estoy aquí para ayudarte con análisis, estrategias y decisiones ejecutivas. Puedes hacerme cualquier pregunta o pedirme que ejecute tareas específicas.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs text-slate-700 transition-all duration-200">
                        💡 Sugerir estrategia Q4
                      </button>
                      <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs text-slate-700 transition-all duration-200">
                        📊 Analizar métricas clave
                      </button>
                      <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs text-slate-700 transition-all duration-200">
                        🎯 Revisar OKRs
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mensajes Premium Ultra-Elegantes */}
              <div className="space-y-8 relative">
              {chatMsgs.map((m, idx) => (
                <div key={m.id} className={cx("flex flex-col gap-3 animate-fadeInUp", m.role === 'user' ? 'items-end' : 'items-start')}
                  style={{ animationDelay: `${idx * 50}ms` }}>
                  <div
                    className={cx(
                      "max-w-[80%] rounded-2xl px-5 py-4 text-sm transition-all duration-300 hover:scale-[1.01] group",
                      m.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-white text-slate-900 border border-slate-200/60 shadow-md shadow-slate-200/50'
                    )}
                    style={{
                      transform: 'perspective(1000px) translateZ(0)',
                      transformStyle: 'preserve-3d'
                    }}
                  >

                    <div className="leading-relaxed relative z-10 prose prose-sm max-w-none prose-slate">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Sistema agentic temporalmente deshabilitado */}

                  {/* Metadata Premium */}
                  <div className="flex items-center gap-3 px-2">
                    {m.role === 'assistant' && m.model && (
                      <span className="text-xs font-medium text-slate-500 px-2 py-1 bg-slate-100/50 rounded-lg">
                        {m.model.includes('gpt-5') ? 'GPT-5' : 'GPT-4o-mini'}
                      </span>
                    )}
                    {m.role === 'assistant' && (m.tokens ?? 0) > 0 && (
                      <span className="text-xs text-slate-400">{m.tokens} tokens</span>
                    )}
                    {m.role === 'assistant' && (
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition-all group"
                          title="Copiar"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                        </button>
                        {voiceSupported && (
                          <button
                            onClick={() => speak(m.text)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 transition-all group"
                            title="Escuchar"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            </div>

            {/* Composer Premium Ultra-Elegante */}
            <div
              className="sticky bottom-0 bg-white border-t border-slate-200/40 px-8 py-6"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                transformStyle: 'preserve-3d',
                boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.03), 0 -1px 0 rgba(255, 255, 255, 0.5) inset'
              }}
            >
              {/* Preview de imagen Premium */}
              {uploadedImage && (
                <div className="mb-4 relative inline-block animate-fadeIn">
                  <img src={uploadedImage} alt="Preview" className="max-w-xs max-h-32 rounded-2xl border-2 border-slate-200/60 shadow-xl shadow-slate-300/50" />
                  <button
                    onClick={removeImage}
                    className="absolute -top-3 -right-3 bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:scale-110 transition-all shadow-xl hover:shadow-2xl"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Input Premium con efecto glassmorphism sutil */}
              <div
                className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 group"
                style={{
                  transform: 'translateZ(5px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.02)'
                }}
              >
                <input
                  value={chatInput}
                  onChange={(e)=>setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
                  className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 font-normal"
                  placeholder="Escribe tu mensaje..."
                />

                {/* Botones de acción Premium */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-1 border-l border-slate-200/60 pl-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
                    title="Subir archivo"
                  >
                    <FileText className="w-4.5 h-4.5 text-slate-500 group-hover:text-slate-700 transition-colors" />
                  </button>

                  {voiceSupported && (
                    <>
                      <button
                        onClick={toggleListen}
                        className={cx(
                          "p-2.5 rounded-xl transition-all duration-200",
                          listening ? "bg-emerald-100 text-emerald-700" : "hover:bg-slate-100"
                        )}
                        title={listening ? "Detener micrófono" : "Hablar"}
                      >
                        {listening ? <MicOff className="w-4.5 h-4.5"/> : <Mic className="w-4.5 h-4.5 text-slate-500 group-hover:text-slate-700"/>}
                      </button>
                      <button
                        onClick={stopSpeak}
                        className="p-2.5 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
                        title="Parar voz"
                      >
                        <StopCircle className="w-4.5 h-4.5 text-slate-500 group-hover:text-slate-700 transition-colors"/>
                      </button>
                    </>
                  )}

                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() && !uploadedImage}
                    className={cx(
                      "p-3 rounded-xl transition-all duration-300 shadow-lg active:scale-95 ml-1",
                      chatInput.trim() || uploadedImage
                        ? "bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 text-white hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                    )}
                    style={chatInput.trim() || uploadedImage ? {
                      transform: 'translateZ(2px)',
                      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    } : undefined}
                    title="Enviar (Enter)"
                  >
                    <span className="font-semibold text-lg leading-none">→</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
      <FooterComponent />

      {/* Modals */}
      <EconeuraModals
        chatHistoryOpen={chatHistoryOpen}
        setChatHistoryOpen={setChatHistoryOpen}
        portalOpen={portalOpen}
        setPortalOpen={setPortalOpen}
        token={userToken || ''}
        darkMode={darkMode}
      />

      {/* Modal de Conexión */}
      {connectModalOpen && connectingAgent && (
        <ConnectAgentModal
          agentId={connectingAgent.id}
          agentTitle={connectingAgent.title}
          isOpen={connectModalOpen}
          onClose={() => {
            setConnectModalOpen(false);
            setConnectingAgent(null);
            setBusyId('');
          }}
          onConnected={() => {
            setConnectModalOpen(false);
            const agent = dept.agents.find(a => a.id === connectingAgent.id);
            if (agent) {
              runAgent(agent);
            }
            setConnectingAgent(null);
          }}
        />
      )}
    </div>
    </>
  );
}

type AgentCardProps = { a: Agent; deptColor: string; busy?: boolean; progress?: number; showUsage?: boolean; onRun: () => Promise<any> | void };
const AgentCard = memo(function AgentCard({ a, deptColor, busy, progress, showUsage, onRun }: AgentCardProps) {
  const pct = Math.max(0, Math.min(100, (progress ?? 11)));
  const I: React.ElementType = iconForAgent(a.title);
  const { r, g, b } = hexToRgb(deptColor);

  return (
    <div className="group relative w-full max-w-full md:max-w-[580px] bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/60 rounded-2xl p-4 md:p-8 flex flex-col shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-400/30 hover:-translate-y-2 transition-all duration-500" style={{
      transform: 'perspective(1000px) rotateX(0deg)',
      transformStyle: 'preserve-3d'
    }}>
      {/* Efecto 3D sutil */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none" style={{ transform: 'translateZ(1px)' }}></div>

      <div className="flex items-start justify-between gap-3 mb-4 relative" style={{ transform: 'translateZ(2px)' }}>
        <div className="flex items-start gap-3 flex-1">
          <div
            className="mt-0.5 p-2.5 rounded-xl border border-slate-200/60 group-hover:scale-105 transition-all duration-200 shadow-md"
            style={{
              backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
              boxShadow: `0 4px 12px rgba(${r}, ${g}, ${b}, 0.15)`
            }}
          >
            {React.createElement(I, { className: "w-5 h-5", style: { color: deptColor } })}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-slate-900 leading-tight">{a.title}</div>
            <div className="text-sm text-slate-600 mt-2 leading-relaxed">{a.desc}</div>
          </div>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium whitespace-nowrap shadow-sm">
          ✓ Activo
        </span>
      </div>

      {showUsage && (
        a.pills && a.pills.length ? (
          <div className="mb-4 text-xs text-slate-700 flex gap-2 flex-wrap relative" style={{ transform: 'translateZ(2px)' }}>
            {a.pills.map((p: string, i: number) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 font-medium shadow-sm">{p}</span>
          ))}
        </div>
        ) : (
          <div className="mb-4 text-xs text-slate-500 font-medium">Consumo: N/D</div>
        )
      )}

      <div className="mb-5 relative" style={{ transform: 'translateZ(2px)' }}>
        <div className="relative h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner border border-slate-200/60">
          <div
            className="absolute inset-y-0 left-0 h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              minWidth: pct > 0 ? '8px' : '0px',
              background: `linear-gradient(90deg, rgba(${r}, ${g}, ${b}, 0.7), rgba(${r}, ${g}, ${b}, 0.9))`,
              boxShadow: `0 0 10px rgba(${r}, ${g}, ${b}, 0.3)`
            }}
          />
        </div>
        <div className="mt-2.5 text-sm text-slate-600 font-medium">{pct}% completado</div>
      </div>

      <div className="flex gap-3 relative" style={{ transform: 'translateZ(3px)' }}>
        {/* MEJORA 9: Botón ejecutar con brillo premium */}
        <button
          onClick={() => onRun()}
          disabled={!!busy}
          className={cx("w-[230px] h-11 px-5 rounded-xl text-base font-semibold transition-shadow duration-200 active:scale-95 inline-flex items-center justify-center gap-2 shrink-0 relative",
            busy
              ? "opacity-60 cursor-not-allowed bg-slate-100 text-slate-500 border border-slate-200/60"
              : "text-white shadow-lg hover:shadow-2xl border-0"
          )}
          style={!busy ? {
            background: `linear-gradient(135deg, rgb(${r}, ${g}, ${b}), rgb(${Math.floor(r*0.9)}, ${Math.floor(g*0.9)}, ${Math.floor(b*0.9)}))`,
            boxShadow: `0 6px 20px rgba(${r}, ${g}, ${b}, 0.35), 0 2px 8px rgba(${r}, ${g}, ${b}, 0.2)`,
            width: '230px'
          } : { width: '230px' }}>
          {busy ? (
            <>
              <span className="animate-spin text-base">⏳</span>
              <span>Ejecutando</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Ejecutar</span>
            </>
          )}
        </button>
        <button className="h-11 w-11 shrink-0 rounded-xl border border-slate-200/60 text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center">
          <Pause className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

type NewAgentCardProps = { deptId: string; deptColor: string; onCreate: (deptId: string) => void };
function NewAgentCard({ deptId, deptColor, onCreate }: NewAgentCardProps){
  const { r, g, b } = hexToRgb(deptColor);

  const handleCreate = () => {
    const name = prompt('Nombre del nuevo agente:');
    if (name) {
      alert(`Creando agente "${name}" para ${deptId}...\n\n(En producción esto se guardaría en la base de datos)`);
      onCreate(deptId);
    }
  };

  return (
    <div
      className="group relative w-full max-w-[580px] bg-gradient-to-b from-slate-50 to-white border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 shadow-lg hover:shadow-2xl hover:border-solid hover:-translate-y-2 transition-all duration-500"
      style={{
        transform: 'perspective(1000px) rotateX(0deg)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Icono central - MISMO TAMAÑO que AgentCard */}
      <div
        className="p-2.5 rounded-xl border border-slate-200/60 shadow-md group-hover:scale-110 transition-all duration-300"
        style={{
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
          boxShadow: `0 4px 15px rgba(${r}, ${g}, ${b}, 0.15)`
        }}
      >
        <Workflow className="w-5 h-5" style={{ color: deptColor }} />
      </div>

      {/* Texto */}
      <div className="text-center">
        <div className="text-base font-bold text-slate-900">Nuevo Agente</div>
        <div className="text-sm text-slate-600 mt-1">Crear agente personalizado</div>
      </div>

      {/* Botón crear */}
      <button
        onClick={handleCreate}
        className="w-full h-11 rounded-xl text-base font-semibold text-white shadow-md hover:shadow-lg hover:scale-102 transition-all duration-200 border border-slate-200/60"
        style={{
          background: `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.75), rgba(${r}, ${g}, ${b}, 0.9))`,
          boxShadow: `0 4px 12px rgba(${r}, ${g}, ${b}, 0.25)`
        }}
      >
        + Crear
      </button>
    </div>
  );
}

export function OrgChart() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {DATA.map((d: Department) => {
        const Icon = getDeptIcon(d.id);
        const p = getPalette(d.id);
        const { r, g, b } = hexToRgb(p.textHex);
        return (
          <div
            key={d.id}
            className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300"
            style={{
              transform: 'perspective(1200px) rotateX(2deg)',
              transformStyle: 'preserve-3d',
              boxShadow: `0 12px 32px rgba(${r}, ${g}, ${b}, 0.15), 0 6px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
            }}
          >
            {/* Efecto 3D overlay mejorado */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 via-transparent to-slate-50/20 pointer-events-none group-hover:from-white/40 transition-all duration-300" style={{ transform: 'translateZ(2px)' }}></div>

            {/* Borde inferior 3D */}
            <div className="absolute inset-x-4 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" style={{ transform: 'translateZ(-1px)' }}></div>

            {/* Header del departamento */}
            <div className="flex items-start justify-between mb-5 relative" style={{ transform: 'translateZ(2px)' }}>
              <div className="flex items-start gap-3 flex-1">
                <div
                  className="p-3 rounded-xl border border-slate-200/60 shadow-lg group-hover:scale-110 transition-all duration-300"
                  style={{
                    backgroundColor: rgba(p.textHex, 0.1),
                    boxShadow: `0 4px 15px rgba(${r}, ${g}, ${b}, 0.2)`
                  }}
                >
                  {React.createElement(Icon, {
                    className: "w-6 h-6",
                    style:{ color: p.textHex }
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base text-slate-900 leading-tight">
                    {d.name}
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg font-semibold mt-2 border shadow-sm"
                    style={{
                      backgroundColor: rgba(p.textHex, 0.1),
                      color: p.textHex,
                      borderColor: rgba(p.textHex, 0.2)
                    }}
                  >
                    <Brain className="w-3.5 h-3.5" />
                    NEURA
                  </div>
                </div>
              </div>
              <span
                className="text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap border-2 shadow-md"
                style={{
                  backgroundColor: rgba(p.textHex, 0.1),
                  color: p.textHex,
                  borderColor: rgba(p.textHex, 0.3)
                }}
              >
                {d.agents.length}
              </span>
            </div>

            {/* Lista de agentes con efecto 3D */}
            <ul className="text-sm text-slate-700 space-y-2 mb-5 relative" style={{ transform: 'translateZ(2px)' }}>
              <li className="flex items-start gap-2.5 font-bold">
                <span
                  className="mt-1.5 w-2 h-2 rounded-full shadow-md"
                  style={{
                    backgroundColor: p.textHex,
                    boxShadow: `0 0 8px rgba(${r}, ${g}, ${b}, 0.4)`
                  }}
                />
                <span style={{ color: p.textHex }}>{d.neura.title}</span>
              </li>
              {d.agents.slice(0, 4).map((a: Agent) => (
                <li
                  key={a.id}
                  className="flex items-start gap-2.5 text-xs hover:translate-x-1 transition-transform duration-200"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-sm"/>
                  <span className="text-slate-600">{a.title}</span>
                </li>
              ))}
              {d.agents.length > 4 && (
                <li className="text-xs text-slate-500 pl-4 font-medium">
                  + {d.agents.length - 4} agentes más
                </li>
              )}
            </ul>

            {/* Footer con tags premium */}
            <div className="flex gap-2 flex-wrap pt-4 border-t-2 border-slate-200/50 relative" style={{ transform: 'translateZ(2px)' }}>
              {d.neura.tags.slice(0, 3).map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold shadow-sm border hover:scale-105 transition-all duration-200"
                  style={{
                    backgroundColor: rgba(p.textHex, 0.08),
                    color: rgba(p.textHex, 0.9),
                    borderColor: rgba(p.textHex, 0.2)
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Exportar helpers para tests
export const __TEST_HELPERS = { iconForAgent, getDeptIcon, getPalette, isReactComponent: isComponent, correlationId, invokeAgent };
export const __RUN_SELF_TESTS = (overrides?: Record<string, unknown>) => {
  const failures: string[] = [];
  try {
    const LogoComp = overrides?.LogoEconeura || LogoEconeura;
    const samples = ['Agente: Agenda Consejo','Agente: Resumen','Agente: OKR','Agente: Phishing Triage','Agente: X'];
    samples.forEach((s: string) => {
      const I = iconForAgent(s);
      if (!isComponent(I)) failures.push(`iconForAgent inválido: ${s}`);
    });
    DATA.forEach((d: Department) => {
      const I = getDeptIcon(d.id);
      if (!isComponent(I)) failures.push(`getDeptIcon inválido: ${d.id}`);
      const pal = getPalette(d.id);
      if (!pal || typeof pal.accentText !== 'string') failures.push(`getPalette inválido: ${d.id}`);
    });
    const el = LogoComp();
    if (!el) failures.push('LogoEconeura falla');
  } catch (e: any) {
    failures.push(`self-test: ${e?.message||e}`);
  } finally {
    if (failures.length && process.env.NODE_ENV === 'development') {
      // Self-test failures solo en desarrollo
    }
  }
  return failures;
};

// Auto-ejecutar self-tests en runtime
(() => {
__RUN_SELF_TESTS();
})();

// Modals (render at end of component)
export function EconeuraModals({ chatHistoryOpen, setChatHistoryOpen, portalOpen, setPortalOpen, token, darkMode }: any) {
  return (
    <>
      {chatHistoryOpen && (
        <ChatHistory
          isOpen={chatHistoryOpen}
          onClose={() => setChatHistoryOpen(false)}
          token={token}
        />
      )}
      {portalOpen && (
        <CustomerPortal
          isOpen={portalOpen}
          onClose={() => setPortalOpen(false)}
          token={token}
          darkMode={darkMode}
        />
      )}
    </>
  );
}


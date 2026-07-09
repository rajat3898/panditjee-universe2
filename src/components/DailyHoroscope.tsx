/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sun, Moon, Compass, Heart, Briefcase, DollarSign, RefreshCw, Share2, Check, Star } from 'lucide-react';
import { DailyHoroscope as DailyHoroscopeType } from '../types';

interface DailyHoroscopeProps {
  onNavigate?: (tab: string) => void;
}

const zodiacSigns = [
  { name: 'Aries (Mesha)', symbol: '♈', element: 'Fire', dates: 'Mar 21 - Apr 19', deity: 'Lord Murugan / Hanuman' },
  { name: 'Taurus (Vrishabha)', symbol: '♉', element: 'Earth', dates: 'Apr 20 - May 20', deity: 'Goddess Lakshmi' },
  { name: 'Gemini (Mithuna)', symbol: '♊', element: 'Air', dates: 'May 21 - Jun 20', deity: 'Lord Ganesha' },
  { name: 'Cancer (Karka)', symbol: '♋', element: 'Water', dates: 'Jun 21 - Jul 22', deity: 'Lord Shiva / Parvati' },
  { name: 'Leo (Simha)', symbol: '♌', element: 'Fire', dates: 'Jul 23 - Aug 22', deity: 'Lord Surya / Vishnu' },
  { name: 'Virgo (Kanya)', symbol: '♍', element: 'Earth', dates: 'Aug 23 - Sep 22', deity: 'Goddess Durga' },
  { name: 'Libra (Tula)', symbol: '♎', element: 'Air', dates: 'Sep 23 - Oct 22', deity: 'Goddess Lakshmi' },
  { name: 'Scorpio (Vrishchika)', symbol: '♏', element: 'Water', dates: 'Oct 23 - Nov 21', deity: 'Lord Kartikeya / Kali' },
  { name: 'Sagittarius (Dhanu)', symbol: '♐', element: 'Fire', dates: 'Nov 22 - Dec 21', deity: 'Lord Dakshinamurthy' },
  { name: 'Capricorn (Makara)', symbol: '♑', element: 'Earth', dates: 'Dec 22 - Jan 19', deity: 'Lord Hanuman / Shani' },
  { name: 'Aquarius (Kumbha)', symbol: '♒', element: 'Air', dates: 'Jan 20 - Feb 18', deity: 'Lord Shiva' },
  { name: 'Pisces (Meena)', symbol: '♓', element: 'Water', dates: 'Feb 19 - Mar 20', deity: 'Lord Vishnu' },
];

export default function DailyHoroscope({ onNavigate }: DailyHoroscopeProps) {
  const [selectedSign, setSelectedSign] = useState<string>('Aries (Mesha)');
  const [horoscope, setHoroscope] = useState<DailyHoroscopeType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const activeZodiac = zodiacSigns.find((z) => z.name === selectedSign) || zodiacSigns[0];

  const fetchHoroscopeData = async (signName: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sign: signName }),
      });
      const data = await response.json();
      if (response.ok) {
        setHoroscope(data);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error('Failed to fetch horoscope:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoroscopeData(selectedSign);
  }, [selectedSign]);

  const handleShare = () => {
    if (!horoscope) return;
    const text = `Daily Vedic Horoscope for ${horoscope.sign} (${horoscope.date}):-\n\n🌟 General: ${horoscope.general}\n💼 Career: ${horoscope.career}\n❤️ Love: ${horoscope.love}\n💰 Finance: ${horoscope.finance}\n\nLucky Color: ${horoscope.luckyColor} | Lucky Number: ${horoscope.luckyNumber}\n- Generated via PanditJee Vedic Services`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="daily-horoscope-component" className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-xs uppercase font-mono tracking-widest bg-white/20 px-3 py-1 rounded-full font-bold inline-block mb-3">
              ✦ AI-Powered Vedic Forecasting
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Daily Zodiac Horoscope</h1>
            <p className="text-orange-100 text-xs md:text-sm max-w-xl">
              Real-time planetary transit forecasts generated via Gemini AI, synchronized with traditional Jyotish alignments.
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-4xl block mb-1">{activeZodiac.symbol}</span>
            <span className="text-xs font-serif font-bold text-orange-100 block">{activeZodiac.name}</span>
            <span className="text-[10px] text-orange-200">{activeZodiac.dates}</span>
          </div>
        </div>
      </div>

      {/* Zodiac Sign Selector Bar */}
      <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-sm">
        <label className="block text-xs font-semibold text-stone-700 mb-3 uppercase tracking-wider font-sans">
          Select Your Zodiac Sign (Rasi)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {zodiacSigns.map((z) => {
            const isSelected = selectedSign === z.name;
            return (
              <button
                id={`zodiac-btn-${z.name.split(' ')[0]}`}
                key={z.name}
                onClick={() => setSelectedSign(z.name)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'border-orange-600 bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'border-orange-100 bg-orange-50/30 text-stone-800 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                <span className="text-2xl">{z.symbol}</span>
                <span className="text-xs font-serif font-bold truncate w-full">{z.name.split(' ')[0]}</span>
                <span className={`text-[9px] ${isSelected ? 'text-orange-100' : 'text-stone-500'}`}>{z.element}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Horoscope Reading Display Card */}
      <div className="bg-white border border-orange-200 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
            <p className="text-sm font-serif text-stone-600 italic">Consulting the celestial nakshatras for {selectedSign}...</p>
          </div>
        ) : horoscope ? (
          <div className="space-y-6">
            {/* Card Top Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-orange-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-orange-100 text-orange-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                    {activeZodiac.element} Sign
                  </span>
                  <span className="text-xs text-stone-500 font-medium">Deity: {activeZodiac.deity}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  {horoscope.sign} Horoscope
                </h2>
                <p className="text-xs text-stone-500 font-mono mt-0.5">{horoscope.date}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  id="btn-refresh-horoscope"
                  onClick={() => fetchHoroscopeData(selectedSign)}
                  className="p-2.5 rounded-xl border border-orange-200 text-stone-700 hover:bg-orange-50 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                  title="Refresh Forecast"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  id="btn-share-horoscope"
                  onClick={handleShare}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-all flex items-center gap-1.5 text-xs cursor-pointer shadow-md shadow-orange-500/20"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  <span>{copied ? 'Copied Reading!' : 'Share Forecast'}</span>
                </button>
              </div>
            </div>

            {/* General Overview Vibe */}
            <div className="bg-orange-50/60 p-5 rounded-2xl border border-orange-100">
              <h3 className="text-xs uppercase font-mono tracking-wider text-orange-700 font-bold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-600" /> Daily Celestial Overview
              </h3>
              <p className="text-sm text-stone-700 font-serif leading-relaxed italic">{horoscope.general}</p>
            </div>

            {/* Grid of Predictions (Career, Love, Finance) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Career */}
              <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-orange-600 mb-3">
                    <Briefcase className="h-5 w-5" />
                    <h4 className="font-serif font-bold text-stone-900">Career & Business</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{horoscope.career}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-orange-50 text-[10px] text-stone-400 font-mono">
                  Transit: 10th House Karma Alignment
                </div>
              </div>

              {/* Love */}
              <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 mb-3">
                    <Heart className="h-5 w-5" />
                    <h4 className="font-serif font-bold text-stone-900">Love & Relationships</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{horoscope.love}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-orange-50 text-[10px] text-stone-400 font-mono">
                  Transit: 7th House Harmony
                </div>
              </div>

              {/* Finance */}
              <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 mb-3">
                    <DollarSign className="h-5 w-5" />
                    <h4 className="font-serif font-bold text-stone-900">Wealth & Finance</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{horoscope.finance}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-orange-50 text-[10px] text-stone-400 font-mono">
                  Transit: 2nd / 11th House Gains
                </div>
              </div>
            </div>

            {/* Lucky Parameters Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-orange-50/30 rounded-2xl border border-orange-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block">Lucky Color for Today</span>
                  <span className="text-sm font-serif font-bold text-stone-900">{horoscope.luckyColor}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-500 shadow-inner border-2 border-white flex items-center justify-center">
                  <Star className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="p-4 bg-orange-50/30 rounded-2xl border border-orange-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block">Lucky Number</span>
                  <span className="text-xl font-mono font-extrabold text-orange-600">{horoscope.luckyNumber}</span>
                </div>
                <div className="px-3 py-1 bg-white rounded-xl border border-orange-200 text-xs font-mono font-bold text-orange-700 shadow-sm">
                  Auspicious Digit
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Map, ChefHat, Sparkles, Heart } from 'lucide-react';
import { TabType } from './types';
import KimchiStoryTab from './components/KimchiStoryTab';
import KimchiMapTab from './components/KimchiMapTab';
import KimchiGameTab from './components/KimchiGameTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('story');

  return (
    <div className="min-h-screen bg-linear-to-b from-yellow-50/40 via-white to-orange-50/30 flex flex-col justify-between selection:bg-rose-100 text-gray-800">
      
      {/* Top Friendly Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-orange-100 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo with Cute Icon & Custom Children Font */}
          <div className="flex items-center gap-2.5">
            <span className="text-4xl p-1 bg-rose-100 rounded-2xl animate-spin duration-3000 hover:rotate-12 cursor-pointer select-none">
              🥬
            </span>
            <div className="space-y-0.5">
              <h1 className="text-2xl md:text-3xl font-kids text-rose-500 font-bold tracking-tight">
                김치 탐험대!
              </h1>
              <p className="text-[11px] font-sans text-gray-400 font-semibold tracking-wider">
                맛있고 신나는 전통 음식 대백과
              </p>
            </div>
          </div>

          {/* Tab Navigation Controls (Junior Naver inspired playful layouts) */}
          <nav className="flex gap-2 bg-amber-50/60 p-1.5 rounded-2xl border border-amber-100">
            {/* Tab 1: Kimchi Story */}
            <button
              onClick={() => setActiveTab('story')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'story'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-rose-500 hover:bg-rose-50/50'
              }`}
              id="tab-btn-story"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-sans">역사와 효능</span>
              {activeTab === 'story' && (
                <motion.span
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-rose-300 rounded-full"
                />
              )}
            </button>

            {/* Tab 2: Kimchi Map */}
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-emerald-500 hover:bg-emerald-50/50'
              }`}
              id="tab-btn-map"
            >
              <Map className="w-4 h-4" />
              <span className="font-sans">김치 보물지도</span>
              {activeTab === 'map' && (
                <motion.span
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-emerald-300 rounded-full"
                />
              )}
            </button>

            {/* Tab 3: Cooking Game */}
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'game'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50/50'
              }`}
              id="tab-btn-game"
            >
              <ChefHat className="w-4 h-4" />
              <span className="font-sans">요리조리 게임</span>
              {activeTab === 'game' && (
                <motion.span
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-orange-300 rounded-full"
                />
              )}
            </button>
          </nav>

        </div>
      </header>

      {/* Main Container Stage Body */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="focus:outline-none"
          >
            {activeTab === 'story' && <KimchiStoryTab />}
            {activeTab === 'map' && <KimchiMapTab />}
            {activeTab === 'game' && <KimchiGameTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Kid-Friendly Interactive Footer */}
      <footer className="bg-amber-50/40 border-t border-amber-100 py-6 text-center space-y-2 mt-12 pb-8">
        <div className="flex items-center justify-center gap-1 text-xs text-rose-500 font-bold font-sans">
          <Heart className="w-3.5 h-3.5 fill-current" />
          마스터 셰프가 보증하는 맛있는 김치 백과사전
        </div>
        <p className="text-xs text-gray-500 font-sans leading-relaxed">
          어머니, 아버님도 함께해요! 김치는 세계 5대 건강식품으로 아동 성장 발달과 장 면역력에 최고의 영양 급식이랍니다.
        </p>
        <p className="text-[10px] text-gray-400 font-sans tracking-wide">
          © {new Date().getFullYear()} 김치 탐험 학습 본부. 모든 영양 정보와 일러스트는 교육 목적으로 제공됩니다.
        </p>
      </footer>

    </div>
  );
}

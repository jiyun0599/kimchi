/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Star, Sparkles, BookOpen, Heart, Flame } from 'lucide-react';
import { KIMCHI_TYPES } from '../data';
import { KimchiType } from '../types';

export default function KimchiMapTab() {
  const [selectedKimchi, setSelectedKimchi] = useState<KimchiType | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Maps regional keywords to provinces for interactive pairing
  const getRegionKey = (regionStr: string) => {
    if (regionStr.includes('전국')) return 'all';
    if (regionStr.includes('경기')) return 'gyeonggi';
    if (regionStr.includes('강원')) return 'gangwon';
    if (regionStr.includes('충청')) return 'chungcheong';
    if (regionStr.includes('전라')) return 'jeolla';
    if (regionStr.includes('경상')) return 'gyeongsang';
    if (regionStr.includes('제주')) return 'jeju';
    if (regionStr.includes('평안') || regionStr.includes('함경')) return 'north';
    return '';
  };

  const handleRegionClick = (regionId: string) => {
    // Find the primary kimchi representative of this region
    let matched = KIMCHI_TYPES.find((k) => {
      const key = getRegionKey(k.region);
      return key === regionId;
    });
    // Fallback if not found or if all clicked
    if (!matched) {
      matched = KIMCHI_TYPES[0]; // default back
    }
    setSelectedKimchi(matched);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Intro Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-sans">
          <MapPin className="w-3.5 h-3.5" />
          지역별 손맛 탐험
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          팔도 강산 곳곳의 이색 김치 지도 🗺️
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-sans">
          우리나라는 지역마다 날씨와 지리적 특징이 다 달라요! 지도의 지역을 손가락으로 가볍게 콕 누르거나, 
          맛보고 싶은 김치 카드를 클릭해 깊고 특별한 이야기를 나눠보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Interactive SVG Map Column */}
        <div className="lg:col-span-5 bg-teal-50/50 border border-teal-100 rounded-3xl p-6 flex flex-col items-center justify-center shadow-xs">
          <h3 className="text-base font-bold text-teal-900 font-sans mb-1 text-center">
            우리나라 지도 탐험선 🇰🇷
          </h3>
          <p className="text-xs text-teal-700/80 font-sans mb-4 text-center">
            전라, 경상, 제주 등 지역을 탭해보세요!
          </p>
          
          {/* Custom Stylized Interactive Korea Map */}
          <div className="w-full max-w-[320px] aspect-[3/4] relative">
            <svg 
              viewBox="0 0 300 400" 
              className="w-full h-full drop-shadow-md"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Region definitions with path coordinates representing stylised provinces */}
              <g className="cursor-pointer">
                {/* 1. 이북지방 (North Region) - Top Zone */}
                <path
                  d="M 50 10 L 170 10 L 250 40 L 220 100 L 150 110 L 110 130 L 40 90 Z"
                  fill={hoveredRegion === 'north' ? '#86efac' : '#dcfce7'}
                  stroke="#22c55e"
                  strokeWidth="2"
                  onClick={() => handleRegionClick('north')}
                  onMouseEnter={() => setHoveredRegion('north')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  id="map-region-north"
                />
                <text x="120" y="55" fill="#15803d" fontSize="13" fontWeight="bold">이북지방</text>

                {/* 2. 서울 / 경기도 (Gyeonggi) */}
                <path
                  d="M 40 90 L 110 130 L 140 135 L 140 180 L 100 190 L 60 180 L 45 140 Z"
                  fill={hoveredRegion === 'gyeonggi' ? '#fca5a5' : '#fee2e2'}
                  stroke="#ef4444"
                  strokeWidth="2"
                  onClick={() => handleRegionClick('gyeonggi')}
                  onMouseEnter={() => setHoveredRegion('gyeonggi')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  id="map-region-gyeonggi"
                />
                <text x="80" y="160" fill="#991b1b" fontSize="13" fontWeight="bold">경기/서울</text>

                {/* 3. 강원도 (Gangwon) */}
                <path
                  d="M 140 135 L 150 110 L 220 100 L 260 150 L 250 180 L 220 220 L 160 170 L 140 170 Z"
                  fill={hoveredRegion === 'gangwon' ? '#93c5fd' : '#dbeafe'}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  onClick={() => handleRegionClick('gangwon')}
                  onMouseEnter={() => setHoveredRegion('gangwon')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  id="map-region-gangwon"
                />
                <text x="190" y="160" fill="#1e40af" fontSize="13" fontWeight="bold">강원도</text>

                {/* 4. 충청도 (Chungcheong) */}
                <path
                  d="M 60 180 L 100 190 L 140 180 L 160 170 L 190 220 L 160 250 L 100 240 L 65 220 Z"
                  fill={hoveredRegion === 'chungcheong' ? '#fde047' : '#fef9c3'}
                  stroke="#eab308"
                  strokeWidth="2"
                  onClick={() => handleRegionClick('chungcheong')}
                  onMouseEnter={() => setHoveredRegion('chungcheong')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  id="map-region-chungcheong"
                />
                <text x="110" y="215" fill="#854d0e" fontSize="13" fontWeight="bold">충청도</text>

                {/* 5. 전라도 (Jeolla) */}
                <path
                  d="M 65 220 L 100 240 L 150 255 L 140 330 L 70 320 L 40 280 L 50 245 Z"
                  fill={hoveredRegion === 'jeolla' ? '#f9a8d4' : '#fce7f3'}
                  stroke="#ec4899"
                  strokeWidth="2"
                  onClick={() => handleRegionClick('jeolla')}
                  onMouseEnter={() => setHoveredRegion('jeolla')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  id="map-region-jeolla"
                />
                <text x="80" y="285" fill="#9d174d" fontSize="13" fontWeight="bold">전라도</text>

                {/* 6. 경상도 (Gyeongsang) */}
                <path
                  d="M 160 250 L 190 220 L 220 220 L 270 240 L 260 320 L 220 330 L 140 330 L 150 255 Z"
                  fill={hoveredRegion === 'gyeongsang' ? '#fed7aa' : '#ffedd5'}
                  stroke="#f97316"
                  strokeWidth="2"
                  onClick={() => handleRegionClick('gyeongsang')}
                  onMouseEnter={() => setHoveredRegion('orange')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  id="map-region-gyeongsang"
                />
                <text x="190" y="285" fill="#9a3412" fontSize="13" fontWeight="bold">경상도</text>

                {/* 7. 제주도 (Jeju) */}
                <ellipse
                  cx="90"
                  cy="375"
                  rx="30"
                  ry="15"
                  fill={hoveredRegion === 'jeju' ? '#c084fc' : '#f3e8ff'}
                  stroke="#a855f7"
                  strokeWidth="2"
                  onClick={() => handleRegionClick('jeju')}
                  onMouseEnter={() => setHoveredRegion('jeju')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  id="map-region-jeju"
                />
                <text x="75" y="380" fill="#6b21a8" fontSize="12" fontWeight="bold">제주도</text>
              </g>
            </svg>

            {/* Live selected banner */}
            <div className="absolute bottom-2 right-2 bg-white/95 border border-teal-200 px-3 py-1.5 rounded-xl shadow-xs text-[11px] font-sans font-medium text-teal-800">
              지도에서 지역을 탭하세요!
            </div>
          </div>
        </div>

        {/* Kimchi List Cards Container */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-800 font-sans">
              비밀이 가득 담긴 김치 카드 대집합 ⭐
            </h4>
            <span className="text-xs text-gray-500 font-sans bg-gray-100 px-2 py-1 rounded">
              총 {KIMCHI_TYPES.length}가지 대표김치
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {KIMCHI_TYPES.map((kimchi) => {
              const isSelected = selectedKimchi?.id === kimchi.id;
              const regionKey = getRegionKey(kimchi.region);

              return (
                <motion.div
                  key={kimchi.id}
                  layoutId={`kimchi-card-${kimchi.id}`}
                  onClick={() => setSelectedKimchi(kimchi)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setHoveredRegion(regionKey)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className={`cursor-pointer p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center relative ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 shadow-md ring-4 ring-rose-100'
                      : 'bg-white border-yellow-100 hover:border-yellow-300 shadow-xs'
                  }`}
                  id={`kimchi-card-element-${kimchi.id}`}
                >
                  <span className="text-4xl mb-2 filter drop-shadow-sm">{kimchi.emoji}</span>
                  <p className="text-xs font-sans text-rose-500 font-semibold bg-rose-50 px-2.5 py-0.5 rounded-full mb-1">
                    {kimchi.region}
                  </p>
                  <h4 className="text-base font-bold text-gray-800 tracking-tight">
                    {kimchi.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-sans mt-1 line-clamp-1">
                    {kimchi.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Kimchi Detailed Info Modal */}
      <AnimatePresence>
        {selectedKimchi && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              layoutId={`kimchi-card-${selectedKimchi.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-4 border-rose-300 rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden relative"
            >
              {/* Card Ribbon Accent */}
              <div className="h-4 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300" />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedKimchi(null)}
                className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full text-gray-500 transition-colors"
                id="close-kimchi-modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8 space-y-6">
                
                {/* Header Banner */}
                <div className="flex items-center gap-4">
                  <div className="text-6xl p-4 bg-orange-100/60 rounded-3xl border border-orange-200">
                    {selectedKimchi.emoji}
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs font-sans font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedKimchi.region}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                      {selectedKimchi.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">핵심 소개</h4>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed font-sans">
                    {selectedKimchi.description}
                  </p>
                </div>

                {/* Rating stats & Spiciness representation */}
                <div className="grid grid-cols-2 gap-4 bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
                  <div className="space-y-1">
                    <span className="text-xs text-amber-800/80 font-bold font-sans">어린이 맛 평가</span>
                    <p className="text-xs font-sans text-gray-700 font-semibold">{selectedKimchi.taste}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-amber-800/80 font-bold font-sans flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-red-500" />
                      맵기 단계
                    </span>
                    <div className="flex gap-0.5" id="spiciness-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < selectedKimchi.spiciness
                              ? 'text-red-500 fill-red-500'
                              : 'text-gray-200 fill-gray-200'
                          }`}
                        />
                      ))}
                      {selectedKimchi.spiciness === 0 && (
                        <span className="text-xs text-emerald-600 font-sans font-bold">전혀 안 매워요 🥛</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Core Ingredients Tags */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">속재료 카드</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedKimchi.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium font-sans border border-gray-200 shadow-2xs"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* High-quality Fact check for child education */}
                <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-4 flex gap-3">
                  <span className="text-2xl mt-0.5">💡</span>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-rose-800 font-sans">김치 역사 & 상식 골든벨</h5>
                    <p className="text-xs text-rose-900 leading-relaxed font-sans font-medium">
                      {selectedKimchi.funFact}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  onClick={() => setSelectedKimchi(null)}
                  className="w-full py-3 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold text-sm rounded-2xl shadow-md transition-colors font-sans"
                  id="modal-confirm-button"
                >
                  우와, 잘 알았어요! 탐험 계속하기
                </button>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

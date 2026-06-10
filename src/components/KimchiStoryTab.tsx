/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, Heart, HelpCircle, ChevronRight, Check } from 'lucide-react';
import { TIMELINE_EVENTS, BENEFIT_CARDS } from '../data';
import { TimelineEvent, BenefitCard } from '../types';

export default function KimchiStoryTab() {
  const [selectedTimelineId, setSelectedTimelineId] = useState<string>('1');
  const [activeBenefitId, setActiveBenefitId] = useState<string | null>(null);

  const selectedTimeline = TIMELINE_EVENTS.find((t) => t.id === selectedTimelineId) || TIMELINE_EVENTS[0];

  return (
    <div className="space-y-12">
      {/* Introduction Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50/70 border border-red-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto shadow-sm"
      >
        <div className="text-5xl md:text-6xl animate-bounce duration-1000">🥬</div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            우리나라 진짜 보물 대백과
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            매콤하고 아삭아삭한 김치 이야기!
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed font-sans">
            김치는 아주아주 오랜 옛날부터 전해 내려온 우리나라 고유의 자랑스러운 전통 음식이에요. 
            처음에는 어떻게 만들어졌고, 어떤 신비로운 영양 성분이 들어있을까요? 함께 신나는 탐험을 출발해요!
          </p>
        </div>
      </motion.div>

      {/* Section 1: History Timeline */}
      <section className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 justify-center pb-2">
          <span className="p-2 bg-amber-100 text-amber-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 font-sans">
            연도별로 알아보는 김치의 역사 여행 🕰️
          </h3>
        </div>

        {/* Timeline track switcher */}
        <div className="relative flex flex-col items-center">
          {/* Connector bar (horizontal for desktop, vertical for mobile-ish or simple card grid) */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-amber-200 -translate-y-1/2 hidden md:block z-0" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full relative z-10">
            {TIMELINE_EVENTS.map((event, index) => {
              const isActive = selectedTimelineId === event.id;
              return (
                <motion.button
                  key={event.id}
                  onClick={() => setSelectedTimelineId(event.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-4 rounded-2xl border text-center transition-all ${
                    isActive
                      ? 'bg-amber-100 border-amber-400 shadow-md text-amber-900 font-bold'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-amber-300 hover:bg-amber-50/50'
                  }`}
                  id={`timeline-btn-${event.id}`}
                >
                  <div className="text-3xl mb-2">{event.emoji}</div>
                  <div className="text-[11px] font-sans font-medium text-amber-600 tracking-wider">
                    {event.period}
                  </div>
                  <div className="text-sm font-bold mt-1 tracking-tight">
                    {event.title.split('!')[0]}
                  </div>
                  {index < TIMELINE_EVENTS.length - 1 && (
                    <div className="hidden md:absolute right-[-14px] top-1/2 -translate-y-1/2 z-20 text-amber-300">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Detailed Timeline Card Display */}
        <div className="min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTimelineId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-2 border-amber-200/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="text-6xl p-5 bg-amber-50 rounded-2xl self-center md:self-start border border-amber-100">
                {selectedTimeline.emoji}
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-sans">
                    {selectedTimeline.period}
                  </span>
                  <span className="text-xs font-mono text-gray-400 font-semibold bg-gray-100 px-2 py-0.5 rounded">
                    {selectedTimeline.yearRange}
                  </span>
                </div>
                <h4 className="text-lg md:text-xl font-bold text-gray-900">
                  {selectedTimeline.title}
                </h4>
                <p className="text-sm md:text-base font-semibold text-amber-800 font-sans">
                  "{selectedTimeline.description}"
                </p>
                <p className="text-sm text-gray-600 leading-relaxed font-sans">
                  {selectedTimeline.details}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Section 2: Benefits */}
      <section className="space-y-6 max-w-5xl mx-auto pt-4">
        <div className="flex items-center gap-2 justify-center pb-2">
          <span className="p-2 bg-pink-100 text-pink-600 rounded-xl">
            <Heart className="w-5 h-5" />
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 font-sans">
            냠냠! 우리 몸에 이렇게나 좋을까? 김치의 4대 효능 🦸‍♂️
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFIT_CARDS.map((benefit) => {
            const isExpanded = activeBenefitId === benefit.id;
            return (
              <motion.div
                key={benefit.id}
                layout
                whileHover={{ y: -4 }}
                className={`border-2 rounded-3xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between ${benefit.colorClass}`}
                onClick={() => setActiveBenefitId(isExpanded ? null : benefit.id)}
                id={`benefit-card-${benefit.id}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{benefit.emoji}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                      {isExpanded ? '상세보기 닫기' : '카드 클릭!'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900">
                    {benefit.title}
                  </h4>
                  <p className="text-[13px] text-gray-700 leading-relaxed font-sans">
                    {benefit.description}
                  </p>
                </div>

                {/* Expanded checklists */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-dashed border-black/10 space-y-2 overflow-hidden"
                    >
                      {benefit.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-1.5 text-xs text-gray-800">
                          <span className="bg-white/95 rounded-full p-0.5 mt-0.5 block shadow-2xs">
                            <Check className="w-3 h-3 text-emerald-600" />
                          </span>
                          <span className="leading-tight font-sans">{detail}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isExpanded && (
                  <div className="mt-4 text-xs font-bold font-sans flex items-center justify-center gap-1 opacity-70">
                    <HelpCircle className="w-3.5 h-3.5" />
                    자세히 보기
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

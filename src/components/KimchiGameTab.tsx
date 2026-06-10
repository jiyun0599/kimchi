/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, Award, RotateCcw, Check, ShowerHead, HelpCircle, Utensils, Droplets, User } from 'lucide-react';
import { GameStage, GameIngredient } from '../types';

// Ingredients for stage 1
const GAME_INGREDIENTS: GameIngredient[] = [
  { id: '1', name: '절임배추', isCorrect: true, emoji: '🥬', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { id: '2', name: '초콜릿', isCorrect: false, emoji: '🍫', color: 'bg-stone-50 border-stone-200 text-stone-800' },
  { id: '3', name: '고춧가루', isCorrect: true, emoji: '🌶️', color: 'bg-red-50 border-red-200 text-red-800' },
  { id: '4', name: '바나나', isCorrect: false, emoji: '🍌', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  { id: '5', name: '무', isCorrect: true, emoji: '🥕', color: 'bg-amber-50 border-amber-200 text-amber-800' },
  { id: '6', name: '아이스크림', isCorrect: false, emoji: '🍦', color: 'bg-pink-50 border-pink-200 text-pink-800' },
  { id: '7', name: '마늘', isCorrect: true, emoji: '🧄', color: 'bg-slate-50 border-slate-200 text-slate-800' },
  { id: '8', name: '피자', isCorrect: false, emoji: '🍕', color: 'bg-orange-50 border-orange-200 text-orange-800' },
  { id: '9', name: '멸치액젓', isCorrect: true, emoji: '🏺', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  { id: '10', name: '우유', isCorrect: false, emoji: '🥛', color: 'bg-blue-50 border-blue-200 text-blue-800' }
];

const CORRECT_INGREDIENTS_COUNT = GAME_INGREDIENTS.filter(i => i.isCorrect).length;

export default function KimchiGameTab() {
  const [stage, setStage] = useState<GameStage>('intro');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [wrongFeedback, setWrongFeedback] = useState<string | null>(null);
  
  // Stage 2: Salting properties
  const [gaugeValue, setGaugeValue] = useState<number>(30);
  const [isGaugeActive, setIsGaugeActive] = useState<boolean>(true);
  const [saltingStatus, setSaltingStatus] = useState<'none' | 'curing' | 'success' | 'fail'>('none');
  const [washCount, setWashCount] = useState<number>(0);
  const [splashes, setSplashes] = useState<{ id: number; x: number; y: number }[]>([]);

  // Stage 3: Mixing properties
  const [rubbingProgress, setRubbingProgress] = useState<number>(0);
  const [rubbedParts, setRubbedParts] = useState<{ [key: string]: boolean }>({
    top: false,
    mid: false,
    bottom: false
  });

  // Final License State
  const [chefName, setChefName] = useState<string>('');
  const [licenseSigned, setLicenseSigned] = useState<boolean>(false);

  // Interval Ref for gauge motion
  const gaugeDirection = useRef<number>(1);
  const gaugeInterval = useRef<NodeJS.Timeout | null>(null);

  // Handling gauge motion back and forth
  useEffect(() => {
    if (stage === 'salting' && isGaugeActive && saltingStatus === 'none') {
      gaugeInterval.current = setInterval(() => {
        setGaugeValue((prev) => {
          let next = prev + gaugeDirection.current * 4;
          if (next >= 100) {
            gaugeDirection.current = -1;
            return 100;
          }
          if (next <= 0) {
            gaugeDirection.current = 1;
            return 0;
          }
          return next;
        });
      }, 50);
    } else {
      if (gaugeInterval.current) {
        clearInterval(gaugeInterval.current);
      }
    }
    return () => {
      if (gaugeInterval.current) clearInterval(gaugeInterval.current);
    };
  }, [stage, isGaugeActive, saltingStatus]);

  const resetGame = () => {
    setStage('intro');
    setSelectedIngredients([]);
    setWrongFeedback(null);
    setGaugeValue(15);
    setIsGaugeActive(true);
    setSaltingStatus('none');
    setWashCount(0);
    setSplashes([]);
    setRubbingProgress(0);
    setRubbedParts({ top: false, mid: false, bottom: false });
    setLicenseSigned(false);
  };

  // Stage 1 Action: Select ingredient
  const handleSelectIngredient = (ing: GameIngredient) => {
    if (!ing.isCorrect) {
      setWrongFeedback(`앗! [${ing.name}]은(는) 김치에 넣지 않아요! 으아~ 김치 맛이 이상해질 거예요! 다시 올바른 양념을 골라보세요.`);
      setTimeout(() => setWrongFeedback(null), 3500);
      return;
    }

    if (selectedIngredients.includes(ing.name)) return;

    const newList = [...selectedIngredients, ing.name];
    setSelectedIngredients(newList);

    if (newList.length === CORRECT_INGREDIENTS_COUNT) {
      setTimeout(() => {
        setStage('salting');
      }, 1000);
    }
  };

  // Stage 2 Action: Freeze Gauge & Check Range (Sweet spot: 65 - 85)
  const handleSaltCabbage = () => {
    setIsGaugeActive(false);
    if (gaugeValue >= 60 && gaugeValue <= 85) {
      setSaltingStatus('curing');
    } else {
      setSaltingStatus('fail');
    }
  };

  const retrySalting = () => {
    setGaugeValue(15);
    setIsGaugeActive(true);
    setSaltingStatus('none');
  };

  const handleWashClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (washCount >= 5) return;
    const nextCount = washCount + 1;
    setWashCount(nextCount);

    // Spawn animated water droplets based on click location
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSplashes((prev) => [...prev, { id: Date.now(), x, y }]);

    if (nextCount === 5) {
      setTimeout(() => {
        setStage('mixing');
      }, 1200);
    }
  };

  // Stage 3 Action: Rub Cabbage segment
  const handleRubSegment = (part: 'top' | 'mid' | 'bottom') => {
    if (rubbedParts[part]) return;

    const updated = { ...rubbedParts, [part]: true };
    setRubbedParts(updated);

    const activeCount = Object.values(updated).filter(Boolean).length;
    const nextProgress = Math.round((activeCount / 3) * 100);
    setRubbingProgress(nextProgress);

    if (nextProgress === 100) {
      setTimeout(() => {
        setStage('success');
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-[36px] shadow-sm p-6 md:p-8 select-none overflow-hidden relative min-h-[500px]">
      
      {/* Intro Stage */}
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-8 py-8"
          >
            <div className="space-y-3">
              <span className="text-6xl p-5 bg-gradient-to-tr from-amber-100 to-rose-100 rounded-full inline-block">
                👨‍🍳
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight font-sans">
                요리조리 김치 만들기 게임! 🌶️
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto leading-relaxed font-sans">
                어린이 꼬마 셰프님! 우리나라 명품 김치를 만드는 신기하고 신나는 조리법을 
                3가지 게임 스테이지를 통과하면서 직접 재밌게 배워보세요!
              </p>
            </div>

            {/* Recipe sequence summary preview box for learning */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl space-y-1">
                <span className="text-xl">Step 1</span>
                <h4 className="text-sm font-bold text-emerald-900">🥬 재료 고르기</h4>
                <p className="text-[11px] text-emerald-800/80 font-sans">배추와 맛깔난 핵심 양념들을 장바구니에 쏙 담아요!</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl space-y-1">
                <span className="text-xl">Step 2</span>
                <h4 className="text-sm font-bold text-amber-900">🧂 절이고 씻기</h4>
                <p className="text-[11px] text-amber-800/80 font-sans">알맞은 시간에 맞춰 소금을 솔솔 뿌리고 물로 말끔히 씻어요!</p>
              </div>
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl space-y-1">
                <span className="text-xl">Step 3</span>
                <h4 className="text-sm font-bold text-rose-900">🏺 골고루 버무리기</h4>
                <p className="text-[11px] text-rose-800/80 font-sans">빠진 곳이 없도록 꼼꼼하게 만능 소를 스르륵 비벼 버무려요!</p>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStage('ingredients')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-rose-100 transition-all font-sans cursor-pointer"
                id="start-game-btn"
              >
                <Play className="w-5 h-5 fill-current" />
                김치 만들기 시작!
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Stage 1: Ingredients selection */}
        {stage === 'ingredients' && (
          <motion.div
            key="ingredients"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Top progress bar */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider font-sans">Stage 1</span>
                <h3 className="text-lg font-bold text-gray-900">비법 김치 재료 고르기 🛒</h3>
              </div>
              <div className="text-sm font-bold text-gray-600 font-sans">
                찾은 재료: <span className="text-rose-500">{selectedIngredients.length}</span> / {CORRECT_INGREDIENTS_COUNT}
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 text-xs md:text-sm text-amber-800 font-sans flex items-start gap-2">
              <span className="text-lg">💡</span>
              <p className="leading-relaxed">
                바구니에서 김치를 만들 때 꼭 필요한 <strong>5가지 올바른 재료</strong>(절임배추, 고춧가루, 무, 마늘, 멸치액젓)를 골라보세요. 
                김치와 상관없는 군것질거리나 피자는 넣으면 안 돼요!
              </p>
            </div>

            {/* Wrong item alert bubble */}
            <AnimatePresence>
              {wrongFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs md:text-sm font-sans font-medium text-center"
                >
                  ⚠️ {wrongFeedback}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ingredients cards shelf */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {GAME_INGREDIENTS.map((ing) => {
                const isPicked = selectedIngredients.includes(ing.name);
                return (
                  <motion.button
                    key={ing.id}
                    disabled={isPicked}
                    onClick={() => handleSelectIngredient(ing)}
                    whileHover={{ scale: isPicked ? 1 : 1.05 }}
                    whileTap={{ scale: isPicked ? 1 : 0.95 }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer text-center flex flex-col items-center justify-center transition-all min-h-[110px] relative ${
                      isPicked
                        ? 'bg-slate-100 border-slate-300 opacity-50 grayscale'
                        : ing.color
                    }`}
                    id={`ing-btn-${ing.id}`}
                  >
                    {isPicked && (
                      <div className="absolute top-2 right-2 bg-rose-500 text-white p-0.5 rounded-full">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <span className="text-4xl mb-1 filter drop-shadow-sm">{ing.emoji}</span>
                    <span className="text-xs font-bold font-sans tracking-tight">{ing.name}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Mixing Bowl Visualizer */}
            <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-center space-y-4">
              <span className="text-xs font-bold text-gray-400 font-sans">우리의 대형 조리 사발</span>
              <div className="w-24 h-16 md:w-32 md:h-20 bg-gray-200 border-b-8 border-gray-300 rounded-b-full mx-auto shadow-inner relative flex items-center justify-center">
                
                {/* Visual ingredients stacked inside bowl */}
                <div className="absolute -top-4 flex justify-center gap-1.5 flex-wrap px-3 max-w-[160px]">
                  {selectedIngredients.map((name, i) => {
                    const matched = GAME_INGREDIENTS.find(g => g.name === name);
                    return (
                      <motion.span
                        key={i}
                        initial={{ scale: 0, y: -15 }}
                        animate={{ scale: 1, y: 0 }}
                        className="text-2xl filter drop-shadow-2xs"
                      >
                        {matched?.emoji}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
              <p className="text-xs font-sans text-gray-500">
                {selectedIngredients.length === 0 
                  ? '바구니에서 배추와 맛있는 양념들을 클릭해 수북이 채워 넣으세요!'
                  : `골라 넣은 재료: ${selectedIngredients.join(', ')}`
                }
              </p>
            </div>
          </motion.div>
        )}

        {/* Stage 2: Salting & Washing */}
        {stage === 'salting' && (
          <motion.div
            key="salting"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Top progress bar */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider font-sans">Stage 2</span>
                <h3 className="text-lg font-bold text-gray-900">아삭아삭 배추 소금 절이기와 시원한 헹구기 🧂</h3>
              </div>
              <div className="text-sm font-bold text-gray-600 font-sans">
                과정 완료: <span className="text-amber-500">{saltingStatus === 'curing' ? '절이기 성공! ➡️ 씻기 중' : '절여서 숨죽이기 완료 대기'}</span>
              </div>
            </div>

            {/* Instruction panel */}
            <div className="bg-amber-50 rounded-2xl p-4 text-xs md:text-sm text-amber-800 font-sans flex items-start gap-2">
              <span className="text-lg">💡</span>
              <p className="leading-relaxed">
                {saltingStatus !== 'curing' ? (
                  <>게이지 바늘이 <strong>노란색 딱 좋아! 구역(60~85)</strong>에 정중앙에 왔을 때 아래의 "소금 뿌리기" 버튼을 콕 누르세요! 너무 길거나 짧으면 상해서 못 먹게 될 수 있어요.</>
                ) : (
                  <>와! 기가 막히게 잘 절여졌어요! 이제 배추에 묻은 남은 소금알들을 물샤워로 시원하게 씻어볼까요? <strong>욕조에 대고 샤워기를 대포알처럼 5번 탭클릭</strong>해보세요!</>
                )}
              </p>
            </div>

            {/* Main Interactive Stage Area */}
            {saltingStatus !== 'curing' ? (
              <div className="space-y-8 py-4 flex flex-col items-center">
                {/* Gauge widget rendering */}
                <div className="w-full max-w-md bg-gray-100 border border-gray-200 h-8 rounded-full relative overflow-hidden flex items-center shadow-inner">
                  {/* Perfect Sweet spot background marker */}
                  <div className="absolute left-[60%] right-[15%] h-full bg-yellow-300 border-x-2 border-dashed border-amber-400 opacity-90 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-amber-900 absolute font-sans z-10">딱 좋아! 🌟</span>
                  </div>

                  {/* Little red needle indicator representing slider */}
                  <div
                    style={{ left: `${gaugeValue}%` }}
                    className="absolute top-0 bottom-0 w-1.5 bg-red-600 transition-all duration-75 z-20 shadow-md"
                  />
                </div>

                {/* Salt animation display center */}
                <div className="text-center space-y-3">
                  <span className="text-6xl filter drop-shadow-sm block">
                    {saltingStatus === 'fail' ? '💥' : '🥬'}
                  </span>
                  <div className="text-xs text-gray-500 font-sans">
                    {saltingStatus === 'none' && '바늘이 좌우로 움직이고 있어요! 타이밍을 장조해 보세요.'}
                    {saltingStatus === 'fail' && (
                      <span className="text-red-500 font-bold">앗! 너무 덜 절였거나 과하게 절여 짜졌어요! 다시 건강하게 절여봐요.</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  {saltingStatus === 'none' ? (
                    <button
                      onClick={handleSaltCabbage}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors font-sans cursor-pointer"
                      id="salt-action-btn"
                    >
                      🧂 지금 소금 뿌리기!
                    </button>
                  ) : (
                    <button
                      onClick={retrySalting}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl border border-gray-300 transition-colors font-sans cursor-pointer"
                      id="retry-salt-btn"
                    >
                      <RotateCcw className="w-4 h-4 inline-block mr-1" />
                      다시 절이기 도전자
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // Washing Section
              <div className="space-y-6 py-4 flex flex-col items-center">
                
                {/* Wash Tub visualizer */}
                <div className="w-full max-w-sm aspect-[4/3] bg-blue-50/70 border-4 border-blue-200/60 rounded-[40px] flex flex-col items-center justify-center relative shadow-inner overflow-hidden">
                  
                  {/* Floating animated droplets from splashes state */}
                  {splashes.map((splash) => (
                    <motion.span
                      key={splash.id}
                      initial={{ scale: 1.5, opacity: 1, y: 0 }}
                      animate={{ scale: 0, opacity: 0, y: -40, x: (Math.random() - 0.5) * 40 }}
                      className="absolute text-3xl z-20 pointer-events-none"
                      style={{ left: splash.x, top: splash.y }}
                    >
                      💦
                    </motion.span>
                  ))}

                  <div className="text-center space-y-2 z-10">
                    <span className="text-5xl filter drop-shadow-xs block animate-pulse">🥬</span>
                    <span className="text-[11px] font-bold text-blue-700 font-sans uppercase tracking-wider">
                      남은 소금기 씻어주기
                    </span>
                    
                    {/* Progress bars inside tub */}
                    <div className="w-40 bg-gray-200 h-3 rounded-full overflow-hidden mx-auto border border-blue-100">
                      <div 
                        className="bg-blue-400 h-full transition-all duration-300" 
                        style={{ width: `${(washCount / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-500 block font-sans">
                      {washCount < 5 ? `탭 횟수: ${washCount}/5` : '완벽해요! 말끔히 씻어 말렸어요!'}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleWashClick}
                    className="px-6 py-3.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-100 transition-all font-sans cursor-pointer flex items-center gap-1.5"
                    id="wash-action-btn"
                  >
                    <ShowerHead className="w-4 h-4" />
                    💦 물뿌리며 싹싹 씻기 (클릭!)
                  </button>
                </div>

              </div>
            )}
          </motion.div>
        )}

        {/* Stage 3: Mixing Cabbage seasoning */}
        {stage === 'mixing' && (
          <motion.div
            key="mixing"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Top progress bar */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider font-sans">Stage 3</span>
                <h3 className="text-lg font-bold text-gray-900">배추 구석구석 매콤 소 버무리기 🏺</h3>
              </div>
              <div className="text-sm font-bold text-gray-600 font-sans">
                버무린 진척율: <span className="text-rose-500">{rubbingProgress}%</span>
              </div>
            </div>

            {/* Instruction panel */}
            <div className="bg-rose-50 rounded-2xl p-4 text-xs md:text-sm text-rose-800 font-sans flex items-start gap-2">
              <span className="text-lg">💡</span>
              <p className="leading-relaxed">
                하얗게 잘 익어 씻겨진 절임배추의 <strong>위쪽(Top), 가운데(Middle), 아래쪽(Bottom)</strong> 세 군데 부분을 손끝으로 콕 탭하거나 마우스로 클릭해보세요! 
                매콤하고 맛깔스러운 김칫소가 들어가며 배추가 붉고 맛있게 익어갈 것입니다.
              </p>
            </div>

            {/* Rub / Click interactive cabinet view */}
            <div className="flex flex-col items-center py-6 justify-center">
              
              {/* Giant Clickable Cabbage Illustration Representation */}
              <div className="w-72 border-4 border-dashed border-rose-200 p-4 rounded-[40px] bg-amber-50/20 shadow-xs relative flex flex-col items-center gap-1">
                
                {/* Segment 1: TOP */}
                <button
                  disabled={rubbedParts.top}
                  onClick={() => handleRubSegment('top')}
                  className={`w-full py-6 md:py-8 rounded-full border text-center transition-all duration-300 font-bold ${
                    rubbedParts.top
                      ? 'bg-rose-500 border-rose-600 text-white shadow-inner scale-99'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 cursor-pointer animate-pulse'
                  }`}
                  id="rub-segment-top"
                >
                  <span className="text-[11px] font-sans font-bold block mb-1">
                    {rubbedParts.top ? '🌶️ 버무려짐!' : '🥬 위쪽 머리골'}
                  </span>
                  <p className="text-xs font-sans">
                    {rubbedParts.top ? '향긋한 생생 고춧소 한가득' : '이곳을 탭해 버무리세요'}
                  </p>
                </button>

                {/* Segment 2: MIDDLE */}
                <button
                  disabled={rubbedParts.mid}
                  onClick={() => handleRubSegment('mid')}
                  className={`w-full py-8 md:py-10 rounded-full border text-center transition-all duration-300 font-bold ${
                    rubbedParts.mid
                      ? 'bg-rose-500 border-rose-600 text-white shadow-inner scale-99'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 cursor-pointer animate-pulse'
                  }`}
                  id="rub-segment-mid"
                >
                  <span className="text-[11px] font-sans font-bold block mb-1">
                    {rubbedParts.mid ? '🌶️ 버무려짐!' : '🥬 중간 품골'}
                  </span>
                  <p className="text-xs font-sans">
                    {rubbedParts.mid ? '속속들이 고소한 무채 양념 가득' : '이곳을 탭해 버무리세요'}
                  </p>
                </button>

                {/* Segment 3: BOTTOM */}
                <button
                  disabled={rubbedParts.bottom}
                  onClick={() => handleRubSegment('bottom')}
                  className={`w-full py-6 md:py-8 rounded-full border text-center transition-all duration-300 font-bold ${
                    rubbedParts.bottom
                      ? 'bg-rose-500 border-rose-600 text-white shadow-inner scale-99'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 cursor-pointer animate-pulse'
                  }`}
                  id="rub-segment-bottom"
                >
                  <span className="text-[11px] font-sans font-bold block mb-1">
                    {rubbedParts.bottom ? '🌶️ 버무려짐!' : '🥬 밑동 뿌리골'}
                  </span>
                  <p className="text-xs font-sans">
                    {rubbedParts.bottom ? '마늘과 마성의 젓 갈 맛 조우!' : '이곳을 탭해 버무리세요'}
                  </p>
                </button>

              </div>

              <div className="mt-6 text-center text-xs font-sans text-gray-500">
                {rubbingProgress < 100 
                  ? '배추 3곳의 하양이들이 모두 매운 옷을 입을 때까지 신나게 콕콕 버무려주세요!'
                  : '대박! 완벽한 비율로 속을 가득 버무려 빨간 포기김치를 만드셨어요!'
                }
              </div>

            </div>
          </motion.div>
        )}

        {/* Finished / Success Stage with license certificate issuance */}
        {stage === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-8 text-center py-6 flex flex-col items-center"
          >
            {/* Celebration elements */}
            <div className="space-y-3">
              <span className="text-6xl animate-bounce block">🏆</span>
              <h2 className="text-2xl md:text-3xl font-bold text-rose-600 tracking-tight font-sans">
                축하합니다! 맛있는 배추김치 완성! 🎉
              </h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed font-sans">
                꼬마 요리사님의 비법 양념 장전, 소금 절이기와 비비기 신공으로 아작아작 장건강 최고 맛있는 전통 배추김치가 귀히 태어났어요!
              </p>
            </div>

            {/* Interactive Licensing Card Badge Maker */}
            <div className="w-full max-w-md bg-gradient-to-tr from-amber-50 to-rose-50 border-4 border-yellow-300 rounded-[30px] p-6 shadow-xl relative overflow-hidden space-y-4">
              
              {/* Background badge decorations */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] text-yellow-100/40 font-bold font-sans pointer-events-none">
                KIMCHI
              </div>

              <div className="relative space-y-3">
                <div className="inline-flex py-1 px-3 bg-yellow-400 text-yellow-950 font-bold rounded-full text-xs font-sans tracking-wide">
                  ⭐ 명예의 영양 면허증 ⭐
                </div>
                <h3 className="text-lg font-bold text-gray-900 font-sans">
                  대한민국 김치인 면허증
                </h3>

                {/* Sub name sign block */}
                {!licenseSigned ? (
                  <div className="space-y-3 max-w-xs mx-auto">
                    <p className="text-[11px] text-gray-500 font-sans">면허증에 새겨질 꼬마 요리사님의 이름을 써보세요!</p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          maxLength={10}
                          value={chefName}
                          onChange={(e) => setChefName(e.target.value)}
                          placeholder="꼬마 요리사 이름"
                          className="w-full pl-8 pr-2 py-2 text-xs border border-amber-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-sans"
                          id="chef-name-input"
                        />
                        <span className="absolute left-2.5 top-2.5 text-gray-400">
                          <User className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <button
                        onClick={() => setLicenseSigned(true)}
                        disabled={!chefName.trim()}
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-slate-200 disabled:text-slate-400 font-bold text-xs font-sans text-yellow-900 rounded-xl transition-all cursor-pointer"
                        id="sign-license-btn"
                      >
                        등록!
                      </button>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/90 rounded-2xl p-4 border border-yellow-200 text-center max-w-xs mx-auto shadow-sm"
                  >
                    <span className="text-4xl block mb-1">🥇</span>
                    <h4 className="text-sm font-bold text-gray-900 font-sans">
                      마스터 셰프: {chefName} 어린이
                    </h4>
                    <p className="text-[10px] text-gray-500 font-sans mt-1 leading-relaxed">
                      위 어린이는 삼국시대 비법 역사와 전국 팔도 명품 김치 비밀을 마스터하고 직접 만들기를 훌륭히 성공하였으므로 이 영광스러운 1등 증서를 수여합니다.
                    </p>
                    <div className="mt-3 text-[10px] font-mono font-bold text-rose-500 tracking-wider bg-rose-50 py-1 rounded-sm">
                      LICENSE NO. KM-20260527
                    </div>
                  </motion.div>
                )}

                <div className="border-t border-dashed border-gray-200 pt-3">
                  <span className="text-[10px] text-gray-400 font-sans block">김치 역사연구소 & 요리본부 증명</span>
                </div>
              </div>

            </div>

            {/* Bottom Reset buttons */}
            <div className="flex gap-4">
              <button
                onClick={resetGame}
                className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs font-sans rounded-2xl border border-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
                id="reset-game-btn"
              >
                <RotateCcw className="w-4 h-4" />
                다시 요리하기
              </button>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

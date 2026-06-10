/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TabType = 'story' | 'map' | 'game';

export interface TimelineEvent {
  id: string;
  period: string;
  title: string;
  description: string;
  details: string;
  emoji: string;
  yearRange: string;
}

export interface BenefitCard {
  id: string;
  title: string;
  description: string;
  emoji: string;
  colorClass: string;
  details: string[];
}

export interface KimchiType {
  id: string;
  name: string;
  region: string;
  emoji: string;
  description: string;
  taste: string; // 맵기 정도, 아삭함 등 어린이용 레이팅
  spiciness: number; // 1 to 5 stars
  funFact: string; // 어린이용 상식
  ingredients: string[];
}

export interface GameIngredient {
  id: string;
  name: string;
  isCorrect: boolean;
  emoji: string;
  color: string;
}

export type GameStage = 'intro' | 'ingredients' | 'salting' | 'mixing' | 'success';

export interface GameState {
  stage: GameStage;
  selectedIngredients: string[];
  saltingGauge: number; // 0 to 100
  saltedState: 'none' | 'perfect' | 'success'; // none -> perfect (gauge check) -> success (after washing)
  washCount: number; // 0 to 5 for washing
  rubbingProgress: number; // 0 to 100
  rubbedParts: { [key: string]: boolean }; // progress tracker for rubbing spots
}

import type { ComponentType } from 'react';
import type { PeekKind } from '../../lib/peekPieces';
import type { MotifProps } from './shared';
import GrannySquare from './GrannySquare';
import Flower from './Flower';
import YarnBall from './YarnBall';
import Heart from './Heart';
import Leaf from './Leaf';
import Pompom from './Pompom';

export const CROCHET_COMPONENTS: Record<PeekKind, ComponentType<MotifProps>> = {
  granny: GrannySquare,
  flower: Flower,
  yarnball: YarnBall,
  heart: Heart,
  leaf: Leaf,
  pompom: Pompom,
};

export { GrannySquare, Flower, YarnBall, Heart, Leaf, Pompom };
export type { MotifProps };

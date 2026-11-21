import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type ArmMode = 'hip' | 'wave' | 'point' | 'fist' | 'think' | 'rest';
type CharacterKind = 'orange' | 'blue';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const blinkScale = (frame: number, moments: number[]) => {
  const distance = Math.min(...moments.map((moment) => Math.abs(frame - moment)));
  if (distance >= 2) return 1;
  return interpolate(distance, [0, 2], [0.08, 1], clamp);
};

const Arm: React.FC<{
  side: 'left' | 'right';
  mode: ArmMode;
  angle: number;
  color: string;
  outline: string;
}> = ({side, mode, angle, color, outline}) => {
  const mirrored = side === 'left';
  let armPath = 'M326 240 Q351 248 350 276';
  if (mode === 'wave') armPath = 'M326 240 Q350 212 351 171';
  if (mode === 'point') armPath = 'M326 240 Q354 226 377 216';
  if (mode === 'fist') armPath = 'M326 240 Q349 214 350 184';
  if (mode === 'think') armPath = 'M326 240 Q338 214 315 202';
  if (mode === 'rest') armPath = 'M326 240 Q340 256 342 282';

  return (
    <g transform={mirrored ? 'translate(400 0) scale(-1 1)' : undefined}>
      <g transform={`rotate(${angle} 326 240)`}>
        <path d={armPath} fill="none" stroke={outline} strokeWidth={22} strokeLinecap="round" />
        <path d={armPath} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" />
        {mode === 'wave' && (
          <g transform="translate(350 166) rotate(-8)">
            <path d="M-3 11 Q-15 1 -10 -9 Q-7 -14 -2 -9 L2 -1 L5 -15 Q8 -20 12 -15 L12 -3 L17 -13 Q22 -15 23 -9 L19 2 L24 -4 Q30 -5 29 2 Q25 18 12 22 Q0 22 -3 11Z" fill={color} stroke={outline} strokeWidth={8} strokeLinejoin="round" />
          </g>
        )}
        {mode === 'point' && (
          <g transform="translate(374 215)">
            <path d="M-9 4 Q-4 -4 2 -3 L16 -17 Q22 -20 23 -14 L12 1 Q22 -3 26 2 Q29 8 20 12 L4 19 Q-7 18 -9 4Z" fill={color} stroke={outline} strokeWidth={8} strokeLinejoin="round" />
          </g>
        )}
        {mode === 'fist' && (
          <g transform="translate(350 183)">
            <path d="M-13 8 Q-17 -1 -11 -7 Q-6 -12 -1 -7 Q3 -17 10 -11 Q17 -14 20 -5 Q29 -2 25 9 Q21 22 7 23 Q-7 22 -13 8Z" fill={color} stroke={outline} strokeWidth={8} strokeLinejoin="round" />
            <path d="M-4 -2 L-3 7 M6 -5 L7 7 M15 -2 L14 7" stroke={outline} strokeWidth={4} strokeLinecap="round" />
          </g>
        )}
        {(mode === 'hip' || mode === 'rest') && (
          <path d="M350 270 Q365 270 365 282 Q363 295 349 292 Q338 286 342 276Z" fill={color} stroke={outline} strokeWidth={8} />
        )}
        {mode === 'think' && (
          <path d="M314 197 Q304 189 309 181 Q315 176 321 184 Q328 175 334 183 Q339 193 327 203 Q320 207 314 197Z" fill={color} stroke={outline} strokeWidth={8} />
        )}
      </g>
    </g>
  );
};

const TriangleCharacter: React.FC<{
  kind: CharacterKind;
  frame: number;
  x: number;
  y: number;
  size: number;
}> = ({kind, frame, x, y, size}) => {
  const isOrange = kind === 'orange';
  const orangeSection = frame < 150 ? 0 : frame < 270 ? 1 : frame < 480 ? 2 : frame < 630 ? 3 : 4;
  const section = orangeSection;
  const talking = isOrange
    ? section === 0 || (section === 2 && Math.floor(frame / 17) % 2 === 0) || section === 3
    : section === 1 || (section === 2 && Math.floor(frame / 17) % 2 === 1) || section === 3;
  const angry = section === 3 || (section === 2 && (isOrange ? frame > 360 : frame > 405));
  const mouth = talking ? 0.22 + 0.78 * (0.5 + 0.5 * Math.sin(frame * 0.62 + (isOrange ? 0 : 1.2))) : 0.06;
  const blink = blinkScale(frame, isOrange ? [42, 116, 194, 312, 526, 681] : [27, 98, 181, 287, 448, 590, 698]);
  const localBounce = talking ? Math.sin(frame * 0.42 + (isOrange ? 0 : 1.7)) * 5 : Math.sin(frame * 0.13) * 2;
  const stomp = section === 3 ? Math.sin((frame - 480) * 0.72 + (isOrange ? 0 : Math.PI)) : 0;
  const bodyShake = section === 3 ? Math.sin((frame - 480) * 0.85 + (isOrange ? 0 : 1)) * 4 : 0;
  const lean = section === 2 ? (isOrange ? 4 : -4) : section === 3 ? (isOrange ? 5 : -5) : 0;
  const rightMode: ArmMode = section === 0 && isOrange ? 'wave'
    : section === 1 && !isOrange ? 'fist'
    : section === 2 ? (isOrange ? 'point' : 'fist')
    : section === 3 ? 'fist'
    : section === 4 ? 'think'
    : 'hip';
  const leftMode: ArmMode = section === 2 && !isOrange ? 'point'
    : section === 3 ? 'fist'
    : 'hip';
  const wave = section === 0 && isOrange ? Math.sin(frame * 0.34) * 17 : 0;
  const fistPulse = section === 3 ? Math.sin(frame * 0.55) * 9 : 0;
  const rightAngle = rightMode === 'wave' ? -13 + wave : rightMode === 'fist' ? -8 + fistPulse : rightMode === 'point' ? 5 + Math.sin(frame * 0.22) * 4 : rightMode === 'think' ? -18 : 0;
  const leftAngle = leftMode === 'point' ? -4 + Math.sin(frame * 0.24) * 4 : leftMode === 'fist' ? 8 - fistPulse : 0;
  const leftLeg = section === 3 ? stomp * 13 : Math.sin(frame * 0.15) * 2;
  const rightLeg = section === 3 ? -stomp * 13 : Math.sin(frame * 0.15 + 1) * 2;
  const color = isOrange ? '#FFB52F' : '#69C9F3';
  const dark = isOrange ? '#F28B1D' : '#3E9FCE';
  const outline = '#553323';
  const prefix = isOrange ? 'orange' : 'blue';
  const pupilShift = section === 4 ? 2 : isOrange ? 6 : -6;
  const mouthHeight = 7 + mouth * (angry ? 19 : 16);
  const mouthY = 251;
  const showAnger = angry ? 1 : 0;

  return (
    <svg
      viewBox="0 0 400 430"
      style={{
        position: 'absolute', left: x, top: y + localBounce,
        width: size, height: size * 1.075, overflow: 'visible',
        filter: 'drop-shadow(0 16px 12px rgba(68, 47, 26, .18))',
        transform: `translateX(${bodyShake}px)`,
      }}
    >
      <defs>
        <linearGradient id={`${prefix}-body`} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={isOrange ? '#FFD65B' : '#A5E8FF'} />
          <stop offset="58%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`${prefix}-shine`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".48" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="405" rx="126" ry="15" fill="#77552F" opacity=".16" />
      <g transform={`rotate(${lean} 200 330)`}>
        <g transform={`rotate(${leftLeg} 148 333)`}>
          <path d="M148 330 Q145 358 135 381" fill="none" stroke={outline} strokeWidth="19" strokeLinecap="round" />
          <path d="M148 330 Q145 358 135 381" fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" />
          <path d="M137 378 Q112 380 113 392 Q118 403 150 398 Q164 394 154 382Z" fill={color} stroke={outline} strokeWidth="8" />
        </g>
        <g transform={`rotate(${rightLeg} 252 333)`}>
          <path d="M252 330 Q255 358 265 381" fill="none" stroke={outline} strokeWidth="19" strokeLinecap="round" />
          <path d="M252 330 Q255 358 265 381" fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" />
          <path d="M263 378 Q288 380 287 392 Q282 403 250 398 Q236 394 246 382Z" fill={color} stroke={outline} strokeWidth="8" />
        </g>
        <Arm side="left" mode={leftMode} angle={leftAngle} color={color} outline={outline} />
        <Arm side="right" mode={rightMode} angle={rightAngle} color={color} outline={outline} />
        <path d="M200 28 L49 326 Q42 344 64 345 L336 345 Q358 344 351 326Z" fill={`url(#${prefix}-body)`} stroke={outline} strokeWidth="10" strokeLinejoin="round" />
        <path d="M200 38 L83 302 Q75 319 95 321 L200 321Z" fill={`url(#${prefix}-shine)`} opacity=".62" />
        <path d="M184 41 Q200 61 216 41" fill="none" stroke="#D94B35" strokeWidth="7" strokeLinecap="round" />
        <path d="M62 319 Q82 300 100 321" fill="none" stroke="#D94B35" strokeWidth="7" strokeLinecap="round" />
        <path d="M300 321 Q318 300 338 319" fill="none" stroke="#D94B35" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="116" cy="238" rx="22" ry="11" fill="#F27E80" opacity={isOrange ? '.22' : '.48'} />
        <ellipse cx="284" cy="238" rx="22" ry="11" fill="#F27E80" opacity={isOrange ? '.22' : '.48'} />
        <g transform={`translate(0 181) scale(1 ${blink}) translate(0 -181)`}>
          <ellipse cx="145" cy="184" rx="29" ry="38" fill="#FFFDF7" stroke={outline} strokeWidth="5" />
          <ellipse cx={151 + pupilShift} cy="190" rx="15" ry="23" fill="#593B42" />
          <ellipse cx={155 + pupilShift} cy="181" rx="6" ry="8" fill="#FFFFFF" />
          <ellipse cx="255" cy="184" rx="29" ry="38" fill="#FFFDF7" stroke={outline} strokeWidth="5" />
          <ellipse cx={249 + pupilShift} cy="190" rx="15" ry="23" fill="#593B42" />
          <ellipse cx={253 + pupilShift} cy="181" rx="6" ry="8" fill="#FFFFFF" />
        </g>
        <path d={angry ? 'M112 133 L157 145' : 'M116 143 Q135 130 153 139'} fill="none" stroke={outline} strokeWidth="9" strokeLinecap="round" />
        <path d={angry ? 'M244 145 L288 132' : 'M247 139 Q266 130 285 143'} fill="none" stroke={outline} strokeWidth="9" strokeLinecap="round" />
        <path d="M164 260 Q200 283 236 260" fill="none" stroke={outline} strokeWidth="3" opacity={1 - mouth} />
        <ellipse cx="200" cy={mouthY + mouthHeight / 2} rx={13 + mouth * 12} ry={mouthHeight} fill="#4A1F25" stroke={outline} strokeWidth={5} opacity={mouth} />
        <path d={`M184 ${mouthY + mouthHeight * 0.75} Q200 ${mouthY + mouthHeight + 8} 216 ${mouthY + mouthHeight * 0.75}`} fill="#F48B91" opacity={mouth * 0.9} />
        {showAnger > 0 && (
          <g transform="translate(300 82)" opacity={interpolate(frame, [450, 480, 620, 640], [0, 1, 1, 0], clamp)}>
            <path d="M0 0 L10 -20 L18 -3 L37 -12 L30 7 L49 16 L27 23 L30 43 L12 31 L-2 48 L-6 26 L-27 25 L-11 9 L-23 -7Z" fill="#F25B51" stroke="#A82C28" strokeWidth={5} strokeLinejoin="round" />
          </g>
        )}
      </g>
    </svg>
  );
};

const ForestBoard: React.FC = () => (
  <AbsoluteFill>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A9D8EF"/><stop offset="1" stopColor="#F4EFD8"/></linearGradient>
        <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E6AE60"/><stop offset=".5" stopColor="#A9612E"/><stop offset="1" stopColor="#70401F"/></linearGradient>
        <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF9E7"/><stop offset="1" stopColor="#F5E9C9"/></linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B7D87A"/><stop offset="1" stopColor="#5D9A54"/></linearGradient>
        <filter id="boardShadow"><feGaussianBlur stdDeviation="18"/></filter>
      </defs>
      <rect width="1920" height="1080" fill="url(#sky)" />
      <circle cx="1570" cy="130" r="78" fill="#FFF5C7" opacity=".75" />
      <g opacity=".65" fill="#FFFFFF"><ellipse cx="510" cy="95" rx="130" ry="36"/><ellipse cx="610" cy="86" rx="88" ry="27"/><ellipse cx="1320" cy="120" rx="100" ry="28"/></g>
      <path d="M0 0 Q120 15 170 130 Q205 210 170 360 L0 420Z" fill="#6B442A"/><path d="M1920 0 Q1790 15 1740 130 Q1715 230 1755 390 L1920 430Z" fill="#6B442A"/>
      <path d="M0 0 Q200 40 360 0 Q480 20 560 120 Q360 80 260 170 Q110 130 0 205Z" fill="#397A43"/>
      <path d="M1920 0 Q1720 40 1560 0 Q1440 20 1360 120 Q1560 80 1660 170 Q1810 130 1920 205Z" fill="#397A43"/>
      <g fill="#6DAA50" opacity=".95">
        {Array.from({length: 28}).map((_, i) => <circle key={i} cx={30 + (i * 71) % 1850} cy={24 + (i * 31) % 125} r={28 + (i % 4) * 7} />)}
      </g>
      <g fill="#8DC66B" opacity=".75">
        {Array.from({length: 20}).map((_, i) => <ellipse key={i} cx={40 + (i * 97) % 1840} cy={68 + (i * 17) % 120} rx="40" ry="18" transform={`rotate(${(i % 2 ? 1 : -1) * 28} ${40 + (i * 97) % 1840} ${68 + (i * 17) % 120})`} />)}
      </g>
      <rect y="880" width="1920" height="200" fill="url(#grass)" />
      <path d="M0 930 Q280 875 520 930 T1040 925 T1560 930 T1920 900 V1080 H0Z" fill="#77AD5B" />
      <ellipse cx="960" cy="1000" rx="760" ry="70" fill="#E7D8A5" opacity=".35" />
      <rect x="58" y="150" width="1804" height="765" rx="54" fill="#54351F" opacity=".25" filter="url(#boardShadow)" />
      <rect x="55" y="128" width="1810" height="770" rx="50" fill="url(#wood)" stroke="#75421F" strokeWidth="8" />
      <rect x="77" y="150" width="1766" height="726" rx="38" fill="#F6DCA9" stroke="#EFC27B" strokeWidth="8" />
      <rect x="96" y="170" width="1728" height="688" rx="28" fill="url(#paper)" stroke="#C98B45" strokeWidth="5" />
      <path d="M115 200 Q960 165 1805 200" stroke="#FFFFFF" strokeWidth="5" opacity=".55" fill="none" />
      <rect x="82" y="42" width="290" height="102" rx="18" fill="url(#wood)" stroke="#70401F" strokeWidth="7" />
      <path d="M110 43 L110 12 M340 43 L340 12" stroke="#8B5A30" strokeWidth="8" />
      <path d="M96 66 Q226 46 358 66" stroke="#FFD78B" strokeWidth="5" opacity=".8" fill="none" />
      <g fill="#3C773F"><circle cx="100" cy="970" r="22"/><circle cx="154" cy="984" r="15"/><circle cx="1765" cy="977" r="23"/><circle cx="1810" cy="989" r="15"/></g>
      <g fill="#FFF7D9" stroke="#E5B75E" strokeWidth="3">
        <circle cx="160" cy="930" r="12"/><circle cx="182" cy="940" r="12"/><circle cx="170" cy="920" r="12"/>
        <circle cx="1740" cy="930" r="12"/><circle cx="1762" cy="940" r="12"/><circle cx="1750" cy="920" r="12"/>
      </g>
    </svg>
  </AbsoluteFill>
);

export const TriangleAngleSum: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({frame: frame - 8, fps, config: {damping: 16, stiffness: 100}});
  const question = spring({frame: frame - 634, fps, config: {damping: 14, stiffness: 110}});
  const orangeX = interpolate(frame, [0, 270, 390, 480, 630, 735], [400, 400, 430, 438, 430, 430], clamp);
  const blueX = interpolate(frame, [0, 270, 390, 480, 630, 735], [1080, 1080, 1040, 1030, 1040, 1040], clamp);
  const captionOpacity = interpolate(frame, [624, 640, 735], [0, 1, 1], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#F7EFD8', overflow: 'hidden', fontFamily: 'Arial, "Microsoft YaHei", sans-serif'}}>
      <ForestBoard />
      <div style={{position: 'absolute', left: 112, top: 68, fontSize: 36, fontWeight: 800, color: '#315B32', letterSpacing: 3, opacity: intro}}>情境导入</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 205, textAlign: 'center', fontSize: 43, fontWeight: 800, color: '#79502D', letterSpacing: 5, opacity: interpolate(frame, [20, 45, 240, 270], [0, .92, .92, 0], clamp)}}>大三角形 VS 小三角形</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 235, textAlign: 'center', fontSize: 25, color: '#A77A47', letterSpacing: 3, opacity: interpolate(frame, [25, 48, 240, 270], [0, .9, .9, 0], clamp)}}>谁的内角和更大？</div>
      <TriangleCharacter kind="orange" frame={frame} x={orangeX} y={335} size={475} />
      <TriangleCharacter kind="blue" frame={frame} x={blueX} y={465} size={350} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 90, display: 'flex', justifyContent: 'center', opacity: captionOpacity, transform: `translateY(${interpolate(question, [0, 1], [60, 0])}px) scale(${0.92 + question * 0.08})`}}>
        <div style={{padding: '22px 58px', borderRadius: 24, background: 'linear-gradient(180deg, #FFF2A9, #F9D66B)', border: '5px solid #DFAE4A', boxShadow: '0 12px 0 rgba(151,93,36,.18)', color: '#603B21', fontSize: 42, fontWeight: 900, letterSpacing: 2}}>
          听完辩论，你能提出什么数学问题？
        </div>
      </div>
      <div style={{position: 'absolute', right: 86, top: 76, color: '#8D754F', fontSize: 19, letterSpacing: 2, opacity: .72}}>数学探究 · 三角形</div>
    </AbsoluteFill>
  );
};
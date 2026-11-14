import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type VideoProps = {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
};

export const MainComposition: React.FC<VideoProps> = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = spring({frame: frame - 12, fps, config: {damping: 14, mass: 0.8}});
  const subtitle = spring({frame: frame - 34, fps, config: {damping: 16}});
  const glow = interpolate(frame, [0, 75, 150], [0.35, 0.8, 0.45], {extrapolateRight: 'clamp'});
  const drift = interpolate(frame, [0, 150], [-34, 34], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #08142f 0%, #112f62 55%, #071126 100%)',
      color: '#fff', fontFamily: 'Arial, "Microsoft YaHei", sans-serif', overflow: 'hidden',
    }}>
      <div style={{position: 'absolute', width: 680, height: 680, borderRadius: '50%',
        left: '58%', top: '48%', transform: `translate(-50%, -50%) translateX(${drift}px)`,
        background: 'radial-gradient(circle, rgba(49,142,255,0.55), rgba(49,142,255,0) 68%)',
        opacity: glow}} />
      <div style={{position: 'absolute', inset: 0, opacity: 0.14,
        backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)',
        backgroundSize: '72px 72px', maskImage: 'linear-gradient(90deg, transparent, black 70%)'}} />
      <div style={{position: 'absolute', left: '12%', top: '50%', transform: 'translateY(-50%)', width: '76%'}}>
        <div style={{fontSize: 25, letterSpacing: 8, color: '#8fcaff', marginBottom: 28,
          opacity: title, transform: `translateY(${interpolate(title, [0, 1], [24, 0])}px)`}}>MOTION GRAPHICS · REMOTION</div>
        <div style={{fontSize: 100, lineHeight: 1.08, fontWeight: 800, letterSpacing: 2,
          opacity: title, transform: `translateY(${interpolate(title, [0, 1], [35, 0])}px)`}}>让创意，动起来。</div>
        <div style={{fontSize: 36, color: '#c7d9f5', marginTop: 30, opacity: subtitle,
          transform: `translateY(${interpolate(subtitle, [0, 1], [24, 0])}px)`}}>Remotion × GitHub Actions 云端视频渲染</div>
        <div style={{height: 5, width: interpolate(frame, [30, 115], [0, 470], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          background: 'linear-gradient(90deg, #44d7ff, #6687ff)', borderRadius: 9, marginTop: 44}} />
      </div>
      <div style={{position: 'absolute', right: '8%', bottom: '8%', color: '#9fb6d8', fontSize: 20, letterSpacing: 3}}>VIDEO STUDIO / 001</div>
    </AbsoluteFill>
  );
};

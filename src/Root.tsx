import React from 'react';
import {Composition, CalculateMetadataFunction} from 'remotion';
import {MainComposition, VideoProps} from './MainComposition';
import {TriangleAngleSum} from './TriangleAngleSum';

const calculateMetadata: CalculateMetadataFunction<VideoProps> = async ({props}) => ({
  width: props.width,
  height: props.height,
  fps: props.fps,
  durationInFrames: props.durationInFrames,
});

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MainComposition"
      component={MainComposition}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{width: 1920, height: 1080, fps: 30, durationInFrames: 150}}
      calculateMetadata={calculateMetadata}
    />
    <Composition
      id="TriangleAngleSum"
      component={TriangleAngleSum}
      durationInFrames={735}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

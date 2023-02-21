import React from 'react';
import Svg, {
  Defs, ClipPath, Path, Image, G, Use,
} from 'react-native-svg';

function DewIcon(props) {
  return (
    <Svg
      width={35}
      height={35}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      overflow="hidden"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <Defs>
        <ClipPath id="adewIcon">
          <Path d="M0 0h96v96H0z" />
        </ClipPath>
        <ClipPath id="bdewIcon">
          <Path d="M0 0h1219200v1219200H0z" />
        </ClipPath>
        <ClipPath id="cdewIcon">
          <Path d="M0 0h1219200v1219200H0z" />
        </ClipPath>
        <Image
          width={35}
          height={35}
          xlinkHref="data:image/png;base64,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"
          preserveAspectRatio="none"
          id="ddewIcon"
        />
      </Defs>
      <G clipPath="url(#adewIcon)">
        <G clipPath="url(#bdewIcon)" transform="scale(.00008)">
          <G clipPath="url(#cdewIcon)">
            <Use
              width="100%"
              height="100%"
              xlinkHref="#ddewIcon"
              transform="scale(12700)"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default DewIcon;

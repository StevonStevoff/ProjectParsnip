/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Svg, {
  Defs, ClipPath, Path, Image, G, Use,
} from 'react-native-svg';

function TempIcon(props) {
  return (
    <Svg
      width={35}
      height={35}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      overflow="hidden"
      {...props}
    >
      <Defs>
        <ClipPath id="atempIcon">
          <Path d="M0 0h96v96H0z" />
        </ClipPath>
        <ClipPath id="btempIcon">
          <Path d="M0 0h1219200v1219200H0z" />
        </ClipPath>
        <ClipPath id="ctempIcon">
          <Path d="M0 0h1219200v1219200H0z" />
        </ClipPath>
        <Image
          width={35}
          height={35}
          xlinkHref="data:image/png;base64,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"
          preserveAspectRatio="none"
          id="dtempIcon"
        />
      </Defs>
      <G clipPath="url(#atempIcon)">
        <G clipPath="url(#btempIcon)" transform="scale(.00008)">
          <G clipPath="url(#ctempIcon)">
            <Use
              width="100%"
              height="100%"
              xlinkHref="#dtempIcon"
              transform="scale(12700)"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default TempIcon;

import React from 'react';
import Svg, {
  Defs, ClipPath, Path, Image, G, Use,
} from 'react-native-svg';

function LightIcon(props) {
  return (
    <Svg
      width={30}
      height={30}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      overflow="hidden"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <Defs>
        <ClipPath id="alightIcon">
          <Path d="M0 0h96v96H0z" />
        </ClipPath>
        <ClipPath id="blightIcon">
          <Path d="M0 0h1219200v1219200H0z" />
        </ClipPath>
        <ClipPath id="clightIcon">
          <Path d="M0 0h1219200v1219200H0z" />
        </ClipPath>
        <Image
          width={30}
          height={30}
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAIRlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAGCgAwAEAAAAAQAAAGAAAAAAWgkyTQAAAAlwSFlzAAALEwAACxMBAJqcGAAAC0JJREFUeAHtXGuMVdUV/s6dYRiwWhkQMFWsM6JFqYAdTGxEBcWitU36gzZpWiwWGLBpgyaN6Q8a2hhSbdNGWy0z2JLQH03pjyb6w6JjHfpIGx8MWpDShCkOVhAcoJU6MM7c02/tc4e53LvPOfs89p178KzkzJy7X2utb+33XmcDOeUI5AjkCOQI5AjkCOQI5AjkCOQI5AjkCOQI5AhkBAH357hHnoyIqxXT0YZmINB9HBPRiNfhoAHNmOusxOkMiF0lYqEqJCsBTXgIBVxNA7RhCN/OitiVcmayBbibMRuuqv3NJYXOoIh5zv3YX6lgvf/OZgtw8SRr/ij4gvFEtobNrsvQjFHmDMDav4Iw36HB+TZsxpc14XUdlKka4z6FFgxjHxGdrkXVxbtsCXOcDv7PCGWrBYzgh77gC+AOpnFs2JQR7JWYmWkB7pNYRIB38gmW2aUJgCXOOvRkwRDBytSJBm4nJmMEvWraaSKTiwOcFc13voFTJsnHM01j2sxZU58mUHv4/A6r8YrjqBqZlM0jxuALJ1kbNOBhvq1PyljNrLagnQb9Ap+5nOp+PmmZ5flTbwHcGniMAHxLMXFxjO89fLo5eD7NGnmknLnJO8tbwnTdLCOarNIVFbCMA/JzJnzK06jBfgS3swSZbX2Wz8dK8Y85a5MbtZxXNKXKc/q8c5q4jFHPaqKLhLCXSnUTmG68jR5nI80SQNxuuAgT8HfmmxWQzD/KxVtcLXyS2xQn/RMB7kZKNB0L+PeOEui3kueEqjwuDboOO6rCEwSkb4CtVPkMjlOmSSFynaCSf6LCO5nuj5xg9jpfZE9fRjTmVv78WllQnNdfsNauKs/obmcHdZyAA7dQhlspwyK+TylPo3kf5HKvJe09p9QNIIITOGn2SzVK+Ae5eI9gvMLnZQLyMhN+lM9T/hkixdzH1FL+QpYtTzvfL4xUAvA8DXlnxDyhyVMfhBVH6WaciAbwAFlMcBaHSh09wS9Lcnk541Q70ckC2VmIuXjBgqzjW6SMWxbIjgGOqsE2M9sBBrgO4DB2G6SLnCROYzRiwnFgOxMuN0ocloiLCbR8BJjGYWEK/1/I8b25CWhs8HIOc+w+PcRefhA4wbXXu/8Bjr/HwSisYOP47ez/v2ScOkJCO2OACCDdkJPQAJMnAq0zgVnce5tEwP2oiWrIc9FkztineqkGaZD+o8CBw4C8JyHHXpdq0wDP0wDxqIlT8Lmc+l8xAyjELEQMds1lwGyuoQ6+A+ztB4Y+iCfPiJ3+X4SJqZ2ZHlzFvkkO0RZRl18CzG/1arQZG7NUZ4aB1w4AhyIOTS76ufi6woxJ9FR2BuExOf489hryJjX9U1cBN16dPvjCeiIb+43XAAvaorUqWSxaJLsGMBW+gWJ8eg7wcXY5tknGlJvIS3iakJtlAxQMhJeaf9MngBlhOwEmaBmmmUleYnCT8cW0EhmyrkxmWA0qsxn+Xo03mHIgMLV0CbUEf1SY6RcD81pHf/n9H0CHOgL1i08cbtUA6iygqPZ19ILO4oBbi25Hz92b4l42zS9WptIvpXSe4cvDqgEUV9lc05EMivOu1MXUNkxaoEx7deQnuy5tzDD7BijwHEm3Ir2OMzs/xWMqEyubLOCuvdwvq3V8rK0D1GFKk/JiWFOlnSySlrWbDYJVmS0EFFlDdrwKvH9GV/hvWYU6eBR5QheZNMyKhXmIfjPPk3ZRuGrwReK2S+sHfJFHZkMyPdXTci4md5eORvUpEoSmagD3x5jETbgfsMsR9xF2rhqSNid7O/VGIpNs+unIW813U7dOdxsu0CWJG5aaASjcLXQeeY2CPMTHv9wWHkQFbazF1SRpPpFpSgC2nlPAGjq67FI+Skn5lfL7A2XIwN2Ki5UnBPAis8wOzSZbyvVKl3BtEEaeS/xOdrPb+ATMYcMK8uITGYACLOcB/H52N+KGYlaW7OfXK5nKJq3BxVc5OO8nBmuSeGWbgVYBGJm2scvZQSHk0CVahy6HKfVKUWVz6MvhopNe2S8SE+6nRKdIBmB300zgv0vL7yGrO6OzYw45yapXavZZkIXJK64tRfTSCBsEo7Dk5fHGBnC76LR0mme9wPfYACMxKWd49hjxnMA6+TF6xBlHHMHExfeJ0R5W0s+ZFmFsAFWgE+zJZso0TzeGgLEBnDXK1+cGZl1PS/PUOybJAXq9UjLZBqnWBnyA63iA/4ypij4rj+Ds7hOYyU9EH2W/9xV2R9HKWLrAOzwPZjE+sf99n/5v0stGph5isTbOR4LGLaBcJPFyptfxCnpYLmb4G+Vxoe/iOlKvFFU2F+9QlXtZ4xfHAV9giGWAUfzYLe1k/Z/P3+v5nBoND/wvfjv1Sqayieu7g1/RlVi6m21J1InWfQRw4vK8lUJ18bk9IBkwlVsRt10fmGTcIv/AnZQwI7j4B+VbRU+Jv6QhZ6IWUC4Am2Af1iqH3HtZP8Q9XU/isabf9tWnr1WoyHQyoHVKrQcr2AVoTwt8US01A0hhcnynmmQj5nFQ+r2EVZGocehYVfC4B/RTJpFNTwcZvIS6dTgr8D99knihqRpgVARnNb9MWYe72R11UClOLSpI3AXlEKReqFgE+iiTjqSvn4DrWet7dNFJw3geZ4dKh9ldXBUKjyfO4SK+muIu6H8Ick5y6z/6KIvef/RhzvY22ORvpQVUCMzjLw3tfTO+r6amuNhB4rK475A+u9fv6+NSCq2FARZqZR2i4rv7tFE1Deylv6if0658zmSZrBqgtE/e7quDOMr2HfGNth4hY9G/A5x1C1iYZK/fRH6rBsAWXEshSg77PuJIK3h7wCfSYvAROjm8/q8wBlO52z8nLFGSeLsGKKrPP4PlYxXDS/8EBJBa0WEuU/7G9ZTJTMz7hNWaZHYNYCr8CKeBf91Xm+5Iuh0BX3iakGNQiUzK8UljbRpa4nezD9/qYKmNMiAe4073gtb0veZkoN3F7i6oz6+WShZni3TBaYWlthdUKZDaGyrw1pI4JH6jc2YBV87gWj1hI1WLLM7z9/VztsOZVxwqok1ttcTJG5LHXguI+qF2uaAyN5fBef9bnhedfLYkH+xFIdnbke0FWeHqF1nmpTWoSzu6zDOYp7RpgOBdURMZBbg9XLDJok1cRsRvx+8z1UECfuq0t5t59KS3sZbWboerdnitGMBKF6RuH5nBwwq5Quz8oAFetDPd2cgtxpQpYQfrI41c/XL+gC9KTsWl6uDJR+H4wXYMEHYoE1/e8ctZVONA6vztjAH6ez2Dha+8rmaY/viNyrtgUnBGg1gXK9kiT/GJf12Np9OjBtwiJUl9DFCeYeld2PRNavN4JI2qE3fJQUp58Hl9YRP3/5dR2WfLFS69R7+yTI6+O1VZn9GUZxJ0UB2mfJ2XNQWQmjSM05Vl6XdBLu4ibB4lvLRPDnXcn+I+griXBXIOGonk27SVTgj4UmJpdvMqX+V5xPfSPoe68WMmPqnRKFSpFWjj2kpxASeYnZGEdPATnmY9GCmPJrHajs7StZUaHRIHKRA6Vc1balSYuI4M4gbnQf6tc7IzDU1ZaXW+TNc/FmsCqCyWVmUBfIEpEwYQQUubYZvkPZAcbEnTbyeQVwqRmTGA0rWFDsGeZ5pedfHVHMF39JH1GZopA/Bi1yE6BK+lEfTbbA4eYEup4dFacqNmygCirnIILuA3GtWf44Lr15rwug7KnAEUmsN4gP+553yWBrn2uP/srwy9ZNIA6hZ2h9+qjdEmzvnjnb6NlTEub5k0gELqMH7G/3s5Ghzgpdo/Ghf0PuxM+eXmXfxK/54POw65/jkCOQI5AjkCOQI5AjkCOQI5AjkCOQI5AjkC2UHg/25HygEisghLAAAAAElFTkSuQmCC"
          preserveAspectRatio="none"
          id="dlightIcon"
        />
      </Defs>
      <G clipPath="url(#alightIcon)">
        <G clipPath="url(#blightIcon)" transform="scale(.00008)">
          <G clipPath="url(#clightIcon)">
            <Use
              width="100%"
              height="100%"
              transform="translate(0, 0)"
              xlinkHref="#dlightIcon"
          
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default LightIcon;

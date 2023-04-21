/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-plusplus */
import { Box, Icon } from 'native-base';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const keywordToIconComponent = {
  temperature: (
    <Box size={9} alignItems="center" justifyContent="center">
      <Icon as={FontAwesome5} name="thermometer-half" size="5" paddingLeft={1} />
    </Box>
  ),
  humidity: (
    <Box size={35} alignItems="center" justifyContent="center">
      <Icon as={MaterialCommunityIcons} name="water-percent" size="30" />
    </Box>
  ),
  'soil moisture': (
    <Box size={9} alignItems="center" justifyContent="center">
      <Icon as={Ionicons} name="water-outline" size="6" />
    </Box>
  ),
  light: (
    <Box size={9} alignItems="center" justifyContent="center">
      <Icon as={MaterialCommunityIcons} name="weather-sunny" size="8" />
    </Box>
  ),
};

const getIconComponent = (description) => {
  const descriptionLower = description.toLowerCase();
  const keywords = Object.keys(keywordToIconComponent);
  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    if (descriptionLower.includes(keyword)) {
      return keywordToIconComponent[keyword];
    }
  }
  return null;
};

export default getIconComponent;

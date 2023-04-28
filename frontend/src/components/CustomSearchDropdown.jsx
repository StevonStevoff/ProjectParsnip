import React, { useState, useMemo, useEffect } from 'react';
import {
  ScrollView, TouchableOpacity, View,
} from 'react-native';
import {
  Icon, Text, Input, Pressable,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

function CustomSearchDropdown({
  data, setReturnItemId, choosePlaceholder, searchPlaceholder,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [foundLength, setFoundLength] = useState('');
  const [selectedItem, setSelectedItem] = useState(choosePlaceholder);

  const filteredItems = useMemo(
    () => data.filter((plantp) => plantp.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [data, searchTerm],
  );

  useEffect(() => {
    setFoundLength(filteredItems.length);
  }, [filteredItems]);

  const handleItemPress = (chosenItem) => {
    setReturnItemId(chosenItem.id);
    setSelectedItem(chosenItem.name);
    setSearchTerm(chosenItem.name);
    setShowDropdown(false);
  };

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Input
          placeholder={showDropdown ? `Search for a ${searchPlaceholder}` : selectedItem}
          value={searchTerm}
          onChangeText={(text) => {
            setSearchTerm(text);
          }}
          style={{ flex: 1, padding: 10 }}
          w="100%"
          size="2xl"
          marginBottom="2%"
          InputLeftElement={showDropdown ? <Icon as={<MaterialIcons name="search" />} size={5} ml="2" color="muted.400" /> : null}
          InputRightElement={(
            <Pressable onPress={() => { setSearchTerm(''); setShowDropdown(!showDropdown); }}>
              <Icon as={MaterialIcons} name={showDropdown ? 'arrow-drop-up' : 'arrow-drop-down'} color="coolGray.800" _dark={{ color: 'warmGray.50' }} size={8} />
            </Pressable>
            )}
          isDisabled={showDropdown === false}
        />
      </View>

      {showDropdown && (
      <ScrollView style={{ maxHeight: 100, color: 'green' }}>
        {
                  filteredItems.map((chosenItem) => (
                    <View
                      style={{
                        flexDirection: 'row', width: '100%', borderBottomWidth: 1, padding: 5,
                      }}
                      key={chosenItem.id}
                    >
                      <TouchableOpacity
                        onPress={() => handleItemPress(chosenItem)}
                        style={{ flex: 9 }}
                      >
                        <Text fontSize={16} style={{ width: '100%' }}>{chosenItem.name}</Text>
                      </TouchableOpacity>
                      {selectedItem === chosenItem.name && <Icon as={MaterialIcons} name="check" color="coolGray.800" _dark={{ color: 'warmGray.50' }} size={6} />}
                    </View>
                  ))
                }
      </ScrollView>
      )}
      {searchTerm.length > 0 && foundLength < 1 && showDropdown && (
        <Text style={{ color: 'red', marginBottom: 8 }}>
          No results found
        </Text>
      )}
    </View>
  );
}

export default CustomSearchDropdown;

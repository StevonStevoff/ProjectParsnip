import { View } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {
  Avatar, VStack, Center, Text, Icon, Pressable,
} from 'native-base';

function ProfilePicture({
  name, username, profilePic, setEditMode, editMode,
}) {
  return (
    <View style={{
      width: '100%', maxHeight: '30%', height: '40%', flex: 1, justifyContent: 'center', alignItems: 'center',
    }}
    >
      <VStack
        space={3}
        alignItems={{
          base: 'center',
          md: 'flex-start',
        }}
      >
        <Center>
          <Avatar
            bg="primary.600"
            alignSelf="center"
            size="2xl"
            source={{
              uri: profilePic,
            }}
          >
            <Avatar.Badge bg="white" alignItems="center">
              {!editMode ? (
                <Pressable
                  testID="edit-profile-button"
                  onPress={() => setEditMode(!editMode)}
                >
                  <Icon
                    as={MaterialCommunityIcons}
                    name="pencil-circle"
                    color="primary.600"
                    size="3xl"
                    style={{ top: '-23%', marginTop: '-18%' }}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={() => console.log('open new page to add image')}>
                  <Icon
                    as={MaterialIcons}
                    name="add-circle"
                    color="primary.800"
                    size="3xl"
                    style={{ top: '-23%', marginTop: '-18%' }}
                  />
                </Pressable>
              )}
            </Avatar.Badge>
          </Avatar>
          <Text fontSize="3xl" fontWeight="700">{name}</Text>
          <Text fontSize="3xl" color="primary.800" bold>
            @
            {username}
          </Text>
        </Center>
      </VStack>
    </View>
  );
}

export default ProfilePicture;

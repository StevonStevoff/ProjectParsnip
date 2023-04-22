/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { useState, useRef, useEffect } from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import {
  Avatar, VStack, Center, Text, Icon, Pressable,
} from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AuthUtils from '../api/utils/AuthUtils';

function ProfilePicture({
  name, username, profilePic, setEditMode, editMode, setUser,
}) {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const uploadImage = async (imageUri) => {
    setIsLoading(true);
    let blobImage;

    if (Platform.OS === 'web') {
      const response = await fetch(imageUri);
      blobImage = await response.blob();
    } else {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      blobImage = new Blob([new Uint8Array(Buffer.from(base64Image, 'base64'))], { type: 'image/png' });
    }

    await AuthUtils.updateProfilePicture(blobImage)
      .then(() => {
        console.log('Image uploaded successfully');
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        AuthUtils.getUserInfo().then((userDetails) => {
          setUser(userDetails);
        }).finally(() => {
          setImage(null);
          setEditMode(false);
          setIsLoading(false);
        });
      });
  };
  useEffect(() => {
    if (image) {
      uploadImage(image);
    }
  }, [image]);

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleClick = () => {
    if (Platform.OS === 'web') {
      fileInputRef.current.click();
    } else {
      pickImage();
    }
  };
  if (isLoading) {
    return (
      <Center>
        <ActivityIndicator size="large" color="#0000ff" />
      </Center>
    );
  }
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
                <>
                  {Platform.OS === 'web' && (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileInput(e)}
                    style={{ display: 'none' }}
                  />
                  )}
                  <Pressable onPress={handleClick}>
                    <Icon
                      as={MaterialIcons}
                      name="add-circle"
                      color="primary.800"
                      size="3xl"
                      style={{ top: '-23%', marginTop: '-18%' }}
                    />
                  </Pressable>
                </>
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

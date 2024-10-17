import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions, 
  Animated, 
  PanResponder, 
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import { Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const videoRef = useRef(null);

  const videos = [
    { 
      id: 1, 
      uri: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
      username: 'user123',
      description: 'Check out this cool video! #fun #viral',
      likes: '1.2M'
    },
    { 
      id: 2, 
      uri: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
      username: 'creator456',
      description: 'Another awesome moment #trending',
      likes: '890K'
    },
    // { 
    //   id: 3,
    //   uri: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    //   username: 'videomaker789',
    //   description: 'Living my best life! #lifestyle',
    //   likes: '2.1M'
    // },
     {
     id: 4, 
      uri: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
      username: 'user123',
      description: 'Check out this cool video! #fun #viral',
      likes: '1.2M'
     },
    {
      id: 5, 
      uri: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
      username: 'creator456',
      description: 'Another awesome moment #trending',
      likes: '890K'
    },
    {
      id: 6,
      uri: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
      username: 'fitness_freak',
      description: 'Push your limits! 💪 #fitness #motivation',
      likes: '2.7M'
    },
    // {
    //   id: 7,
    //   uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    //   username: 'creative_soul',
    //   description: 'Art in motion 🎨 #creative #inspiration',
    //   likes: '2.3M'
    // },
    {
    id: 7,
    uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    username: 'foodie_101',
    description: 'Delicious recipes for everyone 🍳 #cooking #foodie',
    likes: '4.2M'
  },
  {
    id: 8,
    uri: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
    username: 'music_lover',
    description: 'Feel the rhythm 🎵 #music #vibes',
    likes: '5.6M'
  }
  ];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    position.setValue({ x: 0, y: 0 });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const renderTopBar = () => (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.topBarButton}>
        <Ionicons name="settings-outline" size={28} color="white" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>VideoSwipe</Text>
      </View>
      <TouchableOpacity style={styles.topBarButton}>
        <Ionicons name="person-circle-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.bottomBarButton} onPress={() => forceSwipe('left')}>
        <View style={[styles.actionButton, styles.rejectButton]}>
          <Ionicons name="close" size={30} color="#F06795" />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.bottomBarButton}>
        <View style={[styles.actionButton, styles.superLikeButton]}>
          <Ionicons name="star" size={30} color="#64EDCC" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.bottomBarButton} onPress={() => forceSwipe('right')}>
        <View style={[styles.actionButton, styles.acceptButton]}>
          <Ionicons name="heart" size={30} color="#6CD069" />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderVideoInfo = () => {
    const currentVideo = videos[currentIndex];
    return (
      <View style={styles.videoInfo}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.username}>@{currentVideo?.username}</Text>
          <View style={styles.statsContainer}>
            <Ionicons name="heart" size={20} color="white" />
            <Text style={styles.likesText}>{currentVideo?.likes}</Text>
          </View>
        </View>
        <Text style={styles.description}>{currentVideo?.description}</Text>
      </View>
    );
  };

  const renderVideo = () => {
    if (currentIndex >= videos.length) {
      return (
        <View style={styles.endMessage}>
          <Text style={styles.endMessageText}>No more videos to show</Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => setCurrentIndex(0)}
          >
            <Text style={styles.resetButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Animated.View
        style={[styles.videoContainer, getCardStyle()]}
        {...panResponder.panHandlers}
      >
        <Video
          ref={videoRef}
          source={{ uri: videos[currentIndex].uri }}
          style={styles.video}
          shouldPlay={true}
          isLooping={true}
          resizeMode="cover"
        />
        {renderVideoInfo()}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {renderTopBar()}
        {renderVideo()}
        {renderBottomBar()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: '100%',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    zIndex: 1,
  },
  topBarButton: {
    padding: 8,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rejectButton: {
    backgroundColor: 'white',
  },
  acceptButton: {
    backgroundColor: 'white',
  },
  superLikeButton: {
    backgroundColor: 'white',
  },
  videoInfo: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    right: 10,
    padding: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  description: {
    color: 'white',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  endMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  endMessageText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#6CD069',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ref, push, onValue, set } from 'firebase/database';
import { db } from '../services/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

export function CommentSection({ eventId }: { eventId: string }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ User is logged in:', user.email);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } else {
        console.log('⚠️ No user is logged in');
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    });

    const commentsRef = ref(db, `food_events/${eventId}/comments`);
    console.log(`📡 Listening to comments at path: food_events/${eventId}/comments`);

    const unsubscribeDB = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📥 Firebase comment snapshot:', data);

      if (data) {
        const loadedComments = Object.entries(data).map(([id, val]: any) => ({
          id,
          ...val,
        }));
        console.log('✅ Loaded comments:', loadedComments);
        setComments(loadedComments.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        console.log('ℹ️ No comments found.');
        setComments([]);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDB();
    };
  }, [eventId]);

  const handlePostComment = async () => {
    if (!currentUser) {
      alert('Please login to post a comment.');
      console.log('❌ Cannot post: no current user');
      return;
    }
  
    if (!comment.trim()) {
      console.log('⚠️ Empty comment ignored');
      return;
    }
  
    try {
      const newCommentRef = push(ref(db, `food_events/${eventId}/comments`));
      const commentData = {
        userId: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email,
        text: comment.trim(),
        timestamp: Date.now(),
      };
  
      console.log('📤 Posting comment:', commentData);
      await set(newCommentRef, commentData);
      console.log('✅ Comment posted successfully');
      setComment('');
    } catch (error) {
      console.error('❌ Failed to post comment:', error);
    }
  };

  const renderComment = ({ item }: { item: any }) => {
    console.log('🖨️ Rendering comment:', item);
    return (
      <View style={styles.commentBox}>
        <Text style={styles.commentAuthor}>{item.displayName}</Text>
        <Text>{item.text}</Text>
        <Text style={styles.timestamp}>{moment(item.timestamp).fromNow()}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      
      keyboardVerticalOffset={Platform.OS === 'android' ? 80 : 0} 
      style={styles.container}
    >
      <Text style={styles.heading}>Comments</Text>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        style={{ marginBottom: 10 }}
        keyboardShouldPersistTaps="handled"
      />
  
      <TextInput
        placeholder="Write a comment..."
        value={comment}
        onChangeText={setComment}
        multiline
        style={styles.input}
      />

      {isLoggedIn ? (
        <Button title="Post Comment" onPress={handlePostComment} />
      ) : (
        <Button
          title="Log in to Post Comment"
          onPress={() => {
            console.log('🔐 Redirecting to login screen');
            navigation.navigate('Login');
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 25,
    paddingHorizontal: 10,
    flex: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    height: 100,
    outlineColor: '#ccc',
  },
  commentBox: {
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 1,
  },
  commentAuthor: {
    fontWeight: '600',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
});

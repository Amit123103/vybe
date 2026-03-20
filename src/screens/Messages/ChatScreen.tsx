import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Screen } from '../../components/layout/Screen';
import { AppHeader } from '../../components/layout/AppHeader';
import { ChatBubble } from '../../components/messaging/ChatBubble';
import { ChatInput } from '../../components/messaging/ChatInput';
import { VybeLoader } from '../../components/common/VybeLoader';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Message } from '../../types/message.types';
import { FeedStackParamList } from '../../types/navigation.types';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

type ChatRoute = RouteProp<FeedStackParamList, 'Chat'>;

export const ChatScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<ChatRoute>();
  const { conversationId, recipientName } = route.params;
  const { user } = useAuth();
  const {
    messages,
    isLoading,
    otherUserTyping,
    sendMessage,
    handleTyping,
    loadEarlierMessages,
    hasEarlier,
  } = useChat(conversationId);

  const handleSend = useCallback(
    async (text: string) => {
      await sendMessage({ content: text });
    },
    [sendMessage],
  );

  const handleMediaPress = useCallback(() => {
    // Open media picker
  }, []);

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => (
      <ChatBubble
        content={item.content}
        isSent={item.sender.id === user?.id}
        time={item.createdAt}
        status={item.status}
      />
    ),
    [user],
  );

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={recipientName}
        leftIcon={<Text style={{ color: colors.textPrimary, fontSize: 20 }}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      {isLoading ? (
        <VybeLoader fullScreen />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted
          onEndReached={hasEarlier ? loadEarlierMessages : undefined}
          onEndReachedThreshold={0.3}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            otherUserTyping ? (
              <View style={styles.typingContainer}>
                <Text style={[styles.typingText, { color: colors.textMuted }]}>
                  {recipientName} is typing...
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <ChatInput
        onSend={handleSend}
        onTyping={handleTyping}
        onMediaPress={handleMediaPress}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  messagesList: {
    paddingVertical: spacing.sm,
  },
  typingContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  typingText: {
    fontSize: typography.caption.fontSize,
    fontStyle: 'italic',
  },
});

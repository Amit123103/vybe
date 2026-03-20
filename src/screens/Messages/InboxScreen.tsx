import React, { useCallback } from 'react';
import { FlatList, TextInput, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/layout/Screen';
import { AppHeader } from '../../components/layout/AppHeader';
import { ConversationItem } from '../../components/messaging/ConversationItem';
import { VybeLoader } from '../../components/common/VybeLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { useConversations } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Conversation } from '../../types/message.types';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const InboxScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { conversations, isLoading } = useConversations();
  const [search, setSearch] = React.useState('');

  const filteredConversations = conversations.filter((c) =>
    c.participants.some((p) =>
      p.displayName.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const renderConversation = useCallback(
    ({ item }: { item: Conversation }) => (
      <ConversationItem
        conversation={item}
        currentUserId={user?.id || ''}
        onPress={() => {
          const recipient = item.participants.find((p) => p.id !== user?.id);
          (navigation as any).navigate('Chat', {
            conversationId: item.id,
            recipientName: recipient?.displayName || 'User',
            userId: recipient?.id,
          });
        }}
      />
    ),
    [user, navigation],
  );

  return (
    <Screen>
      <AppHeader
        title="Messages"
        leftIcon={<Text style={{ color: colors.textPrimary, fontSize: 20 }}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.bgTertiary }]}>
          <Text style={{ fontSize: 14 }}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search conversations..."
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
        </View>
      </View>

      {isLoading ? (
        <VybeLoader fullScreen />
      ) : filteredConversations.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No messages yet"
          subtitle="Start a conversation with someone"
        />
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    height: 40,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body2.fontSize,
  },
});

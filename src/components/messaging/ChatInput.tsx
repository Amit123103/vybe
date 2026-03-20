import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { CHAT_CONFIG } from '../../constants/config';

interface ChatInputProps {
  onSend: (text: string) => void;
  onTyping: () => void;
  onMediaPress: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onTyping, onMediaPress }) => {
  const { colors } = useTheme();
  const { lightImpact } = useHaptics();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (trimmed) {
      lightImpact();
      onSend(trimmed);
      setText('');
    }
  }, [text, onSend, lightImpact]);

  const handleChangeText = useCallback(
    (value: string) => {
      if (value.length <= CHAT_CONFIG.maxMessageLength) {
        setText(value);
        onTyping();
      }
    },
    [onTyping],
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bgSecondary,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.sm,
        },
      ]}
    >
      {/* Media */}
      <TouchableOpacity
        onPress={onMediaPress}
        style={styles.mediaButton}
        accessibilityLabel="Attach media"
      >
        <Text style={styles.mediaIcon}>📎</Text>
      </TouchableOpacity>

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.bgTertiary }]}>
        <TextInput
          value={text}
          onChangeText={handleChangeText}
          placeholder="Message..."
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.textPrimary }]}
          multiline
          maxLength={CHAT_CONFIG.maxMessageLength}
        />
      </View>

      {/* Send */}
      <TouchableOpacity
        onPress={handleSend}
        style={[
          styles.sendButton,
          { backgroundColor: text.trim() ? colors.primary : colors.bgTertiary },
        ]}
        disabled={!text.trim()}
        accessibilityLabel="Send message"
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.sendIcon,
            { color: text.trim() ? '#FFFFFF' : colors.textMuted },
          ]}
        >
          ↑
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    gap: 8,
  },
  mediaButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaIcon: {
    fontSize: 22,
  },
  inputContainer: {
    flex: 1,
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 120,
  },
  input: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    lineHeight: 20,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
});

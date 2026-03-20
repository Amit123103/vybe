import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen } from '../../components/layout/Screen';
import { VybeInput } from '../../components/common/VybeInput';
import { VybeButton } from '../../components/common/VybeButton';
import { VybeCard } from '../../components/common/VybeCard';
import { VybeChip } from '../../components/common/VybeChip';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useDebounce } from '../../hooks/useDebounce';
import { registerFormSchema, RegisterFormData, getPasswordStrength } from '../../utils/validators';
import { authService } from '../../services/authService';
import { INTERESTS, AUTH_CONFIG } from '../../constants/config';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const RegisterScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      displayName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const password = watch('password');
  const username = watch('username');
  const debouncedUsername = useDebounce(username, 500);

  // Check username availability
  React.useEffect(() => {
    if (debouncedUsername && debouncedUsername.length >= 3) {
      setCheckingUsername(true);
      authService
        .checkUsername(debouncedUsername)
        .then((res) => setUsernameAvailable(res.available))
        .catch(() => setUsernameAvailable(null))
        .finally(() => setCheckingUsername(false));
    } else {
      setUsernameAvailable(null);
    }
  }, [debouncedUsername]);

  const passwordStrength = getPasswordStrength(password || '');

  const toggleInterest = useCallback((interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    try {
      clearError();
      await registerUser({
        displayName: data.displayName,
        username: data.username,
        email: data.email,
        password: data.password,
        interests: selectedInterests,
      });
    } catch {
      // Error handled in store
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            {step === 2 && (
              <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
                <Text style={[styles.backText, { color: colors.textSecondary }]}>← Back</Text>
              </TouchableOpacity>
            )}
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {step === 1 ? 'Create Account' : 'Pick Your Vibes'}
            </Text>
            <Text style={[styles.stepIndicator, { color: colors.textMuted }]}>
              Step {step} of 2
            </Text>
          </View>

          {step === 1 ? (
            <VybeCard variant="glass" padding="lg">
              {error && (
                <View style={[styles.errorBanner, { backgroundColor: 'rgba(255,82,82,0.1)' }]}>
                  <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                </View>
              )}

              <Controller
                control={control}
                name="displayName"
                render={({ field: { onChange, value } }) => (
                  <VybeInput
                    label="Full Name"
                    placeholder="Enter your name"
                    value={value}
                    onChangeText={onChange}
                    error={errors.displayName?.message}
                    leftIcon={<Text style={{ fontSize: 16 }}>👤</Text>}
                  />
                )}
              />

              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <VybeInput
                    label="Username"
                    placeholder="@yourhandle"
                    value={value}
                    onChangeText={onChange}
                    error={errors.username?.message}
                    autoCapitalize="none"
                    leftIcon={<Text style={{ fontSize: 16 }}>@</Text>}
                    rightIcon={
                      checkingUsername ? (
                        <Text>⏳</Text>
                      ) : usernameAvailable === true ? (
                        <Text style={{ color: colors.success }}>✓</Text>
                      ) : usernameAvailable === false ? (
                        <Text style={{ color: colors.error }}>✕</Text>
                      ) : null
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <VybeInput
                    label="Email"
                    placeholder="your@email.com"
                    value={value}
                    onChangeText={onChange}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={<Text style={{ fontSize: 16 }}>📧</Text>}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <VybeInput
                    label="Password"
                    placeholder="Create a strong password"
                    value={value}
                    onChangeText={onChange}
                    error={errors.password?.message}
                    secureTextEntry
                    leftIcon={<Text style={{ fontSize: 16 }}>🔒</Text>}
                  />
                )}
              />

              {/* Password Strength */}
              {password && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBars}>
                    {[1, 2, 3, 4].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor:
                              level <= passwordStrength.score
                                ? passwordStrength.color
                                : colors.bgTertiary,
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <VybeInput
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    value={value}
                    onChangeText={onChange}
                    error={errors.confirmPassword?.message}
                    secureTextEntry
                    leftIcon={<Text style={{ fontSize: 16 }}>🔒</Text>}
                  />
                )}
              />

              <VybeButton
                title="Continue"
                onPress={handleSubmit(onSubmit)}
                fullWidth
                style={styles.submitButton}
              />
            </VybeCard>
          ) : (
            <View>
              <Text style={[styles.interestsSubtitle, { color: colors.textSecondary }]}>
                Select at least {AUTH_CONFIG.minInterests} interests
              </Text>
              <View style={styles.interestsGrid}>
                {INTERESTS.map((interest) => (
                  <VybeChip
                    key={interest}
                    label={interest}
                    selected={selectedInterests.includes(interest)}
                    onPress={() => toggleInterest(interest)}
                    style={styles.interestChip}
                  />
                ))}
              </View>
              <VybeButton
                title="Create Account"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={selectedInterests.length < AUTH_CONFIG.minInterests}
                fullWidth
                style={styles.submitButton}
              />
            </View>
          )}

          {step === 1 && (
            <View style={styles.loginRow}>
              <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                <Text style={[styles.loginLink, { color: colors.primary }]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.sm,
  },
  backText: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontFamily: typography.h1.fontFamily,
    fontWeight: '700',
  },
  stepIndicator: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    marginTop: 4,
  },
  errorBanner: {
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: typography.body2.fontSize,
    textAlign: 'center',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  strengthBars: {
    flexDirection: 'row',
    flex: 1,
    gap: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  interestsSubtitle: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    marginBottom: spacing.md,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  interestChip: {
    marginBottom: 4,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    fontSize: typography.body2.fontSize,
  },
  loginLink: {
    fontSize: typography.body2.fontSize,
    fontWeight: '700',
  },
});

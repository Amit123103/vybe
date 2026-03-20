import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../components/layout/Screen';
import { VybeInput } from '../../components/common/VybeInput';
import { VybeButton } from '../../components/common/VybeButton';
import { VybeCard } from '../../components/common/VybeCard';
import { VybeDivider } from '../../components/common/VybeDivider';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { loginFormSchema, LoginFormData } from '../../utils/validators';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const LoginScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data.email, data.password);
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
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>VYBE</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Welcome back
            </Text>
          </View>

          {/* Form */}
          <VybeCard variant="glass" padding="lg">
            {error && (
              <View style={[styles.errorBanner, { backgroundColor: 'rgba(255,82,82,0.1)' }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            )}

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
                  autoComplete="email"
                  shake={!!errors.email}
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
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  shake={!!errors.password}
                  leftIcon={<Text style={{ fontSize: 16 }}>🔒</Text>}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Text style={{ fontSize: 16 }}>{showPassword ? '👁️' : '🙈'}</Text>
                    </TouchableOpacity>
                  }
                />
              )}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword' as never)}
              style={styles.forgotButton}
            >
              <Text style={[styles.forgotText, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <VybeButton
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              fullWidth
              style={styles.submitButton}
            />

            <View style={styles.dividerRow}>
              <VybeDivider style={styles.dividerLine} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>
                or continue with
              </Text>
              <VybeDivider style={styles.dividerLine} />
            </View>

            {/* Social Login */}
            <View style={styles.socialRow}>
              <VybeButton
                title="Google"
                onPress={() => {}}
                variant="secondary"
                icon={<Text style={{ fontSize: 18 }}>G</Text>}
                style={styles.socialButton}
              />
              <VybeButton
                title="Apple"
                onPress={() => {}}
                variant="secondary"
                icon={<Text style={{ fontSize: 18 }}>🍎</Text>}
                style={styles.socialButton}
              />
            </View>
          </VybeCard>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FF3CAC',
    letterSpacing: 8,
    fontFamily: typography.displayXL.fontFamily,
  },
  subtitle: {
    fontSize: typography.body1.fontSize,
    fontFamily: typography.body1.fontFamily,
    marginTop: spacing.sm,
  },
  errorBanner: {
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    textAlign: 'center',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotText: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    fontWeight: '500',
  },
  submitButton: {
    marginBottom: spacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    marginVertical: 0,
  },
  dividerText: {
    marginHorizontal: spacing.sm,
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  socialButton: {
    flex: 1,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  registerText: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
  },
  registerLink: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    fontWeight: '700',
  },
});

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { useTheme } from '../../hooks/useTheme';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from '../../utils/validators';
import { authService } from '../../services/authService';
import { AUTH_CONFIG } from '../../constants/config';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const ForgotPasswordScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleSendOtp = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmail(data.email);
      setStep('otp');
      startResendTimer();
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(AUTH_CONFIG.otpResendDelay);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '')) {
      verifyOtp(newOtp.join(''));
    }
  };

  const verifyOtp = async (code: string) => {
    setIsLoading(true);
    try {
      const result = await authService.verifyOtp(email, code);
      setResetToken(result.resetToken);
      setStep('reset');
    } catch {
      setOtp(['', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(resetToken, data.password);
      setStep('success');
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
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
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={[styles.backText, { color: colors.textSecondary }]}>← Back</Text>
          </TouchableOpacity>

          {step === 'email' && (
            <VybeCard variant="glass" padding="lg">
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Forgot Password?
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Enter your email and we'll send you a code to reset your password.
              </Text>
              <Controller
                control={emailForm.control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <VybeInput
                    label="Email"
                    placeholder="your@email.com"
                    value={value}
                    onChangeText={onChange}
                    error={emailForm.formState.errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
              <VybeButton
                title="Send OTP"
                onPress={emailForm.handleSubmit(handleSendOtp)}
                loading={isLoading}
                fullWidth
              />
            </VybeCard>
          )}

          {step === 'otp' && (
            <VybeCard variant="glass" padding="lg">
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Enter Code
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                We sent a {AUTH_CONFIG.otpLength}-digit code to {email}
              </Text>
              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => { otpRefs.current[index] = ref; }}
                    style={[
                      styles.otpInput,
                      {
                        backgroundColor: colors.bgTertiary,
                        borderColor: digit ? colors.primary : colors.border,
                        color: colors.textPrimary,
                      },
                    ]}
                    value={digit}
                    onChangeText={(val) => handleOtpChange(val, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                  />
                ))}
              </View>
              {resendTimer > 0 ? (
                <Text style={[styles.resendText, { color: colors.textMuted }]}>
                  Resend in {resendTimer}s
                </Text>
              ) : (
                <TouchableOpacity onPress={() => {
                  authService.forgotPassword(email);
                  startResendTimer();
                }}>
                  <Text style={[styles.resendLink, { color: colors.primary }]}>
                    Resend Code
                  </Text>
                </TouchableOpacity>
              )}
            </VybeCard>
          )}

          {step === 'reset' && (
            <VybeCard variant="glass" padding="lg">
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                New Password
              </Text>
              <Controller
                control={resetForm.control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <VybeInput
                    label="New Password"
                    placeholder="Enter new password"
                    value={value}
                    onChangeText={onChange}
                    error={resetForm.formState.errors.password?.message}
                    secureTextEntry
                  />
                )}
              />
              <Controller
                control={resetForm.control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <VybeInput
                    label="Confirm Password"
                    placeholder="Re-enter password"
                    value={value}
                    onChangeText={onChange}
                    error={resetForm.formState.errors.confirmPassword?.message}
                    secureTextEntry
                  />
                )}
              />
              <VybeButton
                title="Reset Password"
                onPress={resetForm.handleSubmit(handleResetPassword)}
                loading={isLoading}
                fullWidth
              />
            </VybeCard>
          )}

          {step === 'success' && (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Password Reset!
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Your password has been successfully reset.
              </Text>
              <VybeButton
                title="Back to Login"
                onPress={() => navigation.navigate('Login' as never)}
                fullWidth
                style={{ marginTop: spacing.lg }}
              />
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
  backButton: {
    marginBottom: spacing.lg,
  },
  backText: {
    fontSize: typography.body2.fontSize,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontFamily: typography.h2.fontFamily,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: spacing.lg,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    fontSize: 24,
    fontWeight: '700',
  },
  resendText: {
    textAlign: 'center',
    fontSize: typography.body2.fontSize,
  },
  resendLink: {
    textAlign: 'center',
    fontSize: typography.body2.fontSize,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
});

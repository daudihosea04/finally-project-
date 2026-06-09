import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Terms = () => {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Terms of <span style={{ color: colors.primary }}>Service</span>
          </h1>
          <p className="text-xl" style={{ color: colors.textSecondary }}>Last updated: June 2026</p>
        </div>

        <div className="glass-card p-8 rounded-2xl" style={{ border: `1px solid ${colors.border}` }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>1. Acceptance of Terms</h2>
          <p className="mb-6" style={{ color: colors.textSecondary }}>By using UCC Connect Hub, you agree to these terms and conditions. If you do not agree, please do not use the platform.</p>

          <h2 className="text-2xl font-bold mb-4 mt-8" style={{ color: colors.textPrimary }}>2. User Accounts</h2>
          <p className="mb-6" style={{ color: colors.textSecondary }}>You are responsible for maintaining the security of your account and password. UCC Connect Hub cannot be held liable for any loss or damage arising from your failure to comply with this security obligation.</p>

          <h2 className="text-2xl font-bold mb-4 mt-8" style={{ color: colors.textPrimary }}>3. Acceptable Use</h2>
          <p className="mb-6" style={{ color: colors.textSecondary }}>Users must not misuse the platform, harass others, post inappropriate content, or violate academic policies. UCC Connect Hub reserves the right to suspend or terminate accounts that violate these terms.</p>

          <h2 className="text-2xl font-bold mb-4 mt-8" style={{ color: colors.textPrimary }}>4. Academic Integrity</h2>
          <p className="mb-6" style={{ color: colors.textSecondary }}>All submitted assignments must be the student's own work. Plagiarism and cheating will be reported to academic authorities.</p>

          <h2 className="text-2xl font-bold mb-4 mt-8" style={{ color: colors.textPrimary }}>5. Privacy and Data Protection</h2>
          <p className="mb-6" style={{ color: colors.textSecondary }}>Your personal information is protected according to our Privacy Policy. We do not share your data with third parties without your consent.</p>

          <h2 className="text-2xl font-bold mb-4 mt-8" style={{ color: colors.textPrimary }}>6. Modifications to Service</h2>
          <p className="mb-6" style={{ color: colors.textSecondary }}>UCC Connect Hub reserves the right to modify or discontinue the service at any time without notice.</p>

          <h2 className="text-2xl font-bold mb-4 mt-8" style={{ color: colors.textPrimary }}>7. Contact Information</h2>
          <p className="mb-6" style={{ color: colors.textSecondary }}>Questions about these Terms should be sent to info@uccconnect.ac.tz or call +255 747 172 018.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
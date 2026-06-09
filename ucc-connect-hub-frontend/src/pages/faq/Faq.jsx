import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Faq = () => {
  const { colors } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: 'What is UCC Connect Hub?', a: 'UCC Connect Hub is a supplementary digital communication and collaboration platform for UCC Dodoma, providing real-time messaging, assignment management, project workspaces, and multi-channel notifications.' },
    { q: 'Is the platform free?', a: 'Yes, UCC Connect Hub is completely free for all UCC students, faculty, and staff.' },
    { q: 'How do I register?', a: 'Click the "Get Started" button on the homepage, fill out the registration form with your name, email, and password.' },
    { q: 'Can I access on mobile?', a: 'Yes! The platform is fully responsive and works on all devices including smartphones, tablets, and computers.' },
    { q: 'What if I don\'t have internet?', a: 'UCC Connect Hub includes SMS fallback notification system. Critical academic alerts will be sent via SMS to your registered phone number.' },
    { q: 'How do I submit assignments?', a: 'Log in to your student dashboard, navigate to the course, click on the assignment, upload your file, and click submit.' },
    { q: 'When are the intake periods?', a: 'UCC Dodoma has two main intake periods: March/April and September/October.' },
    { q: 'How do I contact support?', a: 'You can send a message through the Contact Us page, email info@uccconnect.ac.tz, or call +255 747 172 018.' },
  ];

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Frequently Asked <span style={{ color: colors.primary }}>Questions</span>
          </h1>
          <p className="text-xl" style={{ color: colors.textSecondary }}>Find answers to common questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
              <button
                className="w-full p-5 text-left flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-semibold" style={{ color: colors.textPrimary }}>{faq.q}</span>
                {openIndex === i ? <ChevronUp size={20} style={{ color: colors.primary }} /> : <ChevronDown size={20} style={{ color: colors.primary }} />}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5" style={{ color: colors.textSecondary }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
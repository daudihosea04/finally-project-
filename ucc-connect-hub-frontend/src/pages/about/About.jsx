import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { GraduationCap, Award, Users, BookOpen, Calendar, Shield, Target, Zap, Globe, Heart, Eye } from 'lucide-react';

const About = () => {
  const { colors } = useTheme();

  const stats = [
    { icon: Users, value: '200+', label: 'Students Enrolled' },
    { icon: BookOpen, value: '2', label: 'Academic Programmes' },
    { icon: Calendar, value: '1999', label: 'Year Established' },
    { icon: Shield, value: 'NACTVET', label: 'Fully Accredited' }
  ];

  const services = [
    { icon: GraduationCap, title: 'Academic Programmes', desc: 'Certificate and Diploma in Computing & IT, Business Information Technology under NACTVET curriculum' },
    { icon: Award, title: 'Professional Courses', desc: 'CCNA, ITIL, PMP, and network security systems for capacity building' },
    { icon: Zap, title: 'IT Consulting', desc: 'Software system development for government and private institutions' },
    { icon: Globe, title: 'Community Impact', desc: 'Computer literacy programs and digital solutions for local businesses' }
  ];

  const values = [
    { icon: Target, title: 'Excellence', desc: 'Committed to excellence in ICT education and service delivery' },
    { icon: Heart, title: 'Innovation', desc: 'Leading in innovation and development of superior ICT products' },
    { icon: Users, title: 'Community', desc: 'Bridging the digital divide in Dodoma region' }
  ];

  return (
    <div className="min-h-screen py-20" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              About <span style={{ color: colors.primary }}>UCC Connect Hub</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
              A supplementary digital communication and collaboration platform for 
              the University of Dar es Salaam Computing Centre (UCC), Dodoma branch.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-6 text-center" style={{ border: `1px solid ${colors.border}` }}>
                <stat.icon size={40} style={{ color: colors.primary }} className="mx-auto mb-3" />
                <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{stat.value}</div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Mission and Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="glass-card p-8" style={{ border: `1px solid ${colors.border}` }}>
              <div className="flex items-center gap-3 mb-4">
                <Target size={32} style={{ color: colors.primary }} />
                <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Our Mission</h2>
              </div>
              <p style={{ color: colors.textSecondary }}>
                To lead in innovation and the development of superior ICT products and services 
                that contribute to social and economic development in Tanzania.
              </p>
            </div>
            <div className="glass-card p-8" style={{ border: `1px solid ${colors.border}` }}>
              <div className="flex items-center gap-3 mb-4">
                <Eye size={32} style={{ color: colors.primary }} />
                <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Our Vision</h2>
              </div>
              <p style={{ color: colors.textSecondary }}>
                To become a regionally recognized Centre for excellence in ICT matters.
              </p>
            </div>
          </div>

          {/* Motto */}
          <div className="glass-card p-8 text-center mb-12" style={{ backgroundColor: `${colors.primary}10`, border: `1px solid ${colors.primary}` }}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>Our Motto</h2>
            <p className="text-xl italic" style={{ color: colors.textPrimary }}>"Excellence, Innovation and Technological Foresight"</p>
          </div>

          {/* Services */}
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.textPrimary }}>What <span style={{ color: colors.primary }}>We Offer</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {services.map((service, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.primary}20` }}>
                    <service.icon size={24} style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>{service.title}</h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>{service.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Core Values */}
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.textPrimary }}>Our <span style={{ color: colors.primary }}>Core Values</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-6 text-center" style={{ border: `1px solid ${colors.border}` }}>
                <value.icon size={40} style={{ color: colors.primary }} className="mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>{value.title}</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>{value.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="glass-card p-8 text-center" style={{ border: `1px solid ${colors.border}` }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>Contact Us</h2>
            <p style={{ color: colors.textSecondary }}>📍 UCC Dodoma Branch - Dodoma, Tanzania</p>
            <p style={{ color: colors.textSecondary }}>📧 info@uccconnect.ac.tz</p>
            <p style={{ color: colors.textSecondary }}>📞 +255 123 456 789</p>
            <p className="mt-4 text-sm" style={{ color: colors.textSubtle }}>© UCC Dodoma | Established 1999 | Fully Owned ICT Company of UDSM</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
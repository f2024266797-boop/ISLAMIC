import { Platform } from 'react-native';

export const THEME = {
  // Minimalist White Palette (User Requested)
  bg: '#FFFFFF',           
  bgCard: '#FDFDFD',       
  bgElevated: '#F8F9FA',   
  
  // Luxury Gold & Deep Obsidian Text
  gold: '#D4AF37',         
  goldLight: '#F9E79F',
  white: '#000000',        // Text is now black for white background
  gray: '#888888',         
  grayDark: '#EEEEEE',     // Very light borders
  
  // Backwards compatibility tokens
  borderGold: 'rgba(212, 175, 55, 0.1)',
  greenLight: '#D4AF37',
  purple: '#A371F7',
  danger: '#FF3B30',
  emerald: '#10B981',
  
  // Layout Precision
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },

  radius: {
    sm: 12,
    md: 18,
    lg: 24,
    xl: 32,
    full: 999
  },

  // Typography for White Mode (Clean Sans-Serif)
  fonts: {
    primary: 'PTSans_400Regular',
    h1: { fontFamily: 'PTSans_400Regular', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    h2: { fontFamily: 'PTSans_400Regular', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
    body: { fontFamily: 'PTSans_400Regular', fontSize: 16, fontWeight: '500', lineHeight: 24 },
    micro: { fontFamily: 'PTSans_400Regular', fontSize: 8, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
    label: { fontFamily: 'PTSans_400Regular', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  },

  shadow: Object.assign(
    (color = '#000', opacity = 0.05, radius = 10, height = 5) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height },
      shadowOpacity: opacity,
      shadowRadius: radius,
      elevation: height,
    }),
    {
      premium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }
    }
  ),

  getArabicFont: (variant = 'default') => {
    return Platform.OS === 'ios' ? 'Geeza Pro' : 'serif';
  }
};

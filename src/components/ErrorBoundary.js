import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { THEME } from '../constants/theme';

/**
 * Production-grade Error Boundary
 * Prevents app-wide crashes and provides a graceful recovery UI.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, log this to a service like Sentry or Bugsnag
    console.error('[Global Error Boundary]:', error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
    // Potential: Trigger a reload or navigate to home
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.icon}>⚠️</Text>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.sub}>
              The app encountered an unexpected error. Don't worry, your data is safe.
            </Text>
            
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {this.state.error?.toString() || 'Unknown Runtime Error'}
              </Text>
            </View>

            <TouchableOpacity style={styles.btn} onPress={this.handleRestart}>
              <Text style={styles.btnText}>Try to Recover</Text>
            </TouchableOpacity>
            
            <Text style={styles.footer}>Powered by Devnexes</Text>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg, justifyContent: 'center' },
  content: { alignItems: 'center', padding: 40, paddingTop: 100 },
  icon: { fontSize: 80, marginBottom: 20 },
  title: { color: THEME.gold, fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  sub: { color: THEME.gray, fontSize: 16, textAlign: 'center', marginTop: 10, lineHeight: 24 },
  errorBox: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 15, width: '100%', marginTop: 30, borderWidth: 1, borderColor: THEME.border },
  errorText: { color: THEME.danger, fontSize: 12, fontFamily: 'monospace' },
  btn: { backgroundColor: THEME.gold, paddingHorizontal: 40, paddingVertical: 18, borderRadius: 30, marginTop: 40 },
  btnText: { color: THEME.bg, fontWeight: 'bold', fontSize: 16 },
  footer: { color: THEME.gray, fontSize: 10, marginTop: 60, opacity: 0.5 }
});

import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, StatusBar, Platform, KeyboardAvoidingView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { THEME } from '../constants/theme';
import useJournalStore from '../store/useJournalStore';
import useHabitStore from '../store/useHabitStore';
import { IslamicPattern } from '../components/IslamicPattern';

export default function JournalScreen({ navigation }) {
  const { tasks, history, lastDate, viewDate, setViewDate, addTask, toggleTask, deleteTask } = useJournalStore();
  const { addPoints } = useHabitStore();
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState('');

  const isToday = true;
  const displayTasks = tasks;

  const handleToggle = (task) => {
    const wasCompleted = task.completed;
    toggleTask(task.id);
    // If it was NOT completed and now it will be (checking it)
    if (!wasCompleted) {
      addPoints(10);
    }
  };

  const handleSave = () => {
    if (!content.trim()) return;
    addTask(content.trim());
    setContent('');
    setShowModal(false);
  };

  const confirmDelete = (id, isCore) => {
    if (isCore) {
      Alert.alert('Cannot Delete', 'This is a core daily task.');
      return;
    }
    Alert.alert('DELETE TASK', 'Remove this task from your daily plan?', [
      { text: 'Keep' },
      { text: 'Delete', onPress: () => deleteTask(id), style: 'destructive' },
    ]);
  };

  const coreTasks = displayTasks.filter(t => t.isCore);
  const customTasks = displayTasks.filter(t => !t.isCore);
  
  const completedCore = coreTasks.filter(t => t.completed).length;
  const coreProgress = coreTasks.length > 0 ? completedCore / coreTasks.length : 0;

  const renderTask = (task) => {
    return (
      <TouchableOpacity 
        key={task.id} 
        activeOpacity={0.7}
        style={[styles.taskCard, task.completed && styles.taskCompletedCard]}
        onPress={() => handleToggle(task)}
        onLongPress={() => confirmDelete(task.id, task.isCore)}
      >
        <View style={styles.taskLeft}>
          <View style={[styles.circleCheck, task.completed && styles.circleChecked]}>
            {task.completed && <Ionicons name="checkmark" size={14} color="#FFF" />}
          </View>
          <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>
            {task.title}
          </Text>
        </View>

        {!task.isCore && (
          <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(task.id, task.isCore)}>
            <Ionicons name="trash-outline" size={16} color="#AAA" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.bg} />
      <IslamicPattern opacity={0.03} />

      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          
          <View style={styles.dateSelector}>
            <Text style={styles.headerDate}>TODAY'S PLAN</Text>
          </View>
        </View>
        <View style={styles.titleSection}>
          <Text style={styles.h1}>Daily Schedule</Text>
          <Text style={styles.subtitle}>Plan your day, track your worship.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Core Prayers Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>OBLIGATORY PRAYERS</Text>
          <Text style={styles.progressText}>{completedCore}/5</Text>
        </View>
        
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${coreProgress * 100}%` }]} />
        </View>

        <View style={styles.tasksContainer}>
          {coreTasks.length === 0 && !isToday ? (
             <Text style={styles.noHistoryText}>No records for this date.</Text>
          ) : coreTasks.map(renderTask)}
        </View>

        {/* Custom Tasks Section */}
        {(customTasks.length > 0 || isToday) && (
          <View style={[styles.sectionHeader, { marginTop: 32 }]}>
            <Text style={styles.sectionTitle}>MY CUSTOM ROUTINE</Text>
          </View>
        )}

        <View style={styles.tasksContainer}>
          {customTasks.length === 0 && isToday ? (
            <View style={styles.emptyState}>
              <Ionicons name="list-outline" size={40} color="#CCC" />
              <Text style={styles.emptyText}>No custom tasks planned.</Text>
              <Text style={styles.emptySub}>Set your goals for today (e.g. Recite Quran, Tahajjud, Sadaqah).</Text>
            </View>
          ) : (
            customTasks.map(renderTask)
          )}
        </View>

        {/* Add Task Button inside flow (Only Today) */}
        {isToday && (
          <TouchableOpacity style={styles.createBtn} onPress={() => setShowModal(true)}>
            <Ionicons name="add" size={20} color={THEME.gold} />
            <Text style={styles.createBtnText}>Add Custom Task</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modern Modal using KeyboardAvoidingView */}
      <Modal visible={showModal} transparent animationType="slide">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>What else do you want to accomplish today?</Text>
            
            <TextInput
              style={styles.inputField}
              placeholder="E.g. Read Surah Al-Mulk at night..."
              placeholderTextColor="#888"
              autoFocus
              value={content}
              onChangeText={setContent}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Save Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  
  dateSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#EEE' },
  dateArrow: { padding: 4 },
  headerDate: { color: THEME.gold, fontSize: 11, fontWeight: '900', letterSpacing: 2, marginHorizontal: 12 },
  
  titleSection: { paddingHorizontal: 4 },
  h1: { color: '#000', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: '#666', fontSize: 14, marginTop: 4 },

  scrollContent: { paddingHorizontal: 24, paddingTop: 10 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  sectionTitle: { color: '#888', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  progressText: { color: THEME.gold, fontSize: 14, fontWeight: '900' },
  
  progressBarBg: { height: 6, backgroundColor: '#EEE', borderRadius: 3, marginBottom: 16, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: THEME.gold, borderRadius: 3 },

  tasksContainer: { gap: 10 },
  
  taskCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: THEME.bgCard, padding: 18, borderRadius: 16,
    borderWidth: 1, borderColor: THEME.grayDark,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1
  },
  taskCompletedCard: {
    backgroundColor: '#F0F0F0', borderColor: 'transparent', opacity: 0.7, shadowOpacity: 0, elevation: 0
  },
  taskLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  circleCheck: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#CCC',
    alignItems: 'center', justifyContent: 'center', marginRight: 14, backgroundColor: '#FFF'
  },
  circleChecked: {
    backgroundColor: THEME.gold, borderColor: THEME.gold
  },
  taskTitle: { color: '#000', fontSize: 16, fontWeight: '600' },
  taskTitleDone: { color: '#999', textDecorationLine: 'line-through' },
  
  deleteBtn: { padding: 6 },
  noHistoryText: { color: '#888', fontStyle: 'italic', fontSize: 13 },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: '#F8F9FA', borderRadius: 16, borderWidth: 1, borderColor: '#EEE', borderStyle: 'dashed' },
  emptyText: { color: '#000', fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  emptySub: { color: '#888', fontSize: 12, textAlign: 'center', paddingHorizontal: 40, marginTop: 8 },

  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingVertical: 16, borderRadius: 16, marginTop: 16, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', gap: 8 },
  createBtnText: { color: THEME.gold, fontSize: 14, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: THEME.bg, padding: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#DDD', borderRadius: 2, alignSelf: 'center', marginBottom: 24 },
  modalTitle: { color: '#000', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  inputField: { backgroundColor: '#F8F9FA', borderRadius: 16, paddingHorizontal: 20, height: 60, color: '#000', fontSize: 16, marginBottom: 24, borderWidth: 1, borderColor: '#EEE' },
  
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, height: 54, borderRadius: 14, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: '#555', fontSize: 15, fontWeight: 'bold' },
  saveBtn: { flex: 1, height: 54, borderRadius: 14, backgroundColor: THEME.gold, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#000', fontSize: 15, fontWeight: 'bold' },
});


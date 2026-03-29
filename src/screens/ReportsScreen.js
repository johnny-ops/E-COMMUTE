import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reportService } from '../services/api';

const ReportsScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [reports, setReports] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReport, setNewReport] = useState({ type: 'traffic', description: '', location: '' });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await reportService.getReports();
      setReports(data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleVote = async (reportId, vote) => {
    try {
      await reportService.voteReport(reportId, vote);
      fetchReports();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await reportService.submitReport(newReport);
      setModalVisible(false);
      setNewReport({ type: 'traffic', description: '', location: '' });
      fetchReports();
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const reportTypes = [
    { key: 'traffic', label: 'Traffic', icon: 'car', color: '#F44336' },
    { key: 'route_change', label: 'Route Change', icon: 'swap-horizontal', color: '#FF9800' },
    { key: 'fare_change', label: 'Fare Change', icon: 'cash', color: '#2196F3' },
    { key: 'congestion', label: 'Congestion', icon: 'people', color: '#9C27B0' },
  ];

  const getReportIcon = (type) => {
    const report = reportTypes.find(r => r.key === type);
    return report ? report.icon : 'alert-circle';
  };

  const getReportColor = (type) => {
    const report = reportTypes.find(r => r.key === type);
    return report ? report.color : '#757575';
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.reportCard, isDark && styles.reportCardDark]}>
            <View style={styles.reportHeader}>
              <View style={[styles.iconBadge, { backgroundColor: getReportColor(item.type) }]}>
                <Ionicons name={getReportIcon(item.type)} size={20} color="#fff" />
              </View>
              <View style={styles.reportInfo}>
                <Text style={[styles.reportType, isDark && styles.textDark]}>
                  {reportTypes.find(r => r.key === item.type)?.label || item.type}
                </Text>
                <Text style={styles.reportTime}>{item.timeAgo}</Text>
              </View>
            </View>
            
            <Text style={[styles.reportLocation, isDark && styles.textDark]}>
              📍 {item.location}
            </Text>
            <Text style={[styles.reportDescription, isDark && styles.textDark]}>
              {item.description}
            </Text>
            
            <View style={styles.voteContainer}>
              <TouchableOpacity 
                style={styles.voteBtn}
                onPress={() => handleVote(item.id, 'up')}
              >
                <Ionicons name="arrow-up" size={18} color="#4CAF50" />
                <Text style={styles.voteText}>{item.upvotes || 0}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.voteBtn}
                onPress={() => handleVote(item.id, 'down')}
              >
                <Ionicons name="arrow-down" size={18} color="#F44336" />
                <Text style={styles.voteText}>{item.downvotes || 0}</Text>
              </TouchableOpacity>
              
              <Text style={styles.reliability}>
                Reliability: {item.reliability || 0}%
              </Text>
            </View>
          </View>
        )}
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>Submit Report</Text>
            
            <View style={styles.typeSelector}>
              {reportTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeBtn,
                    newReport.type === type.key && { backgroundColor: type.color }
                  ]}
                  onPress={() => setNewReport({ ...newReport, type: type.key })}
                >
                  <Ionicons 
                    name={type.icon} 
                    size={20} 
                    color={newReport.type === type.key ? '#fff' : '#666'} 
                  />
                  <Text style={[
                    styles.typeText,
                    newReport.type === type.key && styles.typeTextActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={[styles.modalInput, isDark && styles.modalInputDark]}
              placeholder="Location"
              placeholderTextColor={isDark ? '#999' : '#666'}
              value={newReport.location}
              onChangeText={(text) => setNewReport({ ...newReport, location: text })}
            />
            
            <TextInput
              style={[styles.modalInput, styles.modalTextArea, isDark && styles.modalInputDark]}
              placeholder="Description"
              placeholderTextColor={isDark ? '#999' : '#666'}
              value={newReport.description}
              onChangeText={(text) => setNewReport({ ...newReport, description: text })}
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, styles.submitBtn]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportCardDark: {
    backgroundColor: '#2a2a2a',
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reportTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  reportLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 4,
  },
  voteText: {
    fontSize: 14,
    color: '#666',
  },
  reliability: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '60%',
  },
  modalContentDark: {
    backgroundColor: '#1a1a1a',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    gap: 6,
  },
  typeText: {
    fontSize: 13,
    color: '#666',
  },
  typeTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
  },
  modalInputDark: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#f5f5f5',
  },
  submitBtn: {
    backgroundColor: '#4CAF50',
  },
  cancelBtnText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textDark: {
    color: '#fff',
  },
});

export default ReportsScreen;

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlannerScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI trip planner for UVA and Charlottesville. Where would you like to go?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    { id: 1, text: "Get to class at Rice Hall", icon: "school" },
    { id: 2, text: "Go to Downtown Mall", icon: "storefront" },
    { id: 3, text: "Visit UVA Hospital", icon: "medical" },
    { id: 4, text: "Get to Barracks Road", icon: "car" },
  ];

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateAIResponse(text);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('rice hall') || input.includes('class')) {
      return "🎓 To get to Rice Hall:\n\n🚌 **Best Option**: Take the Blue Line from Central Grounds\n⏰ **Next bus**: 8 minutes\n🚶‍♂️ **Walk time**: 12 minutes\n\n**Recommendation**: Take the bus - it's faster and drops you right at the Engineering School!";
    }
    
    if (input.includes('downtown') || input.includes('mall')) {
      return "🏪 To get to Downtown Mall:\n\n🚌 **Route 7 (CAT)**: From UVA Hospital stop\n⏰ **Next bus**: 15 minutes\n🚌 **Free Trolley**: Once downtown, use the trolley to get around\n🚶‍♂️ **Walk + Bus**: 25 minutes total\n\n**Tip**: The trolley runs every 15 minutes and is free!";
    }
    
    if (input.includes('hospital') || input.includes('medical')) {
      return "🏥 To get to UVA Hospital:\n\n🚌 **Blue Line**: Direct service from Central Grounds\n⏰ **Next bus**: 5 minutes\n🚌 **Route 7 (CAT)**: Alternative option\n⏰ **Frequency**: Every 12-15 minutes\n\n**Note**: Blue Line is fastest for hospital visits!";
    }
    
    if (input.includes('barracks')) {
      return "🛍️ To get to Barracks Road:\n\n🚌 **Route 11 (CAT)**: From UVA Central\n⏰ **Next bus**: 22 minutes\n🚌 **Route 7 (CAT)**: Alternative route\n⏰ **Travel time**: 18 minutes\n\n**Shopping tip**: Route 11 stops right at Stonefield if you need more shopping options!";
    }
    
    return "I can help you plan your trip! Please tell me:\n\n📍 **Where you want to go**\n⏰ **When you need to arrive**\n📱 **Your current location**\n\nI'll find the best bus routes and walking options for you!";
  };

  const handleQuickAction = (action) => {
    sendMessage(action.text);
  };

  const renderMessage = (message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isBot ? styles.botMessage : styles.userMessage,
      ]}
    >
      {message.isBot && (
        <View style={styles.botAvatar}>
          <Ionicons name="bus" size={16} color="#FF6B35" />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          message.isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        <Text style={[styles.messageText, message.isBot ? styles.botText : styles.userText]}>
          {message.text}
        </Text>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.quickActionsTitle}>Quick Destinations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              onPress={() => handleQuickAction(action)}
            >
              <Ionicons name={action.icon} size={20} color="#FF6B35" />
              <Text style={styles.quickActionText}>{action.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map(renderMessage)}
        
        {isTyping && (
          <View style={[styles.messageContainer, styles.botMessage]}>
            <View style={styles.botAvatar}>
              <Ionicons name="bus" size={16} color="#FF6B35" />
            </View>
            <View style={[styles.messageBubble, styles.botBubble]}>
              <Text style={styles.typingText}>AI is thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about getting somewhere..."
          placeholderTextColor="#8E8E93"
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color={!inputText.trim() ? "#8E8E93" : "#FFFFFF"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  quickActionsContainer: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#38383A',
  },
  quickActionsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  quickActionButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38383A',
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  botBubble: {
    backgroundColor: '#1C1C1E',
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    backgroundColor: '#FF6B35',
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: '#FFFFFF',
  },
  userText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 5,
  },
  typingText: {
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderTopColor: '#38383A',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FF6B35',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
});

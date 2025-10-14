// src/screens/ChatScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_BASE } from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const listRef = useRef(null);

  // auto-scroll when messages change
  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      setTimeout(() => listRef.current.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    // bot reply
    botRespond(text);
  };

  const botRespond = (text) => {
    // simple rule-based replies
    const lower = text.toLowerCase();
    let reply = '';
    // If user asks about current orders, fetch from backend and summarize
    if (/(?:\borders?\b|\bmy orders\b|how many orders|pending orders|list orders)/.test(lower)) {
      setBotTyping(true);
      axios.get(`${API_BASE}/orders`)
        .then(res => {
          const orders = res.data || [];
          if (orders.length === 0) {
            reply = 'There are currently no orders.';
            const botMsg0 = { id: Date.now().toString() + '-bot', text: reply, sender: 'bot' };
            setMessages(prev => [...prev, botMsg0]);
            return;
          }
          const totalOrders = orders.length;
          const totalQty = orders.reduce((s, o) => s + (o.quantity || 0), 0);
          const totalValue = orders.reduce((s, o) => s + (o.price || 0), 0);
          // Build a short list (first 5) of orders
          const list = orders.slice(0, 5).map((o, i) => {
            const cropName = o.crop?.name || 'Unknown crop';
            return `${i + 1}) ${cropName} — qty ${o.quantity} — Rs.${o.price}`;
          }).join('\n');
          reply = `You have ${totalOrders} orders totaling ${totalQty} items (Rs.${totalValue}).\nTop orders:\n${list}`;
          const botMsg = { id: Date.now().toString() + '-bot', text: reply, sender: 'bot' };
          setMessages(prev => [...prev, botMsg]);
        })
        .catch(err => {
          console.error('Failed fetching orders for bot:', err);
          const botMsg = { id: Date.now().toString() + '-bot', text: 'Sorry, I could not retrieve orders right now.', sender: 'bot' };
          setMessages(prev => [...prev, botMsg]);
        })
        .finally(() => setBotTyping(false));
      return;
    }
    if (/price|how much|cost/.test(lower)) reply = 'Prices vary by crop. Check the crop listing for price per kg.';
    else if (/\border\b|\bbuy\b|\bpurchase\b/.test(lower)) reply = 'To place an order, select quantity and enter your Gmail, then tap Order Now.';
    else if (/stock|available|quantity/.test(lower)) reply = 'You can check available quantity on the crop card. If you need more info, ask the farmer.';
    else if (/hi|hello|hey/.test(lower)) reply = 'Hello! How can I help you today?';
    else if (/thanks|thank you/.test(lower)) reply = "You're welcome — happy to help!";
    else reply = "I can help with prices, stock or ordering. Ask me about price, availability, or how to buy.";

    setBotTyping(true);
    setTimeout(() => {
      const botMsg = { id: Date.now().toString() + '-bot', text: reply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
      setBotTyping(false);
    }, 900);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=60' }} // Crop/farm field image
      style={styles.background}
    >
      {/* Semi-transparent overlay for readability */}
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View style={item.sender === 'bot' ? styles.botBubble : styles.userBubble}>
                  <Text style={item.sender === 'bot' ? styles.botText : styles.userText}>{item.text}</Text>
                </View>
              )}
              ListFooterComponent={botTyping ? <View style={styles.typingRow}><ActivityIndicator size="small" color="#4CAF50" /><Text style={{marginLeft:8}}>Bot is typing...</Text></View> : null}
              contentContainerStyle={{ paddingBottom: 54, paddingTop: 10 }}
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1 }}
            />

            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="Type a message..." 
                value={input} 
                onChangeText={setInput} 
                onSubmitEditing={() => sendMessage(input)}
              />
              <TouchableOpacity onPress={() => sendMessage(input)}>
                <MaterialIcons name="send" size={28} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex:1, resizeMode:'cover' },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(255, 255, 255, 0.25)' // Slightly transparent overlay
  },
  container: { flex:1, padding:10, justifyContent:'flex-end' },
  messageBubble: { 
    backgroundColor:'#4CAF50', 
    padding:12, 
    borderRadius:15, 
    marginVertical:5, 
    alignSelf:'flex-start', 
    maxWidth:'80%' 
  },
  messageText: { color:'#fff', fontSize:16 },
  botBubble: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    marginVertical: 6,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    marginVertical: 6,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  botText: { color: '#222', fontSize: 16 },
  userText: { color: '#222', fontSize: 16 },
  typingRow: { flexDirection: 'row', alignItems: 'center', padding: 8, marginLeft: 6 },
  inputContainer: { 
    flexDirection:'row', 
    alignItems:'center', 
    backgroundColor:'#fff', 
    padding:10, 
    borderRadius:25, 
    marginHorizontal:10,
    marginBottom:26,
  },
  input: { flex:1, marginRight:10, fontSize:16 },
});

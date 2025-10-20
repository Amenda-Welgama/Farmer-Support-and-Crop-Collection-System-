// src/screens/ChatScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "ආයුබෝවන්! 👋 මම ඔබගේ කෘෂි සහායකයා. මට ඔබට උදව් කළ හැකි කරුණු:\n\n🌾 නිෂ්පාදන සහ මිල ගණන්\n🛒 ඇණවුම් කිරීම\n🚚 බෙදාහැරීම පිළිබඳ තොරතුරු\n📞 සහාය සම්බන්ධ කරගන්න\n🌱 ගොවිතැන් උපදෙස්",
      sender: "bot",
      quickReplies: [
        { id: "products", label: "නිෂ්පාදන" },
        { id: "orders", label: "ඇණවුම්" },
        { id: "delivery", label: "බෙදාහැරීම" },
        { id: "farming_tips", label: "ගොවි උපදෙස්" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      setTimeout(() => listRef.current.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  // Advanced NLP-like function for keyword detection
  const detectIntent = (text) => {
    const lowerText = text.toLowerCase();
    
    // Sinhala keywords
    const sinhalaKeywords = {
      products: ["නිෂ්පාදන", "භාණඩ", "එළවළු", "පලතුරු", "ධාන්‍ය", "බඩ", "කෑම"],
      prices: ["මිල", "ගාන", "කීයද", "කීය", "මුදල්", "වටිනා"],
      order: ["ඇණවුම්", "ඇණවුම", "මිලදී", "ගන්න", "ඕන", "ඕනෑ", "ගන්න්"],
      delivery: ["බෙදාහැරීම", "ගෙන්වා", "එවන්න", "ගෙදර", "ඩිලිවරි"],
      contact: ["අමතන්න", "ඇමතුම්", "සම්බන්ධ", "කතා", "කෝල්", "phone", "email"],
      stock: ["තොගය", "තිබෙනවද", "තිබෙනවා", "තියෙනවද", "ඇද"],
      payment: ["ගෙවීම", "ගෙවන්න", "පේමන්ට්", "මුදල්", "කාඩ්"],
      organic: ["කාබනික", "ඕගැනික", "විෂ", "රසායනික", "ස්වභාවික"],
      farming: ["ගොවිතැන", "වගාව", "වවන", "වපුරන", "බීජ", "පොහොර", "පළිබෝධ"],
      weather: ["කාලගුණ", "වැස්ස", "හිරු", "දේශගුණ"],
    };

    // English keywords
    const englishKeywords = {
      products: ["product", "item", "crop", "vegetable", "fruit", "grain", "food"],
      prices: ["price", "cost", "how much", "rate", "charge"],
      order: ["order", "buy", "purchase", "get", "want"],
      delivery: ["deliver", "shipping", "send", "courier"],
      contact: ["contact", "call", "phone", "email", "support", "help"],
      stock: ["stock", "available", "availability", "inventory"],
      payment: ["payment", "pay", "card", "cash", "transfer"],
      organic: ["organic", "natural", "chemical", "pesticide"],
      farming: ["farming", "cultivation", "plant", "seed", "fertilizer", "pest"],
      weather: ["weather", "rain", "climate", "forecast"],
    };

    // Check Sinhala keywords
    for (const [intent, keywords] of Object.entries(sinhalaKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return intent;
      }
    }

    // Check English keywords
    for (const [intent, keywords] of Object.entries(englishKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return intent;
      }
    }

    return "unknown";
  };

  // Advanced response generator with context awareness
  const getBotResponse = (text, context) => {
    const intent = detectIntent(text);
    const lowerText = text.toLowerCase();

    // Check if user is asking a follow-up question
    const isFollowUp = context.length > 0 && 
      (lowerText.includes("වැඩි") || lowerText.includes("more") || 
       lowerText.includes("තව") || lowerText.includes("additional") ||
       lowerText.includes("කොහොමද") || lowerText.includes("how"));

    const responses = {
      products: {
        text: "අපි විවිධ කාබනික නිෂ්පාදන සපයන්නෙමු:\n\n🥬 එළවළු:\n• තක්කාලි (Rs.120/kg)\n• වම්බටු (Rs.80/kg)\n• කැරට් (Rs.150/kg)\n• බණ්ඩක්කා (Rs.100/kg)\n\n🍎 පලතුරු:\n• අඹ (Rs.250/kg)\n• පැපොල් (Rs.100/kg)\n• අන්නාසි (Rs.180/kg)\n\n🌾 ධාන්‍ය:\n• සහල් (Rs.120/kg)\n• රටකජු (Rs.400/kg)\n• මුං ඇට (Rs.180/kg)\n\nකුමක් ගැන වැඩිදුර දැනගන්න ඕනද?",
        quickReplies: [
          { id: "vegetables", label: "එළවළු" },
          { id: "fruits", label: "පලතුරු" },
          { id: "order_now", label: "ඇණවුම් කරන්න" },
        ],
      },
      prices: {
        text: "අපේ මිල ගණන් දිනපතා යාවත්කාලීන වෙනවා:\n\n💰 අද මිල ගණන්:\n• එළවළු: Rs.50-200/kg\n• පලතුරු: Rs.100-300/kg\n• ධාන්‍ය: Rs.80-400/kg\n\n📊 Special Offers:\n• 5kg ට වැඩි ඇණවුම්: 10% වට්ටම\n• 10kg ට වැඩි: 15% වට්ටම\n• කාබනික නිෂ්පාදන: 20% වට්ටම\n\nකුමන නිෂ්පාදනයක මිල දැනගන්න ඕනද?",
        quickReplies: [
          { id: "products", label: "නිෂ්පාදන බලන්න" },
          { id: "order_now", label: "ඇණවුම් කරන්න" },
        ],
      },
      order: {
        text: "ඇණවුම් කිරීම ඉතා සරලයි! 😊\n\n📝 පියවර:\n1️⃣ නිෂ්පාදන තෝරන්න\n2️⃣ ප්‍රමාණය තෝරන්න\n3️⃣ ගෙන්වා ගන්නා ලිපිනය ඇතුළත් කරන්න\n4️⃣ ගෙවීම් ක්‍රමය තෝරන්න\n5️⃣ තහවුරු කරන්න\n\n✅ ඔබට ලැබෙන්නේ:\n• Order confirmation SMS\n• Real-time tracking\n• 24/7 support\n\nඑහෙනම් ඇණවුම් කරමුද?",
        quickReplies: [
          { id: "products", label: "නිෂ්පාදන බලන්න" },
          { id: "payment", label: "ගෙවීම් ක්‍රම" },
          { id: "delivery", label: "බෙදාහැරීම" },
        ],
      },
      delivery: {
        text: "🚚 බෙදාහැරීම් සේවාව:\n\n📍 ප්‍රදේශ:\n• ගෝල්ඩන් සර්කල් (කිමී 50 තුළ)\n• සියලුම ප්‍රධාන නගර\n• තෝරාගත් ග්‍රාමීය ප්‍රදේශ\n\n💵 ගාස්තු:\n• 0-10km: නොමිලේ! 🎉\n• 10-30km: Rs.200\n• 30-50km: Rs.400\n\n⏰ කාලය:\n• අද දවස: කිමී 10 ඇතුළත\n• හෙට දවස: කිමී 10-50\n• Express delivery: තිබේ (+Rs.200)\n\nඔබේ ප්‍රදේශය කියන්න වෙන්න පුළුවන්ද?",
        quickReplies: [
          { id: "check_area", label: "ප්‍රදේශය පරීක්ෂා කරන්න" },
          { id: "order_now", label: "ඇණවුම් කරන්න" },
        ],
      },
      contact: {
        text: "අපව සම්බන්ධ කරගන්න:\n\n📞 දුරකථන:\n• Hotline: 011-1234567\n• Mobile: +94 77 123 4567\n• වැඩ කරන වේලාවන්: 6AM - 10PM\n\n📧 Email:\n• support@farmapp.lk\n• orders@farmapp.lk\n• Response: 2 පැය ඇතුළත\n\n💬 WhatsApp:\n• +94 77 123 4567\n• 24/7 Available ✅\n\n🏢 කාර්යාලය:\n• කොළඹ 07\n• සඳුදා - ඉරිදා: 8AM - 6PM\n\nකොයි ක්‍රමයෙන් අපව අමතන්න කැමතිද?",
        quickReplies: [
          { id: "call", label: "දුරකථන අමතන්න" },
          { id: "whatsapp", label: "WhatsApp" },
        ],
      },
      stock: {
        text: "📦 තොග තත්වය:\n\n✅ දැනට තිබේ:\n• එළවළු: සියල්ලම තිබේ\n• පලතුරු: 95% තිබේ\n• ධාන්‍ය: සියල්ලම තිබේ\n\n⏳ ඉක්මනින් එන්නේ:\n• අඹ (තව දින 3)\n• පැපොල් (හෙට)\n\n🔔 Stock Alert:\nඔබට අවශ්‍ය නිෂ්පාදන තොගයට එන විට SMS එකක් ලබාගන්න\n\nකුමන නිෂ්පාදනයක තොග තත්වය දැනගන්නද?",
        quickReplies: [
          { id: "products", label: "නිෂ්පාදන බලන්න" },
          { id: "alert", label: "Alert සක්‍රීය කරන්න" },
        ],
      },
      payment: {
        text: "💳 ගෙවීම් ක්‍රම:\n\n1️⃣ කෑෂ් ඔන් ඩිලිවරි:\n   • විශ්වාසදායක සහ ආරක්ෂිත\n   • කිසිදු අමතර ගාස්තුවක් නැත\n\n2️⃣ බැංකු ගෙවීම:\n   • Bank of Ceylon\n   • Commercial Bank\n   • Sampath Bank\n\n3️⃣ ඩිජිටල් ගෙවීම්:\n   • FriMi, eZcash, mCash\n   • Visa/Mastercard\n   • PayPal\n\n🎁 විශේෂ:\nඔන්ලයින් ගෙවීම් සඳහා 5% වට්ටමක්!\n\nකුමන ක්‍රමය ඔබට වඩාත් පහසුද?",
        quickReplies: [
          { id: "cod", label: "Cash on Delivery" },
          { id: "online", label: "Online Payment" },
        ],
      },
      organic: {
        text: "🌿 කාබනික නිෂ්පාදන:\n\nඅපේ සියලු නිෂ්පාදන:\n✅ 100% කාබනික\n✅ රසායනික පොහොර රහිත\n✅ පළිබෝධනාශක නැත\n✅ Non-GMO\n\n🏆 සහතික:\n• Sri Lanka Organic Agriculture\n• International Organic Certification\n• ISO Certified\n\n🌱 වාසි:\n• සෞඛ්‍යාරක්ෂිත\n• පරිසර හිතකාමී\n• වඩා හොඳ රසය\n• දිගු කල් පැවැත්මක්\n\nකුමන කාබනික නිෂ්පාදනයක් ඕනද?",
        quickReplies: [
          { id: "products", label: "නිෂ්පාදන බලන්න" },
          { id: "certificates", label: "සහතික බලන්න" },
        ],
      },
      farming: {
        text: "🌾 ගොවිතැන් උපදෙස්:\n\nමම ඔබට උදව් කරන්නම්:\n\n1️⃣ වගා කිරීම:\n   • බීජ තෝරා ගැනීම\n   • වපුරන කාලය\n   • පාංශු සූදානම\n\n2️⃣ පාලන කළමනාකරණය:\n   • ස්වභාවික පළිබෝධ පාලනය\n   • කාබනික පොහොර\n   • වලාකුළු පාලනය\n\n3️⃣ අස්වැන්න:\n   • නිවැරදි කාලය\n   • ගබඩා කිරීම\n   • විකිණීම\n\n4️⃣ කාලගුණ උපදෙස්:\n   • වගා කිරීමට හොඳම කාලය\n   • වැස්ස පුරෝකථනය\n\nකුමන උපදෙස් අවශ්‍යද?",
        quickReplies: [
          { id: "planting", label: "වගා කිරීම" },
          { id: "pest_control", label: "පළිබෝධ පාලනය" },
          { id: "weather", label: "කාලගුණය" },
        ],
      },
      weather: {
        text: "🌤️ කාලගුණ තොරතුරු:\n\nඅද:\n• උෂ්ණත්වය: 28°C\n• වැසි: 30% chance\n• සුළං: මධ්‍යම\n\n📅 සතියේ පුරෝකථනය:\n• සඳුදා-බදාදා: අව්ව\n• බ්‍රහස්පතින්දා: වැසි\n• සිකුරාදා-ඉරිදා: අර්ධ වළාකුළු\n\n🌱 ගොවි උපදෙස්:\n• වපුරන්න හොඳ කාලයක්\n• වලාකුළු ඉවත් කරන්න\n• ජල සම්පාදනය අඩු කරන්න\n\nවැඩි විස්තර අවශ්‍යද?",
        quickReplies: [
          { id: "farming", label: "ගොවි උපදෙස්" },
          { id: "products", label: "නිෂ්පාදන" },
        ],
      },
      unknown: {
        text: "මට ඔබගේ ප්‍රශ්නය හරියටම තේරුනේ නැහැ. 😊\n\nමට ඔබට උදව් කළ හැකි:\n\n🌾 නිෂ්පාදන සහ මිල ගණන්\n🛒 ඇණවුම් කිරීම\n🚚 බෙදාහැරීම\n📞 සහාය\n🌱 ගොවිතැන් උපදෙස්\n☀️ කාලගුණ තොරතුරු\n\nකරුණාකර ඔබට අවශ්‍ය දෙය තෝරන්න හෝ වෙනත් ආකාරයකින් විමසන්න.",
        quickReplies: [
          { id: "products", label: "නිෂ්පාදන" },
          { id: "orders", label: "ඇණවුම්" },
          { id: "farming_tips", label: "ගොවි උපදෙස්" },
        ],
      },
    };

    return responses[intent] || responses.unknown;
  };

  const sendMessage = (text = null) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // Update context
    setConversationContext((prev) => [...prev, messageText]);
    
    if (!text) setInput("");

    // Simulate bot typing
    setBotTyping(true);

    // Bot response with intelligent delay
    setTimeout(() => {
      const response = getBotResponse(messageText, conversationContext);
      const botMessage = {
        id: Date.now().toString() + "-bot",
        text: response.text,
        sender: "bot",
        quickReplies: response.quickReplies,
      };
      setMessages((prev) => [...prev, botMessage]);
      setBotTyping(false);
    }, 1500);
  };

  const handleQuickReply = (replyId) => {
    const replyTexts = {
      products: "නිෂ්පාදන",
      orders: "ඇණවුම්",
      delivery: "බෙදාහැරීම",
      farming_tips: "ගොවිතැන් උපදෙස්",
      vegetables: "එළවළු",
      fruits: "පලතුරු",
      order_now: "ඇණවුම් කරන්න",
      payment: "ගෙවීම් ක්‍රම",
      check_area: "මගේ ප්‍රදේශය",
      call: "දුරකථන අමතන්න",
      whatsapp: "WhatsApp",
      alert: "Stock Alert",
      cod: "Cash on Delivery",
      online: "Online Payment",
      certificates: "සහතික",
      planting: "වගා කිරීම",
      pest_control: "පළිබෝධ පාලනය",
      weather: "කාලගුණය",
    };

    sendMessage(replyTexts[replyId] || replyId);
  };

  const renderMessage = ({ item }) => (
    <View>
      <View style={item.sender === "bot" ? styles.botBubble : styles.userBubble}>
        <Text style={item.sender === "bot" ? styles.botText : styles.userText}>
          {item.text}
        </Text>
      </View>
      
      {item.quickReplies && item.sender === "bot" && (
        <View style={styles.quickRepliesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRepliesScroll}
          >
            {item.quickReplies.map((reply) => (
              <TouchableOpacity
                key={reply.id}
                style={styles.quickReplyButton}
                onPress={() => handleQuickReply(reply.id)}
              >
                <Text style={styles.quickReplyText}>{reply.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialIcons name="smart-toy" size={28} color="#fff" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>කෘෂි AI සහායක</Text>
              <Text style={styles.headerSubtitle}>Online • Always Ready</Text>
            </View>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
        />

        {botTyping && (
          <View style={styles.typingIndicator}>
            <View style={styles.typingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
            <Text style={styles.typingText}>AI typing කරනවා...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ඔබගේ ප්‍රශ්නය ඇතුළත් කරන්න..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage()}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} 
            onPress={() => sendMessage()}
            disabled={!input.trim()}
          >
            <MaterialIcons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#F2F9F1",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginTop: 2,
  },
  messageList: {
    padding: 20,
    paddingBottom: 8,
  },
  botBubble: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    maxWidth: "85%",
    alignSelf: "flex-start",
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  userBubble: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    maxWidth: "85%",
    alignSelf: "flex-end",
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  botText: {
    color: "#333",
    fontSize: 15,
    lineHeight: 24,
  },
  userText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
  },
  quickRepliesContainer: {
    marginBottom: 16,
    marginLeft: 8,
  },
  quickRepliesScroll: {
    paddingRight: 16,
  },
  quickReplyButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: "#4CAF50",
    elevation: 2,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  quickReplyText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  typingText: {
    color: "#666",
    fontSize: 13,
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "rgba(110, 118, 63, 0.2)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    backgroundColor: "#F2F9F1",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 15,
    maxHeight: 100,
    color: "#333",
    borderWidth: 1,
    borderColor: "rgba(110, 118, 63, 0.3)",
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#9ca86b",
    opacity: 0.6,
  },
});
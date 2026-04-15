// ============================================================
// DONATE PAGE — src/pages/DonatePage.tsx
// Donation page with UPI/GPay QR code, PayPal, and Buy Me a
// Coffee links. Shows supporter appreciation and impact stats.
// ============================================================
import { motion } from "framer-motion";
import { Heart, Coffee, CreditCard, Star, Gift, ExternalLink, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/contexts/LanguageContext";

import gpayQR from "@/assets/gpay-qr.jpg";

const donationLinks = [
  {
    name: "Buy Me a Coffee",
    emoji: "☕",
    description: "Support PyMaster with a coffee! Every cup fuels more lessons.",
    url: siteConfig.donations.buyMeACoffee,
    color: "bg-python-yellow/10 border-python-yellow/30 hover:border-python-yellow",
    buttonColor: "bg-python-yellow text-background hover:bg-python-yellow/90",
    icon: Coffee,
  },
  {
    name: "PayPal",
    emoji: "💳",
    description: "Send a one-time or recurring donation via PayPal.",
    url: "https://paypal.me",
    color: "bg-primary/10 border-primary/30 hover:border-primary",
    buttonColor: "bg-primary text-primary-foreground hover:bg-primary/90",
    icon: CreditCard,
  },
  {
    name: "UPI (India)",
    emoji: "🇮🇳",
    description: "For our Indian supporters — donate via any UPI app.",
    url: "#",
    color: "bg-streak-green/10 border-streak-green/30 hover:border-streak-green",
    buttonColor: "bg-streak-green text-primary-foreground hover:bg-streak-green/90",
    icon: Gift,
  },
];

const supporters = [
  { name: "Anonymous Hero", emoji: "🦸", amount: "★★★" },
  { name: "Python Lover", emoji: "🐍", amount: "★★" },
  { name: "Code Wizard", emoji: "🧙", amount: "★★★★" },
  { name: "Bug Hunter", emoji: "🐛", amount: "★★" },
  { name: "Night Coder", emoji: "🌙", amount: "★★★" },
];

const perks = [
  { emoji: "📚", title: "Free Forever", desc: "Your donation keeps PyMaster free for everyone" },
  { emoji: "🚀", title: "New Features", desc: "Help us build more lessons, problems, and tools" },
  { emoji: "🌍", title: "Global Impact", desc: "Support learners from all around the world" },
  { emoji: "💎", title: "Donor Badge", desc: "Get recognized as a PyMaster supporter" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function DonatePage() {
  const { language } = useLanguage();
  const text = {
    english: {
      support: "Support",
      intro: "PyMaster is free and always will be. Your donations help us create more lessons, build better tools, and reach more aspiring Python developers worldwide.",
      gpayTitle: "Pay via GPay 📱",
      gpayDesc: "Scan the QR code below with Google Pay or any UPI app to donate instantly.",
      chooseSupport: "Choose How to Support 🎁",
      champions: "Wall of Champions ⭐",
      yourName: "Your name could be here! 🌟 Donate to join our Wall of Champions.",
      thankYou: "Thank You!",
      thanksDesc: "Every contribution, no matter how small, makes a huge difference. Together, we're building the best free Python learning platform.",
      donateVia: "Donate via",
    },
    tamil: {
      support: "ஆதரிக்கவும்",
      intro: "PyMaster இலவசம், என்றும் இலவசமே. உங்கள் நன்கொடைகள் மேலும் பாடங்கள் மற்றும் நல்ல கருவிகளை உருவாக்க உதவுகின்றன.",
      gpayTitle: "GPay மூலம் செலுத்தவும் 📱",
      gpayDesc: "Google Pay அல்லது எந்த UPI ஆப்பாலும் கீழே உள்ள QR-ஐ ஸ்கேன் செய்து உடனே நன்கொடை அளிக்கலாம்.",
      chooseSupport: "ஆதரிக்கும் முறையை தேர்வு செய்யவும் 🎁",
      champions: "சாம்பியன் சுவர் ⭐",
      yourName: "உங்கள் பெயரும் இங்கே இருக்கலாம்! 🌟",
      thankYou: "நன்றி!",
      thanksDesc: "சிறிய பங்களிப்பும் பெரிய மாற்றத்தை ஏற்படுத்தும். சேர்ந்து சிறந்த இலவச Python கற்றல் தளத்தை உருவாக்குகிறோம்.",
      donateVia: "இதன் மூலம் நன்கொடை",
    },
    kannada: {
      support: "ಬೆಂಬಲಿಸಿ",
      intro: "PyMaster ಉಚಿತವಾಗಿದೆ ಮತ್ತು ಹಾಗೆಯೇ ಇರುತ್ತದೆ. ನಿಮ್ಮ ದೇಣಿಗೆಗಳು ಇನ್ನಷ್ಟು ಪಾಠಗಳು ಮತ್ತು ಉತ್ತಮ ಸಾಧನಗಳನ್ನು ನಿರ್ಮಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ.",
      gpayTitle: "GPay ಮೂಲಕ ಪಾವತಿ 📱",
      gpayDesc: "Google Pay ಅಥವಾ ಯಾವುದೇ UPI ಆಪ್ ಮೂಲಕ ಕೆಳಗಿನ QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ದೇಣಿಗೆ ನೀಡಿ.",
      chooseSupport: "ಹೇಗೆ ಬೆಂಬಲಿಸಬೇಕು ಆಯ್ಕೆಮಾಡಿ 🎁",
      champions: "ಚಾಂಪಿಯನ್ ಗೋಡೆ ⭐",
      yourName: "ನಿಮ್ಮ ಹೆಸರು ಕೂಡ ಇಲ್ಲಿ ಇರಬಹುದು! 🌟",
      thankYou: "ಧನ್ಯವಾದಗಳು!",
      thanksDesc: "ಚಿಕ್ಕ ಕೊಡುಗೆಯೂ ದೊಡ್ಡ ಬದಲಾವಣೆ ತರುತ್ತದೆ. ನಾವು ಸೇರಿ ಉತ್ತಮ ಉಚಿತ Python ಕಲಿಕಾ ವೇದಿಕೆಯನ್ನು ನಿರ್ಮಿಸುತ್ತಿದ್ದೇವೆ.",
      donateVia: "ಇದರ ಮೂಲಕ ದೇಣಿಗೆ",
    },
    telugu: {
      support: "మద్దతు ఇవ్వండి",
      intro: "PyMaster ఉచితం మరియు అలాగే ఉంటుంది. మీ విరాళాలు మరిన్ని పాఠాలు, మెరుగైన టూల్స్ నిర్మించడానికి సహాయపడతాయి.",
      gpayTitle: "GPay ద్వారా చెల్లించండి 📱",
      gpayDesc: "Google Pay లేదా ఏదైనా UPI యాప్‌తో క్రింది QR కోడ్ స్కాన్ చేసి వెంటనే విరాళం ఇవ్వండి.",
      chooseSupport: "మద్దతు విధానం ఎంచుకోండి 🎁",
      champions: "చాంపియన్ల గోడ ⭐",
      yourName: "మీ పేరు కూడా ఇక్కడ ఉండొచ్చు! 🌟",
      thankYou: "ధన్యవాదాలు!",
      thanksDesc: "చిన్న సహకారమైనా పెద్ద మార్పు చేస్తుంది. కలసి ఉత్తమ ఉచిత Python లెర్నింగ్ ప్లాట్‌ఫామ్‌ను నిర్మిస్తున్నాము.",
      donateVia: "దీనివద్ద విరాళం",
    },
    hindi: {
      support: "सपोर्ट करें",
      intro: "PyMaster मुफ्त है और रहेगा। आपकी डोनेशन से हम और पाठ, बेहतर टूल्स और ज्यादा शिक्षार्थियों तक पहुंच बना पाते हैं।",
      gpayTitle: "GPay से भुगतान करें 📱",
      gpayDesc: "Google Pay या किसी भी UPI ऐप से नीचे का QR स्कैन करके तुरंत डोनेट करें।",
      chooseSupport: "सपोर्ट का तरीका चुनें 🎁",
      champions: "चैंपियंस वॉल ⭐",
      yourName: "आपका नाम भी यहां हो सकता है! 🌟",
      thankYou: "धन्यवाद!",
      thanksDesc: "छोटी से छोटी मदद भी बड़ा फर्क लाती है। मिलकर हम बेहतरीन मुफ्त Python लर्निंग प्लेटफॉर्म बना रहे हैं।",
      donateVia: "इससे डोनेट करें",
    },
  } as const;
  const t = text[language];
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Support PyMaster | Donate</title>
        <meta
          name="description"
          content="Support PyMaster through Buy Me a Coffee, GPay, or PayPal to help keep Python lessons and practice resources growing."
        />
      </Helmet>
      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-destructive/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Heart className="w-16 h-16 text-destructive mx-auto mb-6 fill-destructive/30" />
          </motion.div>
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            {t.support} <span className="text-primary">PyMaster</span> 💙
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            {t.intro}
          </motion.p>
        </div>
      </section>

      {/* Why Donate */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card border border-border rounded-xl p-5 text-center hover:border-primary/30 transition-colors"
            >
              <div className="text-3xl mb-3">{perk.emoji}</div>
              <h3 className="font-semibold text-foreground mb-1">{perk.title}</h3>
              <p className="text-xs text-muted-foreground">{perk.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* GPay QR Code Section */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="bg-card border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center mb-16"
        >
          <Smartphone className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">{t.gpayTitle}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {t.gpayDesc}
          </p>
          <div className="inline-block rounded-xl overflow-hidden border border-border shadow-lg mb-4">
            <img src={gpayQR} alt={`GPay QR Code for donating to PyMaster by ${siteConfig.author}`} className="w-64 h-auto" loading="lazy" />
          </div>
          <p className="text-sm font-mono text-foreground mb-1">UPI ID: {siteConfig.donations.upiId}</p>
          <p className="text-xs text-muted-foreground">
            Scan & pay any amount you'd like. Every rupee counts! 🙏
          </p>
        </motion.div>

        {/* Donation Options */}
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          {t.chooseSupport}
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {donationLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className={`border rounded-2xl p-6 transition-all duration-300 ${link.color}`}
            >
              <div className="text-4xl mb-3">{link.emoji}</div>
              <h3 className="text-lg font-bold text-foreground mb-2">{link.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
              <Button
                className={`w-full gap-2 ${link.buttonColor}`}
                onClick={() => window.open(link.url, "_blank")}
              >
                <link.icon className="w-4 h-4" />
                {t.donateVia} {link.name}
                <ExternalLink className="w-3 h-3" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Wall of Supporters */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-foreground text-center mb-6 flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-python-yellow fill-python-yellow" /> {t.champions}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {supporters.map((s, i) => (
              <motion.div
                key={s.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="text-center p-3 rounded-xl bg-surface-1 border border-border"
              >
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-sm font-medium text-foreground">{s.name}</div>
                <div className="text-xs text-python-yellow">{s.amount}</div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            {t.yourName}
          </p>
        </div>

        {/* Thank you */}
        <div className="text-center pb-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="text-5xl mb-4">🙏</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{t.thankYou}</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t.thanksDesc}
            </p>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
}

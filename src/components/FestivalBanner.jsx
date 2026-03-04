import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
const FESTIVALS = [
  // January - New Year
  {
    name: "🎇 Happy New Year 2026!",
    subtitle: "Start the year with amazing deals — Up to 50% OFF",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    accent: "#e94560",
    emoji: ["✨", "🎆", "🎇", "🥂", "🎊"],
    code: "NEW2026"
  },
  // February - Valentine's Day
  {
    name: "💝 Happy Valentine's Day!",
    subtitle: "Share the love — Romantic gifts & sweet deals",
    gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
    accent: "#fff",
    emoji: ["💝", "💖", "🌹", "💌", "🍫"],
    code: "LOVE25"
  },
  // March - Holi
  {
    name: "🌈 Happy Holi!",
    subtitle: "Play with colors, shop with joy — Colorful deals await!",
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #feca57 30%, #48dbfb 60%, #ff9ff3 100%)",
    accent: "#1a1a2e",
    emoji: ["🌈", "🎨", "💦", "🌸", "🥳"],
    code: "HOLI30"
  },
  // April - Spring Sale
  {
    name: "🌸 Spring Sale is Here!",
    subtitle: "Fresh season, fresh deals — Bloom into savings",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fda085 100%)",
    accent: "#fff",
    emoji: ["🌸", "🌷", "🦋", "🌼", "🌿"],
    code: "SPRING20"
  },
  // May - Eid / Mother's Day
  {
    name: "🌙 Eid Mubarak & Happy Mother's Day!",
    subtitle: "Double celebration — Extra special gifts & offers",
    gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    accent: "#ffd700",
    emoji: ["🌙", "⭐", "🌹", "💐", "🎁"],
    code: "EID30"
  },
  // June - Summer Sale
  {
    name: "☀️ Summer Mega Sale!",
    subtitle: "Hot deals for hot days — Up to 60% OFF everything",
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    accent: "#1a1a2e",
    emoji: ["☀️", "🏖️", "🌊", "🍦", "🕶️"],
    code: "SUMMER60"
  },
  // July - Independence Day (India)
  {
    name: "🇮🇳 Happy Independence Day!",
    subtitle: "Celebrate freedom with patriotic deals — Jai Hind!",
    gradient: "linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%)",
    accent: "#000080",
    emoji: ["🇮🇳", "🎉", "✨", "🥳", "🎊"],
    code: "INDIA75"
  },
  // August - Raksha Bandhan / Onam
  {
    name: "🎀 Happy Raksha Bandhan & Onam!",
    subtitle: "Celebrate bonds & harvest — Festive gifts galore",
    gradient: "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)",
    accent: "#ffd700",
    emoji: ["🎀", "💛", "🌺", "🎁", "🥥"],
    code: "RAKHI25"
  },
  // September - Ganesh Chaturthi
  {
    name: "🐘 Happy Ganesh Chaturthi!",
    subtitle: "Blessings & Big Deals — Ganpati Bappa Morya!",
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 50%, #f7971e 100%)",
    accent: "#8b0000",
    emoji: ["🐘", "🪔", "🌺", "🍬", "✨"],
    code: "GANPATI20"
  },
  // October - Navratri / Halloween
  {
    name: "🎃 Navratri & Halloween Deals!",
    subtitle: "Garba nights & spooky savings — Treat yourself!",
    gradient: "linear-gradient(135deg, #eb5757 0%, #000000 100%)",
    accent: "#ff8c00",
    emoji: ["🎃", "🕷️", "🪔", "💃", "🌙"],
    code: "SPOOKY40"
  },
  // November - Diwali / Black Friday
  {
    name: "🪔 Happy Diwali & Black Friday!",
    subtitle: "Festival of lights meets biggest sale of the year!",
    gradient: "linear-gradient(135deg, #7c3700 0%, #c85000 50%, #ff8c00 100%)",
    accent: "#ffd700",
    emoji: ["🪔", "✨", "🎆", "🌟", "🪅"],
    code: "DIWALI50"
  },
  // December - Christmas / New Year Eve
  {
    name: "🎄 Merry Christmas & Happy New Year!",
    subtitle: "Season's greetings — Biggest holiday deals of the year",
    gradient: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)",
    accent: "#ff6b6b",
    emoji: ["🎄", "🎅", "⭐", "🎁", "❄️"],
    code: "XMAS50"
  },
  // Default - Mega Sale
  {
    name: "🎉 Mega Sale is LIVE!",
    subtitle: "Shop your favorites — Limited time offers across all categories",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    accent: "#ffd700",
    emoji: ["🎉", "🛍️", "💥", "🔥", "⚡"],
    code: "MEGA40"
  },
];

const getCurrentFestival = () => {
  const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
  const day = new Date().getDate();
  switch (month) {
    case 0:  return FESTIVALS[0];   // January  → New Year
    case 1:  return FESTIVALS[1];   // February → Valentine's Day
    case 2:  return FESTIVALS[2];   // March    → Holi (10-20) else Spring
    case 3:  return FESTIVALS[3];   // April    → Spring Sale
    case 4:  return FESTIVALS[4];   // May      → Eid / Mother's Day
    case 5:  return FESTIVALS[5];   // June     → Summer Sale
    case 6:  return FESTIVALS[6];   // July     → Independence Day
    case 7:  return FESTIVALS[7];   // August   → Raksha Bandhan
    case 8:  return FESTIVALS[8];   // September→ Ganesh Chaturthi
    case 9:  return FESTIVALS[9];   // October  → Navratri / Halloween
    case 10: return FESTIVALS[10];  // November → Diwali / Black Friday
    case 11: return FESTIVALS[11];  // December → Christmas
    default: return FESTIVALS[12];  // Fallback → Mega Sale
  }
};
export default function FestivalBanner({ compact = false }) {
  const festival = getCurrentFestival();
  const [visible, setVisible] = useState(true);
  const [floatPos, setFloatPos] = useState([]);
  const { applyPendingCoupon } = useAuth();  // ✅
  const navigate = useNavigate();
  useEffect(() => {
    // Generate random positions for floating emojis
    setFloatPos(festival.emoji.map(() => ({
      left: `${Math.random() * 90}%`,
      animDelay: `${Math.random() * 3}s`,
      size: `${16 + Math.random() * 16}px`,
    })));
  }, []);

  if (!visible) return null;
  // ✅ Click handler on coupon code
  const handleCouponClick = () => {
    applyPendingCoupon(festival.code);
    navigate('/cart');
  };

  if (!visible) return null;

  if (compact) {
    return (
      <div style={{ ...styles.compactBanner, background: festival.gradient }}>
        <span style={styles.compactText}>
          {festival.name} &nbsp;·&nbsp; {festival.subtitle} &nbsp;·&nbsp;
          {/* ✅ Clickable code in compact mode */}
          <span
            style={styles.compactCode}
            onClick={handleCouponClick}
            title="Click to apply in cart"
          >
            Use {festival.code}
          </span>
        </span>
        <button style={styles.compactClose} onClick={() => setVisible(false)}>✕</button>
      </div>
    );
  }
  if (compact) {
    // Slim banner for Login page
    return (
      <div style={styles.codeRow}>
  <span style={styles.codeLabel}>Use code:</span>
  <span style={{ ...styles.code, borderColor: festival.accent, color: festival.accent }}>
    {festival.code}  {/* ✅ dynamic code per festival */}
  </span>
</div>
    );
  }

   return (
    <div style={{ ...styles.banner, background: festival.gradient }}>

      {/* Floating Emojis - unchanged */}
      <div style={styles.floatingWrapper}>
        {floatPos.map((pos, i) => (
          <span key={i} style={{ ...styles.floatingEmoji, left: pos.left, fontSize: pos.size, animationDelay: pos.animDelay }}>
            {festival.emoji[i % festival.emoji.length]}
          </span>
        ))}
      </div>

      <div style={styles.content}>
        <div style={styles.badgeRow}>
          <span style={{ ...styles.badge, background: festival.accent, color: '#1a1a2e' }}>
            🔥 Limited Time
          </span>
        </div>
        <h2 style={styles.title}>{festival.name}</h2>
        <p style={styles.subtitle}>{festival.subtitle}</p>

        {/* ✅ Clickable coupon code */}
        <div style={styles.codeRow}>
          <span style={styles.codeLabel}>Use code:</span>
          <span
            style={{ ...styles.code, borderColor: festival.accent, color: festival.accent, cursor: 'pointer' }}
            onClick={handleCouponClick}
            title="Click to apply in cart"
          >
            {festival.code}
          </span>
          <span style={styles.clickHint}>👆 click to apply</span>
        </div>
      </div>

      <button style={styles.closeBtn} onClick={() => setVisible(false)}>✕</button>

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
          50%  { transform: translateY(-20px) rotate(10deg); opacity: 1; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
        }
        @keyframes shimmer {
          0%   { opacity: 0.7; }
          50%  { opacity: 1; }
          100% { opacity: 0.7; }
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  banner: {
    position: 'relative',
    borderRadius: '20px',
    padding: '32px 48px',
    marginBottom: '32px',
    overflow: 'hidden',
    textAlign: 'center',
    animation: 'slideDown 0.5s ease',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  },
  floatingWrapper: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  floatingEmoji: {
    position: 'absolute',
    top: '10%',
    animation: 'floatUp 3s ease-in-out infinite',
    userSelect: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  badgeRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  badge: {
    fontSize: '12px',
    fontWeight: '800',
    padding: '4px 14px',
    borderRadius: '20px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '32px',
    fontWeight: '900',
    color: '#fff',
    margin: 0,
    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.85)',
    margin: 0,
    maxWidth: '500px',
  },
  codeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '4px',
  },
  codeLabel: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  code: {
    fontSize: '16px',
    fontWeight: '800',
    padding: '4px 16px',
    borderRadius: '8px',
    border: '2px dashed',
    letterSpacing: '2px',
    background: 'rgba(255,255,255,0.1)',
    animation: 'shimmer 2s ease infinite',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '16px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', sans-serif",
  },

  // Compact (Login page)
  compactBanner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 40px 10px 16px',
    position: 'relative',
    animation: 'slideDown 0.5s ease',
  },
  compactText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  compactClose: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    fontFamily: "'Segoe UI', sans-serif",
  },
    clickHint: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
  },
  compactCode: {
    fontWeight: '800',
    textDecoration: 'underline',
    cursor: 'pointer',
    letterSpacing: '1px',
    color: '#fff',
  },
};
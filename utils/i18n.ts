import { useState, useEffect } from 'react';

type Language = 'en' | 'th';

const translations = {
  en: {
    title: "RunSmart VCR Calculator",
    subtitle: "Velocity & Capacity Calculator",
    sectionTitle: "Calculate Your Zones",
    sectionDesc: "Enter your results from a 30-minute or 60-minute all-out time trial to determine your Threshold Pace and personalized training zones.",
    inputTitle: "Input Data",
    durationLabel: "Test Duration (Time Trial)",
    distanceLabel: "Distance Covered (km)",
    calculateBtn: "Calculate VCR",
    avgPace: "Avg Pace",
    thresholdPace: "Threshold Pace",
    vo2Max: "VO2 Max (Est)",
    zonesTitle: "Training Zones",
    aiTitle: "AI Coach Analysis",
    aiSubtitle: "Powered by Gemini 3 Flash",
    analyzeBtn: "Analyze Performance",
    analyzing: "Analyzing your run data...",
    noDataTitle: "No Data Yet",
    noDataDesc: "Complete the form on the left to see your VCR analysis, threshold pace, and AI coaching insights.",
    zones: {
      easy: "Easy / Recovery",
      easyDesc: "Warm up, cool down, and recovery runs. Builds aerobic base.",
      marathon: "Marathon Pace",
      marathonDesc: "Steady aerobic running. Used for long runs.",
      threshold: "Threshold",
      thresholdDesc: "Comfortably hard. Improves lactate clearance.",
      interval: "Interval",
      intervalDesc: "Hard effort. Improves VO2 Max.",
      repetition: "Repetition",
      repetitionDesc: "Very hard. Improves speed and economy.",
    },
    mins: "Mins",
    km: "km",
    inputMethodLabel: "Input Method",
    byDistance: "Distance",
    byPace: "Avg Pace",
    paceLabel: "Average Pace",
    min: "Min",
    sec: "Sec"
  },
  th: {
    title: "RunSmart VCR Calculator",
    subtitle: "เครื่องคำนวณความเร็วและสมรรถนะ",
    sectionTitle: "คำนวณโซนการฝึกซ้อม",
    sectionDesc: "กรอกผลการวิ่งจาก Time Trial 30 หรือ 60 นาที เพื่อหาค่า Threshold Pace และโซนการฝึกซ้อมเฉพาะบุคคลของคุณ",
    inputTitle: "ข้อมูลการวิ่ง",
    durationLabel: "ระยะเวลาทดสอบ (Time Trial)",
    distanceLabel: "ระยะทางที่ทำได้ (กม.)",
    calculateBtn: "คำนวณค่า VCR",
    avgPace: "เพซเฉลี่ย",
    thresholdPace: "Threshold Pace",
    vo2Max: "VO2 Max (ประมาณ)",
    zonesTitle: "โซนการฝึกซ้อม",
    aiTitle: "บทวิเคราะห์จาก AI Coach",
    aiSubtitle: "ขับเคลื่อนโดย Gemini 3 Flash",
    analyzeBtn: "วิเคราะห์ผลการวิ่ง",
    analyzing: "กำลังวิเคราะห์ข้อมูล...",
    noDataTitle: "ยังไม่มีข้อมูล",
    noDataDesc: "กรอกแบบฟอร์มด้านซ้ายเพื่อดูผลวิเคราะห์ VCR, Threshold Pace และคำแนะนำจาก AI",
    zones: {
      easy: "Easy / Recovery (วิ่งสบาย)",
      easyDesc: "วอร์มอัพ คูลดาวน์ และวิ่งฟื้นฟู ช่วยสร้างพื้นฐานแอโรบิก",
      marathon: "Marathon Pace (เพซมาราธอน)",
      marathonDesc: "วิ่งความเร็วคงที่ ใช้สำหรับการวิ่งระยะไกล (Long Run)",
      threshold: "Threshold (เทรโชลด์)",
      thresholdDesc: "เหนื่อยแต่ทนได้ (Comfortably hard) ช่วยปรับปรุงการกำจัดกรดแลคติก",
      interval: "Interval (อินเทอร์วัล)",
      intervalDesc: "วิ่งหนัก ช่วยพัฒนา VO2 Max",
      repetition: "Repetition (เรเพทิชั่น)",
      repetitionDesc: "หนักมาก ช่วยเรื่องความเร็วและเศรษฐศาสตร์การวิ่ง (Running Economy)",
    },
    mins: "นาที",
    km: "กม.",
    inputMethodLabel: "เลือกวิธีระบุข้อมูล",
    byDistance: "ระยะทาง",
    byPace: "เพซเฉลี่ย",
    paceLabel: "ระบุเพซเฉลี่ย",
    min: "นาที",
    sec: "วินาที"
  }
};

export const useTranslation = () => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    // Detect browser language. If it starts with 'th', use Thai, otherwise default to English.
    const userLang = navigator.language.toLowerCase().startsWith('th') ? 'th' : 'en';
    setLang(userLang);
  }, []);

  return { t: translations[lang], lang };
};
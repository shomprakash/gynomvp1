import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input, trackerType, userId } = await req.json();

    // Process health input using structured analysis
    const processedData = await processHealthInput(input, trackerType);
    const insights = generateInsights(processedData, trackerType);

    return new Response(JSON.stringify({ 
      data: processedData, 
      insights: insights 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing health input:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processHealthInput(input: string, trackerType: string) {
  // Extract structured data from natural language input
  const data = {
    original_input: input,
    tracker_type: trackerType,
    processed_at: new Date().toISOString(),
  };

  // Simple pattern matching for health data extraction
  switch (trackerType) {
    case 'period':
      return {
        ...data,
        cycle_info: extractCycleInfo(input),
        symptoms: extractSymptoms(input),
        flow: extractFlow(input),
      };
    case 'pregnancy':
      return {
        ...data,
        week: extractWeek(input),
        symptoms: extractPregnancySymptoms(input),
        appointments: extractAppointments(input),
      };
    case 'menopause':
      return {
        ...data,
        symptoms: extractMenopauseSymptoms(input),
        treatments: extractTreatments(input),
        period_status: extractPeriodStatus(input),
      };
    case 'ovulation':
      return {
        ...data,
        cycle_day: extractCycleDay(input),
        fertility_signs: extractFertilitySigns(input),
        temperature: extractTemperature(input),
      };
    default:
      return data;
  }
}

function extractCycleInfo(input: string) {
  const datePattern = /(\w+)\s+(\d{1,2})/gi;
  const matches = input.match(datePattern);
  
  return {
    start_date: extractDate(input, ['started', 'began', 'period started']),
    end_date: extractDate(input, ['ended', 'finished', 'stopped']),
    length: extractNumber(input, ['days', 'lasted']),
    cycle_length: extractNumber(input, ['cycle', 'usually']),
  };
}

function extractSymptoms(input: string) {
  const symptoms = [];
  const commonSymptoms = [
    'cramps', 'cramping', 'bloating', 'headache', 'tired', 'fatigue',
    'mood changes', 'irritable', 'anxiety', 'breast tenderness'
  ];
  
  commonSymptoms.forEach(symptom => {
    if (input.toLowerCase().includes(symptom)) {
      symptoms.push({
        name: symptom,
        severity: extractSeverity(input, symptom),
      });
    }
  });
  
  return symptoms;
}

function extractFlow(input: string) {
  const flows = ['light', 'moderate', 'heavy'];
  for (const flow of flows) {
    if (input.toLowerCase().includes(flow)) {
      return flow;
    }
  }
  return 'unknown';
}

function extractWeek(input: string) {
  const weekMatch = input.match(/(\d+)\s*weeks?/i);
  return weekMatch ? parseInt(weekMatch[1]) : null;
}

function extractPregnancySymptoms(input: string) {
  const symptoms = [];
  const pregnancySymptoms = [
    'morning sickness', 'nausea', 'fatigue', 'food aversions', 
    'cravings', 'breast tenderness', 'frequent urination'
  ];
  
  pregnancySymptoms.forEach(symptom => {
    if (input.toLowerCase().includes(symptom)) {
      symptoms.push(symptom);
    }
  });
  
  return symptoms;
}

function extractMenopauseSymptoms(input: string) {
  const symptoms = [];
  const menopauseSymptoms = [
    'hot flashes', 'night sweats', 'mood changes', 'anxiety',
    'sleep problems', 'irregular periods'
  ];
  
  menopauseSymptoms.forEach(symptom => {
    if (input.toLowerCase().includes(symptom)) {
      symptoms.push(symptom);
    }
  });
  
  return symptoms;
}

function extractFertilitySigns(input: string) {
  const signs = [];
  const fertilityTerms = [
    'cervical mucus', 'cramping', 'ovulation pain', 'temperature spike'
  ];
  
  fertilityTerms.forEach(term => {
    if (input.toLowerCase().includes(term)) {
      signs.push(term);
    }
  });
  
  return signs;
}

function extractDate(input: string, keywords: string[]) {
  // Simple date extraction - could be enhanced with more sophisticated parsing
  const datePattern = /(\w+)\s+(\d{1,2})/gi;
  return input.match(datePattern)?.[0] || null;
}

function extractNumber(input: string, keywords: string[]) {
  for (const keyword of keywords) {
    const pattern = new RegExp(`(\\d+)\\s*${keyword}`, 'i');
    const match = input.match(pattern);
    if (match) return parseInt(match[1]);
  }
  return null;
}

function extractSeverity(input: string, symptom: string) {
  const severityTerms = ['mild', 'moderate', 'severe', 'intense'];
  for (const term of severityTerms) {
    if (input.toLowerCase().includes(term)) {
      return term;
    }
  }
  return 'moderate';
}

function extractCycleDay(input: string) {
  const dayMatch = input.match(/day\s*(\d+)/i);
  return dayMatch ? parseInt(dayMatch[1]) : null;
}

function extractTemperature(input: string) {
  const tempMatch = input.match(/temperature.*?(\d+\.?\d*)/i);
  return tempMatch ? parseFloat(tempMatch[1]) : null;
}

function extractAppointments(input: string) {
  return input.toLowerCase().includes('appointment') ? ['recent checkup'] : [];
}

function extractTreatments(input: string) {
  const treatments = [];
  const treatmentTerms = ['supplements', 'hormone therapy', 'yoga', 'exercise'];
  
  treatmentTerms.forEach(treatment => {
    if (input.toLowerCase().includes(treatment)) {
      treatments.push(treatment);
    }
  });
  
  return treatments;
}

function extractPeriodStatus(input: string) {
  const monthsMatch = input.match(/(\d+)\s*months?.*?(no|without).*?period/i);
  return monthsMatch ? `${monthsMatch[1]} months without period` : 'unknown';
}

function generateInsights(data: any, trackerType: string) {
  const insights = [];
  
  switch (trackerType) {
    case 'period':
      if (data.cycle_info?.cycle_length > 35) {
        insights.push({
          id: 'long-cycle',
          type: 'pattern',
          title: 'Extended Cycle Length',
          description: 'Your cycle appears longer than the typical 21-35 day range. Consider tracking for a few more months to establish your personal pattern.',
          severity: 'medium'
        });
      }
      
      if (data.symptoms?.some((s: any) => s.severity === 'severe')) {
        insights.push({
          id: 'severe-symptoms',
          type: 'concern',
          title: 'Severe Symptoms Noted',
          description: 'You mentioned experiencing severe symptoms. If this persists, consider discussing with your healthcare provider.',
          severity: 'high'
        });
      }
      break;
      
    case 'pregnancy':
      if (data.week && data.week > 12) {
        insights.push({
          id: 'second-trimester',
          type: 'recommendation',
          title: 'Second Trimester Milestone',
          description: 'You\'re entering the second trimester! Many people find this period more comfortable with reduced morning sickness.',
          severity: 'low'
        });
      }
      break;
      
    case 'menopause':
      if (data.period_status?.includes('months')) {
        insights.push({
          id: 'perimenopause-pattern',
          type: 'pattern',
          title: 'Menopause Transition',
          description: 'Extended periods without menstruation suggest you may be in perimenopause or menopause. Regular check-ups can help monitor this transition.',
          severity: 'medium'
        });
      }
      break;
      
    case 'ovulation':
      if (data.fertility_signs?.length > 0) {
        insights.push({
          id: 'ovulation-signs',
          type: 'pattern',
          title: 'Fertility Signs Detected',
          description: 'You\'re showing multiple signs of ovulation. This is a good time for conception if that\'s your goal.',
          severity: 'low'
        });
      }
      break;
  }
  
  // General health recommendation
  insights.push({
    id: 'general-health',
    type: 'recommendation',
    title: 'Keep Tracking',
    description: 'Consistent tracking helps identify patterns and provides valuable information for healthcare discussions.',
    severity: 'low'
  });
  
  return insights;
}
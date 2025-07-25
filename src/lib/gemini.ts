import { GoogleGenerativeAI } from '@google/generative-ai';

const DEFAULT_API_KEY = 'AIzaSyC5ybft9-GMaYdFAZpYqUbeT328JSx5rlc';

export const getGeminiClient = (customApiKey?: string) => {
  const apiKey = customApiKey || DEFAULT_API_KEY;
  return new GoogleGenerativeAI(apiKey);
};

export const generateGynecologicalResponse = async (
  message: string,
  customApiKey?: string
): Promise<{ content: string; credibilityScore: number; isEmergency: boolean }> => {
  try {
    const genAI = getGeminiClient(customApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a specialized AI gynecological health assistant. Provide evidence-based, accurate medical information about women's health, gynecology, periods, and related symptoms. 

IMPORTANT GUIDELINES:
- Always provide medically accurate information
- Include a credibility score (0-100) based on evidence quality
- Identify emergency symptoms that require immediate medical attention
- Be supportive and non-judgmental
- Recommend seeing a healthcare provider when appropriate
- Cite medical sources when possible

User question: "${message}"

Please respond with:
1. A comprehensive, medically accurate answer
2. Whether this indicates an emergency situation (true/false)
3. A credibility score (0-100) based on medical evidence

Format your response as a natural medical consultation response.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Detect emergency keywords
    const emergencyKeywords = [
      'severe pain', 'heavy bleeding', 'hemorrhage', 'passed out', 'fainted',
      'severe cramping', 'chest pain', 'difficulty breathing', 'extreme pain',
      'emergency', 'urgent', 'high fever', 'infected', 'severe nausea',
      'sudden onset', 'couldn\'t stop bleeding', 'loss of consciousness'
    ];

    const isEmergency = emergencyKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase()) ||
      text.toLowerCase().includes('immediate medical attention') ||
      text.toLowerCase().includes('emergency') ||
      text.toLowerCase().includes('urgent care')
    );

    // Calculate credibility score based on response content
    let credibilityScore = 85; // Base score
    
    if (text.includes('medical literature') || text.includes('studies show')) credibilityScore += 5;
    if (text.includes('consult') || text.includes('healthcare provider')) credibilityScore += 3;
    if (text.length > 200) credibilityScore += 2; // More detailed responses
    if (isEmergency) credibilityScore += 5; // Emergency detection adds credibility

    credibilityScore = Math.min(98, credibilityScore); // Cap at 98

    return {
      content: text,
      credibilityScore,
      isEmergency
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};
import type {
  Profile,
  GenerationOptions,
  ResumeContent,
  CoverLetterContent,
  LinkedInContent,
  InterviewEvaluation,
} from '@/types/resume';

const APP_ID = import.meta.env.VITE_APP_ID;
const API_URL = 'https://api-integrations.appmedo.com/app-7n7oib9pckjl/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse';

interface Message {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

async function callAI(messages: Message[]): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      body: JSON.stringify({
        contents: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.statusText}. ${errorText}`);
    }

    // Parse SSE (Server-Sent Events) response
    const text = await response.text();
    const lines = text.split('\n');
    let fullText = '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.substring(6).trim();
        if (jsonStr && jsonStr !== '[DONE]') {
          try {
            const data = JSON.parse(jsonStr);
            if (data.candidates && data.candidates.length > 0) {
              const content = data.candidates[0].content;
              if (content && content.parts && content.parts.length > 0) {
                fullText += content.parts[0].text || '';
              }
            }
          } catch (e) {
            // Skip invalid JSON lines
            console.warn('Failed to parse SSE line:', jsonStr);
          }
        }
      }
    }

    if (!fullText) {
      throw new Error('No content received from API');
    }

    return fullText;
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
}

export async function generateResume(
  profile: Profile,
  options: GenerationOptions
): Promise<ResumeContent> {
  const prompt = `You are an expert resume writer. Create an ATS-friendly resume based on the following profile for a ${options.targetRole} position. Use a ${options.tone} tone.

Profile:
- Name: ${profile.fullName}
- Current Title: ${profile.currentTitle}
- Email: ${profile.email}
- Location: ${profile.location}
- Work Experience: ${profile.workExperience}
- Projects: ${profile.projects}
- Skills: ${profile.skills}
${profile.education ? `- Education: ${profile.education}` : ''}
${profile.resumeText ? `\nAdditional Resume Content:\n${profile.resumeText}` : ''}

IMPORTANT: You must respond with ONLY a valid JSON object, no additional text before or after.

Respond with this exact JSON structure:
{
  "professionalSummary": "2-3 sentence summary highlighting key qualifications",
  "experience": "Formatted work experience with bullet points using • symbol",
  "projects": "Formatted projects with bullet points using • symbol",
  "skills": "Categorized skills list (e.g., Technical: JavaScript, Python | Soft Skills: Leadership, Communication)",
  "education": "Education details with degree, institution, and year"
}

Make sure the content is ATS-friendly, uses action verbs, and quantifies achievements where possible.`;

  const messages: Message[] = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const response = await callAI(messages);
  
  try {
    // Try to find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Validate that all required fields exist
      if (parsed.professionalSummary && parsed.experience && parsed.projects && parsed.skills) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse JSON response:', e);
  }
  
  // Fallback: create structured content from response
  return {
    professionalSummary: response.split('\n\n')[0] || response.substring(0, 300),
    experience: profile.workExperience,
    projects: profile.projects,
    skills: profile.skills,
    education: profile.education || '',
  };
}

export async function generateCoverLetter(
  profile: Profile,
  options: GenerationOptions,
  jobDescription: string
): Promise<CoverLetterContent> {
  const prompt = `You are an expert cover letter writer. Create a tailored cover letter for a ${options.targetRole} position using a ${options.tone} tone.

Profile:
- Name: ${profile.fullName}
- Current Title: ${profile.currentTitle}
- Work Experience: ${profile.workExperience}
- Projects: ${profile.projects}
- Skills: ${profile.skills}

Job Description:
${jobDescription}

IMPORTANT: You must respond with ONLY a valid JSON object, no additional text before or after.

Respond with this exact JSON structure:
{
  "content": "Full cover letter text with proper formatting and paragraphs",
  "keyAchievements": ["Achievement 1 that matches job requirements", "Achievement 2 that demonstrates relevant skills", "Achievement 3 that shows impact"]
}

The cover letter should:
1. Be personalized to the job description
2. Highlight 2-3 key achievements that match the role
3. Show enthusiasm and cultural fit
4. Be concise and impactful (3-4 paragraphs)`;

  const messages: Message[] = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const response = await callAI(messages);
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.content) {
        return {
          content: parsed.content,
          keyAchievements: Array.isArray(parsed.keyAchievements) ? parsed.keyAchievements : [],
        };
      }
    }
  } catch (e) {
    console.error('Failed to parse JSON response:', e);
  }
  
  // Fallback: use the response as content
  return {
    content: response,
    keyAchievements: [],
  };
}

export async function generateLinkedInContent(
  profile: Profile,
  options: GenerationOptions
): Promise<LinkedInContent> {
  const prompt = `You are a LinkedIn profile optimization expert. Create optimized LinkedIn content for a ${options.targetRole} using a ${options.tone} tone.

Profile:
- Name: ${profile.fullName}
- Current Title: ${profile.currentTitle}
- Work Experience: ${profile.workExperience}
- Projects: ${profile.projects}
- Skills: ${profile.skills}

IMPORTANT: You must respond with ONLY a valid JSON object, no additional text before or after.

Respond with this exact JSON structure:
{
  "headline": "Compelling headline under 120 characters",
  "about": "Engaging About section with 3 paragraphs separated by double line breaks"
}

The content should:
1. Be keyword-optimized for searchability
2. Showcase unique value proposition
3. Include specific achievements
4. Be engaging and authentic
5. Headline must be under 120 characters`;

  const messages: Message[] = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const response = await callAI(messages);
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.headline && parsed.about) {
        return {
          headline: parsed.headline.substring(0, 120), // Ensure max 120 chars
          about: parsed.about,
        };
      }
    }
  } catch (e) {
    console.error('Failed to parse JSON response:', e);
  }
  
  // Fallback: create basic content
  return {
    headline: `${profile.currentTitle} | ${options.targetRole}`.substring(0, 120),
    about: response,
  };
}

export async function evaluateInterviewAnswer(
  question: string,
  answer: string,
  profile: Profile,
  questionType: 'behavioral' | 'technical'
): Promise<InterviewEvaluation> {
  const prompt = questionType === 'behavioral'
    ? `You are an expert interview coach. Evaluate this behavioral interview answer using the STAR format (Situation, Task, Action, Result).

Question: ${question}
Answer: ${answer}

Candidate Profile:
- Name: ${profile.fullName}
- Current Title: ${profile.currentTitle}
- Experience: ${profile.workExperience}

IMPORTANT: You must respond with ONLY a valid JSON object, no additional text before or after.

Respond with this exact JSON structure:
{
  "score": 8,
  "strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "improvements": ["Actionable improvement 1", "Actionable improvement 2", "Actionable improvement 3"],
  "rewrittenAnswer": "Improved version of the answer using STAR format with clear Situation, Task, Action, and Result sections"
}

Score should be 0-10. Provide specific, actionable feedback based on STAR format completeness.`
    : `You are an expert technical interview coach. Evaluate this system design or technical answer.

Question: ${question}
Answer: ${answer}

Candidate Profile:
- Name: ${profile.fullName}
- Current Title: ${profile.currentTitle}
- Skills: ${profile.skills}

IMPORTANT: You must respond with ONLY a valid JSON object, no additional text before or after.

Respond with this exact JSON structure:
{
  "score": 8,
  "strengths": ["Technical strength 1", "Technical strength 2", "Technical strength 3"],
  "improvements": ["Technical improvement 1", "Technical improvement 2", "Technical improvement 3"],
  "rewrittenAnswer": "Improved version with better technical depth, scalability considerations, and clear communication"
}

Score should be 0-10. Focus on technical accuracy, scalability considerations, and communication clarity.`;

  const messages: Message[] = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const response = await callAI(messages);
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (typeof parsed.score === 'number' && Array.isArray(parsed.strengths) && Array.isArray(parsed.improvements)) {
        return {
          score: Math.max(0, Math.min(10, parsed.score)), // Ensure score is 0-10
          strengths: parsed.strengths.slice(0, 3), // Ensure max 3 items
          improvements: parsed.improvements.slice(0, 3), // Ensure max 3 items
          rewrittenAnswer: parsed.rewrittenAnswer || answer,
        };
      }
    }
  } catch (e) {
    console.error('Failed to parse JSON response:', e);
  }
  
  // Fallback: return basic evaluation
  return {
    score: 5,
    strengths: ['Answer provided', 'Attempted to address the question'],
    improvements: ['Unable to evaluate answer properly. Please try again.', 'Ensure your answer is clear and detailed.', 'Consider using specific examples.'],
    rewrittenAnswer: answer,
  };
}

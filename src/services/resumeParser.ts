import type { Profile } from '@/types/resume';

/**
 * Automatically extract structured information from resume text
 * This function uses pattern matching to identify and extract key information
 */
export function autoFillProfileFromText(resumeText: string): Partial<Profile> {
  const profile: Partial<Profile> = {
    resumeText,
  };

  // Extract email
  const emailMatch = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    profile.email = emailMatch[0];
  }

  // Extract phone number (various formats)
  const phoneMatch = resumeText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    // Store phone in resumeText for now, as Profile doesn't have a phone field
    // You can add it to the Profile type if needed
  }

  // Extract name (usually first line or near top, capitalized words)
  const lines = resumeText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Try to find name - usually first non-empty line with 2-4 capitalized words
  for (const line of lines.slice(0, 5)) {
    const words = line.split(/\s+/);
    const capitalizedWords = words.filter(word => /^[A-Z][a-z]+/.test(word));
    
    if (capitalizedWords.length >= 2 && capitalizedWords.length <= 4 && line.length < 50) {
      // Likely a name
      if (!line.includes('@') && !line.includes('http') && !line.includes('www')) {
        profile.fullName = capitalizedWords.join(' ');
        break;
      }
    }
  }

  // Extract location (city, state patterns)
  const locationPatterns = [
    /(?:^|\n)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})/m,
    /(?:^|\n)([A-Z][a-z]+,\s*[A-Z][a-z]+)/m,
    /Location:\s*([^\n]+)/i,
    /Based in:\s*([^\n]+)/i,
  ];

  for (const pattern of locationPatterns) {
    const match = resumeText.match(pattern);
    if (match) {
      profile.location = match[1].trim();
      break;
    }
  }

  // Extract current title (look for common title keywords)
  const titlePatterns = [
    /(?:^|\n)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Engineer|Developer|Manager|Designer|Analyst|Consultant|Specialist|Architect|Lead|Director|VP|President|CEO|CTO|CFO)))/m,
    /Title:\s*([^\n]+)/i,
    /Position:\s*([^\n]+)/i,
    /Role:\s*([^\n]+)/i,
  ];

  for (const pattern of titlePatterns) {
    const match = resumeText.match(pattern);
    if (match) {
      const title = match[1].trim();
      if (title.length < 100) {
        profile.currentTitle = title;
        break;
      }
    }
  }

  // Extract work experience section
  const experiencePatterns = [
    /(?:WORK\s+)?EXPERIENCE[:\s]*\n([\s\S]*?)(?=\n(?:EDUCATION|PROJECTS|SKILLS|CERTIFICATIONS)|$)/i,
    /(?:PROFESSIONAL\s+)?EXPERIENCE[:\s]*\n([\s\S]*?)(?=\n(?:EDUCATION|PROJECTS|SKILLS|CERTIFICATIONS)|$)/i,
    /EMPLOYMENT\s+HISTORY[:\s]*\n([\s\S]*?)(?=\n(?:EDUCATION|PROJECTS|SKILLS|CERTIFICATIONS)|$)/i,
  ];

  for (const pattern of experiencePatterns) {
    const match = resumeText.match(pattern);
    if (match) {
      profile.workExperience = match[1].trim();
      break;
    }
  }

  // Extract projects section
  const projectPatterns = [
    /PROJECTS?[:\s]*\n([\s\S]*?)(?=\n(?:EDUCATION|SKILLS|CERTIFICATIONS|EXPERIENCE)|$)/i,
    /KEY\s+PROJECTS?[:\s]*\n([\s\S]*?)(?=\n(?:EDUCATION|SKILLS|CERTIFICATIONS|EXPERIENCE)|$)/i,
  ];

  for (const pattern of projectPatterns) {
    const match = resumeText.match(pattern);
    if (match) {
      profile.projects = match[1].trim();
      break;
    }
  }

  // Extract skills section
  const skillsPatterns = [
    /SKILLS?[:\s]*\n([\s\S]*?)(?=\n(?:EDUCATION|PROJECTS|CERTIFICATIONS|EXPERIENCE)|$)/i,
    /TECHNICAL\s+SKILLS?[:\s]*\n([\s\S]*?)(?=\n(?:EDUCATION|PROJECTS|CERTIFICATIONS|EXPERIENCE)|$)/i,
    /CORE\s+COMPETENCIES[:\s]*\n([\s\S]*?)(?=\n(?:EDUCATION|PROJECTS|CERTIFICATIONS|EXPERIENCE)|$)/i,
  ];

  for (const pattern of skillsPatterns) {
    const match = resumeText.match(pattern);
    if (match) {
      profile.skills = match[1].trim();
      break;
    }
  }

  // Extract education section
  const educationPatterns = [
    /EDUCATION[:\s]*\n([\s\S]*?)(?=\n(?:EXPERIENCE|PROJECTS|SKILLS|CERTIFICATIONS)|$)/i,
    /ACADEMIC\s+BACKGROUND[:\s]*\n([\s\S]*?)(?=\n(?:EXPERIENCE|PROJECTS|SKILLS|CERTIFICATIONS)|$)/i,
  ];

  for (const pattern of educationPatterns) {
    const match = resumeText.match(pattern);
    if (match) {
      profile.education = match[1].trim();
      break;
    }
  }

  // If sections weren't found, try to extract from the full text
  if (!profile.workExperience) {
    // Look for date patterns that might indicate work experience
    const datePattern = /\d{4}\s*[-–]\s*(?:\d{4}|Present|Current)/gi;
    const matches = resumeText.match(datePattern);
    if (matches && matches.length > 0) {
      // Extract text around date patterns as potential work experience
      const experienceText = resumeText.split('\n')
        .filter(line => datePattern.test(line) || /\b(?:Company|Corporation|Inc|LLC|Ltd)\b/i.test(line))
        .join('\n');
      if (experienceText) {
        profile.workExperience = experienceText;
      }
    }
  }

  return profile;
}

/**
 * Clean and format extracted text for better readability
 */
export function cleanExtractedText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

/**
 * Validate extracted profile data
 */
export function validateExtractedProfile(profile: Partial<Profile>): {
  isValid: boolean;
  missingFields: string[];
} {
  const requiredFields = ['fullName', 'email', 'location', 'currentTitle', 'workExperience', 'projects', 'skills'];
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!profile[field as keyof Profile]) {
      missingFields.push(field);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

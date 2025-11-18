import type { Profile, ResumeContent } from '@/types/resume';

export function exportToTxt(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportResumeToDocx(
  profile: Profile,
  resume: ResumeContent
): void {
  const content = `${profile.fullName}
${profile.email} | ${profile.location}

PROFESSIONAL SUMMARY
${resume.professionalSummary}

WORK EXPERIENCE
${resume.experience}

PROJECTS
${resume.projects}

SKILLS
${resume.skills}

EDUCATION
${resume.education}`;

  exportToTxt(content, `${profile.fullName.replace(/\s+/g, '_')}_Resume.txt`);
}

export function exportCoverLetterToTxt(
  profile: Profile,
  content: string
): void {
  exportToTxt(content, `${profile.fullName.replace(/\s+/g, '_')}_CoverLetter.txt`);
}

export function exportLinkedInToTxt(
  profile: Profile,
  headline: string,
  about: string
): void {
  const content = `LinkedIn Profile Content for ${profile.fullName}

HEADLINE
${headline}

ABOUT
${about}`;

  exportToTxt(content, `${profile.fullName.replace(/\s+/g, '_')}_LinkedIn.txt`);
}

export async function parseDocxFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // DOCX files are ZIP archives containing XML files
        // For a simple implementation, we'll try to extract readable text
        // This is a basic approach - for production, use a library like mammoth.js
        
        const uint8Array = new Uint8Array(arrayBuffer);
        let text = '';
        
        // Try to decode as UTF-8 and extract readable text
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const rawText = decoder.decode(uint8Array);
        
        // Extract text between XML tags (basic approach)
        // This will get some text from the DOCX, though not perfectly formatted
        const textMatches = rawText.match(/>([^<]+)</g);
        if (textMatches) {
          text = textMatches
            .map(match => match.slice(1, -1).trim())
            .filter(t => t.length > 0 && !t.match(/^[0-9\s\-_\.]+$/))
            .join(' ');
        }
        
        if (!text || text.length < 10) {
          // Fallback: just return raw decoded text
          text = rawText.replace(/[^\x20-\x7E\n\r]/g, ' ').trim();
        }
        
        resolve(text || 'Unable to extract text from DOCX file. Please try uploading a TXT file or use manual input.');
      } catch (error) {
        console.error('DOCX parsing error:', error);
        reject(new Error('Failed to parse DOCX file. Please try uploading a TXT file instead.'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export async function parseTxtFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export async function parsePdfFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Basic PDF text extraction
        // PDF files contain text in specific stream objects
        // This is a simplified approach - for production, use pdf.js library
        
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const pdfText = decoder.decode(uint8Array);
        
        // Extract text between BT (Begin Text) and ET (End Text) operators
        // Also extract text from stream objects
        let extractedText = '';
        
        // Method 1: Extract text from text objects (BT...ET)
        const textObjectRegex = /BT\s*(.*?)\s*ET/gs;
        const textObjects = pdfText.match(textObjectRegex);
        
        if (textObjects) {
          textObjects.forEach(obj => {
            // Extract text from Tj, TJ operators
            const tjMatches = obj.match(/\((.*?)\)\s*Tj/g);
            if (tjMatches) {
              tjMatches.forEach(match => {
                const text = match.match(/\((.*?)\)/)?.[1];
                if (text) {
                  extractedText += text + ' ';
                }
              });
            }
            
            // Extract text from array notation [(text)] TJ
            const tjArrayMatches = obj.match(/\[(.*?)\]\s*TJ/g);
            if (tjArrayMatches) {
              tjArrayMatches.forEach(match => {
                const textParts = match.match(/\((.*?)\)/g);
                if (textParts) {
                  textParts.forEach(part => {
                    const text = part.slice(1, -1);
                    extractedText += text + ' ';
                  });
                }
              });
            }
          });
        }
        
        // Method 2: Fallback - extract readable ASCII text
        if (!extractedText || extractedText.length < 50) {
          const readableText = pdfText
            .replace(/[\x00-\x1F\x7F-\xFF]/g, ' ')
            .replace(/\s+/g, ' ')
            .split(' ')
            .filter(word => word.length > 2 && /^[a-zA-Z0-9@.,\-_]+$/.test(word))
            .join(' ');
          
          if (readableText.length > extractedText.length) {
            extractedText = readableText;
          }
        }
        
        // Clean up the extracted text
        extractedText = extractedText
          .replace(/\s+/g, ' ')
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '')
          .replace(/\\/g, '')
          .trim();
        
        if (!extractedText || extractedText.length < 20) {
          resolve('Unable to extract text from PDF file. For best results, please use a TXT file or copy-paste your resume content into the form fields below.');
        } else {
          resolve(extractedText);
        }
      } catch (error) {
        console.error('PDF parsing error:', error);
        reject(new Error('Failed to parse PDF file. Please try uploading a TXT file or use manual input.'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

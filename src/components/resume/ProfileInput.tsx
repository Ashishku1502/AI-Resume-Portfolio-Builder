import { useState } from 'react';
import { Upload, FileText, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Profile } from '@/types/resume';
import { parseTxtFile, parseDocxFile, parsePdfFile } from '@/services/documentService';
import { autoFillProfileFromText, validateExtractedProfile } from '@/services/resumeParser';

interface ProfileInputProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function ProfileInput({ profile, onProfileChange }: ProfileInputProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'txt' && fileExtension !== 'docx' && fileExtension !== 'pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a TXT, DOCX, or PDF file.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      let text = '';
      if (fileExtension === 'txt') {
        text = await parseTxtFile(file);
      } else if (fileExtension === 'docx') {
        text = await parseDocxFile(file);
      } else if (fileExtension === 'pdf') {
        text = await parsePdfFile(file);
      }

      // Automatically extract and fill profile fields
      const extractedProfile = autoFillProfileFromText(text);
      const validation = validateExtractedProfile(extractedProfile);

      // Merge extracted data with existing profile, keeping existing values if they exist
      const updatedProfile: Profile = {
        fullName: extractedProfile.fullName || profile.fullName,
        email: extractedProfile.email || profile.email,
        location: extractedProfile.location || profile.location,
        currentTitle: extractedProfile.currentTitle || profile.currentTitle,
        workExperience: extractedProfile.workExperience || profile.workExperience,
        projects: extractedProfile.projects || profile.projects,
        skills: extractedProfile.skills || profile.skills,
        education: extractedProfile.education || profile.education || '',
        resumeText: text,
      };

      onProfileChange(updatedProfile);

      // Show success message with details about what was extracted
      const extractedFields = Object.keys(extractedProfile).filter(
        key => key !== 'resumeText' && extractedProfile[key as keyof typeof extractedProfile]
      );

      toast({
        title: 'File uploaded successfully',
        description: validation.isValid
          ? `All fields automatically filled! (${extractedFields.length} fields extracted)`
          : `Resume extracted. Please review and fill in missing fields: ${validation.missingFields.join(', ')}`,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to read the file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    onProfileChange({
      ...profile,
      [field]: value,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Profile Information
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Upload your resume - fields will be automatically filled
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="resume-upload" className="flex items-center gap-2">
            Upload Resume (Auto-Fill)
            <Sparkles className="h-3 w-3 text-primary" />
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="resume-upload"
              type="file"
              accept=".txt,.docx,.pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="cursor-pointer"
            />
            <Button
              variant="outline"
              size="icon"
              disabled={isUploading}
              onClick={() => document.getElementById('resume-upload')?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Supported formats: TXT, DOCX, PDF - All fields will be auto-filled
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={profile.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentTitle">Current Title *</Label>
            <Input
              id="currentTitle"
              value={profile.currentTitle}
              onChange={(e) => handleInputChange('currentTitle', e.target.value)}
              placeholder="Senior Software Engineer"
              required
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="San Francisco, CA"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workExperience">Work Experience *</Label>
            <Textarea
              id="workExperience"
              value={profile.workExperience}
              onChange={(e) => handleInputChange('workExperience', e.target.value)}
              placeholder="Describe your work experience, including company names, roles, and key achievements..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projects">Projects *</Label>
            <Textarea
              id="projects"
              value={profile.projects}
              onChange={(e) => handleInputChange('projects', e.target.value)}
              placeholder="Describe your key projects and accomplishments..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills *</Label>
            <Textarea
              id="skills"
              value={profile.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              placeholder="List your technical and soft skills..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education (Optional)</Label>
            <Textarea
              id="education"
              value={profile.education || ''}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="Your educational background..."
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

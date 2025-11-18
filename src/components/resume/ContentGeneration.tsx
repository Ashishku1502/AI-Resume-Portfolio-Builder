import { useState } from 'react';
import { Sparkles, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { Profile, ToneType, ResumeContent, CoverLetterContent, LinkedInContent } from '@/types/resume';
import { generateResume, generateCoverLetter, generateLinkedInContent } from '@/services/aiService';
import { exportResumeToDocx, exportCoverLetterToTxt, exportLinkedInToTxt } from '@/services/documentService';

interface ContentGenerationProps {
  profile: Profile;
}

export function ContentGeneration({ profile }: ContentGenerationProps) {
  const { toast } = useToast();
  const [targetRole, setTargetRole] = useState('');
  const [tone, setTone] = useState<ToneType>('Professional');
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('resume');

  const [resumeContent, setResumeContent] = useState<ResumeContent | null>(null);
  const [coverLetterContent, setCoverLetterContent] = useState<CoverLetterContent | null>(null);
  const [linkedInContent, setLinkedInContent] = useState<LinkedInContent | null>(null);

  const validateProfile = (): boolean => {
    if (!profile.fullName || !profile.currentTitle || !profile.email || !profile.location) {
      toast({
        title: 'Incomplete profile',
        description: 'Please fill in all required fields in the profile section.',
        variant: 'destructive',
      });
      return false;
    }
    if (!profile.workExperience || !profile.projects || !profile.skills) {
      toast({
        title: 'Incomplete profile',
        description: 'Please provide your work experience, projects, and skills.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleGenerateResume = async () => {
    if (!validateProfile()) return;
    if (!targetRole) {
      toast({
        title: 'Target role required',
        description: 'Please specify the target role.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateResume(profile, { targetRole, tone });
      setResumeContent(content);
      toast({
        title: 'Resume generated successfully',
        description: 'Your ATS-friendly resume is ready!',
      });
    } catch (error) {
      console.error('Resume generation error:', error);
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Failed to generate resume. Please check your internet connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!validateProfile()) return;
    if (!targetRole || !jobDescription) {
      toast({
        title: 'Missing information',
        description: 'Please specify the target role and job description.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateCoverLetter(profile, { targetRole, tone }, jobDescription);
      setCoverLetterContent(content);
      toast({
        title: 'Cover letter generated successfully',
        description: 'Your tailored cover letter is ready!',
      });
    } catch (error) {
      console.error('Cover letter generation error:', error);
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Failed to generate cover letter. Please check your internet connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateLinkedIn = async () => {
    if (!validateProfile()) return;
    if (!targetRole) {
      toast({
        title: 'Target role required',
        description: 'Please specify the target role.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateLinkedInContent(profile, { targetRole, tone });
      setLinkedInContent(content);
      toast({
        title: 'LinkedIn content generated successfully',
        description: 'Your optimized LinkedIn profile is ready!',
      });
    } catch (error) {
      console.error('LinkedIn generation error:', error);
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Failed to generate LinkedIn content. Please check your internet connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Content Generation
        </CardTitle>
        <CardDescription>
          Generate professional resume, cover letter, and LinkedIn content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetRole">Target Role *</Label>
            <Input
              id="targetRole"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(value) => setTone(value as ToneType)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Confident">Confident</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="space-y-4">
            <Button
              onClick={handleGenerateResume}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Resume
                </>
              )}
            </Button>

            {resumeContent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Professional Summary</Label>
                  <Textarea
                    value={resumeContent.professionalSummary}
                    readOnly
                    rows={3}
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Experience</Label>
                  <Textarea
                    value={resumeContent.experience}
                    readOnly
                    rows={4}
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Projects</Label>
                  <Textarea
                    value={resumeContent.projects}
                    readOnly
                    rows={4}
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skills</Label>
                  <Textarea
                    value={resumeContent.skills}
                    readOnly
                    rows={3}
                    className="bg-muted"
                  />
                </div>

                <Button
                  onClick={() => exportResumeToDocx(profile, resumeContent)}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume (TXT)
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cover-letter" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description *</Label>
              <Textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={4}
                required
              />
            </div>

            <Button
              onClick={handleGenerateCoverLetter}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Cover Letter
                </>
              )}
            </Button>

            {coverLetterContent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cover Letter</Label>
                  <Textarea
                    value={coverLetterContent.content}
                    readOnly
                    rows={10}
                    className="bg-muted"
                  />
                </div>

                {coverLetterContent.keyAchievements.length > 0 && (
                  <div className="space-y-2">
                    <Label>Key Achievements Highlighted</Label>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {coverLetterContent.keyAchievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  onClick={() => exportCoverLetterToTxt(profile, coverLetterContent.content)}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Cover Letter (TXT)
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="linkedin" className="space-y-4">
            <Button
              onClick={handleGenerateLinkedIn}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate LinkedIn Content
                </>
              )}
            </Button>

            {linkedInContent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Headline (120 characters)</Label>
                  <Input
                    value={linkedInContent.headline}
                    readOnly
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    {linkedInContent.headline.length} / 120 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>About Section</Label>
                  <Textarea
                    value={linkedInContent.about}
                    readOnly
                    rows={8}
                    className="bg-muted"
                  />
                </div>

                <Button
                  onClick={() => exportLinkedInToTxt(profile, linkedInContent.headline, linkedInContent.about)}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download LinkedIn Content (TXT)
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

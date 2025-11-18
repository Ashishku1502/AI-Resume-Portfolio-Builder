import { useState } from 'react';
import { FileText, Sparkles, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileInput } from '@/components/resume/ProfileInput';
import { ContentGeneration } from '@/components/resume/ContentGeneration';
import { InterviewCoach } from '@/components/resume/InterviewCoach';
import type { Profile } from '@/types/resume';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile>({
    fullName: '',
    currentTitle: '',
    email: '',
    location: '',
    workExperience: '',
    projects: '',
    skills: '',
    education: '',
    resumeText: '',
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Resume & Portfolio Builder</h1>
              <p className="text-sm text-muted-foreground">
                Create professional resumes, cover letters, and ace your interviews with AI
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="builder" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resume Builder
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Interview Coach
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ProfileInput profile={profile} onProfileChange={setProfile} />
              </div>
              <div className="space-y-6">
                <ContentGeneration profile={profile} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interview" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <InterviewCoach profile={profile} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            2025 AI Resume & Portfolio Builder
          </p>
        </div>
      </footer>
    </div>
  );
}

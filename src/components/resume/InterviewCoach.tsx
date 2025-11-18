import { useState } from 'react';
import { MessageSquare, Loader2, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import type { Profile, InterviewEvaluation } from '@/types/resume';
import { evaluateInterviewAnswer } from '@/services/aiService';
import { behavioralQuestions, technicalQuestions } from '@/data/interviewQuestions';

interface InterviewCoachProps {
  profile: Profile;
}

export function InterviewCoach({ profile }: InterviewCoachProps) {
  const { toast } = useToast();
  const [questionType, setQuestionType] = useState<'behavioral' | 'technical'>('behavioral');
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);

  const questions = questionType === 'behavioral' ? behavioralQuestions : technicalQuestions;
  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);
  const questionText = customQuestion || selectedQuestion?.question || '';

  const handleEvaluate = async () => {
    if (!questionText) {
      toast({
        title: 'Question required',
        description: 'Please select or enter a question.',
        variant: 'destructive',
      });
      return;
    }

    if (!answer.trim()) {
      toast({
        title: 'Answer required',
        description: 'Please provide your answer.',
        variant: 'destructive',
      });
      return;
    }

    setIsEvaluating(true);
    try {
      const result = await evaluateInterviewAnswer(questionText, answer, profile, questionType);
      setEvaluation(result);
      toast({
        title: 'Evaluation complete',
        description: `Your answer scored ${result.score}/10`,
      });
    } catch (error) {
      console.error('Interview evaluation error:', error);
      toast({
        title: 'Evaluation failed',
        description: error instanceof Error ? error.message : 'Failed to evaluate your answer. Please check your internet connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setAnswer('');
    setEvaluation(null);
    setCustomQuestion('');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          AI Interview Coach
        </CardTitle>
        <CardDescription>
          Practice interview questions and get personalized feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={questionType} onValueChange={(value) => {
          setQuestionType(value as 'behavioral' | 'technical');
          setSelectedQuestionId('');
          setCustomQuestion('');
          setAnswer('');
          setEvaluation(null);
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
            <TabsTrigger value="technical">Technical Design</TabsTrigger>
          </TabsList>

          <TabsContent value={questionType} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-select">Select a Question</Label>
              <Select
                value={selectedQuestionId}
                onValueChange={(value) => {
                  setSelectedQuestionId(value);
                  setCustomQuestion('');
                  setAnswer('');
                  setEvaluation(null);
                }}
              >
                <SelectTrigger id="question-select">
                  <SelectValue placeholder="Choose a question..." />
                </SelectTrigger>
                <SelectContent>
                  {questions.map((q) => (
                    <SelectItem key={q.id} value={q.id}>
                      {q.question.substring(0, 60)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-question">Or Enter Custom Question</Label>
              <Textarea
                id="custom-question"
                value={customQuestion}
                onChange={(e) => {
                  setCustomQuestion(e.target.value);
                  setSelectedQuestionId('');
                  setAnswer('');
                  setEvaluation(null);
                }}
                placeholder={
                  questionType === 'behavioral'
                    ? 'Enter a behavioral interview question...'
                    : 'Enter a system design or technical question...'
                }
                rows={2}
              />
            </div>

            {questionText && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Question:</p>
                <p className="text-sm">{questionText}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="answer">Your Answer</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={
                  questionType === 'behavioral'
                    ? 'Use the STAR format: Situation, Task, Action, Result...'
                    : 'Describe your approach, architecture, and key considerations...'
                }
                rows={8}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleEvaluate}
                disabled={isEvaluating || !questionText || !answer.trim()}
                className="flex-1"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Evaluate Answer
                  </>
                )}
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
            </div>

            {evaluation && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Score</Label>
                    <span className="text-2xl font-bold text-primary">
                      {evaluation.score}/10
                    </span>
                  </div>
                  <Progress value={evaluation.score * 10} className="h-2" />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Strengths
                  </Label>
                  <ul className="space-y-1">
                    {evaluation.strengths.map((strength, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    Areas for Improvement
                  </Label>
                  <ul className="space-y-1">
                    {evaluation.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Improved Answer Example
                  </Label>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{evaluation.rewrittenAnswer}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

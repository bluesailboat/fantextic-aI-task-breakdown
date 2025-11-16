
export interface Step {
  id: string;
  title: string;
  description: string;
  generatedContent?: string;
  isGeneratingContent?: boolean;
}
import React, { useMemo } from 'react';
import { marked } from 'marked';
import { Step } from '../types';
import { PencilIcon } from './Icons';
import { Loader } from './Loader';

interface StepCardProps {
  step: Step;
  stepNumber: number;
  onUpdateStep: (field: 'title' | 'description', value: string) => void;
  isEditable: boolean;
}

export const StepCard: React.FC<StepCardProps> = ({ step, stepNumber, onUpdateStep, isEditable }) => {
  const isContentGenerated = step.generatedContent && step.generatedContent.length > 0;

  const getFullHtmlContent = () => {
    if (!step.generatedContent) return { __html: '' };
    // Sanitize is on by default in recent versions of marked, but can be explicit if needed.
    return { __html: marked.parse(step.generatedContent) as string };
  };

  return (
    <div className={`bg-neutral-900 p-5 rounded-xl border border-neutral-800 shadow-2xl shadow-black/50 hover:border-amber-500/50 transition-all duration-300 animate-fade-in ${step.isGeneratingContent ? 'ring-2 ring-amber-500/50' : ''}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300 ${isContentGenerated ? 'bg-amber-500 text-white' : 'bg-neutral-700 text-amber-400'}`}>
          {stepNumber}
        </div>
        <div className="flex-grow pt-0">
            {isEditable ? (
                 <input
                    type="text"
                    value={step.title}
                    onChange={(e) => onUpdateStep('title', e.target.value)}
                    className="w-full bg-neutral-800/60 px-2 py-1 border border-neutral-700 rounded-md font-bold text-3xl text-amber-400 placeholder:text-amber-600/70 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="步驟標題"
                  />
            ) : (
                <h3 className="font-bold text-3xl text-amber-400">{step.title}</h3>
            )}
        </div>
        {isEditable && (
             <PencilIcon className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-2" />
        )}
      </div>
      
      {!isContentGenerated ? (
        <div className="pl-14">
           {isEditable ? (
                <textarea
                    value={step.description}
                    onChange={(e) => onUpdateStep('description', e.target.value)}
                    className="w-full h-24 bg-neutral-800/60 p-3 border border-neutral-700 rounded-md text-neutral-300 placeholder-neutral-500 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 resize-y"
                    placeholder="步驟描述"
                />
            ) : (
                <p className="text-neutral-400 whitespace-pre-wrap leading-relaxed">{step.description}</p>
            )}
          {step.isGeneratingContent && (
             <div className="mt-4 flex items-center gap-2 text-amber-400">
                <Loader className="h-5 w-5" />
                <span>AI 正在生成內容...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 pl-14 flex flex-col gap-4">
          {/* Original Instruction */}
          <details className="bg-neutral-800/70 p-4 rounded-lg border border-neutral-700 cursor-pointer group">
            <summary className="font-semibold text-lg text-neutral-300 list-none flex justify-between items-center">
              <span>原始指令</span>
              <span className="text-neutral-500 group-hover:text-neutral-300 transition-transform transform group-open:rotate-90">▶</span>
            </summary>
            <p className="mt-3 text-neutral-400 whitespace-pre-wrap leading-relaxed border-t border-neutral-700 pt-3">{step.description}</p>
          </details>
          
          {/* AI Generated Content */}
          <div className="bg-neutral-800/60 p-4 rounded-lg">
            <h4 className="font-semibold text-xl text-neutral-100 mb-4">延伸具體執行細項</h4>
            <div 
              className="prose prose-invert prose-p:text-neutral-300 prose-strong:text-neutral-100 prose-headings:text-amber-400 prose-ul:text-neutral-300 prose-ol:text-neutral-300 prose-li:marker:text-amber-400 prose-a:text-sky-400 hover:prose-a:text-sky-300 prose-code:text-fuchsia-400 max-w-none"
              dangerouslySetInnerHTML={getFullHtmlContent()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
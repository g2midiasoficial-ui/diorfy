import React, { useState } from 'react';
import { ChevronDown, Plus, Sparkles, ArrowRight, Check } from 'lucide-react';
import { TEMPLATES } from '../../data/templates';
import { BoardTemplate } from '../../types/miro';

interface TemplateCarouselProps {
  onSelectTemplate: (template: BoardTemplate) => void;
  onExploreMiroverse: () => void;
}

export const TemplateCarousel: React.FC<TemplateCarouselProps> = ({
  onSelectTemplate,
  onExploreMiroverse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Todas as funções');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const categories = [
    'Todas as funções',
    'Ideação e Brainstorming',
    'Retrospectivas',
    'Fluxogramas e Diagramas',
    'Planejamento Ágil',
  ];

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (selectedCategory === 'Todas as funções') return true;
    return t.category === selectedCategory || t.id === 'blank';
  });

  return (
    <div className="mb-8">
      {/* Category Dropdown Title */}
      <div className="relative inline-block mb-3.5">
        <button
          onClick={() => setShowCategoryMenu(!showCategoryMenu)}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 hover:text-slate-950 transition-colors"
        >
          <span>Templates para {selectedCategory}</span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </button>

        {showCategoryMenu && (
          <div className="absolute left-0 top-full mt-1 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowCategoryMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{cat}</span>
                {selectedCategory === cat && (
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cards Slider / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5 overflow-x-auto pb-2">
        {filteredTemplates.map((tpl) => {
          const isBlank = tpl.id === 'blank';

          if (isBlank) {
            return (
              <div
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl)}
                className="group flex flex-col items-center justify-center h-28 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 transition-all cursor-pointer p-3 shadow-xs hover:shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all mb-2">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 text-center line-clamp-1">
                  Board em branco
                </span>
              </div>
            );
          }

          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className="group flex flex-col justify-between h-28 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:shadow-md transition-all cursor-pointer p-2.5 overflow-hidden relative"
            >
              {/* Card visual mockup header */}
              <div
                className={`h-12 w-full rounded-lg bg-gradient-to-br ${
                  tpl.previewGradient || 'from-slate-100 to-slate-200'
                } flex items-center justify-center relative p-1 overflow-hidden`}
              >
                {/* Visual miniature mockup badges */}
                {tpl.badgeLanguage && (
                  <span className="absolute top-1 right-1 text-[9px] font-semibold text-slate-700 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs">
                    {tpl.badgeLanguage}
                  </span>
                )}

                {/* Mini decorative icons representing template structure */}
                {tpl.id === 'ai-playground' && (
                  <div className="flex items-center gap-1 opacity-80 scale-90">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[10px] font-bold text-indigo-700 bg-white/80 px-1 rounded">
                      Sidekick
                    </span>
                  </div>
                )}
                {tpl.id === 'retrospective-4ls' && (
                  <div className="grid grid-cols-4 gap-0.5 w-16 opacity-70">
                    <div className="h-4 bg-emerald-400 rounded-xs" />
                    <div className="h-4 bg-sky-400 rounded-xs" />
                    <div className="h-4 bg-amber-400 rounded-xs" />
                    <div className="h-4 bg-purple-400 rounded-xs" />
                  </div>
                )}
                {tpl.id === 'flowchart-process' && (
                  <div className="flex items-center gap-1 opacity-70">
                    <div className="w-4 h-3 bg-blue-500 rounded-xs" />
                    <div className="w-2 h-0.5 bg-slate-400" />
                    <div className="w-3 h-3 bg-amber-400 rotate-45" />
                    <div className="w-2 h-0.5 bg-slate-400" />
                    <div className="w-4 h-3 bg-emerald-500 rounded-xs" />
                  </div>
                )}
                {tpl.id === 'kanban-task-extractor' && (
                  <div className="grid grid-cols-3 gap-1 w-14 opacity-75">
                    <div className="h-5 bg-slate-300 rounded-xs p-0.5">
                      <div className="w-full h-1.5 bg-amber-400 rounded-xs mb-0.5" />
                    </div>
                    <div className="h-5 bg-slate-300 rounded-xs p-0.5">
                      <div className="w-full h-1.5 bg-sky-400 rounded-xs mb-0.5" />
                    </div>
                    <div className="h-5 bg-slate-300 rounded-xs p-0.5">
                      <div className="w-full h-1.5 bg-emerald-400 rounded-xs mb-0.5" />
                    </div>
                  </div>
                )}
                {tpl.id === 'roadmap-planning' && (
                  <div className="flex flex-col gap-1 w-14 opacity-75">
                    <div className="h-1.5 bg-rose-400 rounded-full w-3/4" />
                    <div className="h-1.5 bg-amber-400 rounded-full w-full" />
                    <div className="h-1.5 bg-sky-400 rounded-full w-1/2" />
                  </div>
                )}
                {tpl.id === 'mindmap-template' && (
                  <div className="flex items-center justify-center opacity-70">
                    <div className="w-4 h-4 rounded-full bg-violet-500" />
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="mt-1">
                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                  {tpl.title}
                </p>
              </div>
            </div>
          );
        })}

        {/* Diorfyverse Link Card */}
        <div
          onClick={onExploreMiroverse}
          className="group flex flex-col justify-between h-28 rounded-xl border border-slate-200 hover:border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-md transition-all cursor-pointer p-2.5 overflow-hidden shrink-0 min-w-[130px]"
        >
          <div className="h-12 w-full rounded-lg bg-slate-200/70 flex items-center justify-center">
            <div className="flex -space-x-1.5 overflow-hidden">
              <span className="w-5 h-5 rounded-full bg-purple-500 text-[9px] text-white flex items-center justify-center font-bold">
                DF
              </span>
              <span className="w-5 h-5 rounded-full bg-blue-500 text-[9px] text-white flex items-center justify-center font-bold">
                UX
              </span>
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-[9px] text-white flex items-center justify-center font-bold">
                AI
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1 text-slate-700 group-hover:text-blue-600">
            <span className="text-xs font-semibold truncate">Do Diorfyverse</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

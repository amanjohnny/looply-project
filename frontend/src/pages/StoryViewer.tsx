import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function StoryViewer() {
  const { stories, activeStoryIndex, closeStoryViewer, nextStory, prevStory } = useAppStore();

  const story = stories[activeStoryIndex];

  if (!story) return null;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black text-white pb-10">
      <header className="flex items-center justify-between px-4 py-3">
        <button onClick={closeStoryViewer} className="p-2 rounded-full bg-white/10"><ArrowLeft size={20} /></button>
        <p className="text-xs opacity-80">Story {activeStoryIndex + 1}/{stories.length}</p>
      </header>

      <div className="px-4 pt-4">
        <div className="rounded-3xl bg-gradient-to-b from-[#2b1638] to-[#12091b] min-h-[70vh] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{story.avatar}</span>
              <p className="text-sm font-semibold">{story.username}</p>
            </div>
            <div className="text-8xl text-center mt-8">{story.media || '✨'}</div>
          </div>

          <p className="text-sm leading-relaxed break-words [overflow-wrap:anywhere]">{story.caption}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button onClick={prevStory} disabled={activeStoryIndex === 0} className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-xs disabled:opacity-40">
            <ChevronLeft size={14} /> Prev
          </button>
          <button onClick={nextStory} className="flex items-center gap-1 rounded-xl bg-primary-500 px-3 py-2 text-xs">
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

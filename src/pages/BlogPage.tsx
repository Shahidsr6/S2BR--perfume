import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { BlogPost } from '../types';

export const BlogPage: React.FC = () => {
  const posts = StorageService.getBlogPosts();
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  return (
    <div className="w-full bg-[#141312] text-[#e6e1df] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase block">
            The S2BR Olfactory Journal
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl text-[#e6e1df] font-serif">
            Essays in Haute Parfumerie
          </h1>
          <p className="font-body-md text-[14px] text-[#d0c5af]">
            Explorations into rare botanical extractions, aging chemistry, and the sensory culture of Pakistan.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => setActivePost(post)}
              className="bg-[#1d1b1a] border border-[#4d4635]/30 shadow-xl overflow-hidden group cursor-pointer hover:border-[#f2ca50]/40 transition-all flex flex-col justify-between"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#0f0e0d]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-label-caps uppercase text-[#e5c365]">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span className="text-[#99907c]">{post.readTime}</span>
                  </div>

                  <h3 className="font-headline-sm text-xl text-[#e6e1df] font-serif group-hover:text-[#f2ca50] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="font-body-md text-[13px] text-[#d0c5af] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#4d4635]/20 flex items-center justify-between text-[12px] font-body-sm">
                  <span className="text-[#99907c]">By {post.author}</span>
                  <span className="font-title-sc text-[11px] text-[#f2ca50] group-hover:underline uppercase tracking-wider flex items-center gap-1">
                    Read Essay <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Full Article Reader Modal */}
      {activePost && (
        <div 
          className="fixed inset-0 z-50 bg-[#0f0e0d]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActivePost(null)}
        >
          <div 
            className="relative bg-[#1d1b1a] max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#f2ca50]/30 shadow-2xl p-6 sm:p-10 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-4 right-4 text-[#99907c] hover:text-[#f2ca50] p-2"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div className="space-y-2">
              <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-widest">
                {activePost.category} • {activePost.readTime}
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#e6e1df] font-serif leading-tight">
                {activePost.title}
              </h2>
              <p className="font-body-sm text-[12px] text-[#99907c]">
                Published on {activePost.publishedAt} by {activePost.author}
              </p>
            </div>

            <div className="aspect-[21/9] w-full overflow-hidden bg-[#0f0e0d] border border-[#4d4635]/30">
              <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
            </div>

            <div className="font-body-md text-[14px] text-[#d0c5af] leading-relaxed whitespace-pre-line space-y-4">
              {activePost.content}
            </div>

            <div className="pt-6 border-t border-[#4d4635]/30 text-center">
              <button
                onClick={() => setActivePost(null)}
                className="px-6 py-2.5 bg-[#2b2a28] hover:bg-[#363433] text-[#f2ca50] font-title-sc text-[11px] uppercase tracking-wider"
              >
                Close Essay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

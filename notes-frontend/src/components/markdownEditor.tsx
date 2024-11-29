'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { createStarryNight } from '@wooorm/starry-night';
import sourceCss from '@wooorm/starry-night/source.css';
import sourceJs from '@wooorm/starry-night/source.js';
import sourceTsx from '@wooorm/starry-night/source.tsx';
import sourceTs from '@wooorm/starry-night/source.ts';
import textHtmlBasic from '@wooorm/starry-night/text.html.basic';
import textMd from '@wooorm/starry-night/text.md';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';

const grammars = [sourceCss, sourceJs, sourceTsx, sourceTs, textHtmlBasic, textMd];

const sample = `# A demo of Markdown in Next.js

This is a Markdown editor built with Next.js.

## Features
- GitHub-Flavored Markdown (GFM)
- Syntax Highlighting
- HTML in Markdown (optional)

## Try It Out
Edit the Markdown text on the left and see the rendered output on the right!`;

export default function MarkdownEditor({ note , handleContentChange}) {
    const [text, setText] = useState(note.content);
    const [gfm, setGfm] = useState(false);
    const [raw, setRaw] = useState(false);
    const [starryNight, setStarryNight] = useState(null);
  
    const rehypePlugins = [rehypeSlug, rehypeHighlight];
    const remarkPlugins = [remarkToc];
  
    if (gfm) {
      remarkPlugins.unshift(remarkGfm);
    }
  
    if (raw) {
      rehypePlugins.unshift(rehypeRaw);
    }
  
    // Sync text state with `note` prop changes
    useEffect(() => {
      setText(note.content);
    }, [note]);
  
    // Initialize StarryNight for syntax highlighting
    useEffect(() => {
      createStarryNight(grammars).then((instance) => {
        setStarryNight(instance);
  
        const missingScopes = instance.missingScopes();
        if (missingScopes.length > 0) {
          console.error("Missing scopes:", missingScopes);
        }
      });
    }, []);
  
    const renderHighlightedMarkdown = () => {
      if (!starryNight) return null;
      return toJsxRuntime(starryNight.highlight(text, "text.md"), {
        Fragment,
        jsx,
        jsxs,
      });
    };
  
    return (
      <div className="markdown-editor w-full">
        {/* Editor and Preview */}
        <div className="editor flex flex-col md:flex-row gap-4 w-full">
          {/* Markdown Input */}
          <div className="w-full md:w-1/2 opacity-60">
            <textarea
              spellCheck="false"
              className="w-full h-screen border rounded-md p-4"
              value={text}
              rows={text.split("\n").length + 1}
              onChange={(e) => { setText(e.target.value) 
                handleContentChange(e.target.value)
              }}
              placeholder="Write your markdown here..."
            />
          </div>
  
          {/* Rendered Markdown */}
          <div className="w-full md:w-1/2 markdown-body p-4 border rounded-md overflow-auto">
            <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
              {text}
            </Markdown>
          </div>
        </div>
      </div>
    );
  }
  

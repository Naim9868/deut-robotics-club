'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import HardBreak from '@tiptap/extension-hard-break';
import { useEffect, useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showHTML, setShowHTML] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  if (!editor) return null;

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  // Update HTML content when editor changes
  useEffect(() => {
    if (showHTML) {
      setHtmlContent(editor.getHTML());
    }
  }, [showHTML, editor]);

  const handleHTMLChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setHtmlContent(newHtml);
  };

  const applyHTMLChanges = () => {
    try {
      editor.commands.setContent(htmlContent);
      toast.success('HTML applied', { id: 'html-apply' });
    } catch (error) {
      toast.error('Invalid HTML');
    }
  };

  return (
    <div className="border-b border-white/10 bg-[#1a1a1a] sticky top-0 z-10">
      <div className="p-2 flex flex-wrap gap-1">
        {/* Headings Dropdown */}
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'p') editor.chain().focus().setParagraph().run();
            else if (value === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
            else if (value === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
            else if (value === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
            else if (value === 'h4') editor.chain().focus().toggleHeading({ level: 4 }).run();
          }}
          className="bg-[#2a2a2a] text-white text-sm border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-primary"
          value={
            editor.isActive('heading', { level: 1 }) ? 'h1' :
            editor.isActive('heading', { level: 2 }) ? 'h2' :
            editor.isActive('heading', { level: 3 }) ? 'h3' :
            editor.isActive('heading', { level: 4 }) ? 'h4' : 'p'
          }
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>

        <span className="w-px h-6 bg-white/10 mx-1" />

        {/* Text Formatting */}
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded ${editor.isActive('bold') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Bold"><span className="font-bold text-sm">B</span></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded ${editor.isActive('italic') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Italic"><span className="italic text-sm">I</span></button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded ${editor.isActive('underline') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Underline"><span className="underline text-sm">U</span></button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded ${editor.isActive('strike') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Strikethrough"><span className="line-through text-sm">S</span></button>

        <span className="w-px h-6 bg-white/10 mx-1" />

        {/* Text Color */}
        <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} value={editor.getAttributes('textStyle').color || '#ffffff'} className="w-8 h-8 rounded cursor-pointer" title="Text Color" />
        <button onClick={() => editor.chain().focus().unsetColor().run()} className="p-2 rounded text-gray-400 hover:bg-white/10 text-sm" title="Clear Color">Clear</button>

        <span className="w-px h-6 bg-white/10 mx-1" />

        {/* Alignment */}
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Align Left">⬅️</button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Center">⬆️</button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Align Right">➡️</button>
        <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-2 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Justify">🔄</button>

        <span className="w-px h-6 bg-white/10 mx-1" />

        {/* Lists */}
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Bullet List">• List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Numbered List">1. List</button>

        <span className="w-px h-6 bg-white/10 mx-1" />

        {/* Blocks */}
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 rounded ${editor.isActive('codeBlock') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Code Block">&lt;/&gt;</button>
        <button onClick={() => editor.chain().focus().toggleCode().run()} className={`p-2 rounded ${editor.isActive('code') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Inline Code">`code`</button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Quote">❝</button>

        <span className="w-px h-6 bg-white/10 mx-1" />

        {/* Links */}
        <button onClick={() => { const url = window.prompt('Enter URL:'); if (url) editor.chain().focus().setLink({ href: url }).run(); }} className={`p-2 rounded ${editor.isActive('link') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`} title="Add Link">🔗 Link</button>
        <button onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} className="p-2 rounded text-gray-400 hover:bg-white/10 disabled:opacity-50" title="Remove Link">Unlink</button>

        <span className="w-px h-6 bg-white/10 mx-1" />

        {/* Media */}
        <button onClick={() => setShowImageInput(!showImageInput)} className="p-2 rounded text-gray-400 hover:bg-white/10" title="Insert Image">🖼️ Image</button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="p-2 rounded text-gray-400 hover:bg-white/10" title="Horizontal Line">―</button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()} className="p-2 rounded text-gray-400 hover:bg-white/10" title="Line Break">↵</button>

        <span className="w-px h-6 bg-white/10 mx-1" />

        {/* Undo/Redo */}
        <button onClick={() => editor.chain().focus().undo().run()} className="p-2 rounded text-gray-400 hover:bg-white/10" title="Undo" disabled={!editor.can().undo()}>↩ Undo</button>
        <button onClick={() => editor.chain().focus().redo().run()} className="p-2 rounded text-gray-400 hover:bg-white/10" title="Redo" disabled={!editor.can().redo()}>↪ Redo</button>

        {/* HTML View Toggle */}
        <button
          onClick={() => {
            if (!showHTML) {
              setHtmlContent(editor.getHTML());
            }
            setShowHTML(!showHTML);
          }}
          className={`p-2 rounded ml-auto ${showHTML ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`}
          title="Toggle HTML View"
        >
          &lt;/&gt; HTML
        </button>
      </div>

      {/* Image URL Input */}
      {showImageInput && (
        <div className="p-2 border-t border-white/10 bg-[#2a2a2a] flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL..."
            className="flex-1 bg-[#121212] border border-white/10 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-primary"
          />
          <button onClick={addImage} className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/80">
            Insert
          </button>
          <button onClick={() => setShowImageInput(false)} className="px-3 py-1 bg-white/5 text-gray-400 text-sm rounded hover:bg-white/10">
            Cancel
          </button>
        </div>
      )}

      {/* HTML View - Fixed: No more cursor jumping */}
      {showHTML && (
        <div className="p-4 border-t border-white/10 bg-[#121212]">
          <div className="mb-2 flex justify-between items-center">
            <h3 className="text-xs text-gray-400">HTML Editor</h3>
            <div className="flex gap-2">
              <button
                onClick={applyHTMLChanges}
                className="px-3 py-1 bg-primary/20 text-primary text-xs rounded hover:bg-primary/30 transition-colors"
              >
                Apply Changes
              </button>
              <button
                onClick={() => {
                  setHtmlContent(editor.getHTML());
                  setShowHTML(false);
                }}
                className="px-3 py-1 bg-white/5 text-gray-400 text-xs rounded hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
          <textarea
            value={htmlContent}
            onChange={handleHTMLChange}
            className="w-full h-64 bg-[#1a1a1a] text-white font-mono text-sm p-4 rounded border border-white/10 focus:outline-none focus:border-primary resize-none"
            placeholder="HTML code..."
            spellCheck="false"
          />
          <p className="text-xs text-gray-500 mt-2">
            Edit HTML and click "Apply Changes" to update the editor
          </p>
        </div>
      )}
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const editorRef = useRef<any>(null);
  const contentRef = useRef(value);
  const skipNextUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        code: { HTMLAttributes: { class: 'bg-[#2a2a2a] text-primary px-1 py-0.5 rounded font-mono text-sm' } },
        codeBlock: { HTMLAttributes: { class: 'bg-[#2a2a2a] p-4 rounded-lg font-mono text-sm border border-white/10' } },
        blockquote: { HTMLAttributes: { class: 'border-l-4 border-primary pl-4 italic text-gray-400' } },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline hover:text-primary/80 cursor-pointer', rel: 'noopener noreferrer', target: '_blank' } }),
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      ListItem,
      Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: 'max-w-full h-auto rounded-lg border border-white/10 my-4' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline, Code, CodeBlock, Blockquote, HorizontalRule, HardBreak,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-4 min-h-[400px] focus:outline-none text-white',
        placeholder: placeholder || 'Write something...',
      },
    },
    onUpdate: ({ editor }) => {
      if (skipNextUpdate.current) {
        skipNextUpdate.current = false;
        return;
      }
      contentRef.current = editor.getHTML();
      setIsDirty(true);
    },
    immediatelyRender: false,
  });

  // Store editor reference
  useEffect(() => {
    if (editor) editorRef.current = editor;
  }, [editor]);

  // Update editor when value changes externally
  useEffect(() => {
    if (editor && !isDirty && value !== contentRef.current) {
      skipNextUpdate.current = true;
      editor.commands.setContent(value);
      contentRef.current = value;
    }
  }, [value, editor, isDirty]);

  // Handle save
  const handleSave = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.getHTML();
      console.log('Saving content length:', html.length);
      contentRef.current = html;
      onChange(html);
      setIsDirty(false);
      toast.success('Content saved', { id: 'content-save' });
    }
  }, [onChange]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (editorRef.current) {
      skipNextUpdate.current = true;
      editorRef.current.commands.setContent(value);
      contentRef.current = value;
      setIsDirty(false);
    }
  }, [value]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="border border-white/10 rounded-lg overflow-hidden bg-[#121212]">
        <div className="p-4 min-h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-[#121212]">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      
      {/* Status Bar */}
      <div className="border-t border-white/10 bg-[#1a1a1a] px-4 py-2 text-xs text-gray-500 flex justify-between items-center">
        <div className="flex gap-4">
          <span>Words: {editor?.storage.characterCount?.words() || 0}</span>
          <span>Characters: {editor?.storage.characterCount?.characters() || 0}</span>
          {isDirty && (
            <span className="text-yellow-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
              Unsaved changes
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {isDirty && (
            <>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/80 transition-colors font-medium flex items-center gap-1"
              >
                <span>💾</span> Save
              </button>
            </>
          )}
          <span className="text-gray-600">Ctrl+S</span>
        </div>
      </div>

      <style jsx global>{`
        .ProseMirror { min-height: 400px; outline: none; }
        .ProseMirror p { margin: 0.5em 0; line-height: 1.6; }
        .ProseMirror h1 { font-size: 2.5em; font-weight: 800; margin: 0.8em 0 0.4em; }
        .ProseMirror h2 { font-size: 2em; font-weight: 700; margin: 0.8em 0 0.4em; }
        .ProseMirror h3 { font-size: 1.5em; font-weight: 600; margin: 0.8em 0 0.4em; }
        .ProseMirror h4 { font-size: 1.25em; font-weight: 600; margin: 0.8em 0 0.4em; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 1.5em; margin: 0.5em 0; }
        .ProseMirror li { margin: 0.2em 0; }
        .ProseMirror a { color: rgb(230, 57, 70); text-decoration: underline; }
        .ProseMirror a:hover { color: rgb(240, 77, 90); }
        .ProseMirror blockquote { border-left: 4px solid rgb(230, 57, 70); padding-left: 1em; margin: 1em 0; color: #9ca3af; font-style: italic; }
        .ProseMirror code { background: #2a2a2a; color: rgb(230, 57, 70); padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
        .ProseMirror pre { background: #2a2a2a; padding: 1em; border-radius: 8px; overflow-x: auto; }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); margin: 1em 0; }
        .ProseMirror hr { border: none; border-top: 2px solid rgba(255, 255, 255, 0.1); margin: 2em 0; }
        .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #4b5563; pointer-events: none; height: 0; font-style: italic; }
      `}</style>
    </div>
  );
}
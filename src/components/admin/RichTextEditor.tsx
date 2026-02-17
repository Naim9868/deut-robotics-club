'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-white/10 p-2 flex flex-wrap gap-1 bg-[#1a1a1a]">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded text-sm ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`}
      >
        H3
      </button>
      <span className="w-px h-6 bg-white/10 mx-1" />
      
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${editor.isActive('bold') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`}
      >
        <span className="font-bold">B</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${editor.isActive('italic') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`}
      >
        <span className="italic">I</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded ${editor.isActive('strike') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`}
      >
        <span className="line-through">S</span>
      </button>
      <span className="w-px h-6 bg-white/10 mx-1" />
      
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`}
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`}
      >
        1. List
      </button>
      <span className="w-px h-6 bg-white/10 mx-1" />
      
      <button
        onClick={() => editor.chain().focus().setLink({ href: prompt('Enter URL:') || '' }).run()}
        className={`p-2 rounded ${editor.isActive('link') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`}
      >
        Link
      </button>
      
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        className="p-2 rounded text-gray-400 hover:bg-white/10 disabled:opacity-50"
      >
        Unlink
      </button>
      <span className="w-px h-6 bg-white/10 mx-1" />
      
      <input
        type="color"
        onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
        value={editor.getAttributes('textStyle').color || '#000000'}
        className="w-8 h-8 rounded cursor-pointer"
      />
      
      <button
        onClick={() => editor.chain().focus().unsetColor().run()}
        className="p-2 rounded text-gray-400 hover:bg-white/10"
      >
        Clear Color
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      TextStyle,
      Color,
      ListItem,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-4 min-h-[200px] focus:outline-none text-white',
        placeholder: placeholder || 'Write something...',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-[#121212]">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <style jsx>{`
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .ProseMirror li {
          margin: 0.2em 0;
        }
        .ProseMirror a {
          color: rgb(230, 57, 70);
          text-decoration: underline;
        }
        .ProseMirror [style] {
          color: attr(data-color);
        }
      `}</style>
    </div>
  );
}
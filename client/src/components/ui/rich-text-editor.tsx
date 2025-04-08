import React, { useEffect } from 'react';
import { useEditor, EditorContent, Editor, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: cn(
          'min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-sm ring-offset-background',
          !value && 'text-muted-foreground',
          className || ''
        ),
        placeholder: placeholder || 'Write something...',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update content when value changes from outside the editor
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
      {editor && (
        <BubbleMenu editor={editor}>
          <div className="flex items-center bg-popover border border-border rounded-md shadow-md p-1 space-x-1">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              icon={<Bold className="h-4 w-4" />}
              tooltip="Bold"
            />
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              icon={<Italic className="h-4 w-4" />}
              tooltip="Italic"
            />
            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              icon={<List className="h-4 w-4" />}
              tooltip="Bullet List"
            />
            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              icon={<ListOrdered className="h-4 w-4" />}
              tooltip="Ordered List"
            />
            <MenuButton
              onClick={() => {
                const url = window.prompt('URL')
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run()
                }
              }}
              isActive={editor.isActive('link')}
              icon={<LinkIcon className="h-4 w-4" />}
              tooltip="Add Link"
            />
            <MenuButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              icon={<Code className="h-4 w-4" />}
              tooltip="Code Block"
            />
          </div>
        </BubbleMenu>
      )}
      
      <div className="relative">
        <div className="mb-2 flex p-1 bg-muted/60 rounded-t-md border border-input flex-wrap">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={<Bold className="h-4 w-4" />}
            tooltip="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={<Italic className="h-4 w-4" />}
            tooltip="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={<List className="h-4 w-4" />}
            tooltip="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={<ListOrdered className="h-4 w-4" />}
            tooltip="Ordered List"
          />
          <ToolbarButton
            onClick={() => {
              const url = window.prompt('URL')
              if (url) {
                editor.chain().focus().setLink({ href: url }).run()
              }
            }}
            isActive={editor.isActive('link')}
            icon={<LinkIcon className="h-4 w-4" />}
            tooltip="Add Link"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            icon={<Code className="h-4 w-4" />}
            tooltip="Code Block"
          />
        </div>
        <EditorContent editor={editor} className="border-b border-x border-input rounded-b-md overflow-hidden" />
      </div>
    </div>
  );
};

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  tooltip: string;
}

const ToolbarButton = ({ onClick, isActive, icon, tooltip }: ToolbarButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className={cn(
      'h-8 px-2 py-1 text-sm rounded-md',
      isActive ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
    )}
    onClick={onClick}
    title={tooltip}
  >
    {icon}
  </Button>
);

const MenuButton = ({ onClick, isActive, icon, tooltip }: ToolbarButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className={cn(
      'h-6 w-6 p-0 rounded-sm',
      isActive ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
    )}
    onClick={onClick}
    title={tooltip}
  >
    {icon}
  </Button>
);

export { RichTextEditor };
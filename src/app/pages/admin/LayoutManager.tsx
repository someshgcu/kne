import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GripVertical, Eye, EyeOff, Save, ArrowLeft } from 'lucide-react';
import { defaultHomeLayout, LayoutWidget } from '../../../data/mockData';
import { toast } from 'sonner';

const DraggableWidget = ({ widget, index, moveWidget, toggleVisibility }: {
  widget: LayoutWidget;
  index: number;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
  toggleVisibility: (id: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'widget',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'widget',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveWidget(item.index, index);
        item.index = index;
      }
    }
  });

  // Combine drag and drop refs
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`bg-card rounded-lg border-2 border-border p-4 cursor-move transition-all ${isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
        } ${!widget.isVisible ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <GripVertical className="size-5 text-muted" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-primary">{widget.name}</h3>
            <p className="text-sm text-muted">Order: {widget.order}</p>
          </div>
        </div>
        <button
          onClick={() => toggleVisibility(widget.id)}
          className={`p-2 rounded-lg transition-colors ${widget.isVisible
            ? 'bg-accent text-accent-foreground hover:bg-accent/90'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          aria-label={widget.isVisible ? 'Hide widget' : 'Show widget'}
        >
          {widget.isVisible ? (
            <Eye className="size-5" aria-hidden="true" />
          ) : (
            <EyeOff className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
};

export function LayoutManager() {
  // NOTE: Auth is handled by ProtectedRoute wrapper in App.tsx
  const [widgets, setWidgets] = useState<LayoutWidget[]>(defaultHomeLayout);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load saved layout from localStorage
    const savedLayout = localStorage.getItem('homeLayout');
    if (savedLayout) {
      setWidgets(JSON.parse(savedLayout));
    }
  }, []);

  const moveWidget = (dragIndex: number, hoverIndex: number) => {
    const updatedWidgets = [...widgets];
    const [movedWidget] = updatedWidgets.splice(dragIndex, 1);
    updatedWidgets.splice(hoverIndex, 0, movedWidget);

    // Update order numbers
    const reorderedWidgets = updatedWidgets.map((widget, index) => ({
      ...widget,
      order: index + 1
    }));

    setWidgets(reorderedWidgets);
    setHasChanges(true);
  };

  const toggleVisibility = (id: string) => {
    const updatedWidgets = widgets.map((widget) =>
      widget.id === id ? { ...widget, isVisible: !widget.isVisible } : widget
    );
    setWidgets(updatedWidgets);
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save to localStorage (in production, this would call an API)
    localStorage.setItem('homeLayout', JSON.stringify(widgets));
    toast.success('Layout saved successfully!');
    setHasChanges(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default layout?')) {
      setWidgets(defaultHomeLayout);
      localStorage.removeItem('homeLayout');
      toast.success('Layout reset to default');
      setHasChanges(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="min-h-screen bg-secondary/10">
        {/* Header */}
        <header className="bg-primary text-primary-foreground shadow-md">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/admin/dashboard"
                  className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                  aria-label="Back to dashboard"
                >
                  <ArrowLeft className="size-6" aria-hidden="true" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">Layout Manager</h1>
                  <p className="text-sm text-primary-foreground/80">
                    Drag and drop to reorder homepage sections
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Instructions */}
          <div className="bg-accent/10 border border-accent rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-primary mb-2">How to use:</h2>
            <ul className="space-y-2 text-body">
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Drag widgets using the grip icon to reorder sections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Click the eye icon to show/hide sections on the homepage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Click Save to apply your changes</span>
              </li>
            </ul>
          </div>

          {/* Widget List */}
          <div className="bg-card rounded-xl shadow-lg border border-border p-6 mb-6">
            <h2 className="text-xl font-bold text-primary mb-6">Homepage Sections</h2>
            <div className="space-y-3">
              {widgets.map((widget, index) => (
                <DraggableWidget
                  key={widget.id}
                  widget={widget}
                  index={index}
                  moveWidget={moveWidget}
                  toggleVisibility={toggleVisibility}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-4 rounded-lg hover:bg-accent/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="size-5" aria-hidden="true" />
              Save Changes
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-semibold"
            >
              Reset to Default
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-center"
            >
              Preview Site
            </a>
          </div>

          {hasChanges && (
            <div className="mt-4 text-center text-sm text-muted">
              You have unsaved changes
            </div>
          )}
        </div>
      </main>
    </DndProvider>
  );
}

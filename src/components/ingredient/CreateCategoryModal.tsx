import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; unit: string; description?: string }) => void;
}

const unitOptions = ['kg', 'ltr', 'ml', 'pcs', 'gram', 'units'];

export const CreateCategoryModal = ({ isOpen, onClose, onSubmit }: CreateCategoryModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: 'kg',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({ name: '', unit: 'kg', description: '' });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', unit: 'kg', description: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-card-border shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <h2 className="text-lg font-semibold text-ink">Create Category</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-ink/60" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-card-border rounded-lg text-sm text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ink/20"
                placeholder="Enter category name"
                required
              />
            </div>

            {/* Default Unit */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Default Unit
              </label>
              <div className="relative">
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-card-border rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ink/20 appearance-none"
                >
                  {unitOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/60 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-card-border rounded-lg text-sm text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ink/20 resize-none"
                placeholder="Add a description for this category"
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-card-border">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-card-border rounded-lg font-medium text-sm text-ink hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-ink text-white rounded-lg font-medium text-sm hover:bg-ink/90 transition-colors"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
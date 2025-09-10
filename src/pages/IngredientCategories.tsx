import { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { ChevronDown, Plus, Upload, Download, Edit2, Trash2 } from 'lucide-react';
import { CreateCategoryModal } from '../components/ingredient/CreateCategoryModal';
import { DeleteConfirmModal } from '../components/ingredient/DeleteConfirmModal';

interface Category {
  id: number;
  name: string;
  items: number;
  unit: string;
  lastUpdated: string;
}

const mockCategories: Category[] = [
  { id: 1, name: 'Coffee Beans', items: 12, unit: 'kg', lastUpdated: 'Today - 10:30' },
  { id: 2, name: 'Dairy Products', items: 8, unit: 'ltr', lastUpdated: 'Yesterday - 16:45' },
  { id: 3, name: 'Sweeteners', items: 5, unit: 'kg', lastUpdated: '2 days ago' },
  { id: 4, name: 'Syrups', items: 15, unit: 'ml', lastUpdated: '3 days ago' },
];

const IngredientCategories = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      setCategoryToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const handleCreateCategory = (categoryData: any) => {
    const newCategory: Category = {
      id: Math.max(...categories.map(c => c.id), 0) + 1,
      name: categoryData.name,
      items: 0,
      unit: categoryData.unit,
      lastUpdated: 'Just now'
    };
    setCategories([...categories, newCategory]);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
          <span className="text-2xl">📂</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-ink mb-2">No categories yet</h3>
      <p className="text-ink/60 text-sm mb-6 max-w-sm text-center">
        Create your first ingredient category to organize your inventory better
      </p>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-ink/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create Category
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar activePage="ingredient-categories" />
      
      {/* Main Content */}
      <div className="flex-1 ml-[260px]">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-ink">Ingredient Categories</h1>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-card-border rounded-lg font-medium text-sm text-ink hover:bg-black/5 transition-colors">
                <Upload className="w-4 h-4" />
                Import / Export
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-ink/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Category
              </button>
            </div>
          </div>
          
          {/* Table or Empty State */}
          {categories.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-card-border p-6">
              <EmptyState />
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-card-border p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-card-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Category Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Items</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Unit</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Last Updated</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b border-card-border/50 hover:bg-black/2 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-ink">{category.name}</td>
                        <td className="py-3 px-4 text-sm text-ink/70">{category.items}</td>
                        <td className="py-3 px-4 text-sm text-ink/70">{category.unit}</td>
                        <td className="py-3 px-4 text-sm text-ink/70">{category.lastUpdated}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 hover:bg-black/5 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-ink/60" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(category)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
      
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        categoryName={categoryToDelete?.name || ''}
      />
    </div>
  );
};

export default IngredientCategories;
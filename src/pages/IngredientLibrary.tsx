import { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { ChevronDown, Search, Plus, Upload, Download } from 'lucide-react';

interface Ingredient {
  id: number;
  name: string;
  category: string;
  price: string;
  quantity: number;
  unit: string;
  inStock: boolean;
  lastUpdated: string;
}

const mockIngredients: Ingredient[] = [
  { id: 1, name: 'Kopi', category: 'Coffee Beans', price: '$50.000', quantity: 20, unit: 'Pieces (pcs)', inStock: false, lastUpdated: 'Today - 12:45' },
  { id: 2, name: 'Macha', category: 'Powder', price: '$120.000', quantity: 21, unit: 'Pieces (pcs)', inStock: true, lastUpdated: 'Today - 12:31' },
  { id: 3, name: 'Susus SKM', category: 'Dairy', price: '$50.000', quantity: 13, unit: 'Pieces (pcs)', inStock: false, lastUpdated: 'Today - 12:12' },
  { id: 4, name: 'Susu UHT', category: 'Dairy', price: '$50.000', quantity: 31, unit: 'Pieces (pcs)', inStock: true, lastUpdated: 'Today - 12:11' },
];

const IngredientLibrary = () => {
  const [ingredients] = useState<Ingredient[]>(mockIngredients);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar activePage="ingredient-library" />
      
      {/* Main Content */}
      <div className="flex-1 ml-[260px]">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-ink">Ingredient Library</h1>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-card-border rounded-lg font-medium text-sm text-ink hover:bg-black/5 transition-colors">
                <Upload className="w-4 h-4" />
                Import / Export
              </button>
              <button className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-ink/90 transition-colors">
                <Plus className="w-4 h-4" />
                Create Ingredient
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <select className="flex items-center gap-2 px-3 py-2 border border-card-border rounded-lg text-sm text-ink bg-white hover:bg-black/5 transition-colors">
                <option>Ingredient</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select className="flex items-center gap-2 px-3 py-2 border border-card-border rounded-lg text-sm text-ink bg-white hover:bg-black/5 transition-colors">
                <option>Ingredient</option>
              </select>
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products"
                className="w-full bg-white border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ink/20"
              />
            </div>
          </div>
          
          {/* Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-card-border p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">In Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.id} className="border-b border-card-border/50 hover:bg-black/2 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-ink">{ingredient.name}</td>
                      <td className="py-3 px-4 text-sm text-ink/70">{ingredient.price}</td>
                      <td className="py-3 px-4 text-sm text-ink/70">{ingredient.quantity}</td>
                      <td className="py-3 px-4 text-sm text-ink/70">{ingredient.unit}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          ingredient.inStock 
                            ? 'bg-status-green/10 text-status-green border-status-green/20' 
                            : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                          {ingredient.inStock ? ingredient.quantity : 'Out'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-ink/70">{ingredient.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientLibrary;
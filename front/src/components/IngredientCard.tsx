import React from 'react';

interface IngredientCardProps {
  value: {
    name: string;
    quantity: string;
    unit: string;
  };
  onChange: (field: keyof IngredientCardProps['value'], value: string) => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({
  value,
  onChange,
}) => (
  <div className="flex flex-col gap-2">
    {/* Nom de l'ingrédient */}
    <label className="text-sm">Nom de l'ingrédient</label>
    <div className="border rounded">
      <input
        type="text"
        placeholder="Nom de l'ingrédient"
        className="input w-full border-none focus:ring-0"
        value={value.name}
        onChange={e => onChange('name', e.target.value)}
      />
    </div>
    
    {/* Quantité */}
    <label className="text-sm mt-2">Quantité</label>
    <div className="border rounded">
      <input
        type="text"
        placeholder="Quantité"
        className="input w-full border-none focus:ring-0"
        value={value.quantity}
        onChange={e => onChange('quantity', e.target.value)}
      />
    </div>
    
    {/* Unité de mesure (select) */}
    <label className="text-sm mt-2">Unité</label>
    <div className="border rounded w-full">
      <select 
        className="select w-full border-none focus:ring-0"
        value={value.unit}
        onChange={e => onChange('unit', e.target.value)}
      >
        <option value="">Sélectionner une unité</option>
        <option value="g">grammes (g)</option>
        <option value="kg">kilogrammes (kg)</option>
        <option value="ml">millilitres (ml)</option>
        <option value="l">litres (l)</option>
        <option value="cs">cuillères à soupe</option>
        <option value="cc">cuillères à café</option>
        <option value="piece">pièce(s)</option>
        <option value="pincee">pincée(s)</option>
      </select>
    </div>
  </div>
);

export default IngredientCard;

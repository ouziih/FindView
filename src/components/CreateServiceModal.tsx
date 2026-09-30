import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service, PricingType } from '../types';
import { 
  X, 
  Tag, 
  MapPin, 
  Image as ImageIcon, 
  Palette, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface CreateServiceModalProps {
  initialService?: Service | null;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: 'Menuiserie / Bois', url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cuisine & Dressing', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Loft / Salle Réception', url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80' },
  { label: 'Boutique Pop-up', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80' },
  { label: 'High-Tech / Réparation', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80' },
  { label: 'Plomberie & Travaux', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80' },
];

const SIGNATURE_BADGE_STYLES = [
  { label: 'Onyx Minimaliste', class: 'bg-stone-900 text-white' },
  { label: 'Cognac Atelier', class: 'bg-[#B8522E] text-white' },
  { label: 'Ardoise Foncée', class: 'bg-stone-800 text-stone-100' },
  { label: 'Craie Travertin', class: 'bg-stone-200 text-stone-800' },
];

export const CreateServiceModal: React.FC<CreateServiceModalProps> = ({ initialService, onClose }) => {
  const { categories, createService, updateService, currentUser } = useApp();

  const [title, setTitle] = useState(initialService?.title || '');
  const [categoryId, setCategoryId] = useState(initialService?.categoryId || (categories[0]?.id || ''));
  const [pricingType, setPricingType] = useState<PricingType>(initialService?.pricingType || 'quote');
  const [price, setPrice] = useState(initialService?.price || 150);
  const [currency] = useState(initialService?.currency || '€');
  const [city, setCity] = useState(initialService?.city || currentUser?.city || 'Paris');
  const [locationDetails, setLocationDetails] = useState(initialService?.locationDetails || 'Déplacement à domicile et sur chantier');
  const [description, setDescription] = useState(initialService?.description || '');
  const [tagsInput, setTagsInput] = useState(initialService?.tags.join(', ') || 'Artisanat, Sur-mesure, Garanti');
  
  // Custom Identity / Branding
  const [badgeText, setBadgeText] = useState(initialService?.customBranding?.badgeText || 'Artisan Qualifié');
  const [badgeColor, setBadgeColor] = useState(initialService?.customBranding?.badgeColor || SIGNATURE_BADGE_STYLES[0].class);
  
  const [selectedImage, setSelectedImage] = useState(initialService?.images[0] || PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Veuillez saisir un intitulé pour votre prestation.');
      return;
    }

    if (!description.trim() || description.length < 20) {
      setErrorMsg('La description doit comporter au moins 20 caractères.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    const finalImage = customImageUrl.trim() ? customImageUrl.trim() : selectedImage;

    if (initialService) {
      const selectedCat = categories.find(c => c.id === categoryId);
      updateService(initialService.id, {
        title,
        categoryId,
        categoryName: selectedCat ? selectedCat.name : initialService.categoryName,
        pricingType,
        price: Number(price),
        currency,
        city,
        locationDetails,
        description,
        tags,
        images: [finalImage],
        customBranding: badgeText ? { badgeText, badgeColor } : undefined,
      });
    } else {
      createService({
        title,
        categoryId,
        pricingType,
        price: Number(price),
        currency,
        city,
        locationDetails,
        description,
        tags,
        images: [finalImage],
        customBadgeText: badgeText,
        customBadgeColor: badgeColor,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#18181B] p-5 text-white flex items-center justify-between border-b border-stone-800">
          <div>
            <h2 className="font-bold text-sm leading-tight">
              {initialService ? 'Modifier la Prestation' : 'Nouvelle Prestation & Identité'}
            </h2>
            <p className="text-xs text-stone-400">
              Configurez vos tarifs, zones d'intervention et badge personnalisé
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-800 mb-1">
              Intitulé de la Prestation *
            </label>
            <input
              type="text"
              placeholder="Ex : Fabrication de Meubles Sur-Mesure / Location Loft / Réparation Express"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-900 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Catégorie *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-stone-900 font-medium"
              >
                {categories.filter(c => c.isActive).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Mode de tarification & Prix *
              </label>
              <div className="flex gap-2">
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value as PricingType)}
                  className="w-1/2 p-2.5 rounded-xl border border-stone-300 text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-stone-900 font-medium"
                >
                  <option value="quote">Sur devis</option>
                  <option value="hourly">À l'heure</option>
                  <option value="daily">À la journée</option>
                  <option value="fixed">Forfait fixe</option>
                </select>

                <div className="w-1/2 flex items-center gap-1 border border-stone-300 rounded-xl px-2.5 bg-stone-50">
                  <span className="text-stone-400 font-bold">{currency}</span>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-transparent p-1 text-xs text-stone-900 font-bold focus:outline-hidden font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Badge de réassurance personnalisé */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
            <span className="font-bold text-stone-800 block text-xs">Badge d'Accroche / Identité Visuelle</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-stone-500 font-medium block mb-1">Libellé du badge (optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex : Artisan Certifié, Coup de Cœur..."
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label className="text-stone-500 font-medium block mb-1">Style de finition</label>
                <div className="flex items-center gap-2 pt-0.5">
                  {SIGNATURE_BADGE_STYLES.map((b, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setBadgeColor(b.class)}
                      className={`h-7 px-2.5 rounded-md ${b.class} text-[10px] font-bold flex items-center gap-1 transition-all ${
                        badgeColor === b.class ? 'ring-2 ring-stone-900' : 'opacity-80'
                      }`}
                    >
                      {b.label}
                      {badgeColor === b.class && <Check className="w-3 h-3 ml-0.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-stone-800 mb-1">
              Description détaillée *
            </label>
            <textarea
              rows={4}
              placeholder="Détaillez vos prestations, savoir-faire, matériaux utilisés et délais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-900 leading-relaxed"
              required
            />
          </div>

          {/* Location & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                Ville & Rayon de déplacement *
              </label>
              <input
                type="text"
                placeholder="Ex : Lyon et 40km alentours"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-300"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-stone-400" />
                Mots-clés (séparés par virgule)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          {/* Choix d'illustration */}
          <div>
            <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-stone-400" />
              Illustration du service
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {PRESET_IMAGES.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setSelectedImage(img.url); setCustomImageUrl(''); }}
                  className={`relative rounded-lg overflow-hidden h-14 border transition-all ${
                    selectedImage === img.url && !customImageUrl ? 'ring-2 ring-stone-900' : 'opacity-70'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-[#B8522E] text-white font-bold transition-colors shadow-xs"
            >
              {initialService ? 'Enregistrer les modifications' : 'Publier la prestation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

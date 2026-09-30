import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service, PricingType } from '../types';
import { 
  X, 
  Sparkles, 
  Tag, 
  MapPin, 
  Euro, 
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
  { label: 'Beauté & Coiffure', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80' },
];

const BADGE_COLORS = [
  { label: 'Or / Ambre', class: 'bg-amber-600 text-white' },
  { label: 'Émeraude / Vert', class: 'bg-emerald-600 text-white' },
  { label: 'Indigo / Bleu nuit', class: 'bg-indigo-600 text-white' },
  { label: 'Rose / Événement', class: 'bg-pink-600 text-white' },
  { label: 'Pourpre Royal', class: 'bg-purple-600 text-white' },
  { label: 'Noir Élégant', class: 'bg-slate-900 text-white' },
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
  const [badgeColor, setBadgeColor] = useState(initialService?.customBranding?.badgeColor || BADGE_COLORS[0].class);
  
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base">
                {initialService ? 'Modifier la Prestation' : 'Créer & Personnaliser une Prestation'}
              </h2>
              <p className="text-xs text-slate-400">
                Donnez une identité forte à votre offre pour attirer plus de clients
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Intitulé & Catégorie */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Titre du Service ou de la Prestation *
              </label>
              <input
                type="text"
                placeholder="Ex : Fabrication de Meubles Sur-Mesure / Location Loft / Réparation Express"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Catégorie de prestation *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  {categories.filter(c => c.isActive).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Modèle de facturation & Prix *
                </label>
                <div className="flex gap-2">
                  <select
                    value={pricingType}
                    onChange={(e) => setPricingType(e.target.value as PricingType)}
                    className="w-1/2 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value="quote">Sur devis</option>
                    <option value="hourly">À l'heure</option>
                    <option value="daily">À la journée</option>
                    <option value="fixed">Forfait fixe</option>
                  </select>

                  <div className="w-1/2 flex items-center gap-1 border border-slate-300 rounded-xl px-2.5 bg-slate-50">
                    <span className="text-slate-400 font-bold">{currency}</span>
                    <input
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-transparent p-1.5 text-xs text-slate-900 font-bold focus:outline-hidden"
                      placeholder="Prix"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personnalisation & Identité du Service */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Palette className="w-4 h-4 text-amber-600" />
              <span>Identité Visuelle & Badge Personnalisé (Customisation)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Texte du Badge d'accroche (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Artisan Élite, Coup de Cœur, Dispo Immédiate..."
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Couleur du Badge
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {BADGE_COLORS.map((b, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setBadgeColor(b.class)}
                      className={`h-7 w-7 rounded-lg ${b.class} flex items-center justify-center transition-transform ${
                        badgeColor === b.class ? 'ring-2 ring-slate-900 scale-110' : 'opacity-80'
                      }`}
                      title={b.label}
                    >
                      {badgeColor === b.class && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-600">
              <span>Aperçu de votre badge :</span>
              {badgeText ? (
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] shadow-xs ${badgeColor}`}>
                  {badgeText}
                </span>
              ) : (
                <span className="italic text-slate-400">Aucun badge</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Description complète de la prestation *
            </label>
            <textarea
              rows={4}
              placeholder="Détaillez vos compétences, matériaux utilisés, équipements, conditions et délais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Localisation & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                Ville & Rayon d'intervention
              </label>
              <input
                type="text"
                placeholder="Ex : Lyon et 40km alentours"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                Mots-clés / Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                placeholder="Chêne, Sur-mesure, Cuisine, Urgence..."
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Choix de photo */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              Illustration du service (Galerie sélectionnable)
            </label>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
              {PRESET_IMAGES.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedImage(img.url);
                    setCustomImageUrl('');
                  }}
                  className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all group ${
                    selectedImage === img.url && !customImageUrl ? 'border-amber-600 ring-2 ring-amber-400' : 'border-transparent opacity-75'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-0 bg-slate-900/40 text-[9px] text-white flex items-end p-1 font-semibold">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>

            <input
              type="url"
              placeholder="Ou collez une URL d'image personnalisée (https://...)"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 text-[11px] text-slate-700"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors"
            >
              {initialService ? 'Enregistrer les modifications' : 'Publier la prestation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

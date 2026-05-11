import { useLanguage } from '../contexts/LanguageContext';
import { Category } from '../types';

export function useCatName() {
  const { language } = useLanguage();

  return function getCatName(cat: Pick<Category, 'name' | 'translations'>): string {
    return cat.translations?.[language] ?? cat.name;
  };
}

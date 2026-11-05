export const categoryNameMap: Record<string, string> = {
  apartment: 'آپارتمان',
  suite: 'سوئیت',
  villa: 'ویلا',
  'garden-villa': 'ویلای باغی',
  'villa-house': 'خانه ویلایی',
  house: 'خانه',
  'traditional-house': 'خانه سنتی',
  cottage: 'کلبه',
  'eco-lodge': 'بوم‌گردی',
  'آپارتمانی': 'آپارتمانی',
};

export const getCategoryLabel = (name: string): string => {
  return categoryNameMap[name] || name;
};
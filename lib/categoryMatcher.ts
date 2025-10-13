export function matchesCategory(trick: any, categoryFilter: string): boolean {
  if (!categoryFilter) return true;
  
  const category = trick.category?.toLowerCase() || '';
  const title = trick.title?.toLowerCase() || '';
  const description = trick.description?.toLowerCase() || '';
  const content = `${title} ${description}`;

  switch (categoryFilter.toLowerCase()) {
    case 'technology':
      return category === 'technology' || category === 'productivity' ||
             content.includes('tech') || content.includes('app') || content.includes('phone') ||
             content.includes('computer') || content.includes('digital') || content.includes('software') ||
             content.includes('internet') || content.includes('online');
    
    case 'cooking':
      return category === 'cooking' ||
             content.includes('cook') || content.includes('recipe') || content.includes('food') ||
             content.includes('tea') || content.includes('coffee') || content.includes('pasta') ||
             content.includes('bread') || content.includes('sauce') || content.includes('spice') ||
             content.includes('wine') || content.includes('beer') || content.includes('drink');
    
    case 'travel':
      return category === 'travel' ||
             content.includes('travel') || content.includes('car') || content.includes('winter') ||
             content.includes('trip') || content.includes('journey');
    
    case 'cleaning':
      return category === 'cleaning' ||
             content.includes('clean') || content.includes('organize') || content.includes('tidy');
    
    case 'health':
      return category === 'health' ||
             content.includes('health') || content.includes('exercise') || content.includes('diet');
    
    default:
      return category === categoryFilter;
  }
}

export function categorizeAllTricks(tricks: any[]) {
  const categoryCounts = {
    cooking: 0,
    cleaning: 0,
    technology: 0,
    health: 0,
    travel: 0
  };

  tricks.forEach((trick: any) => {
    if (matchesCategory(trick, 'cooking')) categoryCounts.cooking++;
    if (matchesCategory(trick, 'cleaning')) categoryCounts.cleaning++;
    if (matchesCategory(trick, 'technology')) categoryCounts.technology++;
    if (matchesCategory(trick, 'health')) categoryCounts.health++;
    if (matchesCategory(trick, 'travel')) categoryCounts.travel++;
  });

  return categoryCounts;
}

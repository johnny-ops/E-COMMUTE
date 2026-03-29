// AI-based route suggestion algorithm
export const calculateBestRoute = (routes, preferences = {}) => {
  const { priority = 'balanced' } = preferences;
  
  return routes.map(route => {
    let score = 0;
    
    // Time score (lower is better)
    const timeScore = 100 - (route.estimatedTime / 120) * 100;
    
    // Cost score (lower is better)
    const costScore = 100 - (route.totalFare / 100) * 100;
    
    // Transfer score (fewer is better)
    const transferScore = 100 - (route.transfers * 20);
    
    // Calculate weighted score based on priority
    if (priority === 'fastest') {
      score = timeScore * 0.7 + costScore * 0.2 + transferScore * 0.1;
    } else if (priority === 'cheapest') {
      score = costScore * 0.7 + timeScore * 0.2 + transferScore * 0.1;
    } else if (priority === 'least-transfers') {
      score = transferScore * 0.7 + timeScore * 0.2 + costScore * 0.1;
    } else {
      score = (timeScore + costScore + transferScore) / 3;
    }
    
    return { ...route, score };
  }).sort((a, b) => b.score - a.score);
};

export const estimateFare = (distance, transportType) => {
  const fares = {
    jeepney: { base: 13, perKm: 1.5 },
    bus: { base: 15, perKm: 2 },
    train: { base: 15, perKm: 1 },
    tricycle: { base: 20, perKm: 5 },
  };
  
  const fare = fares[transportType] || fares.jeepney;
  return fare.base + (distance * fare.perKm);
};

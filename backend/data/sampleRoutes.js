// Sample Philippine commute routes
const philippineRoutes = [
  {
    id: 'r1',
    origin: 'Cubao, Quezon City',
    destination: 'Makati City Hall',
    estimatedTime: 45,
    totalFare: 35,
    transfers: 1,
    steps: [
      {
        type: 'jeepney',
        instruction: 'Ride Jeepney: Cubao-Ayala',
        distance: 8,
        duration: 25
      },
      {
        type: 'jeepney',
        instruction: 'Transfer to Jeepney: Ayala-Makati City Hall',
        distance: 2,
        duration: 10
      }
    ]
  },
  {
    id: 'r2',
    origin: 'Cubao, Quezon City',
    destination: 'Makati City Hall',
    estimatedTime: 50,
    totalFare: 28,
    transfers: 1,
    steps: [
      {
        type: 'train',
        instruction: 'Ride MRT: Cubao to Ayala Station',
        distance: 7,
        duration: 15
      },
      {
        type: 'jeepney',
        instruction: 'Ride Jeepney: Ayala-Makati City Hall',
        distance: 2,
        duration: 10
      }
    ]
  },
  {
    id: 'r3',
    origin: 'Divisoria, Manila',
    destination: 'SM North EDSA',
    estimatedTime: 60,
    totalFare: 42,
    transfers: 2,
    steps: [
      {
        type: 'jeepney',
        instruction: 'Ride Jeepney: Divisoria-Cubao',
        distance: 10,
        duration: 35
      },
      {
        type: 'bus',
        instruction: 'Transfer to Bus: Cubao-SM North',
        distance: 5,
        duration: 15
      }
    ]
  },
  {
    id: 'r4',
    origin: 'Alabang',
    destination: 'Makati',
    estimatedTime: 35,
    totalFare: 45,
    transfers: 0,
    steps: [
      {
        type: 'bus',
        instruction: 'Ride Bus: Alabang-Makati via Skyway',
        distance: 15,
        duration: 35
      }
    ]
  },
  {
    id: 'r5',
    origin: 'Fairview',
    destination: 'Cubao',
    estimatedTime: 40,
    totalFare: 25,
    transfers: 0,
    steps: [
      {
        type: 'jeepney',
        instruction: 'Ride Jeepney: Fairview-Cubao',
        distance: 12,
        duration: 40
      }
    ]
  }
];

module.exports = { philippineRoutes };

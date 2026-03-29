// Sample Philippine transport terminals
const philippineTerminals = [
  {
    id: 't1',
    name: 'Cubao Terminal',
    type: 'jeepney',
    latitude: 14.6191,
    longitude: 121.0577,
    routes: ['Cubao-Divisoria', 'Cubao-Quiapo', 'Cubao-Fairview']
  },
  {
    id: 't2',
    name: 'EDSA-Ayala Bus Stop',
    type: 'bus',
    latitude: 14.5547,
    longitude: 121.0244,
    routes: ['Makati-Quezon City', 'Makati-Manila']
  },
  {
    id: 't3',
    name: 'MRT Cubao Station',
    type: 'train',
    latitude: 14.6199,
    longitude: 121.0520,
    routes: ['North Avenue-Taft Avenue']
  },
  {
    id: 't4',
    name: 'Divisoria Terminal',
    type: 'jeepney',
    latitude: 14.6042,
    longitude: 120.9822,
    routes: ['Divisoria-Cubao', 'Divisoria-Monumento']
  },
  {
    id: 't5',
    name: 'Alabang Town Center',
    type: 'bus',
    latitude: 14.4198,
    longitude: 121.0419,
    routes: ['Alabang-Makati', 'Alabang-Manila']
  },
  {
    id: 't6',
    name: 'LRT Roosevelt Station',
    type: 'train',
    latitude: 14.6544,
    longitude: 121.0237,
    routes: ['Roosevelt-Baclaran']
  },
  {
    id: 't7',
    name: 'SM North EDSA Terminal',
    type: 'jeepney',
    latitude: 14.6560,
    longitude: 121.0294,
    routes: ['SM North-Fairview', 'SM North-Cubao']
  },
  {
    id: 't8',
    name: 'Makati City Hall',
    type: 'jeepney',
    latitude: 14.5547,
    longitude: 121.0244,
    routes: ['Makati-Guadalupe', 'Makati-Pasay']
  }
];

module.exports = { philippineTerminals };

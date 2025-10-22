export const mockProjects = [
  {
    id: 1,
    attributes: {
      title: "BMW M3 GTR",
      slug: "bmw-m3-gtr",
      specifications: "A high-performance racing car.",
      status: "Completed",
      category: "Racing",
      power_hp: 450,
      engine_type: "V8",
      is_featured: true,
      description: "The BMW M3 GTR is a legendary racing car that competed in the American Le Mans Series.",
      timeline_tasks: [{task: 'Engine rebuild', status: 'completed', date: '2023-01-15'}, {task: 'Suspension setup', status: 'completed', date: '2023-02-01'}],
      race_results: [{event: 'American Le Mans Series', result: '1st Place', date: '2001-01-01'}],
      image_gallery: { data: [] },
    }
  },
  {
    id: 2,
    attributes: {
      title: "Nissan Terrano",
      slug: "nissan-terrano",
      specifications: "A rugged off-road vehicle.",
      status: "In Progress",
      category: "Off-road",
      power_hp: 250,
      engine_type: "V6",
      is_featured: false,
      description: "The Nissan Terrano is a versatile off-road vehicle, perfect for exploring the great outdoors.",
      timeline_tasks: [{task: 'Lift kit installation', status: 'in_progress', date: '2023-03-10'}],
      race_results: [],
      image_gallery: { data: [] },
    }
  },
  {
    id: 3,
    attributes: {
      title: "Porsche 911 GT3 R",
      slug: "porsche-911-gt3-r",
      specifications: "A high-performance racing car.",
      status: "Completed",
      category: "Racing",
      power_hp: 550,
      engine_type: "Flat-6",
      is_featured: true,
      description: "The Porsche 911 GT3 R is a top-tier racing car, designed for endurance and sprint races.",
      timeline_tasks: [{task: 'Aerodynamic upgrades', status: 'completed', date: '2023-04-20'}],
      race_results: [{event: '24 Hours of Nürburgring', result: '3rd Place', date: '2022-05-28'}],
      image_gallery: { data: [] },
    }
  }
];

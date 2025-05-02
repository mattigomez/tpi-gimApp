export const routines = [
  {
      id: 1,
      title: "Rutina Full Body Principiantes",
      description: "Entrenamiento general para todo el cuerpo, ideal para quienes recién comienzan.",
      createdBy: "profesor1", 
      exercises: [
          {
              name: "Sentadillas",
              sets: 3,
              reps: 12,
          },
          {
              name: "Flexiones",
              sets: 3,
              reps: 10,
          },
          {
              name: "Plancha",
              sets: 3,
              duration: "30s",
          },
      ],
      duration: "45 minutos",
      imageUrl: "https://example.com/fullbody.jpg",
      level: "Principiante"
  },
  {
      id: 2,
      title: "Rutina Tren Superior Intermedia",
      description: "Ejercicios centrados en pecho, espalda y brazos.",
      createdBy: "profesor2",
      exercises: [
          {
              name: "Press de banca",
              sets: 4,
              reps: 10,
          },
          {
              name: "Dominadas asistidas",
              sets: 3,
              reps: 8,
          },
          {
              name: "Fondos de tríceps",
              sets: 3,
              reps: 12,
          },
      ],
      duration: "1 hora",
      imageUrl: "https://example.com/tren-superior.jpg",
      level: "Intermedio"
  }
];

export type CarBrand = {
  brand: string;
  models: string[];
};

export const CAR_DATA: CarBrand[] = [
  {
    brand: "Abarth",
    models: ["124 Spider", "500", "595", "695", "Punto Evo"],
  },
  {
    brand: "Alfa Romeo",
    models: ["147", "156", "159", "Giulia", "Giulietta", "GTV", "MiTo", "Spider", "Stelvio", "Tonale"],
  },
  {
    brand: "Audi",
    models: [
      "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8",
      "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8",
      "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q3", "RS Q8",
      "S1", "S3", "S4", "S5", "S6", "S7", "S8", "SQ5", "SQ7", "SQ8",
      "TT", "TTS", "TT RS", "e-tron", "e-tron GT",
    ],
  },
  {
    brand: "BMW",
    models: [
      "Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "Série 6", "Série 7", "Série 8",
      "X1", "X2", "X3", "X4", "X5", "X6", "X7", "XM",
      "M2", "M3", "M4", "M5", "M8", "M135i", "M235i", "M340i", "M440i",
      "i3", "i4", "i5", "i7", "iX", "iX1", "iX2", "iX3",
      "Z3", "Z4",
    ],
  },
  {
    brand: "Chevrolet",
    models: ["Camaro", "Captiva", "Corvette", "Cruze", "Equinox", "Malibu", "Spark", "Tahoe", "Trailblazer", "Trax"],
  },
  {
    brand: "Citroën",
    models: [
      "Berlingo", "C1", "C2", "C3", "C3 Aircross", "C3 Picasso",
      "C4", "C4 Cactus", "C4 Picasso", "C4 SpaceTourer",
      "C5", "C5 Aircross", "C5 X",
      "C-Elysée", "DS3", "DS4", "DS5", "Grand C4 Picasso",
      "Jumpy", "Nemo", "SpaceTourer", "Xsara",
    ],
  },
  {
    brand: "Cupra",
    models: ["Ateca", "Born", "Formentor", "Leon", "Tavascan", "Terramar"],
  },
  {
    brand: "Dacia",
    models: ["Dokker", "Duster", "Jogger", "Logan", "Logan MCV", "Lodgy", "Sandero", "Sandero Stepway", "Spring"],
  },
  {
    brand: "DS Automobiles",
    models: ["DS 3", "DS 3 Crossback", "DS 4", "DS 5", "DS 7", "DS 7 Crossback", "DS 9"],
  },
  {
    brand: "Fiat",
    models: [
      "124 Spider", "500", "500C", "500e", "500L", "500X",
      "Bravo", "Doblo", "Egea", "Fullback", "Grande Punto",
      "Panda", "Punto", "Qubo", "Scudo", "Tipo",
    ],
  },
  {
    brand: "Ford",
    models: [
      "B-Max", "C-Max", "EcoSport", "Edge", "Explorer", "Fiesta", "Focus",
      "Galaxy", "Grand C-Max", "Ka", "Ka+", "Kuga", "Mondeo",
      "Mustang", "Mustang Mach-E", "Puma", "Ranger", "S-Max", "Transit",
    ],
  },
  {
    brand: "Honda",
    models: [
      "Accord", "Civic", "CR-V", "CR-Z", "e", "e:Ny1",
      "HR-V", "Jazz", "Legend", "NSX", "Pilot", "ZR-V",
    ],
  },
  {
    brand: "Hyundai",
    models: [
      "Bayon", "Elantra", "Genesis", "Getz", "Grand Santa Fe",
      "i10", "i20", "i30", "i40", "IONIQ", "IONIQ 5", "IONIQ 6",
      "ix20", "ix35", "Kona", "Santa Fe", "Sonata", "Tucson", "Veloster",
    ],
  },
  {
    brand: "Jaguar",
    models: ["E-Pace", "E-Type", "F-Pace", "F-Type", "I-Pace", "XE", "XF", "XJ"],
  },
  {
    brand: "Jeep",
    models: ["Avenger", "Cherokee", "Commander", "Compass", "Grand Cherokee", "Renegade", "Wrangler"],
  },
  {
    brand: "Kia",
    models: [
      "Ceed", "Carens", "EV3", "EV6", "EV9",
      "Niro", "Niro EV", "Picanto", "ProCeed", "Rio",
      "Sorento", "Soul", "Sportage", "Stinger", "Stonic", "XCeed",
    ],
  },
  {
    brand: "Lamborghini",
    models: ["Aventador", "Huracán", "Urus"],
  },
  {
    brand: "Land Rover",
    models: [
      "Defender", "Discovery", "Discovery Sport",
      "Freelander", "Range Rover", "Range Rover Evoque",
      "Range Rover Sport", "Range Rover Velar",
    ],
  },
  {
    brand: "Lexus",
    models: ["CT", "ES", "GS", "IS", "LC", "LS", "LX", "NX", "RX", "UX"],
  },
  {
    brand: "Maserati",
    models: ["Ghibli", "Grecale", "GranCabrio", "GranTurismo", "Levante", "Quattroporte"],
  },
  {
    brand: "Mazda",
    models: [
      "2", "3", "6", "CX-3", "CX-30", "CX-5", "CX-60",
      "CX-7", "CX-9", "MX-5", "MX-30",
    ],
  },
  {
    brand: "Mercedes-Benz",
    models: [
      "Classe A", "Classe B", "Classe C", "Classe CLA", "Classe CLS",
      "Classe E", "Classe G", "Classe GL", "Classe GLA", "Classe GLB",
      "Classe GLC", "Classe GLE", "Classe GLS", "Classe S", "Classe SL", "Classe SLK",
      "AMG GT", "AMG ONE",
      "EQA", "EQB", "EQC", "EQE", "EQS", "EQT", "EQV",
      "Marco Polo", "Sprinter", "V-Klasse", "Vito",
    ],
  },
  {
    brand: "Mini",
    models: [
      "3 portes", "5 portes", "Cabrio", "Clubman", "Clubvan",
      "Cooper", "Cooper S", "Countryman", "Paceman", "Paceman S",
      "JCW", "John Cooper Works", "Aceman",
    ],
  },
  {
    brand: "Mitsubishi",
    models: ["ASX", "Colt", "Eclipse Cross", "Galant", "L200", "Lancer", "Outlander", "Pajero", "Space Star"],
  },
  {
    brand: "Nissan",
    models: [
      "370Z", "Ariya", "Juke", "Leaf", "Micra", "Murano",
      "Navara", "Note", "Pathfinder", "Pulsar", "Qashqai",
      "Townstar", "X-Trail",
    ],
  },
  {
    brand: "Opel / Vauxhall",
    models: [
      "Adam", "Agila", "Ampera", "Antara", "Astra",
      "Cascada", "Combo", "Corsa", "Crossland", "Grandland",
      "Insignia", "Karl", "Meriva", "Mokka", "Omega",
      "Signum", "Vectra", "Vivaro", "Zafira",
    ],
  },
  {
    brand: "Peugeot",
    models: [
      "107", "108", "2008", "205", "206", "207", "208",
      "3008", "301", "307", "308", "4008",
      "408", "5008", "508", "508 SW", "607",
      "Expert", "Partner", "Traveller",
      "e-208", "e-2008", "e-308", "e-408",
    ],
  },
  {
    brand: "Porsche",
    models: [
      "718 Boxster", "718 Cayman", "911",
      "Cayenne", "Macan", "Panamera",
      "Taycan", "Taycan Cross Turismo",
    ],
  },
  {
    brand: "Renault",
    models: [
      "Arkana", "Austral", "Captur", "Clio", "Espace",
      "Express", "Fluence", "Grand Scenic", "Kadjar",
      "Kangoo", "Koleos", "Laguna", "Latitude",
      "Master", "Megane", "Megane E-Tech", "Modus",
      "Safrane", "Scenic", "Scenic E-Tech", "Symbol",
      "Trafic", "Twingo", "Twizy", "Wind", "Zoe",
    ],
  },
  {
    brand: "Seat",
    models: [
      "Alhambra", "Altea", "Arona", "Arosa",
      "Ateca", "Cordoba", "Exeo",
      "Ibiza", "Leon", "Mii", "Tarraco", "Toledo",
    ],
  },
  {
    brand: "Skoda",
    models: [
      "Citigo", "Enyaq", "Enyaq Coupé",
      "Fabia", "Kamiq", "Karoq", "Kodiaq",
      "Octavia", "Rapid", "Roomster", "Scala",
      "Superb", "Yeti",
    ],
  },
  {
    brand: "Smart",
    models: ["#1", "#3", "Brabus", "EQ Fortwo", "Fortwo", "Forfour"],
  },
  {
    brand: "Subaru",
    models: ["BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Levorg", "Outback", "Solterra", "WRX"],
  },
  {
    brand: "Suzuki",
    models: ["Alto", "Baleno", "Celerio", "Ignis", "Jimny", "S-Cross", "Swift", "SX4", "Vitara"],
  },
  {
    brand: "Tesla",
    models: ["Cybertruck", "Model 3", "Model S", "Model X", "Model Y", "Roadster"],
  },
  {
    brand: "Toyota",
    models: [
      "Aygo", "Aygo X", "bZ4X", "C-HR",
      "Camry", "Corolla", "Cross", "GR86", "GR Yaris",
      "Hilux", "Land Cruiser", "Mirai",
      "Prius", "ProAce", "RAV4", "Supra",
      "Urban Cruiser", "Verso", "Yaris", "Yaris Cross",
    ],
  },
  {
    brand: "Volkswagen",
    models: [
      "Amarok", "Arteon", "Caddy", "California", "Golf",
      "Golf GTI", "Golf R", "Golf Sportsvan", "ID.3", "ID.4",
      "ID.5", "ID.7", "Jetta", "Multivan", "Passat",
      "Polo", "Sharan", "T-Cross", "T-Roc", "Taigo",
      "Tiguan", "Touareg", "Touran", "Transporter", "Up!",
    ],
  },
  {
    brand: "Volvo",
    models: [
      "C30", "C40", "EX30", "EX40", "EX90",
      "S40", "S60", "S80", "S90",
      "V40", "V60", "V70", "V90",
      "XC40", "XC60", "XC70", "XC90",
    ],
  },
];

export const ALL_BRANDS = CAR_DATA.map((d) => d.brand).sort();

export function getModelsForBrand(brand: string): string[] {
  return CAR_DATA.find((d) => d.brand === brand)?.models ?? [];
}

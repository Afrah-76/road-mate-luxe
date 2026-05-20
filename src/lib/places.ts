export type Place = {
  slug: string;
  name: string;
  description: string;
  lat: number;
  lon: number;
  spots: string[];
  image: string;
  gallery: string[];
};

// Curated stable Unsplash photo URLs (images.unsplash.com is a CDN, source.unsplash.com is deprecated).
const IMG = {
  hills1: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80&auto=format&fit=crop",
  hills2: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop",
  hills3: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80&auto=format&fit=crop",
  hills4: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80&auto=format&fit=crop",
  tea:    "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=1200&q=80&auto=format&fit=crop",
  lake1:  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80&auto=format&fit=crop",
  lake2:  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=80&auto=format&fit=crop",
  forest: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80&auto=format&fit=crop",
  pine:   "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80&auto=format&fit=crop",
  temple1:"https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80&auto=format&fit=crop",
  temple2:"https://images.unsplash.com/photo-1609858155423-5fae0bd55785?w=1200&q=80&auto=format&fit=crop",
  temple3:"https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80&auto=format&fit=crop",
  temple4:"https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80&auto=format&fit=crop",
  india1: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80&auto=format&fit=crop",
  india2: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1200&q=80&auto=format&fit=crop",
  beach1: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
  beach2: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80&auto=format&fit=crop",
  beach3: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1200&q=80&auto=format&fit=crop",
  ocean:  "https://images.unsplash.com/photo-1439405326854-014607f694d7?w=1200&q=80&auto=format&fit=crop",
  sunset: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1200&q=80&auto=format&fit=crop",
  bridge: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80&auto=format&fit=crop",
  fall1:  "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&q=80&auto=format&fit=crop",
  fall2:  "https://images.unsplash.com/photo-1467890947394-8171244e5410?w=1200&q=80&auto=format&fit=crop",
  fort:   "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80&auto=format&fit=crop",
  city:   "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=80&auto=format&fit=crop",
  palace: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80&auto=format&fit=crop",
  market: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&q=80&auto=format&fit=crop",
};

export const PLACES: Place[] = [
  { slug: "ooty", name: "Ooty (Udhagamandalam)", description: "Queen of hill stations — tea estates, toy trains and misty peaks.", lat: 11.4102, lon: 76.6950,
    spots: ["Botanical Gardens", "Doddabetta Peak", "Ooty Lake", "Nilgiri Mountain Railway", "Pykara Falls"],
    image: IMG.tea, gallery: [IMG.tea, IMG.hills1, IMG.lake1, IMG.forest, IMG.fall1] },
  { slug: "kodaikanal", name: "Kodaikanal", description: "Princess of hill stations with pine forests and a star-shaped lake.", lat: 10.2381, lon: 77.4892,
    spots: ["Kodai Lake", "Coaker's Walk", "Pillar Rocks", "Bryant Park", "Silver Cascade Falls"],
    image: IMG.pine, gallery: [IMG.pine, IMG.lake2, IMG.hills2, IMG.fall2, IMG.forest] },
  { slug: "rameswaram", name: "Rameswaram", description: "Sacred island town with temples and turquoise seas.", lat: 9.2876, lon: 79.3129,
    spots: ["Ramanathaswamy Temple", "Pamban Bridge", "Dhanushkodi Beach", "Agni Theertham", "Gandamadana Parvatham"],
    image: IMG.bridge, gallery: [IMG.bridge, IMG.temple1, IMG.beach1, IMG.ocean, IMG.beach3] },
  { slug: "madurai", name: "Madurai", description: "Temple city of Tamil Nadu — ancient, vibrant, never sleeps.", lat: 9.9252, lon: 78.1198,
    spots: ["Meenakshi Amman Temple", "Thirumalai Nayakkar Palace", "Gandhi Memorial Museum", "Vaigai Dam", "Alagar Kovil"],
    image: IMG.temple2, gallery: [IMG.temple2, IMG.temple3, IMG.palace, IMG.market, IMG.india1] },
  { slug: "kanyakumari", name: "Kanyakumari", description: "Where three seas meet — sunrise, sunset and the southern tip of India.", lat: 8.0883, lon: 77.5385,
    spots: ["Vivekananda Rock Memorial", "Thiruvalluvar Statue", "Sunset Point", "Padmanabhapuram Palace", "Our Lady of Ransom Church"],
    image: IMG.sunset, gallery: [IMG.sunset, IMG.ocean, IMG.beach2, IMG.temple4, IMG.beach1] },
  { slug: "mahabalipuram", name: "Mahabalipuram", description: "UNESCO shore temples and rock-cut wonders by the Bay of Bengal.", lat: 12.6269, lon: 80.1927,
    spots: ["Shore Temple", "Pancha Rathas", "Arjuna's Penance", "Krishna's Butterball", "Mahabalipuram Beach"],
    image: IMG.temple4, gallery: [IMG.temple4, IMG.beach3, IMG.temple1, IMG.ocean, IMG.beach1] },
  { slug: "thanjavur", name: "Thanjavur (Tanjore)", description: "Cradle of Chola art, music and the Brihadeeswarar Temple.", lat: 10.7870, lon: 79.1378,
    spots: ["Brihadeeswarar Temple", "Thanjavur Palace", "Saraswathi Mahal Library", "Art Gallery", "Sangeetha Mahal"],
    image: IMG.temple3, gallery: [IMG.temple3, IMG.palace, IMG.temple2, IMG.india2, IMG.india1] },
  { slug: "yercaud", name: "Yercaud", description: "A quiet hill station on the Shevaroy hills, coffee and orange groves.", lat: 11.7747, lon: 78.2095,
    spots: ["Yercaud Lake", "Pagoda Point", "Killiyur Falls", "Shevaroy Temple", "Lady's Seat"],
    image: IMG.hills3, gallery: [IMG.hills3, IMG.lake1, IMG.forest, IMG.fall1, IMG.hills2] },
  { slug: "coimbatore", name: "Coimbatore", description: "Manchester of South India — gateway to the Western Ghats.", lat: 11.0168, lon: 76.9558,
    spots: ["Marudhamalai Temple", "VOC Park", "Dhyanalinga", "Siruvani Falls", "Adiyogi Statue"],
    image: IMG.hills4, gallery: [IMG.hills4, IMG.temple1, IMG.fall2, IMG.city, IMG.forest] },
  { slug: "tiruppur", name: "Tiruppur", description: "Knit city with parks, temples and a buzzing local culture.", lat: 11.1085, lon: 77.3411,
    spots: ["Avinashi Temple", "Tiruppur Kumaran Memorial", "Thirumurthi Hills", "Amaravathi Dam", "Uthukuli"],
    image: IMG.city, gallery: [IMG.city, IMG.temple2, IMG.hills1, IMG.market, IMG.india2] },
  { slug: "vellore", name: "Vellore", description: "Fort city famous for the golden temple of Sripuram.", lat: 12.9165, lon: 79.1325,
    spots: ["Vellore Fort", "Sripuram Golden Temple", "Jalakandeswarar Temple", "Government Museum", "Amirthi Zoological Park"],
    image: IMG.fort, gallery: [IMG.fort, IMG.temple3, IMG.palace, IMG.temple1, IMG.india1] },
  { slug: "courtallam", name: "Courtallam (Kutralam)", description: "Spa of South India — a constellation of healing waterfalls.", lat: 8.9333, lon: 77.2667,
    spots: ["Main Falls", "Five Falls", "Old Courtallam Falls", "Tiger Falls", "Honey Falls"],
    image: IMG.fall1, gallery: [IMG.fall1, IMG.fall2, IMG.forest, IMG.hills2, IMG.lake2] },
];

export const findPlace = (slug: string) => PLACES.find((p) => p.slug === slug);

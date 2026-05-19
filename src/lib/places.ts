export type Place = {
  slug: string;
  name: string;
  description: string;
  lat: number;
  lon: number;
  spots: string[];
};

export const PLACES: Place[] = [
  { slug: "ooty", name: "Ooty (Udhagamandalam)", description: "Queen of hill stations — tea estates, toy trains and misty peaks.", lat: 11.4102, lon: 76.6950, spots: ["Botanical Gardens", "Doddabetta Peak", "Ooty Lake", "Nilgiri Mountain Railway", "Pykara Falls"] },
  { slug: "kodaikanal", name: "Kodaikanal", description: "Princess of hill stations with pine forests and a star-shaped lake.", lat: 10.2381, lon: 77.4892, spots: ["Kodai Lake", "Coaker's Walk", "Pillar Rocks", "Bryant Park", "Silver Cascade Falls"] },
  { slug: "rameswaram", name: "Rameswaram", description: "Sacred island town with temples and turquoise seas.", lat: 9.2876, lon: 79.3129, spots: ["Ramanathaswamy Temple", "Pamban Bridge", "Dhanushkodi Beach", "Agni Theertham", "Gandamadana Parvatham"] },
  { slug: "madurai", name: "Madurai", description: "Temple city of Tamil Nadu — ancient, vibrant, never sleeps.", lat: 9.9252, lon: 78.1198, spots: ["Meenakshi Amman Temple", "Thirumalai Nayakkar Palace", "Gandhi Memorial Museum", "Vaigai Dam", "Alagar Kovil"] },
  { slug: "kanyakumari", name: "Kanyakumari", description: "Where three seas meet — sunrise, sunset and the southern tip of India.", lat: 8.0883, lon: 77.5385, spots: ["Vivekananda Rock Memorial", "Thiruvalluvar Statue", "Sunset Point", "Padmanabhapuram Palace", "Our Lady of Ransom Church"] },
  { slug: "mahabalipuram", name: "Mahabalipuram", description: "UNESCO shore temples and rock-cut wonders by the Bay of Bengal.", lat: 12.6269, lon: 80.1927, spots: ["Shore Temple", "Pancha Rathas", "Arjuna's Penance", "Krishna's Butterball", "Mahabalipuram Beach"] },
  { slug: "thanjavur", name: "Thanjavur (Tanjore)", description: "Cradle of Chola art, music and the Brihadeeswarar Temple.", lat: 10.7870, lon: 79.1378, spots: ["Brihadeeswarar Temple", "Thanjavur Palace", "Saraswathi Mahal Library", "Art Gallery", "Sangeetha Mahal"] },
  { slug: "yercaud", name: "Yercaud", description: "A quiet hill station on the Shevaroy hills, coffee and orange groves.", lat: 11.7747, lon: 78.2095, spots: ["Yercaud Lake", "Pagoda Point", "Killiyur Falls", "Shevaroy Temple", "Lady's Seat"] },
  { slug: "coimbatore", name: "Coimbatore", description: "Manchester of South India — gateway to the Western Ghats.", lat: 11.0168, lon: 76.9558, spots: ["Marudhamalai Temple", "VOC Park", "Dhyanalinga", "Siruvani Falls", "Adiyogi Statue"] },
  { slug: "tiruppur", name: "Tiruppur", description: "Knit city with parks, temples and a buzzing local culture.", lat: 11.1085, lon: 77.3411, spots: ["Avinashi Temple", "Tiruppur Kumaran Memorial", "Thirumurthi Hills", "Amaravathi Dam", "Uthukuli"] },
  { slug: "vellore", name: "Vellore", description: "Fort city famous for the golden temple of Sripuram.", lat: 12.9165, lon: 79.1325, spots: ["Vellore Fort", "Sripuram Golden Temple", "Jalakandeswarar Temple", "Government Museum", "Amirthi Zoological Park"] },
  { slug: "courtallam", name: "Courtallam (Kutralam)", description: "Spa of South India — a constellation of healing waterfalls.", lat: 8.9333, lon: 77.2667, spots: ["Main Falls", "Five Falls", "Old Courtallam Falls", "Tiger Falls", "Honey Falls"] },
];

export const findPlace = (slug: string) => PLACES.find((p) => p.slug === slug);

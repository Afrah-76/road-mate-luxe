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

const u = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

// Themed fallback photos for spot galleries (stable Unsplash CDN URLs).
const IMG = {
  hills1: "https://www.clubmahindra.com/blog/images/Ooty-Places-to-Visit-in-Ooty.jpg",
  hills2: "https://www.tourmyindia.com/states/tamilnadu/images/kodaikanal-lake.jpg",
  hills3: u("photo-1501785888041-af3ef285b470"),
  hills4: u("photo-1470071459604-3b5ec3a7fe05"),
  tea:    "https://static.wixstatic.com/media/adbc9d_5f9f1beb25274cd4bedb07a538223497~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/adbc9d_5f9f1beb25274cd4bedb07a538223497~mv2.jpg",
  lake1:  "https://www.indiatravel.app/wp-content/uploads/2024/04/Ooty-Tea-Museum.jpg",
  lake2:  "https://assets.traveltriangle.com/blog/wp-content/uploads/2018/04/Thirumalai-Nayak-Mahal.jpg",
  forest: "https://www.sharonsable.com/images/10/9532/botanical-gardens-in-ooty-25-photo-7089.jpg",
  pine:   u("photo-1441974231531-c6227db76b6e"),
  temple1: u("photo-1582510003544-4d00b7f74220"),
  temple2: u("photo-1609858155423-5fae0bd55785"),
  temple3: "https://www.holidify.com/images/bgImages/MADURAI.jpg",
  temple4: "https://irisholidays.com/keralatourism/wp-content/uploads/2025/02/mahabalipuram-tamlnadu.jpg",
  india1: "https://img.veenaworld.com/wp-content/uploads/2020/11/10-Madurai-Temples-with-Brilliant-Architecture-scaled.jpg",
  india2: u("photo-1514222134-b57cbb8ce073"),
  beach1: "https://www.sharpholidays.in/blog/wp-content/uploads/2025/03/vivekananda-memorial-rameswaram-768x444.jpg",
  beach2: "https://www.hoteltempleciti.com/blog/wp-content/uploads/2022/03/Best-Time-To-Visit-Kanyakumari.jpg",
  beach3: "https://www.justahotels.com/wp-content/uploads/2023/09/Rameswaram.jpg",
  ocean:  "https://assets.traveltriangle.com/blog/wp-content/uploads/2018/04/Thiruvalluvar-Statue.jpg",
  sunset: u("photo-1495616811223-4d98c6e9c869"),
  bridge: "https://www.justahotels.com/wp-content/uploads/2022/09/temple-rameswaram.png",
  fall1:  "https://assets.traveltriangle.com/blog/wp-content/uploads/2018/02/Perumal-Peak-kb6592hdg.jpg",
  fall2:  "https://images.news9live.com/wp-content/uploads/2025/10/pillars-rock-kodaikanal-.png",
  fort:   u("photo-1564507592333-c60657eea523"),
  city:   u("photo-1477587458883-47145ed94245"),
  palace: "https://newstodaynet.com/wp-content/uploads/2024/12/images-53-1.jpeg",
  market: u("photo-1532375810709-75b1da00537c"),
};

// Place cover photos — exact Unsplash URLs requested by the user.
const COVER = {
  ooty:          "https://s3.india.com/wp-content/uploads/2024/07/Historical-Places-To-Visit-In-Ooty.jpg?impolicy=Medium_Widthonly&w=800&h=541",
  kodaikanal:    "https://www.treebo.com/blog/wp-content/uploads/2018/08/Things-To-Do-In-Kodaikanal.jpg",
  rameswaram:    "https://www.justahotels.com/wp-content/uploads/2023/12/HQ368254-transformed.jpeg",
  madurai:       "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
  kanyakumari:   "https://www.tusktravel.com/blog/wp-content/uploads/2021/01/Kanyakumari-Temple.jpg",
  mahabalipuram: "https://wallpaperaccess.com/full/11038015.jpg",
  thanjavur:     "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800&q=80",
  yercaud:       "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&q=80",
  coimbatore:    "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
  tiruppur:      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  vellore:       "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
  courtallam:    "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800&q=80",
};

export const PLACES: Place[] = [
  { slug: "ooty", name: "Ooty (Udhagamandalam)", description: "Queen of hill stations — tea estates, toy trains and misty peaks.", lat: 11.4102, lon: 76.6950,
    spots: ["Ooty Botanical Garden", "Ooty Lake", "Doddabetta Peak", "Rose Garden Ooty", "Nilgiri Mountain Railway"],
    image: COVER.ooty, gallery: [COVER.ooty, IMG.lake1, IMG.hills1, IMG.tea, IMG.forest] },
  { slug: "kodaikanal", name: "Kodaikanal", description: "Princess of hill stations with pine forests and a star-shaped lake.", lat: 10.2381, lon: 77.4892,
    spots: ["Kodaikanal Lake", "Coaker's Walk", "Pillar Rocks", "Silver Cascade Falls", "Bear Shola Falls"],
    image: COVER.kodaikanal, gallery: [COVER.kodaikanal, IMG.lake2, IMG.hills2, IMG.fall1, IMG.fall2] },
  { slug: "rameswaram", name: "Rameswaram", description: "Sacred island town with temples and turquoise seas.", lat: 9.2876, lon: 79.3129,
    spots: ["Ramanathaswamy Temple", "Pamban Bridge", "Dhanushkodi Beach", "Agnitheertham Beach", "Adam's Bridge Viewpoint"],
    image: COVER.rameswaram, gallery: [COVER.rameswaram, IMG.bridge, IMG.beach1, IMG.ocean, IMG.beach3] },
  { slug: "madurai", name: "Madurai", description: "Temple city of Tamil Nadu — ancient, vibrant, never sleeps.", lat: 9.9252, lon: 78.1198,
    spots: ["Meenakshi Amman Temple", "Thirumalai Nayak Palace", "Gandhi Museum", "Alagar Kovil", "Vandiyur Mariamman Teppakulam"],
    image: COVER.madurai, gallery: [COVER.madurai, IMG.palace, IMG.india1, IMG.temple3, IMG.lake2] },
  { slug: "kanyakumari", name: "Kanyakumari", description: "Where three seas meet — sunrise, sunset and the southern tip of India.", lat: 8.0883, lon: 77.5385,
    spots: ["Vivekananda Rock Memorial", "Thiruvalluvar Statue", "Kanyakumari Sunrise", "Padmanabapuram Palace", "Sunset View Point"],
    image: COVER.kanyakumari, gallery: [COVER.kanyakumari, IMG.ocean, IMG.sunset, IMG.palace, IMG.beach2] },
  { slug: "mahabalipuram", name: "Mahabalipuram", description: "UNESCO shore temples and rock-cut wonders by the Bay of Bengal.", lat: 12.6269, lon: 80.1927,
    spots: ["Shore Temple", "Five Rathas", "Arjuna's Penance", "Krishna's Butter Ball", "Mahabalipuram Beach"],
    image: COVER.mahabalipuram, gallery: [COVER.mahabalipuram, IMG.temple4, IMG.temple1, IMG.india2, IMG.beach3] },
  { slug: "thanjavur", name: "Thanjavur (Tanjore)", description: "Cradle of Chola art, music and the Brihadeeswarar Temple.", lat: 10.7870, lon: 79.1378,
    spots: ["Brihadeeswarar Temple", "Thanjavur Palace", "Saraswathi Mahal Library", "Schwartz Church", "Thanjavur Art Gallery"],
    image: COVER.thanjavur, gallery: [COVER.thanjavur, IMG.palace, IMG.india1, IMG.temple2, IMG.india2] },
  { slug: "yercaud", name: "Yercaud", description: "A quiet hill station on the Shevaroy hills, coffee and orange groves.", lat: 11.7747, lon: 78.2095,
    spots: ["Yercaud Lake", "Lady's Seat Viewpoint", "Kiliyur Falls", "Shevaroy Temple", "Yercaud Rose Garden"],
    image: COVER.yercaud, gallery: [COVER.yercaud, IMG.lake1, IMG.hills3, IMG.fall1, IMG.forest] },
  { slug: "coimbatore", name: "Coimbatore", description: "Manchester of South India — gateway to the Western Ghats.", lat: 11.0168, lon: 76.9558,
    spots: ["Marudamalai Temple", "VOC Park & Zoo", "Gedee Car Museum", "Dhyanalinga (Isha Foundation)", "Perur Pateeswarar Temple"],
    image: COVER.coimbatore, gallery: [COVER.coimbatore, IMG.temple1, IMG.city, IMG.hills4, IMG.temple3] },
  { slug: "tiruppur", name: "Tiruppur", description: "Knit city with parks, temples and a buzzing local culture.", lat: 11.1085, lon: 77.3411,
    spots: ["Noyyal River Park", "Kangeyam", "Amaravathi Dam", "Avinashi Temple", "Tiruppur Kumaran Memorial"],
    image: COVER.tiruppur, gallery: [COVER.tiruppur, IMG.lake2, IMG.city, IMG.temple2, IMG.market] },
  { slug: "vellore", name: "Vellore", description: "Fort city famous for the golden temple of Sripuram.", lat: 12.9165, lon: 79.1325,
    spots: ["Vellore Fort", "Sripuram Golden Temple", "Jalakandeswarar Temple", "Government Museum", "Amirthi Zoological Park"],
    image: COVER.vellore, gallery: [COVER.vellore, IMG.fort, IMG.temple3, IMG.palace, IMG.forest] },
  { slug: "courtallam", name: "Courtallam (Kutralam)", description: "Spa of South India — a constellation of healing waterfalls.", lat: 8.9333, lon: 77.2667,
    spots: ["Main Falls", "Five Falls", "Old Courtallam Falls", "Tiger Falls", "Honey Falls"],
    image: COVER.courtallam, gallery: [COVER.courtallam, IMG.fall1, IMG.fall2, IMG.forest, IMG.hills2] },
];

export const findPlace = (slug: string) => PLACES.find((p) => p.slug === slug);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Helper to ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Data Seed
const initialData = {
  users: [
    {
      id: "usr_customer_demo",
      email: "customer@homecookfinder.test",
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      role: "CUSTOMER",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      createdAt: new Date().toISOString()
    },
    {
      id: "usr_cook_priya",
      email: "cook@homecookfinder.test",
      name: "Priya Reddy",
      phone: "+91 98765 11111",
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      createdAt: new Date().toISOString()
    },
    {
      id: "usr_admin_demo",
      email: "admin@homecookfinder.test",
      name: "Super Admin",
      phone: "+91 98765 99999",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      createdAt: new Date().toISOString()
    },
    {
      id: "usr_cook_reema",
      email: "reema@homecookfinder.test",
      name: "Reema Agarwal",
      phone: "+91 98765 22222",
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "usr_cook_sunitha",
      email: "sunitha@homecookfinder.test",
      name: "Sunitha Amma",
      phone: "+91 98765 33333",
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "usr_cook_kavitha",
      email: "kavitha@homecookfinder.test",
      name: "Kavitha Rao",
      phone: "+91 98765 44444",
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "usr_cook_anitha",
      email: "anitha@homecookfinder.test",
      name: "Anitha Varma",
      phone: "+91 98765 55555",
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "usr_cook_laxmi",
      email: "laxmi@homecookfinder.test",
      name: "Laxmi Devi",
      phone: "+91 98765 66666",
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "usr_cook_swapna",
      email: "swapna@homecookfinder.test",
      name: "Swapna Naidu",
      phone: "+91 98765 77777",
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "usr_cook_archana",
      email: "archana@homecookfinder.test",
      name: "Archana Sen",
      phone: "+91 98765 88888",
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "usr_cook_radhika",
      email: "radhika@homecookfinder.test",
      name: "Radhika K",
      phone: "+91 98765 12345",
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "usr_cook_geetha",
      email: "geetha@homecookfinder.test",
      name: "Geetha Rani",
      phone: "+91 98765 67890",
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    }
  ],
  adminAuthorizations: [
    {
      id: "auth_usr_admin_demo",
      userId: "usr_admin_demo",
      email: "admin@homecookfinder.test",
      name: "Super Admin",
      status: "ACTIVE",
      grantedBy: "SYSTEM_OWNER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  cookProfiles: [
    {
      id: "cook_priya",
      userId: "usr_cook_priya",
      kitchenName: "Priya's Home Kitchen",
      ownerName: "Priya Reddy",
      photo: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
      bio: "Cooking authentic Andhra meals with pure homemade podis, ghee, and fresh organic ingredients. Verified by Home Cook Finder team on video call.",
      location: "Madhapur, Hyderabad",
      lat: 17.4483,
      lng: 78.3915,
      distanceKm: 0.4,
      rating: 4.9,
      reviewCount: 340,
      startingPrice: 120,
      cuisines: ["Andhra", "South Indian", "Biryani"],
      experienceYears: 12,
      isVerified: true,
      verificationDate: "2026-06-12",
      nextCheckDays: 18,
      fssaiNumber: "23621003000142",
      aadhaarStatus: "VERIFIED",
      availableToday: true,
      prepTimeMinutes: 25,
      openingHours: "11:00 AM - 10:00 PM"
    },
    {
      id: "cook_reema",
      userId: "usr_cook_reema",
      kitchenName: "Reema's Home Delights",
      ownerName: "Reema Agarwal",
      photo: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=600&q=80",
      bio: "Wholesome North Indian Thalis, freshly hand-rolled Chapatis, and Punjabi specials made with love in my home kitchen.",
      location: "Jubilee Hills, Hyderabad",
      lat: 17.4319,
      lng: 78.4071,
      distanceKm: 0.8,
      rating: 4.8,
      reviewCount: 210,
      startingPrice: 90,
      cuisines: ["North Indian", "Punjabi", "Thalis"],
      experienceYears: 9,
      isVerified: true,
      verificationDate: "2026-05-20",
      nextCheckDays: 12,
      fssaiNumber: "23621003000889",
      aadhaarStatus: "VERIFIED",
      availableToday: true,
      prepTimeMinutes: 20,
      openingHours: "12:00 PM - 9:30 PM"
    },
    {
      id: "cook_sunitha",
      userId: "usr_cook_sunitha",
      kitchenName: "Amma's Kitchen",
      ownerName: "Sunitha Amma",
      photo: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
      bio: "Traditional Rayalaseema Ragi Mudde, Dum Biryanis, and slow-cooked home gravies passed down through 3 generations.",
      location: "Kondapur, Hyderabad",
      lat: 17.4622,
      lng: 78.3673,
      distanceKm: 1.2,
      rating: 4.9,
      reviewCount: 520,
      startingPrice: 170,
      cuisines: ["Rayalaseema", "Biryani", "Telangana"],
      experienceYears: 20,
      isVerified: true,
      verificationDate: "2026-06-01",
      nextCheckDays: 22,
      fssaiNumber: "23621003000551",
      aadhaarStatus: "VERIFIED",
      availableToday: true,
      prepTimeMinutes: 35,
      openingHours: "11:30 AM - 10:30 PM"
    },
    {
      id: "cook_kavitha",
      userId: "usr_cook_kavitha",
      kitchenName: "Kavitha's Gourmet Express",
      ownerName: "Kavitha Rao",
      photo: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80",
      bio: "Hot crisp Ghee Pudi Dosa, Tiffins, Mirchi Bajji, and weekend chicken pulav prepared fresh upon your order.",
      location: "Gachibowli, Hyderabad",
      lat: 17.4401,
      lng: 78.3489,
      distanceKm: 1.5,
      rating: 4.7,
      reviewCount: 180,
      startingPrice: 70,
      cuisines: ["Tiffins", "Snacks", "South Indian"],
      experienceYears: 7,
      isVerified: true,
      verificationDate: "2026-06-18",
      nextCheckDays: 25,
      fssaiNumber: "23621003000774",
      aadhaarStatus: "VERIFIED",
      availableToday: true,
      prepTimeMinutes: 15,
      openingHours: "7:00 AM - 11:00 PM"
    },
    {
      id: "cook_anitha",
      userId: "usr_cook_anitha",
      kitchenName: "Anitha's Traditional Kitchen",
      ownerName: "Anitha Varma",
      photo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      bio: "Homemade Pulihora, Sambar Rice, Festival Specials, Bobbatlu and traditional sweets made with pure A2 cow ghee.",
      location: "Hitec City, Hyderabad",
      lat: 17.4435,
      lng: 78.3772,
      distanceKm: 2.0,
      rating: 4.9,
      reviewCount: 410,
      startingPrice: 100,
      cuisines: ["Andhra", "Sweets", "Festival Specials"],
      experienceYears: 15,
      isVerified: true,
      verificationDate: "2026-06-05",
      nextCheckDays: 14,
      fssaiNumber: "23621003000332",
      aadhaarStatus: "VERIFIED",
      availableToday: true,
      prepTimeMinutes: 20,
      openingHours: "10:30 AM - 9:00 PM"
    },
    {
      id: "cook_laxmi",
      userId: "usr_cook_laxmi",
      kitchenName: "Laxmi's Pure Veg Kitchen",
      ownerName: "Laxmi Devi",
      photo: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&q=80",
      bio: "100% Pure Vegetarian Sattvic homemade meals, No Onion No Garlic options available upon request.",
      location: "Banjara Hills, Hyderabad",
      lat: 17.4156,
      lng: 78.4347,
      distanceKm: 2.3,
      rating: 4.8,
      reviewCount: 290,
      startingPrice: 60,
      cuisines: ["Pure Veg", "Sattvic", "South Indian"],
      experienceYears: 18,
      isVerified: true,
      verificationDate: "2026-06-10",
      nextCheckDays: 16,
      fssaiNumber: "23621003000661",
      aadhaarStatus: "VERIFIED",
      availableToday: true,
      prepTimeMinutes: 15,
      openingHours: "8:00 AM - 9:30 PM"
    },
    {
      id: "cook_swapna",
      userId: "usr_cook_swapna",
      kitchenName: "Swapna's Spice Magic",
      ownerName: "Swapna Naidu",
      photo: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
      bio: "Fiery Telangana Natu Kodi (Country Chicken), Spicy Mutton Kheema, and authentic village-style firewood roasted spices.",
      location: "Kukatpally, Hyderabad",
      lat: 17.4849,
      lng: 78.4011,
      distanceKm: 3.1,
      rating: 4.6,
      reviewCount: 150,
      startingPrice: 230,
      cuisines: ["Telangana", "Non-Veg", "Spicy"],
      experienceYears: 8,
      isVerified: true,
      verificationDate: "2026-05-28",
      nextCheckDays: 8,
      fssaiNumber: "23621003000998",
      aadhaarStatus: "VERIFIED",
      availableToday: true,
      prepTimeMinutes: 35,
      openingHours: "12:00 PM - 11:00 PM"
    },
    {
      id: "cook_archana",
      userId: "usr_cook_archana",
      kitchenName: "Archana's Kitchenette",
      ownerName: "Archana Sen",
      photo: "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=600&q=80",
      bio: "Healthy home-cooked meals, Millet Upmas, Low-oil curries and protein bowls for working professionals.",
      location: "Madhapur, Hyderabad",
      lat: 17.4490,
      lng: 78.3890,
      distanceKm: 0.6,
      rating: 4.9,
      reviewCount: 380,
      startingPrice: 90,
      cuisines: ["Healthy", "Millets", "Dietary"],
      experienceYears: 6,
      isVerified: true,
      verificationDate: "2026-06-15",
      nextCheckDays: 20,
      fssaiNumber: "23621003000412",
      aadhaarStatus: "VERIFIED",
      availableToday: true,
      prepTimeMinutes: 20,
      openingHours: "8:00 AM - 10:00 PM"
    },
    {
      id: "cook_radhika",
      userId: "usr_cook_radhika",
      kitchenName: "Radhika's Coastal Flavors",
      ownerName: "Radhika K",
      photo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      bio: "Coastal Andhra style fresh Fish Pulusu, Prawn Iguru, and crispy Tawa Fish Fry delivered straight from my home pan.",
      location: "Kondapur, Hyderabad",
      lat: 17.4610,
      lng: 78.3650,
      distanceKm: 1.8,
      rating: 4.8,
      reviewCount: 195,
      startingPrice: 240,
      cuisines: ["Seafood", "Coastal Andhra", "Non-Veg"],
      experienceYears: 14,
      isVerified: true,
      verificationDate: "2026-06-08",
      nextCheckDays: 15,
      fssaiNumber: "23621003000219",
      aadhaarStatus: "VERIFIED",
      availableToday: true,
      prepTimeMinutes: 30,
      openingHours: "12:00 PM - 10:00 PM"
    },
    {
      id: "cook_geetha",
      userId: "usr_cook_geetha",
      kitchenName: "Geetha's Sweet Home",
      ownerName: "Geetha Rani",
      photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      bio: "Authentic festival sweets, Mysurpa, Sunnundalu, Ariselu and hot savory snacks made fresh in small batches.",
      location: "Jubilee Hills, Hyderabad",
      lat: 17.4330,
      lng: 78.4050,
      distanceKm: 2.5,
      rating: 4.9,
      reviewCount: 330,
      startingPrice: 80,
      cuisines: ["Sweets", "Snacks", "Traditional"],
      experienceYears: 16,
      isVerified: true,
      verificationDate: "2026-06-03",
      nextCheckDays: 11,
      fssaiNumber: "23621003000109",
      aadhaarStatus: "VERIFIED",
      availableToday: true,
      prepTimeMinutes: 10,
      openingHours: "9:00 AM - 8:30 PM"
    }
  ],
  menuItems: [
    {
      id: "itm_1",
      cookId: "cook_priya",
      name: "Andhra Special Meal Thali",
      description: "Steamed Rice, Pappu (Dal), Sambar, Rasam, Homemade Curd, Fryms, Podi & Desi Ghee.",
      price: 140,
      category: "Lunch",
      prepTimeMinutes: 25,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_2",
      cookId: "cook_priya",
      name: "Gongura Mutton Curry",
      description: "Tender mutton pieces slow-cooked with spicy Andhra Gongura (Sorrel) leaves.",
      price: 280,
      category: "Specials",
      prepTimeMinutes: 40,
      dietaryType: "NON_VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_3",
      cookId: "cook_priya",
      name: "Pappu Charu & Potato Fry Thali",
      description: "Comforting home-style Pappu Charu served with crispy roasted spiced potato fry and rice.",
      price: 120,
      category: "Lunch",
      prepTimeMinutes: 25,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_4",
      cookId: "cook_priya",
      name: "Kakaraya Fry (Crispy Bittergourd)",
      description: "Thinly sliced bittergourd fried crisp with roasted garlic and red chili podi.",
      price: 85,
      category: "Dinner",
      prepTimeMinutes: 20,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_5",
      cookId: "cook_reema",
      name: "Dal Chawal Thali with Desi Ghee",
      description: "Yellow Arhar Dal Tadka, Jeera Rice, 2 Butter Phulkas, Aloo Jeera and Salad.",
      price: 90,
      category: "Lunch",
      prepTimeMinutes: 20,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_6",
      cookId: "cook_reema",
      name: "Paneer Butter Masala & 3 Phulkas",
      description: "Rich creamy Paneer Butter Masala gravy served hot with 3 soft homemade phulkas.",
      price: 130,
      category: "Dinner",
      prepTimeMinutes: 25,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_7",
      cookId: "cook_reema",
      name: "Paneer Tikka Homemade Bowl",
      description: "Char-grilled homemade cottage cheese cubes tossed with bell peppers and green mint chutney.",
      price: 180,
      category: "Snacks",
      prepTimeMinutes: 25,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_8",
      cookId: "cook_reema",
      name: "Egg Masala Curry & 3 Parathas",
      description: "Two boiled eggs cooked in spicy onion tomato gravy served with 3 lachha parathas.",
      price: 140,
      category: "Dinner",
      prepTimeMinutes: 25,
      dietaryType: "NON_VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_9",
      cookId: "cook_sunitha",
      name: "Hyderabadi Chicken Dum Biryani",
      description: "Authentic home-cooked Dum Biryani with aromatic basmati rice, tender chicken, and Mirchi ka Salan.",
      price: 220,
      category: "Specials",
      prepTimeMinutes: 35,
      dietaryType: "NON_VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_10",
      cookId: "cook_sunitha",
      name: "Rayalaseema Ragi Mudde & Natu Kodi",
      description: "Nutritious finger millet balls served with spicy village style country chicken curry.",
      price: 240,
      category: "Lunch",
      prepTimeMinutes: 40,
      dietaryType: "NON_VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_11",
      cookId: "cook_sunitha",
      name: "Ulavacharu Veg Thali",
      description: "Rich horsegram soup curry served with steamed rice, ghee, papad and curd.",
      price: 170,
      category: "Lunch",
      prepTimeMinutes: 30,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_12",
      cookId: "cook_kavitha",
      name: "Soft Ghee Pudi Dosa & Chutneys",
      description: "Crispy golden dosa brushed with pure ghee & spicy roasted lentil podi, served with peanut & ginger chutney.",
      price: 80,
      category: "Breakfast",
      prepTimeMinutes: 15,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_13",
      cookId: "cook_kavitha",
      name: "Mirchi Bajji & Punugulu Combo",
      description: "Fresh green chili fritters and crispy rice flour bite-size punugulu served hot.",
      price: 70,
      category: "Snacks",
      prepTimeMinutes: 15,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_14",
      cookId: "cook_kavitha",
      name: "Home Chicken Fry Pulav",
      description: "Seeraga Samba rice pulav served with crispy spicy pan-roasted chicken fry and raitha.",
      price: 210,
      category: "Dinner",
      prepTimeMinutes: 30,
      dietaryType: "NON_VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_15",
      cookId: "cook_anitha",
      name: "Pulihora (Tamarind Rice) with Fryms",
      description: "Traditional temple-style tangy tamarind rice spiced with mustard, curry leaves, and roasted peanuts.",
      price: 100,
      category: "Breakfast",
      prepTimeMinutes: 20,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_16",
      cookId: "cook_anitha",
      name: "Special Ugadi Pachadi & Sweet Bobbatlu",
      description: "Traditional 6-taste Ugadi dish paired with 2 hot sweet Bobbatlu (Puran Poli).",
      price: 160,
      category: "Desserts",
      prepTimeMinutes: 20,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_17",
      cookId: "cook_anitha",
      name: "Butter Milk & Curd Rice Pot",
      description: "Creamy homemade curd rice tempered with mustard, pomegranates, and served with spiced buttermilk.",
      price: 70,
      category: "Lunch",
      prepTimeMinutes: 10,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_18",
      cookId: "cook_laxmi",
      name: "Steamed Fluffy Idli Set with Sambar",
      description: "4 melt-in-mouth steamed rice cakes served with hot drumstick sambar & fresh coconut chutney.",
      price: 60,
      category: "Breakfast",
      prepTimeMinutes: 15,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_19",
      cookId: "cook_laxmi",
      name: "Chettinad Mushroom Curry & Rice",
      description: "Button mushrooms simmered in freshly ground black pepper Chettinad masala gravy.",
      price: 170,
      category: "Dinner",
      prepTimeMinutes: 25,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_20",
      cookId: "cook_laxmi",
      name: "Classic Tomato Bath & Raitha",
      description: "Karnataka style spiced tomato pulav rice served with onion cucumber raitha.",
      price: 85,
      category: "Lunch",
      prepTimeMinutes: 20,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_21",
      cookId: "cook_swapna",
      name: "Telangana Natu Kodi Kura",
      description: "Spicy country chicken cooked with stone-ground shallots, garlic, and homemade garam masala.",
      price: 260,
      category: "Specials",
      prepTimeMinutes: 45,
      dietaryType: "NON_VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_22",
      cookId: "cook_swapna",
      name: "Special Mutton Kheema Curry",
      description: "Minced mutton slow cooked with green peas and fragrant Telangana spices.",
      price: 310,
      category: "Dinner",
      prepTimeMinutes: 40,
      dietaryType: "NON_VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_23",
      cookId: "cook_archana",
      name: "Foxtail Millet Upma & Coconut Chutney",
      description: "Diabetic-friendly foxtail millet upma cooked with vegetables and mild spices.",
      price: 110,
      category: "Breakfast",
      prepTimeMinutes: 20,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_24",
      cookId: "cook_archana",
      name: "Oats Rava Dosa with Peanut Chutney",
      description: "Instant crisp oats and semolina dosa spiced with cumin, green chilies, and ginger.",
      price: 95,
      category: "Breakfast",
      prepTimeMinutes: 20,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_25",
      cookId: "cook_radhika",
      name: "Nellore Fish Pulusu",
      description: "Freshwater fish steak simmered in tangy tamarind gravy with green chilies & raw mango.",
      price: 290,
      category: "Specials",
      prepTimeMinutes: 35,
      dietaryType: "NON_VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_26",
      cookId: "cook_radhika",
      name: "Royyala Iguru (Prawn Curry)",
      description: "Juicy prawns cooked in thick onion-tomato spicy semi-gravy.",
      price: 320,
      category: "Lunch",
      prepTimeMinutes: 35,
      dietaryType: "NON_VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_27",
      cookId: "cook_geetha",
      name: "Traditional Home-made Mysurpa",
      description: "Melt-in-mouth ghee Mysore Pak made using organic gram flour and pure desi ghee [250g].",
      price: 150,
      category: "Desserts",
      prepTimeMinutes: 10,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_28",
      cookId: "cook_geetha",
      name: "Fresh Gulab Jamun [4 pcs]",
      description: "Soft khoya jamuns soaked in cardamom flavored sugar syrup.",
      price: 80,
      category: "Desserts",
      prepTimeMinutes: 10,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1599785209707-a456fc1337cc?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "itm_29",
      cookId: "cook_geetha",
      name: "Dry Fruit Sunnundalu [6 pcs]",
      description: "Nutritious roasted urad dal laddoos made with jaggery, almonds, and desi ghee.",
      price: 180,
      category: "Desserts",
      prepTimeMinutes: 10,
      dietaryType: "VEG",
      availableToday: true,
      paused: false,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80"
    }
  ],
  orders: [
    {
      id: "ord_1001",
      orderNumber: "HCF-1001",
      customerId: "usr_customer_demo",
      cookId: "cook_priya",
      cookName: "Priya's Home Kitchen",
      items: [
        { menuItemId: "itm_1", name: "Andhra Special Meal Thali", price: 140, quantity: 2, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80" },
        { menuItemId: "itm_2", name: "Gongura Mutton Curry", price: 280, quantity: 1, image: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=500&q=80" }
      ],
      subtotal: 560,
      deliveryFee: 35,
      tax: 28,
      total: 623,
      deliveryAddress: {
        addressLine: "Flat 402, Cyber Towers View, Hitec City",
        city: "Hyderabad",
        pincode: "500081"
      },
      deliveryOption: "Standard Delivery",
      paymentMethod: "MOCK_PAYMENT",
      paymentStatus: "PAID",
      status: "PREPARING", // PLACED -> ACCEPTED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED
      prepTimeMinutes: 25,
      etaMinutes: 20,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "ord_1002",
      orderNumber: "HCF-1002",
      customerId: "usr_customer_demo",
      cookId: "cook_sunitha",
      cookName: "Amma's Kitchen",
      items: [
        { menuItemId: "itm_9", name: "Hyderabadi Chicken Dum Biryani", price: 220, quantity: 2, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80" }
      ],
      subtotal: 440,
      deliveryFee: 40,
      tax: 22,
      total: 502,
      deliveryAddress: {
        addressLine: "Flat 402, Cyber Towers View, Hitec City",
        city: "Hyderabad",
        pincode: "500081"
      },
      deliveryOption: "Standard Delivery",
      paymentMethod: "MOCK_PAYMENT",
      paymentStatus: "PAID",
      status: "DELIVERED",
      prepTimeMinutes: 35,
      etaMinutes: 0,
      createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 80 * 60 * 1000).toISOString()
    }
  ],
  reviews: [
    {
      id: "rev_1",
      orderId: "ord_1002",
      customerId: "usr_customer_demo",
      customerName: "Rahul Sharma",
      cookId: "cook_priya",
      rating: 5,
      comment: "Truly home cooked! The Gongura Mutton had that exact grandma kitchen flavor, spicy and tangy. Loved it!",
      dishRating: "Gongura Mutton Curry (5/5)",
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: "rev_2",
      orderId: "ord_1002",
      customerId: "usr_customer_demo",
      customerName: "Siddharth V.",
      cookId: "cook_sunitha",
      rating: 5,
      comment: "Best home biryani in Kondapur! Freshly cooked basmati with tender meat. Arrived piping hot.",
      dishRating: "Chicken Dum Biryani (5/5)",
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
    }
  ],
  favorites: [
    {
      id: "fav_1",
      customerId: "usr_customer_demo",
      cookId: "cook_priya",
      createdAt: new Date().toISOString()
    },
    {
      id: "fav_2",
      customerId: "usr_customer_demo",
      cookId: "cook_sunitha",
      createdAt: new Date().toISOString()
    }
  ],
  addresses: [
    {
      id: "addr_1",
      customerId: "usr_customer_demo",
      label: "Home",
      addressLine: "Flat 402, Cyber Towers View, Hitec City",
      city: "Hyderabad",
      pincode: "500081",
      lat: 17.4435,
      lng: 78.3772,
      isDefault: true
    },
    {
      id: "addr_2",
      customerId: "usr_customer_demo",
      label: "Office",
      addressLine: "Building 12B, Mindspace IT Park, Madhapur",
      city: "Hyderabad",
      pincode: "500081",
      lat: 17.4483,
      lng: 78.3915,
      isDefault: false
    }
  ],
  subscriptions: [
    {
      id: "sub_1",
      customerId: "usr_customer_demo",
      cookId: "cook_priya",
      kitchenName: "Priya's Home Kitchen",
      planType: "WEEKLY", // DAILY / WEEKLY / MONTHLY
      dishName: "Andhra Special Meal Thali",
      status: "ACTIVE", // ACTIVE / PAUSED / CANCELLED
      daysOfWeek: ["MON", "TUE", "WED", "THU", "FRI"],
      mealsLeft: 18,
      pricePerMeal: 130,
      nextDeliveryDate: "Tomorrow, 1:15 PM"
    }
  ],
  customRequests: [
    {
      id: "req_1",
      customerId: "usr_customer_demo",
      customerName: "Rahul Sharma",
      dishName: "Andhra-style Gongura Mutton for 20 people",
      servings: 20,
      preferredDate: "2026-10-12",
      preferredTime: "07:00 PM",
      budgetMax: 5500,
      location: "Madhapur, Hyderabad",
      details: "Need authentic home cooked spicy Gongura Mutton with Ragi Mudde and Rice for a family function.",
      status: "QUOTED", // OPEN / QUOTED / ACCEPTED / COMPLETED
      quotes: [
        {
          id: "q_1",
          cookId: "cook_priya",
          cookName: "Priya's Home Kitchen",
          price: 4800,
          deliveryTime: "6:30 PM",
          message: "I can prepare authentic fresh Gongura Mutton & Ragi Mudde in brass utensils. Free delivery included!"
        }
      ],
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString()
    }
  ],
  messages: [
    {
      id: "msg_1",
      orderId: "ord_1001",
      senderId: "usr_customer_demo",
      receiverId: "usr_cook_priya",
      senderName: "Rahul Sharma",
      text: "Hi Priya! Could you please make the Pappu a little extra spicy today?",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      isRead: true
    },
    {
      id: "msg_2",
      orderId: "ord_1001",
      senderId: "usr_cook_priya",
      receiverId: "usr_customer_demo",
      senderName: "Priya Reddy",
      text: "Sure Rahul! Preparing with fresh green chilies and homemade ghee now. Will dispatch in 15 mins!",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false
    }
  ],
  verificationApplications: [
    {
      id: "app_201",
      cookId: "cook_new_app",
      applicantName: "Sunil Varma",
      phone: "+91 91234 56789",
      email: "sunil.kitchen@gmail.com",
      kitchenName: "Sunil's Homemade Biryani & Grills",
      address: "Plot 45, Near Image Hospital, Madhapur, Hyderabad",
      experienceYears: 6,
      cuisines: ["Hyderabadi", "Biryani", "Grills"],
      kitchenPhoto: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
      aadhaarNumber: "XXXX-XXXX-8821",
      fssaiNumber: "23621004991201",
      status: "PENDING", // PENDING / APPROVED / REJECTED
      submittedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      notes: "Aadhaar KYC verified. Pending video call inspection on kitchen hygiene."
    }
  ],
  notifications: [
    {
      id: "notif_1",
      userId: "usr_customer_demo",
      title: "Order Preparing",
      message: "Priya's Home Kitchen has accepted order #HCF-1001 and started cooking fresh!",
      type: "ORDER",
      isRead: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    {
      id: "notif_2",
      userId: "usr_cook_priya",
      title: "New Order Received!",
      message: "Rahul Sharma placed order #HCF-1001 worth ₹623.",
      type: "ORDER",
      isRead: true,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    }
  ]
};

// Database persistence engine
class DatabaseEngine {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.data = initialData;
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error("Error reading database file, initializing fallback data:", err);
        this.data = initialData;
        this.save();
      }
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error("Error writing database file:", err);
    }
  }

  // Get collection
  get(collectionName) {
    const items = this.data[collectionName] || [];
    if (collectionName === 'cookProfiles') {
      return items.map(c => ({
        acceptedPaymentMethods: ["PHONEPE_UPI", "RAZORPAY_GATEWAY", "CARD", "NETBANKING", "COD"],
        ...c
      }));
    }
    return items;
  }

  // Find by ID
  findById(collectionName, id) {
    const list = this.get(collectionName);
    return list.find(item => item.id === id);
  }

  // Filter
  filter(collectionName, predicate) {
    const list = this.get(collectionName);
    return list.filter(predicate);
  }

  // Insert
  insert(collectionName, item) {
    if (!this.data[collectionName]) {
      this.data[collectionName] = [];
    }
    this.data[collectionName].unshift(item);
    this.save();
    return item;
  }

  // Update by ID
  update(collectionName, id, updates) {
    const list = this.get(collectionName);
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
      this.save();
      return list[index];
    }
    return null;
  }

  // Delete by ID
  delete(collectionName, id) {
    const list = this.get(collectionName);
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      const removed = list.splice(index, 1);
      this.save();
      return removed[0];
    }
    return null;
  }
}

export const db = new DatabaseEngine();

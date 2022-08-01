export interface ITeam {
  number: number;
  players: string[];
  disabled?: boolean;
}

export const EMPTY_TEAM = {
  number: 0,
  players: [],
};

export const TEAM_COLORS = ["#ff000055", "#00ff0055", "#0044ff55", "#eedd0077"];

export interface ITransaction {
  direction: "pay" | "receive";
  amount: number;
  entity: string;
}

export const LOCKS = [
  "purple",
  "light_blue",
  "light_green",
  "pink",
  "orange",
  "light_purple",
  "red",
  "yellow",
  "green",
  "gray",
  "dark_blue",
  "light_pink",
] as const;

export const LOCK_COLORS: { [lock: string]: string } = {
  purple: "#8000de",
  light_blue: "#92e7ff",
  light_green: "#92ffbf",
  pink: "#ff12a8",
  orange: "#ff9017",
  light_purple: "#ccb3ff",
  red: "#db0015",
  yellow: "#ffff24",
  green: "#00930c",
  gray: "#bfbfbf",
  dark_blue: "#000bdb",
  light_pink: "#fac8e7",
};

export function getLockPrettyName(lock: Lock): string {
  return lock
    .split("_")
    .map(
      (word) =>
        word.substring(0, 1).toUpperCase() + word.substring(1, word.length)
    )
    .join(" ");
}

export type Lock = typeof LOCKS[number];

export interface IProperty {
  name?: string;
  lock: Lock;
  price: number;
  rent: number;
  cottageRents: number[];
}

export const PROPERTIES: { [name: string]: IProperty } = {
  // purple lock
  "Nym's Hut": {
    lock: "purple",
    price: 60,
    rent: 2,
    cottageRents: [10, 30, 90, 160, 250],
  },
  "Jynx's Room": {
    lock: "purple",
    price: 60,
    rent: 4,
    cottageRents: [20, 60, 180, 320, 450],
  },
  // light blue lock
  Waterfall: {
    lock: "light_blue",
    price: 100,
    rent: 6,
    cottageRents: [100, 200, 300, 400, 550],
  },
  "Underground Hold": {
    lock: "light_blue",
    price: 100,
    rent: 6,
    cottageRents: [100, 200, 300, 400, 550],
  },
  "Incantus Outpost": {
    lock: "light_blue",
    price: 120,
    rent: 8,
    cottageRents: [100, 200, 300, 400, 600],
  },
  // inner loop: light green lock
  Helotown: {
    // prophecy sword
    lock: "light_green",
    price: 130,
    rent: 7,
    cottageRents: [45, 125, 375, 555, 675],
  },
  Southell: {
    // diamond
    lock: "light_green",
    price: 130,
    rent: 7,
    cottageRents: [45, 125, 375, 555, 675],
  },
  Northell: {
    // elixir
    lock: "light_green",
    price: 150,
    rent: 11,
    cottageRents: [55, 165, 475, 675, 825],
  },
  // pink lock
  "Abandoned Hall": {
    lock: "pink",
    price: 140,
    rent: 10,
    cottageRents: [50, 150, 450, 625, 750],
  },
  Library: {
    lock: "pink",
    price: 140,
    rent: 10,
    cottageRents: [50, 150, 450, 625, 750],
  },
  "Wrelic's Room": {
    lock: "pink",
    price: 160,
    rent: 12,
    cottageRents: [60, 180, 500, 700, 900],
  },
  // orange lock
  "Castle Gates": {
    lock: "orange",
    price: 180,
    rent: 14,
    cottageRents: [100, 200, 300, 400, 950],
  },
  "Royal Stables": {
    lock: "orange",
    price: 180,
    rent: 14,
    cottageRents: [100, 200, 300, 400, 950],
  },
  "Pine Forest": {
    lock: "orange",
    price: 200,
    rent: 16,
    cottageRents: [100, 200, 300, 400, 1000],
  },
  // inner loop: light purple lock
  Eastell: {
    // dragon brand
    lock: "light_purple",
    price: 210,
    rent: 19,
    cottageRents: [85, 235, 650, 810, 1025],
  },
  Westell: {
    // medallion
    lock: "light_purple",
    price: 210,
    rent: 19,
    cottageRents: [85, 235, 650, 810, 1025],
  },
  Aldentown: {
    // sorcerer necklace
    lock: "light_purple",
    price: 250,
    rent: 21,
    cottageRents: [105, 315, 775, 950, 1075],
  },
  // red lock
  "Training Site": {
    lock: "red",
    price: 220,
    rent: 18,
    cottageRents: [100, 200, 300, 400, 1050],
  },
  Silverfell: {
    lock: "red",
    price: 220,
    rent: 18,
    cottageRents: [100, 200, 300, 400, 1050],
  },
  "Initiation Tower": {
    lock: "red",
    price: 240,
    rent: 20,
    cottageRents: [100, 300, 750, 925, 1100],
  },
  // yellow lock
  Novelis: {
    lock: "yellow",
    price: 260,
    rent: 22,
    cottageRents: [110, 330, 800, 975, 1150],
  },
  Campfire: {
    lock: "yellow",
    price: 260,
    rent: 22,
    cottageRents: [110, 330, 800, 975, 1150],
  },
  "Morrow's Territory": {
    lock: "yellow",
    price: 280,
    rent: 24,
    cottageRents: [120, 360, 850, 1025, 1200],
  },
  // green lock
  "Key's Tree": {
    lock: "green",
    price: 300,
    rent: 26,
    cottageRents: [130, 390, 900, 1100, 1275],
  },
  "Shadolan Tree": {
    lock: "green",
    price: 300,
    rent: 26,
    cottageRents: [130, 390, 900, 1100, 1275],
  },
  "Graysen's House": {
    lock: "green",
    price: 320,
    rent: 28,
    cottageRents: [150, 450, 1000, 1200, 1400],
  },
  // inner loop: gray lock
  Wildlands: {
    // magnolia poison
    lock: "gray",
    price: 330,
    rent: 33,
    cottageRents: [165, 475, 1050, 1250, 1450],
  },
  Pellinglow: {
    // lionfish quill
    lock: "gray",
    price: 330,
    rent: 33,
    cottageRents: [165, 475, 1050, 1250, 1450],
  },
  Loredom: {
    // gem
    lock: "gray",
    price: 380,
    rent: 43,
    cottageRents: [190, 550, 1250, 1500, 1750],
  },
  // dark blue lock
  "Frostbitten Mountains": {
    lock: "dark_blue",
    price: 450,
    rent: 45,
    cottageRents: [175, 500, 1100, 1300, 1500],
  },
  "The Crypt": {
    lock: "dark_blue",
    price: 500,
    rent: 50,
    cottageRents: [200, 600, 1400, 1700, 2000],
  },
  // inner loop: light pink lock
  Ironisle: {
    // mirror shard
    lock: "light_pink",
    price: 430,
    rent: 65,
    cottageRents: [225, 700, 1700, 2100, 2500],
  },
  Citadal: {
    // tiger's eye
    lock: "light_pink",
    price: 430,
    rent: 65,
    cottageRents: [225, 700, 1700, 2100, 2500],
  },
  Rowandom: {
    // dragonfly wings
    lock: "light_pink",
    price: 500,
    rent: 80,
    cottageRents: [250, 800, 2000, 2500, 3000],
  },
};

export function getPropertiesByLock(properties: string[]) {
  const result: { [lock: string]: IProperty[] } = {};

  for (let i = 0; i < LOCKS.length; ++i) {
    const propsWithLock = properties.filter(
      (p) => PROPERTIES[p].lock === LOCKS[i]
    );
    if (propsWithLock.length < 1) {
      continue;
    }
    result[LOCKS[i]] = propsWithLock
      .sort((p1: string, p2: string) => {
        const idx1 = Object.keys(PROPERTIES).indexOf(p1.toString());
        const idx2 = Object.keys(PROPERTIES).indexOf(p2.toString());
        return idx1 < idx2 ? 1 : -1;
      })
      .map((p) => ({
        ...PROPERTIES[p],
        name: p,
      }));
  }

  return result;
}

export const PROPS_BY_LOCK = getPropertiesByLock(Object.keys(PROPERTIES));

export const PASSWORD = "jynx";

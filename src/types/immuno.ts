// https://github.com/MuteJester/GenAIRR/blob/master/src/GenAIRR/dataconfig/enums.py

export const ChainType = {
    BCR_HEAVY: "BCR_HEAVY",
    BCR_LIGHT_KAPPA: "BCR_LIGHT_KAPPA",
    BCR_LIGHT_LAMBDA: "BCR_LIGHT_LAMBDA",
    TCR_ALPHA: "TCR_ALPHA",
    TCR_BETA: "TCR_BETA",
    TCR_GAMMA: "TCR_GAMMA",
    TCR_DELTA: "TCR_DELTA",
  } as const;
  export type ChainType = typeof ChainType[keyof typeof ChainType];
  
  /** Chains that have a D segment. */
  const CHAINS_WITH_D: ReadonlySet<ChainType> = new Set<ChainType>([
    ChainType.BCR_HEAVY,
    ChainType.TCR_BETA,
    ChainType.TCR_DELTA,
  ]);
  
  /** Python-style property as a function. */
  export function hasD(chain: ChainType): boolean {
    return CHAINS_WITH_D.has(chain);
  }
  
  /** Convenience buckets. */
  export const BCR_CHAINS: ChainType[] = [
    ChainType.BCR_HEAVY,
    ChainType.BCR_LIGHT_KAPPA,
    ChainType.BCR_LIGHT_LAMBDA,
  ];
  export const TCR_CHAINS: ChainType[] = [
    ChainType.TCR_ALPHA,
    ChainType.TCR_BETA,
    ChainType.TCR_GAMMA,
    ChainType.TCR_DELTA,
  ];
  
  /** Species. Mirrors the Python Enum values. */
  export const Species = {
    // Common Mammalian Models
    HUMAN: "Human",
    MOUSE: "Mouse",
    RAT: "Rat",
    RABBIT: "Rabbit",
    GUINEA_PIG: "Guinea Pig",
  
    // Primates
    RHESUS_MACAQUE: "Rhesus Macaque",
    CYNOMOLGUS_MACAQUE: "Cynomolgus Macaque",
    MARMOSET: "Marmoset",
  
    // Agricultural and Domestic Animals
    PIG: "Pig",
    COW: "Cow",
    SHEEP: "Sheep",
    GOAT: "Goat",
    HORSE: "Horse",
    DOG: "Dog",
    CAT: "Cat",
  
    // Camelids
    LLAMA: "Llama",
    ALPACA: "Alpaca",
    DROMEDARY_CAMEL: "Dromedary Camel",
  
    // Birds
    CHICKEN: "Chicken",
    DUCK: "Duck",
    TURKEY: "Turkey",
  
    // Fish and Aquatic Vertebrates
    ZEBRAFISH: "Zebrafish",
    TROUT: "Trout",
    SALMON: "Salmon",
    CATFISH: "Catfish",
    SHARK: "Shark",
  
    // Other
    FERRET: "Ferret",
    BAT: "Bat",
  } as const;
  export type Species = typeof Species[keyof typeof Species];
  
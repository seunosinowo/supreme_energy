export type Product = {
  id: string;
  shortName: string;
  name: string;
  price: number;
  unit: "litre" | "kg";
  density: string;
  flashPoint: string;
  note: string;
};

// Edit only this file when prices change, then update PRICE_LAST_UPDATED.
export const PRICE_LAST_UPDATED = "15 September 2026, 6:00 PM WAT";
export const DELIVERY_ALLOWANCE = 0;

export const products: Product[] = [
  { id: "pms", shortName: "PMS", name: "Premium Motor Spirit", price: 650, unit: "litre", density: "0.720–0.775 kg/L", flashPoint: "Below −40°C", note: "Clean-burning petrol supplied to applicable quality specifications." },
  { id: "ago", shortName: "AGO", name: "Automotive Gas Oil", price: 920, unit: "litre", density: "0.820–0.880 kg/L", flashPoint: "≥ 55°C", note: "Dependable diesel for fleets, plants, generators and industrial operations." },
  { id: "lpg", shortName: "LPG", name: "Liquefied Petroleum Gas", price: 670, unit: "kg", density: "0.500–0.580 kg/L", flashPoint: "Approx. −104°C", note: "Efficient gas supply for domestic, commercial and industrial use." },
  { id: "lpfo", shortName: "LPFO / LPO", name: "Low Pour Fuel Oil", price: 780, unit: "litre", density: "0.880–0.960 kg/L", flashPoint: "≥ 66°C", note: "Industrial fuel selected for controlled handling and consistent performance." },
  { id: "naphtha", shortName: "Naphtha", name: "Petroleum Naphtha", price: 735, unit: "litre", density: "0.650–0.750 kg/L", flashPoint: "Below 0°C", note: "Versatile light petroleum feedstock supplied with careful quality control." },
];

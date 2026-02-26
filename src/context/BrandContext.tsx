import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Brand, initialBrands, Stage, mockERPData } from "@/data/mockData";
import { recalcBrand } from "@/utils/statusUtils";

interface BrandState {
  brands: Brand[];
  addBrand: (brand: Brand) => void;
  updateBrand: (id: string, updater: (b: Brand) => Brand) => void;
  updateStage: (brandId: string, stageName: string, patch: Partial<Stage>) => void;
  syncERP: (brandId: string) => void;
}

const BrandContext = createContext<BrandState>({
  brands: [],
  addBrand: () => {},
  updateBrand: () => {},
  updateStage: () => {},
  syncERP: () => {},
});

export const useBrands = () => useContext(BrandContext);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>(() => {
    const stored = localStorage.getItem("brands");
    if (stored) {
      try { return JSON.parse(stored); } catch { /* fall through */ }
    }
    return initialBrands;
  });

  useEffect(() => {
    localStorage.setItem("brands", JSON.stringify(brands));
  }, [brands]);

  const addBrand = (brand: Brand) => {
    console.log("[Audit] Brand added:", brand.name);
    setBrands(prev => [...prev, recalcBrand(brand)]);
  };

  const updateBrand = (id: string, updater: (b: Brand) => Brand) => {
    setBrands(prev => prev.map(b => b.id === id ? recalcBrand(updater(b)) : b));
  };

  const updateStage = (brandId: string, stageName: string, patch: Partial<Stage>) => {
    console.log("[Audit] Stage updated:", brandId, stageName, patch);
    setBrands(prev =>
      prev.map(b => {
        if (b.id !== brandId) return b;
        const stages = b.stages.map(s => s.name === stageName ? { ...s, ...patch } : s);
        return recalcBrand({ ...b, stages });
      })
    );
  };

  const syncERP = (brandId: string) => {
    console.log("[Audit] ERP Sync triggered for brand:", brandId);
    const erpData = mockERPData.Manufacturing;
    updateStage(brandId, "Manufacturing", {
      actualStart: erpData.actualStart,
      actualEnd: erpData.actualEnd,
      owner: erpData.owner,
      notes: erpData.notes,
      status: "Completed",
    });
  };

  return (
    <BrandContext.Provider value={{ brands, addBrand, updateBrand, updateStage, syncERP }}>
      {children}
    </BrandContext.Provider>
  );
}

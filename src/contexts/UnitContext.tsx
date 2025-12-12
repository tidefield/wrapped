import React, { createContext, useContext, useState, ReactNode } from "react";

export type Unit = "km" | "mile";

interface UnitContextType {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  convertDistance: (distanceInKm: number) => number;
  getDistanceLabel: () => string;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [unit, setUnitState] = useState<Unit>("km");

  const setUnit = (newUnit: Unit) => {
    setUnitState(newUnit);
  };

  const convertDistance = (distanceInKm: number): number => {
    if (unit === "mile") {
      return distanceInKm * 0.621371;
    }
    return distanceInKm;
  };

  const getDistanceLabel = (): string => {
    return unit === "km" ? "kilometers" : "miles";
  };

  return (
    <UnitContext.Provider
      value={{ unit, setUnit, convertDistance, getDistanceLabel }}
    >
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = (): UnitContextType => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error("useUnit must be used within a UnitProvider");
  }
  return context;
};

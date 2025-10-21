import BottleCreate from "@/components/BottleCreate";
import HorseCreate from "@/components/HorseCreate";
import { useLocalSearchParams } from "expo-router";

type CreateVariant = "horse" | "bottle";

function resolveVariant(value: string | string[] | undefined): CreateVariant {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized === "bottle" ? "bottle" : "horse";
}

export default function CreateScreen() {
  const { variant: variantParam } = useLocalSearchParams<{
    variant?: string | string[];
  }>();
  const variant = resolveVariant(variantParam);

  return (
    <>
      {variant === "horse" && <HorseCreate />}
      {variant === "bottle" && <BottleCreate />}
    </>
  );
}

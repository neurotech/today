export type Advice = {
  id: number;
  advice: string;
};

type AdviceSlipResponse = {
  slip: { id: number; advice: string };
};

/**
 * Deliberately uncached: the point is a different slip each time. Consumed by
 * the Living Worlds iframe via /api/advice.
 */
export const getAdvice = async (): Promise<Advice> => {
  const response = await fetch("https://api.adviceslip.com/advice", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Advice Slip returned ${response.status}`);
  }

  const { slip } = (await response.json()) as AdviceSlipResponse;

  return { id: slip.id, advice: slip.advice };
};

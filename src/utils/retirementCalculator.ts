
export interface RetirementInput {
  desiredCorpus: number;
  expectedCAGR: number;
  yearsToWork: number;
  monthlyExpenses: number;
  inflationRate: number;
}

export interface RetirementResult {
  requiredMonthlyInvestment: number;
  totalAmountNeeded: number;
  corpusAtRetirement: number;
  monthlyInvestmentWithInflation: number[];
}

export const calculateRequiredInvestment = ({
  desiredCorpus,
  expectedCAGR,
  yearsToWork,
  monthlyExpenses,
  inflationRate
}: RetirementInput): RetirementResult => {
  const monthlyRate = expectedCAGR / (12 * 100);
  const months = yearsToWork * 12;
  
  // Calculate required monthly investment using PMT formula
  const requiredMonthlyInvestment = (desiredCorpus * monthlyRate) / 
    (Math.pow(1 + monthlyRate, months) - 1);

  // Calculate yearly investment considering inflation
  const monthlyInvestmentWithInflation = Array.from({ length: yearsToWork }, (_, year) => {
    return requiredMonthlyInvestment * Math.pow(1 + inflationRate / 100, year);
  });

  const corpusAtRetirement = requiredMonthlyInvestment * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
    (1 + monthlyRate);

  return {
    requiredMonthlyInvestment,
    totalAmountNeeded: desiredCorpus,
    corpusAtRetirement,
    monthlyInvestmentWithInflation,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};


export interface DebtInput {
  loanAmount: number;
  interestRate: number;
  loanTenure: number;
  expectedReturn: number;
  assetDepreciation: number;
}

export interface DebtResult {
  totalInterest: number;
  monthlyEMI: number;
  totalAmount: number;
  assetValueAfterTenure: number;
  netWealthImpact: number;
  isGoodDebt: boolean;
}

export const calculateDebtImpact = ({
  loanAmount,
  interestRate,
  loanTenure,
  expectedReturn,
  assetDepreciation
}: DebtInput): DebtResult => {
  const monthlyRate = interestRate / (12 * 100);
  const months = loanTenure * 12;
  
  // Calculate EMI
  const monthlyEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  
  const totalAmount = monthlyEMI * months;
  const totalInterest = totalAmount - loanAmount;
  
  // Calculate asset value after tenure
  const assetValueAfterTenure = loanAmount * Math.pow(1 + (expectedReturn - assetDepreciation) / 100, loanTenure);
  
  // Calculate net wealth impact
  const netWealthImpact = assetValueAfterTenure - totalAmount;
  
  return {
    totalInterest,
    monthlyEMI,
    totalAmount,
    assetValueAfterTenure,
    netWealthImpact,
    isGoodDebt: netWealthImpact > 0
  };
};

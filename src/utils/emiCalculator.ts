
export const calculateEMI = (principal: number, rate: number, tenure: number): number => {
  const monthlyRate = rate / (12 * 100);
  const totalMonths = tenure * 12;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
};

export const calculatePropertyAppreciation = (
  initialPrice: number,
  appreciationRate: number,
  years: number
): number => {
  return initialPrice * Math.pow(1 + appreciationRate / 100, years);
};

export const calculateFees = (propertyValue: number) => {
  return {
    gst: propertyValue * 0.05,
    registration: propertyValue * 0.05,
    stampDuty: propertyValue * 0.01,
    loanProcessing: propertyValue * 0.005,
  };
};

export const calculateLoanDetails = (
  principal: number,
  rate: number,
  tenure: number,
  currentYear: number
) => {
  const monthlyEMI = calculateEMI(principal, rate, tenure);
  const monthsPassed = currentYear * 12;
  const totalPaid = monthlyEMI * monthsPassed;
  
  // Calculate remaining loan balance
  const monthlyRate = rate / (12 * 100);
  let remainingBalance = principal;
  
  for (let i = 0; i < monthsPassed; i++) {
    const interestPortion = remainingBalance * monthlyRate;
    const principalPortion = monthlyEMI - interestPortion;
    remainingBalance -= principalPortion;
  }

  return {
    emiPaid: totalPaid,
    loanBalance: Math.max(0, remainingBalance),
  };
};

export const calculateSIPReturns = (
  monthlyInvestment: number,
  rateOfReturn: number,
  years: number
): number => {
  const monthlyRate = rateOfReturn / (12 * 100);
  const months = years * 12;
  const amount = monthlyInvestment * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
    (1 + monthlyRate);
  return amount;
};

export const formatCurrency = (amount: number): string => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PiggyBank, Home, Percent, DollarSign, Clock } from "lucide-react";
import {
  calculateEMI,
  calculatePropertyAppreciation,
  calculateFees,
  calculateLoanDetails,
  formatCurrency,
  calculateSIPReturns
} from "@/utils/emiCalculator";

interface Fees {
  gst: number;
  registration: number;
  stampDuty: number;
  loanProcessing: number;
}

interface Result {
  year: number;
  futurePrice: number;
  totalSpent: number;
  sipReturns: number;
  emiPaid: number;
  loanBalance: number;
  monthlyInvestment: number;
}

const EMICalculator = () => {
  const [propertyPrice, setPropertyPrice] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [appreciationRate, setAppreciationRate] = useState("");
  const [years, setYears] = useState("");
  const [cagr, setCagr] = useState("15");
  const [results, setResults] = useState<Result[]>([]);
  const [fees, setFees] = useState<Fees | null>(null);

  const calculateResults = () => {
    const price = Number(propertyPrice);
    const loan = Number(loanAmount);
    const interest = Number(interestRate);
    const appreciation = Number(appreciationRate);
    const numYears = Number(years);
    const cagrRate = Number(cagr);
    
    if (numYears <= 0) return;

    const calculatedFees = calculateFees(price);
    const totalFees = Object.values(calculatedFees).reduce((a, b) => a + b, 0);
    const downPayment = price - loan;
    
    setFees(calculatedFees);
    const loanDetails = calculateLoanDetails(loan, interest, 20, numYears);
    const totalSpent = loanDetails.emiPaid + totalFees + downPayment;
    
    // Monthly SIP amount calculation
    const monthlyInvestment = totalSpent / (numYears * 12);
    
    const newResults = [{
      year: numYears,
      futurePrice: calculatePropertyAppreciation(price, appreciation, numYears),
      totalSpent,
      sipReturns: calculateSIPReturns(monthlyInvestment, cagrRate, numYears),
      monthlyInvestment,
      ...loanDetails,
    }];

    setResults(newResults);
  };

  return (
    <div className="min-h-screen bg-sage-light p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-sage-dark">Property Investment Calculator</h1>
          <p className="text-sage/80">Calculate your potential property investment returns</p>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-white/90 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium">Property Price</Label>
              <div className="relative">
                <Home className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Enter property price"
                  className="pl-10"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Loan Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Enter loan amount"
                  className="pl-10"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Interest Rate (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Enter interest rate"
                  className="pl-10"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Property Appreciation Rate (%)</Label>
              <div className="relative">
                <PiggyBank className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Enter appreciation rate"
                  className="pl-10"
                  value={appreciationRate}
                  onChange={(e) => setAppreciationRate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Number of Years</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Enter number of years"
                  className="pl-10"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Expected SIP CAGR (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Enter expected CAGR"
                  className="pl-10"
                  value={cagr}
                  onChange={(e) => setCagr(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-sage hover:bg-sage-dark transition-colors"
            onClick={calculateResults}
          >
            Calculate Returns
          </Button>
        </Card>

        {fees && (
          <Card className="p-6 backdrop-blur-sm bg-white/90 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-sage-dark">Fees Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-sage/80">GST (5%)</p>
                <p className="text-xl font-semibold">{formatCurrency(fees.gst)}</p>
              </div>
              <div>
                <p className="text-sm text-sage/80">Registration (5%)</p>
                <p className="text-xl font-semibold">{formatCurrency(fees.registration)}</p>
              </div>
              <div>
                <p className="text-sm text-sage/80">Stamp Duty (1%)</p>
                <p className="text-xl font-semibold">{formatCurrency(fees.stampDuty)}</p>
              </div>
              <div>
                <p className="text-sm text-sage/80">Loan Processing (0.5%)</p>
                <p className="text-xl font-semibold">{formatCurrency(fees.loanProcessing)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-sage/80">Total Fees</p>
                <p className="text-xl font-semibold text-sage">
                  {formatCurrency(Object.values(fees).reduce((a, b) => a + b, 0))}
                </p>
              </div>
            </div>
          </Card>
        )}

        {results.length > 0 && (
          <div className="space-y-6 animate-fadeIn">
            {results.map((result, index) => (
              <Card
                key={index}
                className="p-6 backdrop-blur-sm bg-white/90 shadow-lg transition-all hover:shadow-xl"
              >
                <h3 className="text-lg font-semibold mb-4 text-sage-dark">
                  After {result.year} {result.year === 1 ? 'Year' : 'Years'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-sage/80">Future Property Value</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.futurePrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage/80">EMI Paid</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.emiPaid)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage/80">Loan Balance</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.loanBalance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage/80">Total Money Spent</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.totalSpent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage/80">Property Investment Profit</p>
                    <p className="text-xl font-semibold text-sage">
                      {formatCurrency(result.futurePrice - result.totalSpent)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-sage/10">
                  <h4 className="text-lg font-semibold mb-4 text-sage-dark">Compare with SIP</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-sage/80">Required Monthly SIP</p>
                      <p className="text-xl font-semibold">{formatCurrency(result.monthlyInvestment)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-sage/80">SIP Returns ({cagr}% CAGR)</p>
                      <p className="text-xl font-semibold">{formatCurrency(result.sipReturns)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-sage/80">SIP vs Property Difference</p>
                      <p className="text-xl font-semibold text-sage">
                        {formatCurrency(result.sipReturns - (result.futurePrice - result.totalSpent))}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EMICalculator;

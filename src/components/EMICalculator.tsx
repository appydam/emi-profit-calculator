import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PiggyBank, Home, Percent, DollarSign, Clock, IndianRupee, ArrowLeft, Github, Linkedin } from "lucide-react";
import {
  calculateEMI,
  calculatePropertyAppreciation,
  calculateFees,
  calculateLoanDetails,
  formatCurrency,
  calculateSIPReturns
} from "@/utils/emiCalculator";
import { useNavigate } from "react-router-dom";

interface StateFees {
  state: string;
  stampDuty: number;
  registration: number;
}

const stateFeesList: StateFees[] = [
  { state: "Andhra Pradesh", stampDuty: 5, registration: 0.5 },
  { state: "Arunachal Pradesh", stampDuty: 6, registration: 1 },
  { state: "Assam", stampDuty: 8.25, registration: 0 },
  { state: "Bihar", stampDuty: 6, registration: 2 },
  { state: "Chhattisgarh", stampDuty: 5, registration: 4 },
  { state: "Goa", stampDuty: 5, registration: 3 },
  { state: "Gujarat", stampDuty: 4.90, registration: 1 },
  { state: "Haryana", stampDuty: 7, registration: 0 },
  { state: "Himachal Pradesh", stampDuty: 5, registration: 6 },
  { state: "Jammu and Kashmir", stampDuty: 5, registration: 0 },
  { state: "Jharkhand", stampDuty: 4, registration: 3 },
  { state: "Karnataka", stampDuty: 5, registration: 1 },
  { state: "Kerala", stampDuty: 8, registration: 2 },
  { state: "Madhya Pradesh", stampDuty: 7.50, registration: 3 },
  { state: "Maharashtra", stampDuty: 6, registration: 1 },
  { state: "Manipur", stampDuty: 7, registration: 3 },
  { state: "Meghalaya", stampDuty: 9.90, registration: 0 },
  { state: "Mizoram", stampDuty: 9, registration: 0 },
  { state: "Nagaland", stampDuty: 8.25, registration: 0 },
  { state: "Odisha", stampDuty: 5, registration: 2 },
  { state: "Punjab", stampDuty: 7, registration: 1 },
  { state: "Rajasthan", stampDuty: 5, registration: 1 },
  { state: "Sikkim", stampDuty: 5, registration: 0 },
  { state: "Tamil Nadu", stampDuty: 7, registration: 4 },
  { state: "Telangana", stampDuty: 5, registration: 0.5 },
  { state: "Tripura", stampDuty: 5, registration: 0 },
  { state: "Uttar Pradesh", stampDuty: 7, registration: 1 },
  { state: "Uttarakhand", stampDuty: 5, registration: 2 },
  { state: "West Bengal", stampDuty: 7, registration: 1 }
];

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
  const navigate = useNavigate();
  const [propertyPrice, setPropertyPrice] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [appreciationRate, setAppreciationRate] = useState("");
  const [years, setYears] = useState("");
  const [loanTenure, setLoanTenure] = useState("20");
  const [cagr, setCagr] = useState("15");
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [results, setResults] = useState<Result[]>([]);
  const [fees, setFees] = useState<Fees | null>(null);

  const calculateResults = () => {
    const price = Number(propertyPrice);
    const loan = Number(loanAmount);
    const interest = Number(interestRate);
    const appreciation = Number(appreciationRate);
    const numYears = Number(years);
    const tenure = Number(loanTenure);
    const cagrRate = Number(cagr);
    
    if (numYears <= 0) return;

    const selectedStateFees = stateFeesList.find(s => s.state === selectedState) || stateFeesList[0];
    const calculatedFees = {
      gst: price * 0.05,
      registration: price * (selectedStateFees.registration / 100),
      stampDuty: price * (selectedStateFees.stampDuty / 100),
      loanProcessing: price * 0.005
    };

    const totalFees = Object.values(calculatedFees).reduce((a, b) => a + b, 0);
    const downPayment = price - loan;
    
    setFees(calculatedFees);
    const loanDetails = calculateLoanDetails(loan, interest, tenure, numYears);
    const totalSpent = loanDetails.emiPaid + totalFees + downPayment;
    
    const monthlyInvestment = totalSpent / (numYears * 12);
    const futurePropertyValue = calculatePropertyAppreciation(price, appreciation, numYears);
    const sipReturns = calculateSIPReturns(monthlyInvestment, cagrRate, numYears);

    // Calculate taxes
    const propertyTaxAmount = (futurePropertyValue - price) * 0.125; // 12.5% LTCG
    const sipTaxAmount = (sipReturns - totalSpent) * 0.125; // 12.5% LTCG

    const newResults = [{
      year: numYears,
      futurePrice: futurePropertyValue,
      totalSpent,
      sipReturns,
      monthlyInvestment,
      propertyTaxAmount,
      propertyProfitAfterTax: futurePropertyValue - price - propertyTaxAmount,
      sipTaxAmount,
      sipProfitAfterTax: sipReturns - totalSpent - sipTaxAmount,
      ...loanDetails,
    }];

    setResults(newResults);
  };

  return (
    <div className="min-h-screen bg-sage-light p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button 
          variant="ghost" 
          className="mb-4 text-sage hover:text-sage-dark"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calculators
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-sage-dark">How much profit you can make with short-term Real Estate Investment</h1>
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
                  placeholder="Enter property price (eg: 10000000)"
                  className="pl-10"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Loan Amount</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Enter loan amount (eg: 8000000)"
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
                  placeholder="Enter interest rate (eg: 9.1)"
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
                  placeholder="Enter appreciation rate (eg: 15)"
                  className="pl-10"
                  value={appreciationRate}
                  onChange={(e) => setAppreciationRate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Loan Tenure (Years)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Enter loan tenure in years (eg: 20)"
                  className="pl-10"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Investment Period (Years)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Enter investment period in years (eg: 5)"
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
                  placeholder="Enter expected CAGR (eg: 15)"
                  className="pl-10"
                  value={cagr}
                  onChange={(e) => setCagr(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">State</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {stateFeesList.map((state) => (
                    <SelectItem key={state.state} value={state.state}>
                      {state.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <p className="text-base font-semibold">{formatCurrency(fees.gst)}</p>
              </div>
              <div>
                <p className="text-sm text-sage/80">
                  Registration ({stateFeesList.find(s => s.state === selectedState)?.registration}%)
                </p>
                <p className="text-base font-semibold">{formatCurrency(fees.registration)}</p>
              </div>
              <div>
                <p className="text-sm text-sage/80">
                  Stamp Duty ({stateFeesList.find(s => s.state === selectedState)?.stampDuty}%)
                </p>
                <p className="text-base font-semibold">{formatCurrency(fees.stampDuty)}</p>
              </div>
              <div>
                <p className="text-sm text-sage/80">Loan Processing (0.5%)</p>
                <p className="text-base font-semibold">{formatCurrency(fees.loanProcessing)}</p>
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
                  Selling property after {result.year} {result.year === 1 ? 'Year' : 'Years'}
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
                    <p className="text-sm text-sage/80">Per Month EMI</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.emiPaid / (result.year * 12))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage/80">Loan Balance</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.loanBalance)}</p>
                    <p className="text-xs text-sage/60">Remaining Loan to be Paid to bank</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage/80">Total Money Spent</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.totalSpent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage/80">Property Investment Profit</p>
                    <p className="text-xl font-semibold text-sage text-lime-600">
                      {formatCurrency(result.futurePrice - result.totalSpent - result.loanBalance)}
                    </p>
                    <p className="text-xs text-sage/60">futurePrice - (totalSpent + loanBalance)</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-sage/10">
                  <h4 className="text-lg font-semibold mb-4 text-sage-dark">Total Spent Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <p className="text-sm text-sage/80">Down Payment</p>
                      <p className="text-base font-semibold">{formatCurrency(Number(propertyPrice) - Number(loanAmount))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-sage/80">Total Fees</p>
                      <p className="text-base font-semibold">{formatCurrency(Object.values(fees).reduce((a, b) => a + b, 0))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-sage/80">EMI Paid</p>
                      <p className="text-base font-semibold">{formatCurrency(result.emiPaid)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-sage/10">
                  <h4 className="text-lg font-semibold mb-4 text-sage-dark">Compare with SIP</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-sage/80">Required Monthly SIP</p>
                      <p className="text-xl font-semibold">{formatCurrency(result.monthlyInvestment)}</p>
                      <p className="text-xs text-sage/60">Avg monthly spend on SIP where total spend over this period in SIP is equal to total spend on real estate investment</p>
                    </div>
                    <div>
                      <p className="text-sm text-sage/80">SIP Returns ({cagr}% CAGR)</p>
                      <p className="text-xl font-semibold text-green-600">{formatCurrency(result.sipReturns)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-sage/80">SIP vs Property Difference</p>
                      <p
                        className={`text-xl font-semibold ${
                          result.sipReturns - (result.futurePrice - result.totalSpent - result.loanBalance) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(result.sipReturns - (result.futurePrice - result.totalSpent - result.loanBalance))}
                      </p>
                      <p className="text-sm font-medium">
                        {result.sipReturns - (result.futurePrice - result.totalSpent - result.loanBalance) > 0
                          ? "SIP would be a better investment than Real Estate"
                          : "Real Estate would be a better investment than SIP"}
                      </p>
                    </div>

                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <footer className="py-6 border-t border-sage/10">
          <div className="flex justify-center space-x-4">
            <a 
              href="https://github.com/appydam" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sage hover:text-sage-dark transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="https://www.linkedin.com/in/arpitdhamija/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sage hover:text-sage-dark transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EMICalculator;

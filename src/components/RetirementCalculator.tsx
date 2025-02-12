import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, PiggyBank, Percent, IndianRupee } from "lucide-react";
import { calculateRequiredInvestment, formatCurrency, type RetirementResult } from "@/utils/retirementCalculator";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RetirementCalculator = () => {
  const navigate = useNavigate();
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [yearsToWork, setYearsToWork] = useState("");
  const [expectedCAGR, setExpectedCAGR] = useState("12");
  const [inflationRate, setInflationRate] = useState("6");
  const [result, setResult] = useState<RetirementResult | null>(null);

  const calculateRetirement = () => {
    const expenses = Number(monthlyExpenses);
    const years = Number(yearsToWork);
    const cagr = Number(expectedCAGR);
    const inflation = Number(inflationRate);
    
    if (!expenses || !years) return;
    
    const desiredCorpus = expenses * 12 * 25; // 25 years of expenses as retirement corpus
    
    const result = calculateRequiredInvestment({
      desiredCorpus,
      expectedCAGR: cagr,
      yearsToWork: years,
      monthlyExpenses: expenses,
      inflationRate: inflation
    });
    
    setResult(result);
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
        
        <Card className="p-6 backdrop-blur-sm bg-white/90 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Reverse Retirement Calculator</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium">Monthly Expenses</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Enter monthly expenses"
                  className="pl-10"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Years to Work</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Enter years you want to work"
                  className="pl-10"
                  value={yearsToWork}
                  onChange={(e) => setYearsToWork(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Expected CAGR (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Expected return rate"
                  className="pl-10"
                  value={expectedCAGR}
                  onChange={(e) => setExpectedCAGR(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Inflation Rate (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
                <Input
                  type="number"
                  placeholder="Expected inflation rate"
                  className="pl-10"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-sage hover:bg-sage-dark transition-colors"
            onClick={calculateRetirement}
          >
            Calculate Required Investment
          </Button>

          {result && (
            <div className="mt-6 space-y-6">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-sage/80">Required Monthly Investment</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.requiredMonthlyInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage/80">Total Corpus Needed</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.totalAmountNeeded)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage/80">Expected Corpus at Retirement</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.corpusAtRetirement)}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Year-wise Investment (Adjusted for Inflation)</h3>
                <div className="space-y-2">
                  {result.monthlyInvestmentWithInflation.map((amount, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>Year {index + 1}</span>
                      <span className="font-semibold">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RetirementCalculator;

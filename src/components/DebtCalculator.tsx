import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IndianRupee, Percent, Clock } from "lucide-react";
import { calculateDebtImpact, type DebtResult } from "@/utils/debtCalculator";
import { formatCurrency } from "@/utils/retirementCalculator";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DebtCalculator = () => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [assetDepreciation, setAssetDepreciation] = useState("0");
  const [result, setResult] = useState<DebtResult | null>(null);

  const calculateDebt = () => {
    const amount = Number(loanAmount);
    const rate = Number(interestRate);
    const tenure = Number(loanTenure);
    const returns = Number(expectedReturn);
    const depreciation = Number(assetDepreciation);
    
    if (!amount || !rate || !tenure || !returns) return;
    
    const result = calculateDebtImpact({
      loanAmount: amount,
      interestRate: rate,
      loanTenure: tenure,
      expectedReturn: returns,
      assetDepreciation: depreciation
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
        
        <h2 className="text-2xl font-semibold mb-6">Smart vs Dumb Debt Calculator</h2>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-sm font-medium">Loan Amount</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
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
            <Label className="text-sm font-medium">Loan Tenure (Years)</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
              <Input
                type="number"
                placeholder="Enter loan tenure"
                className="pl-10"
                value={loanTenure}
                onChange={(e) => setLoanTenure(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Expected Return Rate (%)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
              <Input
                type="number"
                placeholder="Enter expected return rate"
                className="pl-10"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Asset Depreciation Rate (%)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-2.5 h-5 w-5 text-sage/50" />
              <Input
                type="number"
                placeholder="Enter depreciation rate"
                className="pl-10"
                value={assetDepreciation}
                onChange={(e) => setAssetDepreciation(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full mt-6 bg-sage hover:bg-sage-dark transition-colors"
          onClick={calculateDebt}
        >
          Calculate Debt Impact
        </Button>

        {result && (
          <div className="mt-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Debt Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-sage/80">Monthly EMI</p>
                  <p className="text-xl font-semibold">{formatCurrency(result.monthlyEMI)}</p>
                </div>
                <div>
                  <p className="text-sm text-sage/80">Total Interest Paid</p>
                  <p className="text-xl font-semibold">{formatCurrency(result.totalInterest)}</p>
                </div>
                <div>
                  <p className="text-sm text-sage/80">Total Amount to be Paid</p>
                  <p className="text-xl font-semibold">{formatCurrency(result.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-sage/80">Asset Value After Tenure</p>
                  <p className="text-xl font-semibold">{formatCurrency(result.assetValueAfterTenure)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-sage/80">Net Wealth Impact</p>
                  <p className={`text-xl font-semibold ${result.isGoodDebt ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(result.netWealthImpact)}
                  </p>
                  <p className="text-sm mt-1">
                    This is {result.isGoodDebt ? 'Smart Debt 👍' : 'Dumb Debt 👎'} - 
                    {result.isGoodDebt 
                      ? ' The investment return is higher than the cost of debt'
                      : ' The cost of debt exceeds the investment return'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtCalculator;

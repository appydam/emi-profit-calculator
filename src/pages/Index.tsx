
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calculator, PiggyBank, IndianRupee } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const calculators = [
    {
      title: "Property Investment Calculator",
      description: "Calculate returns on property investment and compare with other investment options",
      icon: Home,
      route: "/emi-calculator"
    },
    {
      title: "Reverse Retirement Calculator",
      description: "Plan your early retirement by calculating required monthly investments",
      icon: PiggyBank,
      route: "/retirement-calculator"
    },
    {
      title: "Smart vs Dumb Debt Calculator",
      description: "Analyze if your debt is helping or hurting your wealth creation",
      icon: Calculator,
      route: "/debt-calculator"
    }
  ];

  return (
    <div className="min-h-screen bg-sage-light p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-sage-dark">Financial Calculators</h1>
          <p className="text-sage text-lg">Make smarter financial decisions with our suite of calculators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc) => (
            <Card
              key={calc.route}
              className="p-6 hover:shadow-lg transition-all cursor-pointer backdrop-blur-sm bg-white/90"
              onClick={() => navigate(calc.route)}
            >
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-full bg-sage/10 flex items-center justify-center">
                  <calc.icon className="h-6 w-6 text-sage" />
                </div>
                <h2 className="text-xl font-semibold text-sage-dark">{calc.title}</h2>
                <p className="text-sage/80 text-sm">{calc.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;

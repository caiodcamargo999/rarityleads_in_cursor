import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Building } from "lucide-react";

interface DefineTargetProps {
  data: {
    industry: string;
    subSegment: string;
    location: string;
    companySize: string;
    budget: number;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const industries = [
  { value: "dental", label: "Dental Clinics", subSegments: ["Orthodontics", "Implantology", "Pediatric Dentistry", "General"] },
  { value: "real-estate", label: "Real Estate", subSegments: ["Sales", "Rental", "Property Management", "Construction"] },
  { value: "solar", label: "Solar Energy", subSegments: ["Residential", "Commercial", "Industrial", "Rural"] },
  { value: "fitness", label: "Fitness Centers", subSegments: ["Weight Training", "Functional", "Crossfit", "Pilates"] },
  { value: "beauty", label: "Beauty & Aesthetics", subSegments: ["Aesthetic Clinic", "Beauty Salon", "Barbershop", "Spa"] }
];

const companySizes = [
  { value: "micro", label: "Micro (1-9 employees)", icon: "🏠" },
  { value: "small", label: "Small (10-49 employees)", icon: "🏢" },
  { value: "medium", label: "Medium (50-249 employees)", icon: "🏬" },
  { value: "large", label: "Large (250+ employees)", icon: "🏭" }
];

const DefineTarget = ({ data, onUpdate, onNext }: DefineTargetProps) => {
  const { t } = useTranslation();
  const [estimatedCompanies, setEstimatedCompanies] = useState(1250);

  const selectedIndustry = industries.find(ind => ind.value === data.industry);

  const handleIndustryChange = (value: string) => {
    onUpdate({ industry: value, subSegment: "" });
    // Simulate real-time company count update
    // Removed all setTimeout demo code for estimated companies
  };

  const handleSubSegmentChange = (value: string) => {
    onUpdate({ subSegment: value });
    // Removed all setTimeout demo code for estimated companies
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ location: e.target.value });
    // Removed all setTimeout demo code for estimated companies
  };

  const handleCompanySizeChange = (value: string) => {
    onUpdate({ companySize: value });
    // Removed all setTimeout demo code for estimated companies
  };

  const handleBudgetChange = (value: number[]) => {
    onUpdate({ budget: value[0] });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-medium text-white mb-2">
          {t('prospecting.defineTarget.title')}
        </h3>
        <p className="text-gray-300">
          {t('prospecting.defineTarget.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Filters */}
        <div className="space-y-6">
          {/* Industry Selection */}
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-base font-medium text-white">{t('prospecting.defineTarget.industry')}</Label>
            <Select value={data.industry} onValueChange={handleIndustryChange}>
              <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <SelectValue placeholder={t('prospecting.defineTarget.industry')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/20 text-white">
                {industries.map((industry) => (
                  <SelectItem key={industry.value} value={industry.value} className="hover:bg-white/10 focus:bg-white/10">
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub-segment Selection */}
          {selectedIndustry && (
            <div className="space-y-2">
              <Label htmlFor="subSegment" className="text-base font-medium text-white">{t('prospecting.defineTarget.subSegment')}</Label>
              <Select value={data.subSegment} onValueChange={handleSubSegmentChange}>
                <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <SelectValue placeholder={t('prospecting.defineTarget.subSegment')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/20 text-white">
                  {selectedIndustry.subSegments.map((segment) => (
                    <SelectItem key={segment} value={segment} className="hover:bg-white/10 focus:bg-white/10">
                      {segment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-base font-medium text-white">{t('prospecting.defineTarget.location')}</Label>
            <Input
              id="location"
              placeholder="Ex: New York, NY - 50km radius"
              value={data.location}
              onChange={handleLocationChange}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>

          {/* Company Size */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-white">{t('prospecting.defineTarget.companySize')}</Label>
            <div className="grid grid-cols-2 gap-3">
              {companySizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleCompanySizeChange(size.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    data.companySize === size.value
                      ? "border-purple-400 bg-purple-400/20"
                      : "border-white/20 hover:border-white/40 bg-white/5"
                  }`}
                >
                  <div className="text-2xl mb-1">{size.icon}</div>
                  <div className="text-sm font-medium text-white">{size.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-white">
              {t('prospecting.defineTarget.budget')}: ${data.budget.toLocaleString()}
            </Label>
            <Slider
              value={[data.budget]}
              onValueChange={handleBudgetChange}
              max={10000}
              min={500}
              step={250}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>$500</span>
              <span>$10,000+</span>
            </div>
          </div>
        </div>

        {/* Right Column - Results Preview */}
        <div className="space-y-6">
          {/* Real-time Results */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Building className="h-5 w-5 text-purple-400" />
                <span>Matching Companies</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {estimatedCompanies.toLocaleString()}
                </div>
                <p className="text-gray-300 mb-4">
                  companies found with your criteria
                </p>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                  <p className="text-sm text-gray-200">
                    💡 <strong>Tip:</strong> Between 500-2000 companies is the ideal size for an efficient campaign
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saved Personas */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Saved Buyer Personas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
                  🦷 Dental Clinics - Downtown
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
                  🏠 Real Estate - Suburbs
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
                  ☀️ Solar Residential - Rural
                </Button>
              </div>
              <Button variant="ghost" className="w-full mt-3 text-purple-400 hover:text-purple-300">
                + Save current configuration
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h4 className="font-medium text-yellow-300 mb-2">Segmentation Tips</h4>
              <ul className="text-sm text-yellow-100 space-y-1">
                <li>• Be specific in sub-segment for greater relevance</li>
                <li>• Consider seasonality of your service</li>
                <li>• Medium companies have faster decision processes</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <Button onClick={onNext} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
          {t('common.next')}
        </Button>
      </div>
    </div>
  );
};

export default DefineTarget;

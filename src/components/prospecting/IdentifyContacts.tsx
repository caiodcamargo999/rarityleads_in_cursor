import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Building, User, CheckCircle, AlertCircle, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IdentifyContactsProps {
  data: {
    targetCompany: string;
    selectedDecisionMakers: any[];
    industry: string;
    subSegment: string;
    location: string;
    companySize: string;
    budget: number;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const mockDecisionMakers = [
  {
    id: 1,
    name: "Dr. Carlos Silva",
    role: "Diretor Clínico",
    company: "Clínica Odonto Excellence",
    decisionLevel: "Final",
    confidence: 92,
    sources: ["LinkedIn", "Website", "Eventos Públicos"],
    phone: "+55 11 99999-9999",
    email: "carlos.silva@example.com",
    linkedin: "linkedin.com/in/carlossilva",
    jobChallenges: [
      "Aumentar número de pacientes",
      "Melhorar eficiência operacional",
      "Competir com clínicas maiores"
    ],
    interests: [
      "Tecnologia odontológica",
      "Gestão clínica",
      "Marketing médico"
    ]
  },
  {
    id: 2,
    name: "Ana Fernandes",
    role: "Gerente Administrativo",
    company: "Clínica Odonto Excellence",
    decisionLevel: "Influenciador",
    confidence: 85,
    sources: ["LinkedIn", "Website"],
    phone: "+55 11 88888-8888",
    email: "ana.fernandes@example.com",
    linkedin: "linkedin.com/in/anafernandes",
    jobChallenges: [
      "Controlar custos operacionais",
      "Melhorar agendamento",
      "Capacitar equipe"
    ],
    interests: [
      "Automação de processos",
      "Gestão financeira",
      "Treinamento de equipe"
    ]
  },
  {
    id: 3,
    name: "Roberto Santos",
    role: "Sócio Proprietário",
    company: "Clínica Odonto Excellence",
    decisionLevel: "Final",
    confidence: 88,
    sources: ["LinkedIn", "Registro CRO"],
    phone: "+55 11 77777-7777",
    email: "roberto.santos@example.com",
    linkedin: "linkedin.com/in/robertosantos",
    jobChallenges: [
      "Expandir negócio",
      "Aumentar lucratividade",
      "Modernizar clínica"
    ],
    interests: [
      "Investimentos em saúde",
      "Expansão de negócios",
      "Novas tecnologias"
    ]
  }
];

const IdentifyContacts = ({ data, onUpdate, onNext, onPrev }: IdentifyContactsProps) => {
  const { toast } = useToast();
  const [searching, setSearching] = useState(false);
  const [foundDecisionMakers, setFoundDecisionMakers] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>(
    data.selectedDecisionMakers.map(dm => dm.id) || []
  );

  const handleCompanySearch = () => {
    if (!data.targetCompany.trim()) {
      toast({
        title: "Nome da empresa necessário",
        description: "Por favor, digite o nome de uma empresa para buscar decisores.",
        variant: "destructive"
      });
      return;
    }

    setSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setFoundDecisionMakers(mockDecisionMakers);
      setSearching(false);
      toast({
        title: "Busca concluída!",
        description: `Encontramos ${mockDecisionMakers.length} potenciais decisores usando apenas dados públicos.`
      });
    }, 2000);
  };

  const handleContactSelect = (contactId: number, checked: boolean) => {
    let newSelected;
    if (checked) {
      newSelected = [...selectedContacts, contactId];
    } else {
      newSelected = selectedContacts.filter(id => id !== contactId);
    }
    
    setSelectedContacts(newSelected);
    
    const selectedDecisionMakers = foundDecisionMakers.filter(dm => 
      newSelected.includes(dm.id)
    );
    
    onUpdate({ selectedDecisionMakers });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 bg-green-100";
    if (confidence >= 80) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getDecisionLevelColor = (level: string) => {
    if (level === "Final") return "bg-rarity-pink text-white";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-medium text-gray-700 mb-2 font-benton">
          Vamos encontrar os decisores para sua abordagem
        </h3>
        <p className="text-gray-500 font-benton">
          Sistema de descoberta compliance-first usando apenas dados públicos e autorizados
        </p>
      </div>

      {/* Company Search */}
      <Card className="bg-gradient-to-r from-rarity-blue/5 to-rarity-purple/5 border-rarity-blue/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-benton">
            <Building className="h-5 w-5 text-rarity-blue" />
            <span>Busca por Empresa</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            <Input
              placeholder="Digite o nome da empresa target"
              value={data.targetCompany}
              onChange={(e) => onUpdate({ targetCompany: e.target.value })}
              className="flex-1 font-benton"
            />
            <Button 
              onClick={handleCompanySearch}
              disabled={searching || !data.targetCompany.trim()}
              className="bg-gradient-to-r from-rarity-pink to-rarity-purple text-white font-benton"
            >
              {searching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Descobrir Decisores
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* LGPD Compliance Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-2 font-benton">
                🔒 Conformidade com LGPD
              </h4>
              <ul className="text-sm text-blue-700 space-y-1 font-benton">
                <li>• Utilizamos apenas dados públicos e fontes autorizadas</li>
                <li>• Respeitamos opt-out e políticas de privacidade</li>
                <li>• Logs completos para auditoria e transparência</li>
                <li>• Mecanismos de exclusão disponíveis a qualquer momento</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {foundDecisionMakers.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium text-gray-800 font-benton">
              Encontramos {foundDecisionMakers.length} potenciais decisores para {data.targetCompany}
            </h3>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              {selectedContacts.length} selecionados
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {foundDecisionMakers.map((decisionMaker) => (
              <Card 
                key={decisionMaker.id}
                className={`transition-all ${
                  selectedContacts.includes(decisionMaker.id)
                    ? "ring-2 ring-rarity-pink border-rarity-pink"
                    : "hover:border-gray-300"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={`contact-${decisionMaker.id}`}
                        checked={selectedContacts.includes(decisionMaker.id)}
                        onCheckedChange={(checked) => 
                          handleContactSelect(decisionMaker.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg font-benton">
                          {decisionMaker.name}
                        </CardTitle>
                        <p className="text-gray-600 font-benton">{decisionMaker.role}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={`text-xs ${getConfidenceColor(decisionMaker.confidence)}`}>
                        {decisionMaker.confidence}% confiança
                      </Badge>
                      <Badge 
                        className={`text-xs ml-1 ${getDecisionLevelColor(decisionMaker.decisionLevel)}`}
                      >
                        {decisionMaker.decisionLevel}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 font-benton">
                      📊 Dados disponíveis:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {decisionMaker.sources.map((source, index) => (
                        <Badge key={index} variant="outline" className="text-xs font-benton">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm font-benton">
                        🎯 Desafios do cargo:
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {decisionMaker.jobChallenges.slice(0, 2).map((challenge, index) => (
                          <li key={index} className="font-benton">• {challenge}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm font-benton">
                        💡 Interesses:
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {decisionMaker.interests.slice(0, 2).map((interest, index) => (
                          <li key={index} className="font-benton">• {interest}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs font-benton"
                      onClick={() => {
                        toast({
                          title: "Detalhes do perfil",
                          description: "Funcionalidade em desenvolvimento"
                        });
                      }}
                    >
                      <User className="h-3 w-3 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs font-benton"
                      onClick={() => {
                        toast({
                          title: "LinkedIn aberto",
                          description: "Perfil do LinkedIn seria aberto em nova aba"
                        });
                      }}
                    >
                      <Linkedin className="h-3 w-3 mr-1" />
                      LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedContacts.length > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-800 font-benton">
                    {selectedContacts.length} decisores selecionados
                  </h4>
                </div>
                <p className="text-sm text-green-700 mb-4 font-benton">
                  Você está pronto para prosseguir para a próxima etapa de personalização de abordagem.
                </p>
                <div className="flex flex-wrap gap-2">
                  {foundDecisionMakers
                    .filter(dm => selectedContacts.includes(dm.id))
                    .map(dm => (
                      <Badge key={dm.id} className="bg-green-100 text-green-800 font-benton">
                        {dm.name} - {dm.role}
                      </Badge>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="font-benton">
          Voltar
        </Button>
        <Button 
          onClick={onNext} 
          disabled={data.selectedDecisionMakers.length === 0}
          className="bg-rarity-pink hover:bg-rarity-pink/90 font-benton"
        >
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};

export default IdentifyContacts;

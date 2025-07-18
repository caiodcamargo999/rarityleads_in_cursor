import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowUp, CheckCircle } from "lucide-react";

interface ExploreMarketProps {
  data: {
    industry: string;
    subSegment: string;
    location: string;
    companySize: string;
    budget: number;
    selectedOffer: any;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const offerTemplates = {
  dental: [
    {
      id: "dental-premium",
      name: "OFERTA PREMIUM",
      conversionRate: 36,
      estimatedReturn: 4500,
      description: "Leads totalmente qualificados + CRM personalizado",
      idealFor: "Clínicas com 3+ profissionais e alto valor por paciente",
      features: [
        "Landing page otimizada para conversão",
        "Campanha Meta Ads e Google Ads",
        "CRM com automação de follow-up",
        "Qualificação de leads via chatbot IA",
        "Relatórios semanais detalhados"
      ],
      psychologicalTriggers: [
        "Autoridade médica",
        "Resultados comprovados",
        "Exclusividade no tratamento"
      ],
      commonObjections: [
        "\"Preço muito alto\"",
        "\"Preciso pensar\"",
        "\"Vou consultar meu sócio\""
      ]
    },
    {
      id: "dental-standard",
      name: "OFERTA PADRÃO",
      conversionRate: 28,
      estimatedReturn: 2800,
      description: "Geração de leads + automação de nutrição",
      idealFor: "Clínicas estabelecidas buscando escalar",
      features: [
        "Funil de captura no Instagram e Facebook",
        "Sequência de e-mails educativos",
        "WhatsApp automático para agendamento",
        "Dashboard de acompanhamento",
        "Suporte via chat"
      ],
      psychologicalTriggers: [
        "Conveniência no agendamento",
        "Confiança na expertise",
        "Urgência nos tratamentos"
      ],
      commonObjections: [
        "\"Não tenho tempo agora\"",
        "\"Meu plano não cobre\"",
        "\"Vou pesquisar outros preços\""
      ]
    },
    {
      id: "dental-entry",
      name: "OFERTA ENTRADA",
      conversionRate: 22,
      estimatedReturn: 1200,
      description: "Presença digital + captação inicial",
      idealFor: "Clínicas novas ou com orçamento limitado",
      features: [
        "Perfil otimizado no Google Meu Negócio",
        "Campanha básica no Facebook",
        "Formulário de contato no site",
        "WhatsApp Business configurado",
        "3 posts semanais nas redes"
      ],
      psychologicalTriggers: [
        "Proximidade geográfica",
        "Primeiro atendimento gratuito",
        "Facilidade de pagamento"
      ],
      commonObjections: [
        "\"Será que é confiável?\"",
        "\"Fica muito longe\"",
        "\"Prefiro indicação de amigos\""
      ]
    }
  ],
  "real-estate": [
    {
      id: "realestate-premium",
      name: "OFERTA PREMIUM",
      conversionRate: 32,
      estimatedReturn: 5200,
      description: "Captação qualificada + CRM imobiliário",
      idealFor: "Imobiliárias com carteira diversificada",
      features: [
        "Portal imobiliário integrado",
        "Campanhas segmentadas por perfil de cliente",
        "CRM com pipeline de vendas/locação",
        "Tour virtual dos imóveis",
        "Relatórios de mercado semanais"
      ],
      psychologicalTriggers: [
        "Oportunidade única",
        "Valorização do imóvel",
        "Segurança no investimento"
      ],
      commonObjections: [
        "\"Preço acima do mercado\"",
        "\"Localização não ideal\"",
        "\"Preciso ver outros imóveis\""
      ]
    }
  ]
};

const ExploreMarket = ({ data, onUpdate, onNext, onPrev }: ExploreMarketProps) => {
  const [selectedOfferId, setSelectedOfferId] = useState(data.selectedOffer?.id || "");
  
  const industryOffers = offerTemplates[data.industry as keyof typeof offerTemplates] || [];

  const handleOfferSelect = (offer: any) => {
    setSelectedOfferId(offer.id);
    onUpdate({ selectedOffer: offer });
  };

  const handleCustomizeOffer = (offer: any) => {
    console.log("Customizing offer:", offer);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-medium text-gray-700 mb-2 font-benton">
          Ofertas recomendadas para seu target
        </h3>
        <p className="text-gray-500 font-benton">
          Com base no perfil selecionado, aqui estão as ofertas com maior taxa de conversão
        </p>
      </div>

      {industryOffers.length === 0 ? (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6 text-center">
            <Sparkles className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-yellow-800 mb-2 font-benton">
              Ofertas em desenvolvimento
            </h3>
            <p className="text-yellow-700 font-benton">
              Estamos preparando ofertas personalizadas para {data.industry}. 
              Em breve teremos templates otimizados para sua indústria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {industryOffers.map((offer) => (
            <Card 
              key={offer.id}
              className={`relative transition-all cursor-pointer hover:shadow-lg ${
                selectedOfferId === offer.id
                  ? "ring-2 ring-rarity-pink border-rarity-pink"
                  : "hover:border-gray-300"
              }`}
              onClick={() => handleOfferSelect(offer)}
            >
              {selectedOfferId === offer.id && (
                <div className="absolute -top-2 -right-2 bg-rarity-pink text-white rounded-full p-1">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-gradient-to-r from-rarity-pink to-rarity-purple text-white border-0">
                    {offer.name}
                  </Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-rarity-blue font-benton">
                      {offer.conversionRate}%
                    </div>
                    <div className="text-xs text-gray-500 font-benton">conversão</div>
                  </div>
                </div>
                
                <CardTitle className="text-lg font-benton">{offer.description}</CardTitle>
                
                <div className="flex items-center space-x-2 text-green-600">
                  <ArrowUp className="h-4 w-4" />
                  <span className="font-medium font-benton">
                    R$ {offer.estimatedReturn.toLocaleString('pt-BR')} retorno estimado
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 font-benton">
                    <strong>Ideal para:</strong> {offer.idealFor}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2 font-benton">Pontos fortes:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {offer.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 font-benton">
                        <span className="text-rarity-pink mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 font-benton"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle blueprint view
                    }}
                  >
                    Ver Blueprint
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 font-benton"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomizeOffer(offer);
                    }}
                  >
                    Personalizar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedOfferId && data.selectedOffer && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800 font-benton">
              <CheckCircle className="h-5 w-5" />
              <span>Blueprint Detalhado - {data.selectedOffer.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-3 font-benton">
                  🎯 Gatilhos Psicológicos
                </h4>
                <ul className="space-y-2">
                  {data.selectedOffer.psychologicalTriggers.map((trigger: string, index: number) => (
                    <li key={index} className="bg-white p-2 rounded text-sm font-benton">
                      {trigger}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3 font-benton">
                  ❌ Objeções Comuns
                </h4>
                <ul className="space-y-2">
                  {data.selectedOffer.commonObjections.map((objection: string, index: number) => (
                    <li key={index} className="bg-white p-2 rounded text-sm font-benton">
                      {objection}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-3 font-benton">
                📋 Estrutura Completa da Oferta
              </h4>
              <div className="bg-white p-4 rounded-lg">
                <ul className="space-y-2">
                  {data.selectedOffer.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2 font-benton">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-rarity-blue">
              <h4 className="font-medium text-rarity-blue mb-2 font-benton">
                💡 Insights do Setor
              </h4>
              <p className="text-sm text-gray-700 font-benton">
                Baseado em dados históricos, ofertas como esta têm{" "}
                <strong>{data.selectedOffer.conversionRate}% de taxa de conversão</strong> no setor de{" "}
                {data.industry}. O ROI médio é de{" "}
                <strong>R$ {data.selectedOffer.estimatedReturn.toLocaleString('pt-BR')}</strong> em 90 dias.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="font-benton">
          Voltar
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!data.selectedOffer}
          className="bg-rarity-pink hover:bg-rarity-pink/90 font-benton"
        >
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};

export default ExploreMarket;

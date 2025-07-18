import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Mail,
  Send,
  Linkedin,
  RefreshCw,
  Copy,
  Check,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomizeApproachProps {
  data: {
    template: string;
    channel: string;
    customMessage: string;
    selectedDecisionMakers: Array<any>;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const channels = [
  { id: "whatsapp", name: "WhatsApp", icon: <MessageSquare className="h-5 w-5" /> },
  { id: "email", name: "Email", icon: <Mail className="h-5 w-5" /> },
  { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
];

const templates = {
  whatsapp: [
    {
      id: "wapp-intro",
      name: "Introdução Direta",
      template: "Olá {{nome}}, aqui é [Seu Nome] da [Sua Empresa]. Notei que a {{empresa}} tem se destacado em {{área}}. Como outros {{cargo}} no setor de {{indústria}}, imagino que esteja buscando soluções para {{problema comum}}. Desenvolvemos uma abordagem específica que aumentou em 32% a {{métrica relevante}} para {{empresa similar}}. Poderia compartilhar como vocês estão lidando com {{desafio específico}} atualmente?"
    },
    {
      id: "wapp-value",
      name: "Proposta de Valor",
      template: "Olá {{nome}}, espero que esteja bem. Percebi que a {{empresa}} está investindo em {{área de interesse}}. Nossa solução especializada tem ajudado {{empresas similares}} a {{benefício principal}} e {{benefício secundário}}. Tenho alguns insights específicos para o setor de {{indústria}} que acredito serem relevantes para vocês. Teria interesse em uma breve conversa sobre como isso poderia beneficiar a {{empresa}}?"
    }
  ],
  email: [
    {
      id: "email-formal",
      name: "Apresentação Formal",
      template: "Prezado(a) {{nome}},\n\nEspero que esta mensagem o(a) encontre bem.\n\nMeu nome é [Seu Nome], da [Sua Empresa], especializada em soluções de {{área de especialidade}} para o setor de {{indústria}}.\n\nAnalisando o perfil da {{empresa}}, percebi que vocês têm feito um excelente trabalho em {{área de destaque}}. Parabéns pelo caso de {{caso de sucesso ou iniciativa recente}}.\n\nTemos trabalhado com empresas como {{empresa similar}} e {{outra empresa}}, ajudando-as a {{benefício principal}} com resultados significativos como {{resultado específico}}.\n\nGostaria de compartilhar alguns insights específicos que desenvolvemos para {{setor específico}} e que poderiam ser valiosos para a {{empresa}}.\n\nVocê teria disponibilidade para uma breve conversa de 15 minutos na próxima semana?\n\nAtenciosamente,\n[Seu Nome]\n[Seu Cargo]\n[Sua Empresa]\n[Seus Contatos]"
    },
    {
      id: "email-direct",
      name: "Direto ao Ponto",
      template: "Assunto: Aumento de {{métrica}} para {{empresa}}\n\n{{nome}},\n\nVi que a {{empresa}} está focando em {{objetivo estratégico}}.\n\nAjudamos {{empresa de referência}} a aumentar {{métrica}} em {{percentual}}% em {{período}} através de {{solução}}.\n\nPodemos fazer o mesmo pela {{empresa}}?\n\nQual seria o melhor horário para uma conversa rápida de 10 minutos?\n\nAtenciosamente,\n[Seu Nome]"
    }
  ],
  linkedin: [
    {
      id: "linkedin-connection",
      name: "Conexão Inicial",
      template: "Olá {{nome}}, notei seu papel como {{cargo}} na {{empresa}}. Trabalho com {{sua especialidade}} e tenho ajudado empresas do setor de {{indústria}} a {{benefício principal}}. Gostaria de conectar para compartilharmos insights sobre {{tema relevante}}."
    },
    {
      id: "linkedin-followup",
      name: "Follow-up pós-conexão",
      template: "Olá {{nome}}, obrigado por aceitar minha conexão! Como mencionei, tenho trabalhado com várias empresas de {{indústria}} ajudando-as a {{principal benefício}}. Recentemente, implementamos uma estratégia para {{empresa similar}} que resultou em {{resultado específico}}. Acredito que poderíamos alcançar resultados semelhantes para a {{empresa}}. Você teria interesse em uma breve conversa sobre isso?"
    }
  ]
};

const CustomizeApproach = ({ data, onUpdate, onNext, onPrev }: CustomizeApproachProps) => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatingMessage, setGeneratingMessage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedDecisionMaker, setSelectedDecisionMaker] = useState(
    data.selectedDecisionMakers.length > 0 ? data.selectedDecisionMakers[0] : null
  );
  
  // Set default channel if none selected
  useEffect(() => {
    if (!data.channel && channels.length > 0) {
      onUpdate({ channel: channels[0].id });
    }
  }, []);
  
  // Select a template when channel changes
  useEffect(() => {
    if (data.channel && templates[data.channel]?.length > 0) {
      setSelectedTemplate(templates[data.channel][0]);
    } else {
      setSelectedTemplate(null);
    }
  }, [data.channel]);
  
  // Generate personalized message when template or decision maker changes
  useEffect(() => {
    if (selectedTemplate && selectedDecisionMaker) {
      generateMessage();
    }
  }, [selectedTemplate, selectedDecisionMaker]);
  
  const handleChannelSelect = (channelId) => {
    onUpdate({ channel: channelId });
  };
  
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };
  
  const handleDecisionMakerSelect = (decisionMaker) => {
    setSelectedDecisionMaker(decisionMaker);
  };
  
  const generateMessage = () => {
    if (!selectedTemplate || !selectedDecisionMaker) return;
    
    setGeneratingMessage(true);
    
    // Simulate message generation with a timeout
    setTimeout(() => {
      let personalizedMessage = selectedTemplate.template;
      
      // Replace template variables with actual data
      personalizedMessage = personalizedMessage
        .replace(/{{nome}}/g, selectedDecisionMaker.name)
        .replace(/{{cargo}}/g, selectedDecisionMaker.role)
        .replace(/{{empresa}}/g, selectedDecisionMaker.company)
        .replace(/{{indústria}}/g, "odontologia")
        .replace(/{{área}}/g, "atendimento especializado")
        .replace(/{{problema comum}}/g, selectedDecisionMaker.jobChallenges[0])
        .replace(/{{métrica relevante}}/g, "taxa de conversão de leads")
        .replace(/{{empresa similar}}/g, "Clínica Sorrir Sempre")
        .replace(/{{desafio específico}}/g, selectedDecisionMaker.jobChallenges[1])
        .replace(/{{área de interesse}}/g, selectedDecisionMaker.interests[0])
        .replace(/{{benefício principal}}/g, "aumentar o número de novos pacientes")
        .replace(/{{benefício secundário}}/g, "melhorar a retenção")
        .replace(/{{empresas similares}}/g, "Odonto Excellence e Clínica Dental Plus")
        .replace(/{{área de especialidade}}/g, "marketing digital")
        .replace(/{{área de destaque}}/g, selectedDecisionMaker.interests[1])
        .replace(/{{caso de sucesso ou iniciativa recente}}/g, "expansão recente")
        .replace(/{{outra empresa}}/g, "Oral Clinic")
        .replace(/{{resultado específico}}/g, "aumento de 40% em consultas iniciais")
        .replace(/{{setor específico}}/g, "clínicas odontológicas")
        .replace(/{{objetivo estratégico}}/g, selectedDecisionMaker.interests[2])
        .replace(/{{empresa de referência}}/g, "Odonto Saúde")
        .replace(/{{percentual}}/g, "35")
        .replace(/{{período}}/g, "3 meses")
        .replace(/{{solução}}/g, "nossa estratégia de captação multicanal")
        .replace(/{{tema relevante}}/g, selectedDecisionMaker.interests[0])
        .replace(/{{sua especialidade}}/g, "marketing digital odontológico")
        .replace(/{{principal benefício}}/g, "aumentar captação de pacientes")
        .replace(/{{métrica}}/g, "número de novos pacientes");
      
      onUpdate({ customMessage: personalizedMessage });
      setGeneratingMessage(false);
    }, 1500);
  };
  
  const handleRefreshMessage = () => {
    generateMessage();
    toast({
      title: "Mensagem atualizada",
      description: "Uma nova versão da mensagem foi gerada."
    });
  };
  
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(data.customMessage);
    setCopied(true);
    toast({
      title: "Mensagem copiada!",
      description: "A mensagem foi copiada para a área de transferência."
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleMessageChange = (e) => {
    onUpdate({ customMessage: e.target.value });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-medium text-gray-700 mb-2 font-benton">
          Vamos criar uma abordagem personalizada
        </h3>
        <p className="text-gray-500 font-benton">
          Personalize sua mensagem com base no perfil do decisor para aumentar suas chances de resposta
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Decision makers */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 font-benton">Selecione o decisor</h3>
          
          {data.selectedDecisionMakers.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-700 text-sm font-benton">
                Nenhum decisor selecionado. Por favor, volte à etapa anterior e selecione pelo menos um decisor.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.selectedDecisionMakers.map((decisionMaker) => (
                <Card
                  key={decisionMaker.id}
                  className={`cursor-pointer transition-all ${
                    selectedDecisionMaker?.id === decisionMaker.id
                      ? "border-rarity-pink ring-1 ring-rarity-pink"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => handleDecisionMakerSelect(decisionMaker)}
                >
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base font-benton">{decisionMaker.name}</CardTitle>
                    <CardDescription className="text-xs font-benton">
                      {decisionMaker.role} • {decisionMaker.company}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Middle column - Channel & Templates */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 font-benton">Escolha o canal</h3>
          
          {/* Channel selection */}
          <div className="flex gap-2">
            {channels.map((channel) => (
              <Button
                key={channel.id}
                variant={data.channel === channel.id ? "default" : "outline"}
                className={`flex-1 ${data.channel === channel.id ? "" : ""} font-benton`}
                onClick={() => handleChannelSelect(channel.id)}
              >
                {channel.icon}
                <span className="ml-1.5">{channel.name}</span>
              </Button>
            ))}
          </div>
          
          {/* Template selection */}
          {data.channel && templates[data.channel] && (
            <>
              <h3 className="font-medium text-gray-800 mt-6 font-benton">Selecione um template</h3>
              <div className="space-y-3">
                {templates[data.channel].map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id
                        ? "border-rarity-pink ring-1 ring-rarity-pink"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-base font-benton">{template.name}</CardTitle>
                      <CardDescription className="text-xs line-clamp-2 font-benton">
                        {template.template.substring(0, 100)}...
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Right column - Generated Message */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800 font-benton">Mensagem personalizada</h3>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefreshMessage}
                disabled={!selectedTemplate || !selectedDecisionMaker || generatingMessage}
                className="font-benton"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${generatingMessage ? 'animate-spin' : ''}`} />
                Regenerar
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyMessage}
                disabled={!data.customMessage || generatingMessage}
                className="font-benton"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Card className="h-[calc(100%-40px)]">
            <CardContent className="p-0">
              {generatingMessage ? (
                <div className="flex flex-col items-center justify-center h-64 p-4">
                  <Sparkles className="h-8 w-8 text-rarity-pink mb-3 animate-pulse" />
                  <p className="text-gray-500 font-benton">Gerando mensagem personalizada...</p>
                </div>
              ) : !data.customMessage ? (
                <div className="flex flex-col items-center justify-center h-64 p-4">
                  <MessageSquare className="h-8 w-8 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-benton">
                    Selecione um canal, um template e um decisor para gerar sua mensagem
                  </p>
                </div>
              ) : (
                <Textarea
                  value={data.customMessage}
                  onChange={handleMessageChange}
                  className="w-full h-64 p-4 rounded-lg resize-none border-0 focus-visible:ring-0 font-benton"
                  placeholder="Mensagem personalizada aparecerá aqui..."
                />
              )}
            </CardContent>
            
            {data.customMessage && (
              <CardFooter className="p-3 border-t">
                <div className="text-xs text-gray-500 flex items-center gap-1 font-benton">
                  <Sparkles className="h-3 w-3 text-rarity-pink" />
                  <span>Personalizado com base no perfil do decisor</span>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="font-benton">
          Voltar
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!data.customMessage}
          className="bg-rarity-pink hover:bg-rarity-pink/90 font-benton"
        >
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};

export default CustomizeApproach;

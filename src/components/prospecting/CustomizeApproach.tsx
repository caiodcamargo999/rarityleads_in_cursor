"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Mail, Linkedin, Copy, RefreshCw, Check } from 'lucide-react';

interface DecisionMaker {
  id: string;
  name: string;
  role: string;
  company: string;
  jobChallenges: string[];
  interests: string[];
}

interface Template {
  id: string;
  name: string;
  template: string;
}

interface Channel {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface CustomizeApproachProps {
  data: {
    template: string;
    channel: string;
    customMessage: string;
    selectedDecisionMakers: DecisionMaker[];
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const channels: Channel[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: <MessageSquare className="h-4 w-4" />
  },
  {
    id: 'email',
    name: 'Email',
    icon: <Mail className="h-4 w-4" />
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin className="h-4 w-4" />
  }
];

const templates: Record<string, Template[]> = {
  whatsapp: [
    {
      id: 'whatsapp-1',
      name: 'Abordagem Direta',
      template: 'Olá {{nome}}, tudo bem? Vi que você é {{cargo}} na {{empresa}} e pensei que poderia ser interessante conversarmos sobre como outras clínicas odontológicas estão aumentando sua captação de pacientes. Tem 2 minutos para uma conversa rápida?'
    },
    {
      id: 'whatsapp-2',
      name: 'Problema Específico',
      template: 'Oi {{nome}}! Como {{cargo}} da {{empresa}}, você deve enfrentar o desafio de {{problema comum}}. Gostaria de compartilhar como outras clínicas resolveram isso e aumentaram sua {{métrica relevante}} em {{percentual}}%. Interessante?'
    }
  ],
  email: [
    {
      id: 'email-1',
      name: 'Email Profissional',
      template: 'Assunto: Como {{empresa similar}} aumentou {{métrica}} em {{percentual}}\n\nPrezado {{nome}},\n\nComo {{cargo}} da {{empresa}}, você deve conhecer os desafios de {{desafio específico}}.\n\nGostaria de compartilhar como outras clínicas odontológicas estão resolvendo isso.\n\nAguardo seu retorno.\n\nAtenciosamente,\n[Seu Nome]'
    }
  ],
  linkedin: [
    {
      id: 'linkedin-1',
      name: 'Conexão Profissional',
      template: 'Olá {{nome}},\n\nVi seu perfil e fiquei impressionado com seu trabalho como {{cargo}} na {{empresa}}.\n\nTrabalho com {{área de especialidade}} para clínicas odontológicas e gostaria de compartilhar algumas insights sobre {{área de interesse}}.\n\nPodemos conectar?'
    }
  ]
};

const CustomizeApproach = ({ data, onUpdate, onNext, onPrev }: CustomizeApproachProps) => {
  const { toast } = useToast();
  const [selectedDecisionMaker, setSelectedDecisionMaker] = useState<DecisionMaker | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generatingMessage, setGeneratingMessage] = useState(false);
  const [copied, setCopied] = useState(false);

  // Set default decision maker
  useEffect(() => {
    if (data.selectedDecisionMakers.length > 0 && !selectedDecisionMaker) {
      setSelectedDecisionMaker(data.selectedDecisionMakers[0]);
    }
  }, [data.selectedDecisionMakers, selectedDecisionMaker]);

  // Select a template when channel changes
  useEffect(() => {
    if (data.channel && templates[data.channel as keyof typeof templates]?.length > 0) {
      setSelectedTemplate(templates[data.channel as keyof typeof templates][0]);
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

  const handleChannelSelect = (channelId: string) => {
    onUpdate({ channel: channelId });
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleDecisionMakerSelect = (decisionMaker: DecisionMaker) => {
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

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
                variant={data.channel === channel.id ? "primary" : "outline"}
                className={`flex-1 ${data.channel === channel.id ? "" : ""} font-benton`}
                onClick={() => handleChannelSelect(channel.id)}
              >
                {channel.icon}
                <span className="ml-1.5">{channel.name}</span>
              </Button>
            ))}
          </div>
          
          {/* Template selection */}
          {data.channel && templates[data.channel as keyof typeof templates] && (
            <>
              <h3 className="font-medium text-gray-800 mt-6 font-benton">Selecione um template</h3>
              <div className="space-y-3">
                {templates[data.channel as keyof typeof templates].map((template) => (
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
                disabled={generatingMessage}
                className="font-benton"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${generatingMessage ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyMessage}
                className="font-benton"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copiado!
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
          
          <div className="relative">
            <Textarea
              value={data.customMessage}
              onChange={handleMessageChange}
              placeholder="Sua mensagem personalizada aparecerá aqui..."
              className="min-h-[300px] font-benton"
            />
            
            {generatingMessage && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
                <div className="text-center">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-benton">Gerando mensagem...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="font-benton">
              {data.customMessage.length} caracteres
            </Badge>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onPrev} className="font-benton">
                Voltar
              </Button>
              <Button onClick={onNext} disabled={!data.customMessage.trim()} className="font-benton">
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeApproach;

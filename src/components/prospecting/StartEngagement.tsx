import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Calendar, 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  Mail, 
  Linkedin,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StartEngagementProps {
  data: {
    scheduledActions: any[];
    sentMessages: any[];
    selectedDecisionMakers: any[];
    channel: string;
    customMessage: string;
  };
  onUpdate: (data: any) => void;
  onPrev: () => void;
}

const channelIcons: { [key: string]: React.ReactNode } = {
  whatsapp: <MessageSquare className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />
};

const StartEngagement = ({ data, onUpdate, onPrev }: StartEngagementProps) => {
  const { toast } = useToast();
  const [sendingMessages, setSendingMessages] = useState(false);
  const [schedulingFollowUps, setSchedulingFollowUps] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<number[]>(
    data.selectedDecisionMakers.map(dm => dm.id)
  );

  const handleSendMessages = async () => {
    if (!data.customMessage.trim()) {
      toast({
        title: "Mensagem necessária",
        description: "Por favor, volte à etapa anterior e crie uma mensagem personalizada.",
        variant: "destructive"
      });
      return;
    }

    if (selectedContacts.length === 0) {
      toast({
        title: "Nenhum contato selecionado",
        description: "Selecione pelo menos um decisor para enviar a mensagem.",
        variant: "destructive"
      });
      return;
    }

    setSendingMessages(true);

    // Simulate sending messages
    setTimeout(() => {
      const newSentMessages = selectedContacts.map(contactId => {
        const contact = data.selectedDecisionMakers.find(dm => dm.id === contactId);
        return {
          id: Date.now() + contactId,
          contactId,
          contactName: contact?.name,
          contactRole: contact?.role,
          channel: data.channel,
          message: data.customMessage,
          sentAt: new Date(),
          status: "sent",
          trackingId: `msg_${Date.now()}_${contactId}`
        };
      });

      onUpdate({ 
        sentMessages: [...data.sentMessages, ...newSentMessages]
      });

      setSendingMessages(false);
      
      toast({
        title: "Mensagens enviadas!",
        description: `${selectedContacts.length} mensagem(ns) enviada(s) com sucesso.`
      });
    }, 2000);
  };

  const handleScheduleFollowUps = () => {
    setSchedulingFollowUps(true);

    setTimeout(() => {
      const newScheduledActions = selectedContacts.map(contactId => {
        const contact = data.selectedDecisionMakers.find(dm => dm.id === contactId);
        return {
          id: Date.now() + contactId + 1000,
          contactId,
          contactName: contact?.name,
          actionType: "follow-up",
          channel: data.channel,
          scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          status: "scheduled",
          message: "Follow-up automático: Como está considerando nossa proposta?"
        };
      });

      onUpdate({
        scheduledActions: [...data.scheduledActions, ...newScheduledActions]
      });

      setSchedulingFollowUps(false);
      
      toast({
        title: "Follow-ups agendados!",
        description: `${selectedContacts.length} follow-up(s) agendado(s) para 3 dias.`
      });
    }, 1500);
  };

  const handleContactToggle = (contactId: number) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const getChannelName = (channel: string) => {
    const names: { [key: string]: string } = {
      whatsapp: "WhatsApp",
      email: "Email", 
      linkedin: "LinkedIn"
    };
    return names[channel] || channel;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-emerald-100 text-emerald-800";
      case "read": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-medium text-gray-700 mb-2 font-benton">
          Iniciar engajamento
        </h3>
        <p className="text-gray-500 font-benton">
          Envie suas mensagens personalizadas e configure follow-ups automáticos
        </p>
      </div>

      {/* Message Preview & Contact Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Message Preview */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-rarity-blue/5 to-rarity-purple/5 border-rarity-blue/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 font-benton">
                {channelIcons[data.channel as string]}
                <span>Preview da Mensagem - {getChannelName(data.channel)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.customMessage ? (
                <div className="bg-white p-4 rounded-lg border">
                  <Textarea
                    value={data.customMessage}
                    readOnly
                    className="w-full h-40 resize-none border-0 bg-transparent focus-visible:ring-0 font-benton"
                  />
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-800 font-medium font-benton">Mensagem não criada</p>
                      <p className="text-yellow-700 text-sm font-benton">
                        Volte à etapa anterior para criar uma mensagem personalizada.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSendMessages}
              disabled={sendingMessages || !data.customMessage || selectedContacts.length === 0}
              className="w-full bg-gradient-to-r from-rarity-pink to-rarity-purple text-white font-benton"
              size="lg"
            >
              {sendingMessages ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Enviando mensagens...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Enviar para {selectedContacts.length} contato(s)
                </>
              )}
            </Button>

            <Button
              onClick={handleScheduleFollowUps}
              disabled={schedulingFollowUps || selectedContacts.length === 0}
              variant="outline"
              className="w-full font-benton"
              size="lg"
            >
              {schedulingFollowUps ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Agendando follow-ups...
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5 mr-2" />
                  Agendar Follow-ups (3 dias)
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right - Contact Selection */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 font-benton">
            Selecionar destinatários ({selectedContacts.length}/{data.selectedDecisionMakers.length})
          </h3>

          <div className="space-y-3">
            {data.selectedDecisionMakers.map((contact) => (
              <Card 
                key={contact.id}
                className={`cursor-pointer transition-all ${
                  selectedContacts.includes(contact.id)
                    ? "border-rarity-pink bg-rarity-pink/5"
                    : "hover:border-gray-300"
                }`}
                onClick={() => handleContactToggle(contact.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium font-benton">{contact.name}</h4>
                      <p className="text-sm text-gray-600 font-benton">
                        {contact.role} • {contact.company}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedContacts.includes(contact.id) && (
                        <CheckCircle className="h-5 w-5 text-rarity-pink" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data.selectedDecisionMakers.length === 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-700 text-sm font-benton">
                Nenhum decisor disponível. Volte às etapas anteriores para identificar e selecionar decisores.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sent Messages & Scheduled Actions */}
      {(data.sentMessages.length > 0 || data.scheduledActions.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sent Messages */}
          {data.sentMessages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-benton">
                  <Send className="h-5 w-5 text-green-600" />
                  <span>Mensagens Enviadas ({data.sentMessages.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.sentMessages.map((message) => (
                  <div key={message.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {channelIcons[message.channel]}
                        <span className="font-medium text-sm font-benton">{message.contactName}</span>
                      </div>
                      <Badge className={getStatusColor(message.status)}>
                        {message.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 font-benton">
                      {message.contactRole} • Enviado em {message.sentAt.toLocaleDateString('pt-BR')} às {message.sentAt.toLocaleTimeString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-benton">
                      ID: {message.trackingId}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Scheduled Actions */}
          {data.scheduledActions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-benton">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Ações Agendadas ({data.scheduledActions.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.scheduledActions.map((action) => (
                  <div key={action.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {channelIcons[action.channel]}
                        <span className="font-medium text-sm font-benton">{action.contactName}</span>
                      </div>
                      <Badge className={getStatusColor(action.status)}>
                        {action.actionType}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 font-benton">
                      Agendado para: {action.scheduledFor.toLocaleDateString('pt-BR')} às {action.scheduledFor.toLocaleTimeString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-benton">
                      {action.message}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Success Summary */}
      {data.sentMessages.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-medium text-green-800 font-benton">
                  Campanha de Prospecção Iniciada!
                </h3>
                <p className="text-green-700 font-benton">
                  Suas mensagens foram enviadas e os follow-ups estão agendados.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600 font-benton">{data.sentMessages.length}</div>
                <div className="text-sm text-green-700 font-benton">Mensagens Enviadas</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 font-benton">{data.scheduledActions.length}</div>
                <div className="text-sm text-blue-700 font-benton">Follow-ups Agendados</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 font-benton">
                  {getChannelName(data.channel)}
                </div>
                <div className="text-sm text-purple-700 font-benton">Canal Utilizado</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-rarity-pink font-benton">✨</div>
                <div className="text-sm text-rarity-pink font-benton">IA Personalizada</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg border-l-4 border-green-400">
              <p className="text-sm text-green-700 font-benton">
                <strong>Próximos passos:</strong> Monitore as respostas no dashboard e ajuste sua estratégia 
                com base nos resultados. Lembre-se de que a taxa de resposta média é de 15-25% 
                para mensagens personalizadas como as suas.
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
      </div>
    </div>
  );
};

export default StartEngagement;

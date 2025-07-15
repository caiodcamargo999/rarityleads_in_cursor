"use client";

import { useState, useEffect } from "react";

interface WhatsAppQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  onConnected: () => void;
}

export default function WhatsAppQRCodeModal({
  isOpen,
  onClose,
  sessionId,
  onConnected,
}: WhatsAppQRCodeModalProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'generating' | 'waiting' | 'connected' | 'expired' | 'error'>('generating');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!isOpen) return;

    // Generate QR code
    const generateQR = async () => {
      try {
        setStatus('generating');
        const response = await fetch(`http://localhost:3001/api/sessions/${sessionId}/qr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          setQrCode(data.qr);
          setStatus('waiting');
          setCountdown(60);
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    generateQR();

    // WebSocket connection for real-time status
    const ws = new WebSocket('ws://localhost:3001');
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'subscribe',
        sessionId: sessionId
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.sessionId === sessionId) {
        if (data.status === 'connected') {
          setStatus('connected');
          setTimeout(() => {
            onConnected();
            onClose();
          }, 2000);
        } else if (data.status === 'expired') {
          setStatus('expired');
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [isOpen, sessionId, onConnected, onClose]);

  useEffect(() => {
    if (status === 'waiting' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setStatus('expired');
    }
  }, [status, countdown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card-bg border border-border rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-primary-text">Conectar WhatsApp</h2>
          <button
            onClick={onClose}
            className="text-secondary-text hover:text-primary-text transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="text-center">
          {status === 'generating' && (
            <div className="space-y-4">
              <div className="w-48 h-48 bg-main-bg border border-border rounded-lg flex items-center justify-center mx-auto">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-text"></div>
              </div>
              <p className="text-secondary-text">Gerando código QR...</p>
            </div>
          )}

          {status === 'waiting' && qrCode && (
            <div className="space-y-4">
              <div className="w-48 h-48 bg-white p-4 rounded-lg mx-auto">
                <img src={qrCode} alt="QR Code" className="w-full h-full" />
              </div>
              <div className="space-y-2">
                <p className="text-primary-text font-medium">Escaneie o código QR</p>
                <p className="text-secondary-text text-sm">
                  Abra o WhatsApp no seu celular e escaneie este código
                </p>
                <p className="text-secondary-text text-sm">
                  Código expira em: {countdown}s
                </p>
              </div>
            </div>
          )}

          {status === 'connected' && (
            <div className="space-y-4">
              <div className="w-48 h-48 bg-green-100 border border-green-200 rounded-lg flex items-center justify-center mx-auto">
                <div className="text-green-600 text-4xl">✓</div>
              </div>
              <div className="space-y-2">
                <p className="text-green-400 font-medium">Conectado com sucesso!</p>
                <p className="text-secondary-text text-sm">
                  Seu WhatsApp foi conectado. Redirecionando...
                </p>
              </div>
            </div>
          )}

          {status === 'expired' && (
            <div className="space-y-4">
              <div className="w-48 h-48 bg-red-100 border border-red-200 rounded-lg flex items-center justify-center mx-auto">
                <div className="text-red-600 text-4xl">⏱</div>
              </div>
              <div className="space-y-2">
                <p className="text-red-400 font-medium">Código expirado</p>
                <p className="text-secondary-text text-sm">
                  O código QR expirou. Clique em "Gerar novo código" para tentar novamente.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-main-bg border border-border text-primary-text px-4 py-2 rounded-lg hover:bg-border transition-colors"
              >
                Gerar novo código
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="w-48 h-48 bg-red-100 border border-red-200 rounded-lg flex items-center justify-center mx-auto">
                <div className="text-red-600 text-4xl">⚠</div>
              </div>
              <div className="space-y-2">
                <p className="text-red-400 font-medium">Erro na conexão</p>
                <p className="text-secondary-text text-sm">
                  Não foi possível gerar o código QR. Verifique sua conexão e tente novamente.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-main-bg border border-border text-primary-text px-4 py-2 rounded-lg hover:bg-border transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
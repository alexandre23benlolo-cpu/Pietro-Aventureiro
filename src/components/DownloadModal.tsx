import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Laptop, CheckCircle2, Share2, PlusSquare, ArrowDownToLine, Loader2 } from 'lucide-react';
import { downloadProjectZip } from '../utils/zipDownloader';
import { soundCtrl } from '../utils/audio';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleClose = () => {
    soundCtrl.playClick(350);
    onClose();
  };

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    soundCtrl.playClick(440);
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const handleDownloadZipClick = async () => {
    try {
      soundCtrl.playClick(480);
      setIsDownloading(true);
      await downloadProjectZip();
      setIsDownloaded(true);
      soundCtrl.playCorrect();
    } catch {
      // Fallback
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-pop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-slate-900 border-2 border-emerald-400/50 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl relative text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-300 leading-tight">
                Baixar & Instalar
              </h2>
              <p className="text-xs text-indigo-100">
                Como usar o app no seu celular, tablet ou computador
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-rose-500/30 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition active:scale-95"
          >
            <X className="w-4 h-4 text-emerald-300" />
            <span>Fechar</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Method 1: Instant ZIP Download */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1">
              <ArrowDownToLine className="w-5 h-5" />
              <span>Opção 1: Baixar Código Completo (.ZIP)</span>
            </div>
            <p className="text-xs text-slate-200 mb-3">
              Gera um arquivo <strong>.ZIP</strong> com todos os arquivos do projeto para abrir e rodar no seu computador.
            </p>

            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownloadZipClick}
              className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-3 px-4 rounded-xl shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2 text-sm"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compactando arquivos...</span>
                </>
              ) : isDownloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                  <span>Download Concluído! Baixar novamente?</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Clique aqui para Baixar o Arquivo .ZIP</span>
                </>
              )}
            </button>
          </div>

          {/* Method 2: Install as Mobile / Desktop App (PWA) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-yellow-300 font-bold text-sm">
              <Smartphone className="w-4 h-4" />
              <span>Opção 2: Instalar no Celular ou Tablet (Como App)</span>
            </div>
            <p className="text-xs text-slate-300">
              Você pode adicionar o ícone do Pietro direto na tela de início do seu aparelho para abrir em tela cheia como um aplicativo de verdade:
            </p>

            {deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-950 font-black py-2.5 px-4 rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-2 text-xs"
              >
                <Smartphone className="w-4 h-4" />
                <span>Instalar no Dispositivo Agora</span>
              </button>
            )}

            {/* iOS Guide */}
            <div className="bg-indigo-950/50 p-3 rounded-xl border border-indigo-400/20 text-xs text-indigo-100 space-y-1.5">
              <span className="font-bold text-cyan-300 block">📱 No iPhone ou iPad (Safari):</span>
              <p className="flex items-center gap-1.5">
                <span>1.</span> Toque no botão de <strong>Compartilhar</strong> <Share2 className="w-3.5 h-3.5 inline text-sky-400" /> na barra do navegador.
              </p>
              <p className="flex items-center gap-1.5">
                <span>2.</span> Selecione a opção <strong>&ldquo;Adicionar à Tela de Início&rdquo;</strong> <PlusSquare className="w-3.5 h-3.5 inline text-amber-400" />.
              </p>
            </div>

            {/* Android Guide */}
            <div className="bg-indigo-950/50 p-3 rounded-xl border border-indigo-400/20 text-xs text-indigo-100 space-y-1.5">
              <span className="font-bold text-cyan-300 block">🤖 No Celular Android (Chrome):</span>
              <p>
                1. Toque no menu de <strong>três pontinhos (⋮)</strong> no canto superior direito.
              </p>
              <p>
                2. Toque em <strong>&ldquo;Instalar aplicativo&rdquo;</strong> ou <strong>&ldquo;Adicionar à tela inicial&rdquo;</strong>.
              </p>
            </div>
          </div>

          {/* Method 3: AI Studio Interface Guide */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Laptop className="w-4 h-4" />
              <span>Opção 3: Baixar pelo painel do Google AI Studio</span>
            </div>
            <p>
              No canto superior direito da janela do <strong>Google AI Studio</strong> (na barra superior fora do aplicativo), você encontrará o botão de <strong>Exportar / Download</strong> do projeto (ícone de seta para baixo ou menu de 3 pontinhos) que permite exportar o repositório ou baixar o arquivo ZIP diretamente da plataforma.
            </p>
          </div>
        </div>

        {/* Guaranteed Bottom Close Button */}
        <div className="pt-3.5 border-t border-white/10 mt-3 flex justify-end shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-lg transition active:scale-95 flex items-center gap-2"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Lightbulb, Plus } from "lucide-react";
import { useDeviceType } from '@/hooks/use-device-type';

type AddDetailsModalProps = {
  onClose: () => void;
  onSubmit: (details: string, selectedTags: string[]) => void;
  existingUserData: string;
};

// Tags sugeridos por IA basados en categorías comunes de productos tecnológicos
const suggestedTags = [
  // Uso y necesidades
  "Gaming", "Trabajo", "Estudio", "Viajes", "Fotografía", "Videos", "Streaming",
  "Ejercicio", "Hogar", "Oficina", "Productividad", "Entretenimiento",

  // Características técnicas
  "Cámara avanzada", "Batería larga", "Pantalla grande", "Compacto", "Resistente",
  "Rápido", "Silencioso", "Liviano", "Duradero", "Fácil de usar",

  // Preferencias de marca y estilo
  "Marca específica", "Diseño moderno", "Colores específicos", "Premium",
  "Económico", "Minimalista", "Innovador", "Clásico", "Deportivo",

  // Funcionalidades específicas
  "5G", "WiFi 6", "Bluetooth", "USB-C", "Carga inalámbrica", "Resistente al agua",
  "Modo nocturno", "Grabación 4K", "Procesamiento AI", "Seguridad biométrica"
];

const AddDetailsModal: React.FC<AddDetailsModalProps> = ({
  onClose,
  onSubmit,
  existingUserData
}) => {
  const [details, setDetails] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deviceInfo = useDeviceType();
  const { isMobile, isTablet } = deviceInfo;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!details.trim() && selectedTags.length === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(details.trim(), selectedTags);
      onClose();
    } catch (error) {
      console.error('Error submitting additional details:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = details.trim().length > 0 || selectedTags.length > 0;

  return (
    <div className={`fixed inset-0 z-50 flex justify-center ${
      isMobile
        ? 'items-end p-0'
        : 'items-center p-4'
    }`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full overflow-y-auto modal-scroll bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl ${
        isMobile
          ? 'max-h-[95vh] rounded-t-3xl max-w-none'
          : isTablet
          ? 'max-h-[90vh] max-w-xl rounded-3xl'
          : 'max-h-[90vh] max-w-2xl rounded-3xl'
      }`}>
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute z-10 rounded-full glassmorphism touch-manipulation ${
            isMobile
              ? 'top-3 right-3 w-8 h-8'
              : 'top-4 right-4 w-10 h-10'
          }`}
          onClick={onClose}
        >
          <X className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />
        </Button>

        {/* Header */}
        <div className={isMobile ? 'p-4 pb-0' : 'p-6 pb-0'}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className={`font-headline font-bold ${
                isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'
              }`}>
                Mejora tus recomendaciones
              </h2>
              <p className={`text-muted-foreground ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                {isMobile
                  ? "Más detalles para mejores resultados"
                  : "Cuéntanos más para encontrar opciones aún más perfectas"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`space-y-4 ${
          isMobile ? 'p-4' : isTablet ? 'p-5' : 'p-6'
        }`}>
          {/* Tips Section */}
          <div className="glassmorphism rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Lightbulb className="w-5 h-5" />
              <span>Consejos para mejores resultados</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• <strong>Sé específico</strong>: Menciona marcas, modelos o características concretas que te interesan</p>
              <p>• <strong>Comparte tu contexto</strong>: ¿Para qué lo usarás principalmente? ¿Tienes alguna limitación?</p>
              <p>• <strong>Define prioridades</strong>: ¿Qué es más importante para ti? ¿Precio, calidad, funciones específicas?</p>
              <p>• <strong>Experiencias pasadas</strong>: ¿Qué te ha gustado o disgustado de productos anteriores?</p>
            </div>
          </div>

          {/* Text Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">
              Cuéntanos más detalles
            </label>
            <Textarea
              placeholder="Por ejemplo: Necesito que tenga una excelente cámara para fotografía nocturna, batería que dure todo el día, y que sea resistente porque hago deportes al aire libre. Mi presupuesto máximo es $800..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-32 resize-none glassmorphism text-sm"
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {details.length}/1000 caracteres
            </div>
          </div>

          {/* Quick Tags */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold">
                O selecciona características importantes
              </label>
              <Badge variant="outline" className="text-xs">
                Opcional
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
              {suggestedTags.map((tag, index) => (
                <Button
                  key={index}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  className="rounded-full h-7 text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {selectedTags.includes(tag) && <Plus className="w-3 h-3 mr-1 rotate-45" />}
                  {tag}
                </Button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {selectedTags.length} característica{selectedTags.length !== 1 ? 's' : ''} seleccionada{selectedTags.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Current Info Preview */}
          <div className="glassmorphism-subtle rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-2">Información actual que tenemos:</h4>
            <p className="text-xs text-muted-foreground bg-black/10 dark:bg-white/10 rounded-lg p-3 max-h-24 overflow-y-auto">
              {existingUserData || "No hay información previa disponible"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Buscando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Buscar mejores opciones
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDetailsModal;
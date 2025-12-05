import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { ShoppingCart, Salad } from 'lucide-react';

interface SalatConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salatName: string;
  onComplete: (config: { dressing: string }) => void;
}

const DRESSINGS = [
  { id: 'scharf', label: 'mit Dressing, scharf', description: 'Würziges scharfes Dressing' },
  { id: 'joghurt', label: 'mit Joghurt-Dressing', description: 'Cremiges Joghurt-Dressing' },
  { id: 'cocktail', label: 'mit Cocktail-Dressing', description: 'Klassisches Cocktail-Dressing' },
  { id: 'ohne', label: 'ohne Dressing', description: 'Salat pur ohne Dressing' },
];

export function SalatConfigDialog({ open, onOpenChange, salatName, onComplete }: SalatConfigDialogProps) {
  const [selectedDressing, setSelectedDressing] = useState<string>('');

  const handleComplete = () => {
    if (!selectedDressing) {
      return; // Dressing ist Pflichtfeld
    }

    const dressingLabel = DRESSINGS.find(d => d.id === selectedDressing)?.label || '';
    
    onComplete({
      dressing: dressingLabel,
    });

    // Reset
    setSelectedDressing('');
  };

  const handleCancel = () => {
    setSelectedDressing('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glossy-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary glow-green flex items-center gap-2">
            <Salad className="w-8 h-8" />
            {salatName} konfigurieren
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info Box */}
          <div className="bg-accent/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong>Alle Salate werden zubereitet mit:</strong> Eisbergsalat, Tomaten, Gurken, Zwiebeln
            </p>
          </div>

          {/* Dressing Selection - PFLICHTFELD */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Ihr Dressing wählen</h3>
              <span className="text-red-500 text-sm font-semibold">(Pflichtfeld)</span>
            </div>
            
            <RadioGroup value={selectedDressing} onValueChange={setSelectedDressing}>
              <div className="grid gap-3">
                {DRESSINGS.map((dressing) => (
                  <div
                    key={dressing.id}
                    className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedDressing === dressing.id
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border hover:border-primary/50 hover:bg-accent/5'
                    }`}
                    onClick={() => setSelectedDressing(dressing.id)}
                  >
                    <RadioGroupItem value={dressing.id} id={dressing.id} />
                    <Label
                      htmlFor={dressing.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-semibold">{dressing.label}</div>
                      <div className="text-sm text-muted-foreground">{dressing.description}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {!selectedDressing && (
              <p className="text-sm text-red-500 font-medium">
                ⚠️ Bitte wählen Sie ein Dressing aus
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!selectedDressing}
            className="flex-1 glossy-button bg-primary hover:bg-primary/90 text-primary-foreground glow-green"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            In den Warenkorb
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

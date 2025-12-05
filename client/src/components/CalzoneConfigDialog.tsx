import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface CalzoneConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calzoneName: string;
  onComplete: (config: { extras: string[] }) => void;
}

const CALZONE_EXTRAS = [
  { name: "mit Knoblauch", price: 0 },
  { name: "mit Oliven", price: 100 },
  { name: "mit Thunfisch", price: 100 },
  { name: "mit Sardellen", price: 100 },
  { name: "mit Kapern", price: 100 },
  { name: "mit Champignons", price: 100 },
  { name: "mit Artischocken", price: 100 },
  { name: "mit Paprika", price: 100 },
  { name: "mit Zwiebeln", price: 100 },
  { name: "mit Peperoni", price: 100 },
  { name: "mit Mais", price: 100 },
  { name: "mit Ananas", price: 100 },
  { name: "mit Spinat", price: 100 },
  { name: "mit Broccoli", price: 100 },
  { name: "mit Rucola", price: 100 },
  { name: "mit Gorgonzola", price: 100 },
  { name: "mit Mozzarella", price: 100 },
  { name: "mit Schafskäse", price: 100 },
  { name: "mit Ei", price: 50 },
  { name: "mit Sauce Hollandaise", price: 100 },
];

export function CalzoneConfigDialog({ open, onOpenChange, calzoneName, onComplete }: CalzoneConfigDialogProps) {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const handleExtraToggle = (extraName: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraName) 
        ? prev.filter(e => e !== extraName)
        : [...prev, extraName]
    );
  };

  const handleComplete = () => {
    // Format extras with price information
    const formattedExtras = selectedExtras.map(extraName => {
      const extra = CALZONE_EXTRAS.find(e => e.name === extraName);
      if (extra && extra.price > 0) {
        const priceStr = (extra.price / 100).toFixed(2).replace('.', ',');
        return `${extraName} (+${priceStr}€)`;
      }
      return extraName;
    });
    
    onComplete({
      extras: formattedExtras
    });
    // Reset state
    setSelectedExtras([]);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedExtras([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-600">
            {calzoneName} - Extras wählen
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Extras hinzufügen (optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              {CALZONE_EXTRAS.map((extra) => (
                <div key={extra.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`extra-${extra.name}`}
                    checked={selectedExtras.includes(extra.name)}
                    onCheckedChange={() => handleExtraToggle(extra.name)}
                  />
                  <Label
                    htmlFor={`extra-${extra.name}`}
                    className="text-sm cursor-pointer"
                  >
                    {extra.name}
                    {extra.price > 0 && (
                      <span className="text-emerald-600 ml-1">
                        (+{(extra.price / 100).toFixed(2).replace('.', ',')}€)
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Abbrechen
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleComplete}
            >
              In den Warenkorb
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

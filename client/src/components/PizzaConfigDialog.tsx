import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PizzaSize {
  name: string;
  price: number;
}

interface PizzaConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pizzaName: string;
  sizes: PizzaSize[];
  onComplete: (config: { size: string; sizePrice: number; extras: string[] }) => void;
}

const PIZZA_EXTRAS = [
  { name: "mit Knoblauch", price: 0 },
  { name: "mit Thunfisch", price: 100 },
  { name: "mit Peperoni", price: 100 },
  { name: "mit Paprika", price: 100 },
  { name: "mit Mozzarella", price: 100 },
  { name: "mit Truthahnsalami", price: 100 },
  { name: "mit Ei", price: 100 },
  { name: "mit Dönerfleisch", price: 100 },
  { name: "mit Zwiebeln", price: 100 },
  { name: "mit Käse, extra", price: 50 },
  { name: "mit Putenschinken", price: 100 },
  { name: "mit Champignons", price: 100 },
  { name: "mit Spinat", price: 100 },
  { name: "mit Ananas", price: 100 },
  { name: "mit Oliven", price: 100 },
  { name: "mit Tomaten", price: 100 },
  { name: "mit Mais", price: 100 },
  { name: "mit Knoblauchwurst, türkisch", price: 100 },
  { name: "mit Artischocken", price: 100 },
  { name: "mit Feta", price: 100 },
];

export function PizzaConfigDialog({ open, onOpenChange, pizzaName, sizes, onComplete }: PizzaConfigDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedSizePrice, setSelectedSizePrice] = useState<number>(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const handleSizeSelect = (sizeName: string, price: number) => {
    setSelectedSize(sizeName);
    setSelectedSizePrice(price);
  };

  const handleExtraToggle = (extraName: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraName) 
        ? prev.filter(e => e !== extraName)
        : [...prev, extraName]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedSize) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleComplete = () => {
    if (selectedSize) {
      // Format extras with price information
      const formattedExtras = selectedExtras.map(extraName => {
        const extra = PIZZA_EXTRAS.find(e => e.name === extraName);
        if (extra && extra.price > 0) {
          const priceStr = (extra.price / 100).toFixed(2).replace('.', ',');
          return `${extraName} (+${priceStr}€)`;
        }
        return extraName;
      });
      
      onComplete({
        size: selectedSize,
        sizePrice: selectedSizePrice,
        extras: formattedExtras
      });
      // Reset state
      setStep(1);
      setSelectedSize("");
      setSelectedSizePrice(0);
      setSelectedExtras([]);
      onOpenChange(false);
    }
  };

  const canProceed = step === 1 ? selectedSize !== "" : true;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {pizzaName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Schritt {step}/2
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4" style={{ display: step === 1 ? 'block' : 'none' }}>
              <h3 className="text-lg font-semibold">Größe wählen</h3>
              <RadioGroup value={selectedSize} onValueChange={(value) => {
                const size = sizes.find(s => s.name === value);
                if (size) {
                  handleSizeSelect(size.name, size.price);
                }
              }}>
                <div className="grid grid-cols-1 gap-3">
                  {sizes.map((size) => (
                    <div
                      key={size.name}
                      className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedSize === size.name
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleSizeSelect(size.name, size.price)}
                    >
                      <RadioGroupItem value={size.name} id={size.name} />
                      <Label
                        htmlFor={size.name}
                        className="flex-1 cursor-pointer flex justify-between items-center"
                      >
                        <span className="font-medium">{size.name}</span>
                        <span className="text-primary font-semibold">
                          {(size.price / 100).toFixed(2)} €
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
          </div>

          <div className="space-y-4" style={{ display: step === 2 ? 'block' : 'none' }}>
              <h3 className="text-lg font-semibold">Extras wählen (optional)</h3>
              <div className="grid grid-cols-1 gap-3">
                {PIZZA_EXTRAS.map((extra) => (
                  <div
                    key={extra.name}
                    className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedExtras.includes(extra.name)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleExtraToggle(extra.name)}
                  >
                    <Checkbox
                      id={extra.name}
                      checked={selectedExtras.includes(extra.name)}
                      onCheckedChange={() => handleExtraToggle(extra.name)}
                    />
                    <Label
                      htmlFor={extra.name}
                      className="flex-1 cursor-pointer flex justify-between items-center"
                    >
                      <span>{extra.name}</span>
                      {extra.price > 0 && (
                        <span className="text-primary font-semibold">
                          +{(extra.price / 100).toFixed(2)} €
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-4 border-t">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Zurück
            </Button>
          )}
          
          {step < 2 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="ml-auto flex items-center gap-2"
            >
              Weiter
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="ml-auto bg-primary hover:bg-primary/90"
            >
              In den Warenkorb legen
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

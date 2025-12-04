import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface MenuConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: (config: MenuConfig) => void;
  menuName: string;
}

interface ItemConfig {
  extras: string[];
  sauce: string;
}

interface MenuConfig {
  item1: ItemConfig;
  item2: ItemConfig;
  pommesSauce: string;
  drink: string;
}

const ITEM_EXTRAS = [
  "ohne Zwiebeln",
  "ohne Rotkohl",
  "ohne Eisbergsalat",
  "ohne Peperoni",
  "ohne Tomaten",
  "ohne Mais",
  "mit Käse (+0,50€)",
  "mit Schafskäse (+1,00€)"
];

const SAUCES = [
  "Ketchup",
  "Mayonnaise",
  "Cocktailsauce",
  "Joghurtsauce",
  "Scharfe Sauce"
];

const DRINKS_125L = [
  "Coca-Cola 1,25l",
  "Fanta 1,25l",
  "Sprite 1,25l",
  "Mezzo Mix 1,25l",
  "Wasser 1,25l"
];

export function MenuConfigDialog({ open, onClose, onComplete, menuName }: MenuConfigDialogProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<MenuConfig>({
    item1: { extras: [], sauce: "" },
    item2: { extras: [], sauce: "" },
    pommesSauce: "",
    drink: ""
  });

  // Determine item type (Döner or Yufka) based on menu name
  const isYufkaMenu = menuName.toLowerCase().includes("yufka");
  const itemName = isYufkaMenu ? "Yufka" : "Döner";

  const handleItemExtrasChange = (itemNum: 1 | 2, extra: string, checked: boolean) => {
    const key = itemNum === 1 ? "item1" : "item2";
    setConfig(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        extras: checked 
          ? [...prev[key].extras, extra]
          : prev[key].extras.filter(e => e !== extra)
      }
    }));
  };

  const handleItemSauceChange = (itemNum: 1 | 2, sauce: string) => {
    const key = itemNum === 1 ? "item1" : "item2";
    setConfig(prev => ({
      ...prev,
      [key]: { ...prev[key], sauce }
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    onComplete(config);
    onClose();
    // Reset
    setStep(1);
    setConfig({
      item1: { extras: [], sauce: "" },
      item2: { extras: [], sauce: "" },
      pommesSauce: "",
      drink: ""
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return config.item1.sauce !== "";
      case 2:
        return config.item2.sauce !== "";
      case 3:
        return config.pommesSauce !== "";
      case 4:
        return config.drink !== "";
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600">
            {menuName} konfigurieren - Schritt {step}/4
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Item 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{itemName} 1 konfigurieren</h3>
              
              <div className="space-y-3">
                <Label className="text-base font-semibold">Sauce wählen (Pflicht)</Label>
                <RadioGroup 
                  value={config.item1.sauce} 
                  onValueChange={(sauce) => handleItemSauceChange(1, sauce)}
                >
                  {SAUCES.map(sauce => (
                    <div key={sauce} className="flex items-center space-x-2">
                      <RadioGroupItem value={sauce} id={`i1-sauce-${sauce}`} />
                      <Label htmlFor={`i1-sauce-${sauce}`} className="cursor-pointer">
                        {sauce}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Extras (Optional)</Label>
                {ITEM_EXTRAS.map(extra => (
                  <div key={extra} className="flex items-center space-x-2">
                    <Checkbox
                      id={`i1-${extra}`}
                      checked={config.item1.extras.includes(extra)}
                      onCheckedChange={(checked) => 
                        handleItemExtrasChange(1, extra, checked as boolean)
                      }
                    />
                    <Label htmlFor={`i1-${extra}`} className="cursor-pointer">
                      {extra}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Item 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{itemName} 2 konfigurieren</h3>
              
              <div className="space-y-3">
                <Label className="text-base font-semibold">Sauce wählen (Pflicht)</Label>
                <RadioGroup 
                  value={config.item2.sauce} 
                  onValueChange={(sauce) => handleItemSauceChange(2, sauce)}
                >
                  {SAUCES.map(sauce => (
                    <div key={sauce} className="flex items-center space-x-2">
                      <RadioGroupItem value={sauce} id={`i2-sauce-${sauce}`} />
                      <Label htmlFor={`i2-sauce-${sauce}`} className="cursor-pointer">
                        {sauce}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Extras (Optional)</Label>
                {ITEM_EXTRAS.map(extra => (
                  <div key={extra} className="flex items-center space-x-2">
                    <Checkbox
                      id={`i2-${extra}`}
                      checked={config.item2.extras.includes(extra)}
                      onCheckedChange={(checked) => 
                        handleItemExtrasChange(2, extra, checked as boolean)
                      }
                    />
                    <Label htmlFor={`i2-${extra}`} className="cursor-pointer">
                      {extra}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pommes Sauce */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pommes-Sauce wählen</h3>
              <RadioGroup 
                value={config.pommesSauce} 
                onValueChange={(sauce) => setConfig(prev => ({ ...prev, pommesSauce: sauce }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ketchup" id="pommes-ketchup" />
                  <Label htmlFor="pommes-ketchup" className="cursor-pointer">Ketchup</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mayonnaise" id="pommes-mayo" />
                  <Label htmlFor="pommes-mayo" className="cursor-pointer">Mayonnaise</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Getränk */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Getränk wählen (1,25l)</h3>
              <RadioGroup 
                value={config.drink} 
                onValueChange={(drink) => setConfig(prev => ({ ...prev, drink }))}
              >
                {DRINKS_125L.map(drink => (
                  <div key={drink} className="flex items-center space-x-2">
                    <RadioGroupItem value={drink} id={`drink-${drink}`} />
                    <Label htmlFor={`drink-${drink}`} className="cursor-pointer">
                      {drink}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>

          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-green-600 hover:bg-green-700"
            >
              Weiter
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceed()}
              className="bg-green-600 hover:bg-green-700"
            >
              In Warenkorb legen
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

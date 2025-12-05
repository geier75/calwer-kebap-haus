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
  onComplete: (config: any) => void;
  menuName: string;
}

interface ItemConfig {
  extras: string[];
  sauce: string;
}

interface PizzaConfig {
  pizzaName: string;
  extras: string[];
}

interface DonerMenuConfig {
  item1: ItemConfig;
  item2: ItemConfig;
  pommesSauce: string;
  drink: string;
}

interface PizzaMenuConfig {
  pizza1: PizzaConfig;
  pizza2?: PizzaConfig;
  drink1: string;
  drink2?: string;
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

const DRINKS_033L = [
  "Coca-Cola 0,33l",
  "Coca-Cola light 0,33l",
  "Coca-Cola Zero 0,33l",
  "Fanta Orange 0,33l",
  "Fanta Exotic 0,33l",
  "Sprite 0,33l",
  "Mezzo Mix 0,33l",
  "ohne Getränk"
];

const DRINKS_033L_SECOND = [
  "ohne weiteres Getränk",
  "Coca-Cola 0,33l",
  "Coca-Cola light 0,33l",
  "Coca-Cola Zero 0,33l",
  "Fanta Orange 0,33l",
  "Fanta Exotic 0,33l",
  "Sprite 0,33l",
  "Mezzo Mix 0,33l"
];

const PIZZAS = [
  "Pizza Margherita",
  "Pizza Truthahn",
  "Pizza Putenkeule",
  "Pizza Truthahn-Salami",
  "Pizza Funghi",
  "Pizza Sucuk",
  "Pizza Quattro Stagioni",
  "Pizza Milano",
  "Pizza Tonno",
  "Pizza Hawaii",
  "Pizza Amore",
  "Pizza Vier Jahreszeiten",
  "Pizza Mozzarella",
  "Pizza Döner",
  "Pizza Calwer (scharf)",
  "Pizza Wunderbar",
  "Pizza Vegetarisch",
  "Pizza Diavolo",
  "Pizza Al Capone",
  "Pizza Sardegna",
  "Pizza Special",
  "Calzone Calwer",
  "Calzone Super",
  "Calzone Italia Mozzarella",
  "Vegetarische Calzone"
];

const PIZZA_EXTRAS = [
  "mit Knoblauch",
  "mit Thunfisch (+1,00€)",
  "mit Peperoni (+1,00€)",
  "mit Paprika (+1,00€)",
  "mit Mozzarella (+1,00€)",
  "mit Truthahnsalami (+1,00€)",
  "mit Ei (+1,00€)",
  "mit Dönerfleisch (+1,00€)",
  "mit Zwiebeln (+1,00€)",
  "mit Käse, extra (+0,50€)",
  "mit Putenschinken (+1,00€)",
  "mit Champignons (+1,00€)",
  "mit Spinat (+1,00€)",
  "mit Ananas (+1,00€)",
  "mit Oliven (+1,00€)",
  "mit Tomaten (+1,00€)",
  "mit Mais (+1,00€)",
  "mit Knoblauchwurst, türkisch (+1,00€)",
  "mit Artischocken (+1,00€)",
  "mit Feta (+1,00€)"
];

export function MenuConfigDialog({ open, onClose, onComplete, menuName }: MenuConfigDialogProps) {
  const [step, setStep] = useState(1);
  
  // Determine menu type
  const isPizzaMenu = menuName.toLowerCase().includes("pizza");
  const isYufkaMenu = menuName.toLowerCase().includes("yufka");
  const isMenu3 = menuName.toLowerCase().includes("menü 3");
  
  const itemName = isPizzaMenu ? "Pizza" : (isYufkaMenu ? "Yufka" : "Döner");
  
  // Döner/Yufka menu config
  const [donerConfig, setDonerConfig] = useState<DonerMenuConfig>({
    item1: { extras: [], sauce: "" },
    item2: { extras: [], sauce: "" },
    pommesSauce: "",
    drink: ""
  });
  
  // Pizza menu config
  const [pizzaConfig, setPizzaConfig] = useState<PizzaMenuConfig>({
    pizza1: { pizzaName: "", extras: [] },
    pizza2: { pizzaName: "", extras: [] },
    drink1: "",
    drink2: ""
  });

  const totalSteps = isPizzaMenu ? (isMenu3 ? 3 : 6) : 4;

  // Döner/Yufka handlers
  const handleItemExtrasChange = (itemNum: 1 | 2, extra: string, checked: boolean) => {
    const key = itemNum === 1 ? "item1" : "item2";
    setDonerConfig(prev => ({
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
    setDonerConfig(prev => ({
      ...prev,
      [key]: { ...prev[key], sauce }
    }));
  };

  // Pizza handlers
  const handlePizzaSelection = (pizzaNum: 1 | 2, pizzaName: string) => {
    const key = pizzaNum === 1 ? "pizza1" : "pizza2";
    setPizzaConfig(prev => ({
      ...prev,
      [key]: { ...prev[key]!, pizzaName }
    }));
  };

  const handlePizzaExtrasChange = (pizzaNum: 1 | 2, extra: string, checked: boolean) => {
    const key = pizzaNum === 1 ? "pizza1" : "pizza2";
    setPizzaConfig(prev => ({
      ...prev,
      [key]: {
        ...prev[key]!,
        extras: checked
          ? [...prev[key]!.extras, extra]
          : prev[key]!.extras.filter(e => e !== extra)
      }
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    if (isPizzaMenu) {
      onComplete(pizzaConfig);
    } else {
      onComplete(donerConfig);
    }
    onClose();
    // Reset
    setStep(1);
    setDonerConfig({
      item1: { extras: [], sauce: "" },
      item2: { extras: [], sauce: "" },
      pommesSauce: "",
      drink: ""
    });
    setPizzaConfig({
      pizza1: { pizzaName: "", extras: [] },
      pizza2: { pizzaName: "", extras: [] },
      drink1: "",
      drink2: ""
    });
  };

  const canProceed = () => {
    if (isPizzaMenu) {
      if (isMenu3) {
        // Menü 3: Pizza + Extras + Drink
        switch (step) {
          case 1: return pizzaConfig.pizza1.pizzaName !== "";
          case 2: return true; // Extras are optional
          case 3: return pizzaConfig.drink1 !== "";
          default: return false;
        }
      } else {
        // Menü 2: 2 Pizzas + Extras + 2 Drinks
        switch (step) {
          case 1: return pizzaConfig.pizza1.pizzaName !== "";
          case 2: return true; // Extras are optional
          case 3: return pizzaConfig.pizza2!.pizzaName !== "";
          case 4: return true; // Extras are optional
          case 5: return pizzaConfig.drink1 !== "";
          case 6: return pizzaConfig.drink2 !== "";
          default: return false;
        }
      }
    } else {
      // Döner/Yufka menu
      switch (step) {
        case 1: return donerConfig.item1.sauce !== "";
        case 2: return donerConfig.item2.sauce !== "";
        case 3: return donerConfig.pommesSauce !== "";
        case 4: return donerConfig.drink !== "";
        default: return false;
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600">
            {menuName} konfigurieren - Schritt {step}/{totalSteps}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* PIZZA MENU STEPS */}
          {isPizzaMenu && (
            <>
              {/* Menü 2: Step 1 - Pizza 1 Selection */}
              {!isMenu3 && step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pizza 1 auswählen</h3>
                  <RadioGroup 
                    value={pizzaConfig.pizza1.pizzaName} 
                    onValueChange={(pizza) => handlePizzaSelection(1, pizza)}
                  >
                    <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                      {PIZZAS.map(pizza => (
                        <div key={pizza} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                          <RadioGroupItem value={pizza} id={`p1-${pizza}`} />
                          <Label htmlFor={`p1-${pizza}`} className="cursor-pointer flex-1">
                            {pizza}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Menü 2: Step 2 - Pizza 1 Extras */}
              {!isMenu3 && step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pizza 1 Extras (optional)</h3>
                  <p className="text-sm text-gray-600">Gewählte Pizza: {pizzaConfig.pizza1.pizzaName}</p>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {PIZZA_EXTRAS.map(extra => (
                      <div key={extra} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={`p1-extra-${extra}`}
                          checked={pizzaConfig.pizza1.extras.includes(extra)}
                          onCheckedChange={(checked) => 
                            handlePizzaExtrasChange(1, extra, checked as boolean)
                          }
                        />
                        <Label htmlFor={`p1-extra-${extra}`} className="cursor-pointer flex-1">
                          {extra}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Menü 2: Step 3 - Pizza 2 Selection */}
              {!isMenu3 && step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pizza 2 auswählen</h3>
                  <RadioGroup 
                    value={pizzaConfig.pizza2!.pizzaName} 
                    onValueChange={(pizza) => handlePizzaSelection(2, pizza)}
                  >
                    <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                      {PIZZAS.map(pizza => (
                        <div key={pizza} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                          <RadioGroupItem value={pizza} id={`p2-${pizza}`} />
                          <Label htmlFor={`p2-${pizza}`} className="cursor-pointer flex-1">
                            {pizza}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Menü 2: Step 4 - Pizza 2 Extras */}
              {!isMenu3 && step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pizza 2 Extras (optional)</h3>
                  <p className="text-sm text-gray-600">Gewählte Pizza: {pizzaConfig.pizza2!.pizzaName}</p>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {PIZZA_EXTRAS.map(extra => (
                      <div key={extra} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={`p2-extra-${extra}`}
                          checked={pizzaConfig.pizza2!.extras.includes(extra)}
                          onCheckedChange={(checked) => 
                            handlePizzaExtrasChange(2, extra, checked as boolean)
                          }
                        />
                        <Label htmlFor={`p2-extra-${extra}`} className="cursor-pointer flex-1">
                          {extra}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Menü 3: Step 1 - Pizza Selection */}
              {isMenu3 && step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pizza auswählen</h3>
                  <RadioGroup 
                    value={pizzaConfig.pizza1.pizzaName} 
                    onValueChange={(pizza) => handlePizzaSelection(1, pizza)}
                  >
                    <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                      {PIZZAS.map(pizza => (
                        <div key={pizza} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                          <RadioGroupItem value={pizza} id={`p-${pizza}`} />
                          <Label htmlFor={`p-${pizza}`} className="cursor-pointer flex-1">
                            {pizza}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Menü 3: Step 2 - Pizza Extras */}
              {isMenu3 && step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pizza Extras (optional)</h3>
                  <p className="text-sm text-gray-600">Gewählte Pizza: {pizzaConfig.pizza1.pizzaName}</p>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {PIZZA_EXTRAS.map(extra => (
                      <div key={extra} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={`p-extra-${extra}`}
                          checked={pizzaConfig.pizza1.extras.includes(extra)}
                          onCheckedChange={(checked) => 
                            handlePizzaExtrasChange(1, extra, checked as boolean)
                          }
                        />
                        <Label htmlFor={`p-extra-${extra}`} className="cursor-pointer flex-1">
                          {extra}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Menü 2: Step 5 - Drink 1 */}
              {!isMenu3 && step === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Getränk 1 auswählen (0,33l)</h3>
                  <RadioGroup 
                    value={pizzaConfig.drink1} 
                    onValueChange={(drink) => setPizzaConfig(prev => ({ ...prev, drink1: drink }))}
                  >
                    {DRINKS_033L.map(drink => (
                      <div key={drink} className="flex items-center space-x-2">
                        <RadioGroupItem value={drink} id={`drink1-${drink}`} />
                        <Label htmlFor={`drink1-${drink}`} className="cursor-pointer">
                          {drink}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Menü 2: Step 6 - Drink 2 */}
              {!isMenu3 && step === 6 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Getränk 2 auswählen (0,33l)</h3>
                  <RadioGroup 
                    value={pizzaConfig.drink2} 
                    onValueChange={(drink) => setPizzaConfig(prev => ({ ...prev, drink2: drink }))}
                  >
                    {DRINKS_033L_SECOND.map(drink => (
                      <div key={drink} className="flex items-center space-x-2">
                        <RadioGroupItem value={drink} id={`drink2-${drink}`} />
                        <Label htmlFor={`drink2-${drink}`} className="cursor-pointer">
                          {drink}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Menü 3: Step 3 - Drink */}
              {isMenu3 && step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Getränk auswählen (0,33l)</h3>
                  <RadioGroup 
                    value={pizzaConfig.drink1} 
                    onValueChange={(drink) => setPizzaConfig(prev => ({ ...prev, drink1: drink }))}
                  >
                    {DRINKS_033L.map(drink => (
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
            </>
          )}

          {/* DÖNER/YUFKA MENU STEPS */}
          {!isPizzaMenu && (
            <>
              {/* Step 1 - Item 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{itemName} 1 konfigurieren</h3>
                  
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Sauce wählen (Pflicht)</Label>
                    <RadioGroup 
                      value={donerConfig.item1.sauce} 
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
                    <Label className="text-base font-semibold">Extras (optional)</Label>
                    {ITEM_EXTRAS.map(extra => (
                      <div key={extra} className="flex items-center space-x-2">
                        <Checkbox
                          id={`i1-${extra}`}
                          checked={donerConfig.item1.extras.includes(extra)}
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

              {/* Step 2 - Item 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{itemName} 2 konfigurieren</h3>
                  
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Sauce wählen (Pflicht)</Label>
                    <RadioGroup 
                      value={donerConfig.item2.sauce} 
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
                    <Label className="text-base font-semibold">Extras (optional)</Label>
                    {ITEM_EXTRAS.map(extra => (
                      <div key={extra} className="flex items-center space-x-2">
                        <Checkbox
                          id={`i2-${extra}`}
                          checked={donerConfig.item2.extras.includes(extra)}
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

              {/* Step 3 - Pommes Sauce */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pommes-Sauce wählen</h3>
                  <RadioGroup 
                    value={donerConfig.pommesSauce} 
                    onValueChange={(sauce) => setDonerConfig(prev => ({ ...prev, pommesSauce: sauce }))}
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

              {/* Step 4 - Drink */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Getränk auswählen (1,25l)</h3>
                  <RadioGroup 
                    value={donerConfig.drink} 
                    onValueChange={(drink) => setDonerConfig(prev => ({ ...prev, drink }))}
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
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-green-600 hover:bg-green-700"
            >
              Weiter
              <ChevronRight className="ml-2 h-4 w-4" />
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

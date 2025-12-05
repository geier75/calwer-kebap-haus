import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryStreet: '',
    deliveryHouseNumber: '',
    deliveryFloor: '',
    deliveryPostalCode: '75365',
    deliveryCity: 'Calw',
    deliveryNotes: '',
    paymentMethod: 'cash' as 'cash' | 'paypal',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      setOrderNumber(data.orderNumber);
      setOrderComplete(true);
      clearCart();
      toast.success('Bestellung erfolgreich aufgegeben!');
    },
    onError: (error) => {
      toast.error('Fehler beim Aufgeben der Bestellung: ' + error.message);
      setIsSubmitting(false);
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name ist erforderlich';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Telefonnummer ist erforderlich';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Ungültige Telefonnummer';
    }

    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Ungültige E-Mail-Adresse';
    }

    if (!formData.deliveryStreet.trim()) {
      newErrors.deliveryStreet = 'Straße ist erforderlich';
    }

    if (!formData.deliveryHouseNumber.trim()) {
      newErrors.deliveryHouseNumber = 'Hausnummer ist erforderlich';
    }

    if (!formData.deliveryPostalCode.trim()) {
      newErrors.deliveryPostalCode = 'Postleitzahl ist erforderlich';
    }

    if (!formData.deliveryCity.trim()) {
      newErrors.deliveryCity = 'Stadt ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Bitte füllen Sie alle erforderlichen Felder aus');
      return;
    }

    if (items.length === 0) {
      toast.error('Ihr Warenkorb ist leer');
      return;
    }

    setIsSubmitting(true);

    const orderItems = items.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      priceAtOrder: item.price,
      variant: item.variant || null,
      extras: item.extras || undefined,
    }));

    createOrderMutation.mutate({
      ...formData,
      items: orderItems,
      totalAmount: getTotalPrice(),
    });
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Warenkorb ist leer</h2>
          <p className="text-muted-foreground mb-6">
            Fügen Sie Produkte hinzu, um eine Bestellung aufzugeben.
          </p>
          <Button onClick={() => setLocation('/menu')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zum Menü
          </Button>
        </Card>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 text-center max-w-md glossy-card">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6 glow-green" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4 text-gradient-green">
              Bestellung erfolgreich!
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              Bestellnummer: <span className="font-bold text-primary">{orderNumber}</span>
            </p>
            <p className="text-muted-foreground mb-6">
              Ihre Bestellung wird in 30-45 Minuten geliefert.
              <br />
              Sie erhalten eine WhatsApp-Benachrichtigung.
            </p>
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full glow-orange"
                onClick={() => setLocation('/menu')}
              >
                Zurück zum Menü
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation('/menu')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Menü
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <h1 className="text-4xl font-bold mb-8 text-gradient-green">Kasse</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <Card className="p-6 glossy-card">
                <h2 className="text-xl font-bold mb-4">Kontaktinformationen</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({ ...formData, customerName: e.target.value })
                      }
                      className={errors.customerName ? 'border-destructive' : ''}
                    />
                    {errors.customerName && (
                      <p className="text-sm text-destructive mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Telefonnummer *</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      placeholder="+49 ..."
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, customerPhone: e.target.value })
                      }
                      className={errors.customerPhone ? 'border-destructive' : ''}
                    />
                    {errors.customerPhone && (
                      <p className="text-sm text-destructive mt-1">{errors.customerPhone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customerEmail">E-Mail (optional)</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, customerEmail: e.target.value })
                      }
                      className={errors.customerEmail ? 'border-destructive' : ''}
                    />
                    {errors.customerEmail && (
                      <p className="text-sm text-destructive mt-1">{errors.customerEmail}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Delivery Address */}
              <Card className="p-6 glossy-card">
                <h2 className="text-xl font-bold mb-4">Lieferadresse</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="deliveryStreet">Straße *</Label>
                      <Input
                        id="deliveryStreet"
                        value={formData.deliveryStreet}
                        onChange={(e) =>
                          setFormData({ ...formData, deliveryStreet: e.target.value })
                        }
                        className={errors.deliveryStreet ? 'border-destructive' : ''}
                      />
                      {errors.deliveryStreet && (
                        <p className="text-sm text-destructive mt-1">{errors.deliveryStreet}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="deliveryHouseNumber">Nr. *</Label>
                      <Input
                        id="deliveryHouseNumber"
                        value={formData.deliveryHouseNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, deliveryHouseNumber: e.target.value })
                        }
                        className={errors.deliveryHouseNumber ? 'border-destructive' : ''}
                      />
                      {errors.deliveryHouseNumber && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.deliveryHouseNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deliveryFloor">Etage / Wohnung (optional)</Label>
                    <Input
                      id="deliveryFloor"
                      placeholder="z.B. 2. OG, Wohnung 5"
                      value={formData.deliveryFloor}
                      onChange={(e) =>
                        setFormData({ ...formData, deliveryFloor: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deliveryPostalCode">PLZ *</Label>
                      <Input
                        id="deliveryPostalCode"
                        value={formData.deliveryPostalCode}
                        onChange={(e) =>
                          setFormData({ ...formData, deliveryPostalCode: e.target.value })
                        }
                        className={errors.deliveryPostalCode ? 'border-destructive' : ''}
                      />
                      {errors.deliveryPostalCode && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.deliveryPostalCode}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="deliveryCity">Stadt *</Label>
                      <Input
                        id="deliveryCity"
                        value={formData.deliveryCity}
                        onChange={(e) =>
                          setFormData({ ...formData, deliveryCity: e.target.value })
                        }
                        className={errors.deliveryCity ? 'border-destructive' : ''}
                      />
                      {errors.deliveryCity && (
                        <p className="text-sm text-destructive mt-1">{errors.deliveryCity}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deliveryNotes">Lieferhinweise (optional)</Label>
                    <Input
                      id="deliveryNotes"
                      placeholder="z.B. Klingel defekt, bitte anrufen"
                      value={formData.deliveryNotes}
                      onChange={(e) =>
                        setFormData({ ...formData, deliveryNotes: e.target.value })
                      }
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6 glossy-card">
                <h2 className="text-xl font-bold mb-4">Zahlungsmethode</h2>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value as 'cash' | 'paypal' })
                  }
                >
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/10">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Wallet className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">Barzahlung bei Lieferung</p>
                        <p className="text-sm text-muted-foreground">
                          Zahlen Sie bar beim Lieferanten
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/10">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">PayPal</p>
                        <p className="text-sm text-muted-foreground">
                          Sicher online bezahlen
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full glow-orange hover-lift text-lg font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Wird verarbeitet...' : 'Jetzt kostenpflichtig bestellen'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 glossy-card sticky top-4">
              <h2 className="text-xl font-bold mb-4">Bestellübersicht</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variant || 'default'}`}
                    className="flex justify-between items-start pb-4 border-b border-border/50"
                  >
                    <div className="flex gap-3 flex-1">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground">Größe: {item.variant}</p>
                        )}
                        {item.extras && item.extras.length > 0 && (
                          <div className="text-sm text-muted-foreground mt-1">
                            <p className="font-medium">Extras:</p>
                            <ul className="list-disc list-inside ml-2">
                              {item.extras.map((extra, idx) => (
                                <li key={idx}>{extra}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">Menge: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-primary">
                      {((item.price * item.quantity) / 100).toFixed(2)} €
                    </p>
                  </div>
                ))}

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-lg">
                    <span>Zwischensumme:</span>
                    <span className="font-semibold">
                      {(getTotalPrice() / 100).toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Lieferung:</span>
                    <span className="font-semibold text-primary">Kostenlos</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold pt-4 border-t border-border">
                    <span>Gesamt:</span>
                    <span className="text-primary glow-green">
                      {(getTotalPrice() / 100).toFixed(2)} €
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Lieferzeit:</strong> 30-45 Minuten
                    <br />
                    <strong>Mindestbestellwert:</strong> Keiner
                    <br />
                    <strong>Liefergebiet:</strong> Calw und Umgebung
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

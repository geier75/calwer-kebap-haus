import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Euro,
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Ausstehend', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Bestätigt', color: 'bg-blue-500', icon: CheckCircle2 },
  preparing: { label: 'In Vorbereitung', color: 'bg-purple-500', icon: Package },
  delivering: { label: 'Unterwegs', color: 'bg-orange-500', icon: TrendingUp },
  delivered: { label: 'Geliefert', color: 'bg-green-500', icon: CheckCircle2 },
  cancelled: { label: 'Storniert', color: 'bg-red-500', icon: XCircle },
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  
  const { data: orders, isLoading, refetch } = trpc.orders.list.useQuery(undefined, {
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Status aktualisiert');
      refetch();
    },
    onError: (error: any) => {
      toast.error('Fehler beim Aktualisieren: ' + error.message);
    },
  });

  const filteredOrders = orders?.filter(order => 
    selectedStatus === 'all' || order.status === selectedStatus
  );

  const todayOrders = orders?.filter(order => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders?.reduce((sum, order) => sum + order.total, 0) || 0;

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent glow-green"></div>
          <p className="mt-4 text-muted-foreground">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => setLocation('/menu')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zum Menü
            </Button>
            <h1 className="text-4xl font-bold text-gradient-green">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Echtzeit-Bestellübersicht und Statistiken
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 glossy-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bestellungen Heute</p>
                <p className="text-3xl font-bold text-primary glow-green">
                  {todayOrders?.length || 0}
                </p>
              </div>
              <ShoppingBag className="w-12 h-12 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6 glossy-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Umsatz Heute</p>
                <p className="text-3xl font-bold text-primary glow-green">
                  {(todayRevenue / 100).toFixed(2)} €
                </p>
              </div>
              <Euro className="w-12 h-12 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6 glossy-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gesamt Bestellungen</p>
                <p className="text-3xl font-bold text-primary glow-green">
                  {orders?.length || 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-primary opacity-50" />
            </div>
          </Card>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as OrderStatus | 'all')}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Status filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Bestellungen</SelectItem>
              <SelectItem value="pending">Ausstehend</SelectItem>
              <SelectItem value="confirmed">Bestätigt</SelectItem>
              <SelectItem value="preparing">In Vorbereitung</SelectItem>
              <SelectItem value="delivering">Unterwegs</SelectItem>
              <SelectItem value="delivered">Geliefert</SelectItem>
              <SelectItem value="cancelled">Storniert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders?.length === 0 ? (
            <Card className="p-12 text-center glossy-card">
              <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                Keine Bestellungen gefunden
              </p>
            </Card>
          ) : (
            filteredOrders?.map((order, idx) => {
              const StatusIcon = statusConfig[order.status].icon;
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-6 glossy-card hover:border-primary/50 transition-colors">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Order Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-primary">
                              {order.orderNumber}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString('de-DE')}
                            </p>
                          </div>
                          <Badge className={`${statusConfig[order.status].color} text-white`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {statusConfig[order.status].label}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold">Kunde:</span> {order.customerName}
                          </div>
                          <div>
                            <span className="font-semibold">Telefon:</span> {order.customerPhone}
                          </div>
                          <div>
                            <span className="font-semibold">Adresse:</span>{' '}
                            {order.deliveryStreet} {order.deliveryHouseNumber}
                            {order.deliveryFloor && `, ${order.deliveryFloor}`},{' '}
                            {order.deliveryPostalCode} {order.deliveryCity}
                          </div>
                          {order.deliveryNotes && (
                            <div>
                              <span className="font-semibold">Hinweise:</span> {order.deliveryNotes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Zwischensumme:</span>
                            <span className="font-semibold">
                              {(order.subtotal / 100).toFixed(2)} €
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Lieferung:</span>
                            <span className="font-semibold text-primary">Kostenlos</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-border">
                            <span className="font-bold">Gesamt:</span>
                            <span className="font-bold text-lg text-primary">
                              {(order.total / 100).toFixed(2)} €
                            </span>
                          </div>
                          <div className="pt-2">
                            <Badge variant="outline">
                              {order.paymentMethod === 'cash' ? '💵 Bar' : '💳 PayPal'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Status Actions */}
                      <div>
                        <p className="text-sm font-semibold mb-3">Status ändern:</p>
                        <div className="space-y-2">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => handleStatusChange(order.id, 'confirmed')}
                            >
                              Bestätigen
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => handleStatusChange(order.id, 'preparing')}
                            >
                              In Vorbereitung
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => handleStatusChange(order.id, 'delivering')}
                            >
                              Unterwegs
                            </Button>
                          )}
                          {order.status === 'delivering' && (
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => handleStatusChange(order.id, 'delivered')}
                            >
                              Geliefert
                            </Button>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="w-full"
                              onClick={() => handleStatusChange(order.id, 'cancelled')}
                            >
                              Stornieren
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

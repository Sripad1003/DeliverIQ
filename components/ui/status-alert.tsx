import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { OrderStatus } from '@/lib/app-data'

interface StatusAlertProps {
  status: OrderStatus;
}

export function StatusAlert({ status }: StatusAlertProps) {
  let variant: 'default' | 'destructive' = 'default';
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  let description = '';

  switch (status) {
    case OrderStatus.Pending:
      badgeVariant = 'secondary';
      description = 'Your order is awaiting assignment to a driver.';
      break;
    case OrderStatus.Assigned:
      badgeVariant = 'default';
      description = 'A driver has been assigned and is on their way to pickup.';
      break;
    case OrderStatus.PickedUp:
      badgeVariant = 'default';
      description = 'Your order has been picked up and is in transit.';
      break;
    case OrderStatus.Delivered:
      badgeVariant = 'outline';
      description = 'Your order has been successfully delivered.';
      break;
    case OrderStatus.Cancelled:
      variant = 'destructive';
      badgeVariant = 'destructive';
      description = 'Your order has been cancelled.';
      break;
    default:
      badgeVariant = 'secondary';
      description = 'Unknown order status.';
  }

  return (
    <Alert variant={variant} className="p-2">
      <Badge variant={badgeVariant}>{status}</Badge>
      <AlertDescription className="sr-only">{description}</AlertDescription>
    </Alert>
  );
}

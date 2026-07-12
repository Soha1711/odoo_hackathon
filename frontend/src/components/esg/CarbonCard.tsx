import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Leaf, Plane, Trash2, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

interface CarbonCardProps {
  transaction: any;
  onDeleteClick?: (id: string) => void;
  canDelete?: boolean;
}

export function CarbonCard({ transaction, onDeleteClick, canDelete = false }: CarbonCardProps) {
  const isFleet = transaction.sourceType === 'FLEET';
  const isExpense = transaction.sourceType === 'EXPENSE';

  return (
    <Card hoverable>
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Custom icon matching scope source */}
          <div className={`p-3 rounded-xl ${
            isExpense ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' :
            isFleet ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400' :
            'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
          }`}>
            {isExpense ? <Zap className="h-5 w-5" /> : isFleet ? <Plane className="h-5 w-5" /> : <Leaf className="h-5 w-5" />}
          </div>

          <div>
            <h5 className="text-sm font-semibold text-foreground line-clamp-1">{transaction.sourceId}</h5>
            <p className="text-xs text-muted-foreground mt-0.5">
              {transaction.quantity} {transaction.unit} &bull; {new Date(transaction.transactionDate).toLocaleDateString()}
            </p>
            <div className="flex items-center space-x-1.5 mt-1.5">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {transaction.sourceType}
              </Badge>
              {transaction.department && (
                <span className="text-[11px] text-muted-foreground font-medium">
                  {transaction.department.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Calculated CO2 output */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-lg font-bold text-foreground">
              {transaction.calculatedEmissions.toFixed(2)}
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground block uppercase">
              kg CO₂e
            </span>
          </div>

          {canDelete && onDeleteClick && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 p-1.5 h-auto rounded-full"
              onClick={() => onDeleteClick(transaction.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default CarbonCard;

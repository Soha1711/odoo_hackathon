import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Shield, CheckCircle2 } from 'lucide-react';
import { EsgPolicy } from '../../types/policy';

interface PolicyCardProps {
  policy: EsgPolicy;
  isAcknowledged: boolean;
  onAcknowledgeClick?: (id: string) => void;
  isAcknowledging?: boolean;
}

export function PolicyCard({
  policy,
  isAcknowledged,
  onAcknowledgeClick,
  isAcknowledging = false,
}: PolicyCardProps) {
  return (
    <Card hoverable className="overflow-hidden">
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950/20 text-blue-600 rounded-xl">
              <Shield className="h-5 w-5" />
            </div>
            <Badge variant={isAcknowledged ? 'success' : 'warning'}>
              {isAcknowledged ? 'Acknowledged' : 'Pending Acknowledgment'}
            </Badge>
          </div>

          <h4 className="text-base font-semibold text-foreground truncate">{policy.title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-3 mt-1.5">{policy.description}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground font-medium">
            Published: {new Date(policy.createdAt).toLocaleDateString()}
          </span>

          {isAcknowledged ? (
            <div className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Signed</span>
            </div>
          ) : (
            onAcknowledgeClick && (
              <Button
                variant="primary"
                size="sm"
                className="h-8 py-0 px-3 text-xs"
                onClick={() => onAcknowledgeClick(policy.id)}
                isLoading={isAcknowledging}
              >
                Sign Policy
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default PolicyCard;

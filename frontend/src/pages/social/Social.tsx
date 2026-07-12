import { useState } from 'react';
import { useSocial } from '../../hooks/useSocial';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FileUpload } from '../../components/ui/FileUpload';
import { toast } from '../../components/ui/Toast';
import { Heart, Calendar, Check, X } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

export function Social() {
  const { user } = useAuthContext();
  const { activities, participations, joinActivity, reviewParticipation, isLoadingActivities, isLoadingParticipations } = useSocial();
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const isManagement = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivityId) return;

    try {
      await joinActivity({ activityId: selectedActivityId, proofUrl });
      toast.success('Joined CSR activity successfully.');
      setIsJoinModalOpen(false);
      setSelectedActivityId(null);
      setProofUrl('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to register for CSR activity.');
    }
  };

  const handleReview = async (participationId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setIsReviewing(true);
      await reviewParticipation({ participationId, approvalStatus: status });
      toast.success(`CSR participation marked as ${status.toLowerCase()}.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to review participation.');
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center">
            <Heart className="h-8 w-8 mr-2.5 text-red-500" />
            Social Module (CSR)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and log corporate social responsibility events and volunteerism.
          </p>
        </div>
      </div>

      {/* Grid of CSR activities */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Scheduled CSR Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingActivities ? (
            <p className="text-sm text-muted-foreground">Loading activities...</p>
          ) : activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active CSR activities planned.</p>
          ) : (
            activities.map((act) => {
              const hasJoined = participations.some((p) => p.csrActivityId === act.id);
              return (
                <Card key={act.id} hoverable className="flex flex-col justify-between h-full">
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                          CSR Event
                        </span>
                        <Badge variant={hasJoined ? 'success' : 'default'}>
                          {hasJoined ? 'Registered' : 'Open'}
                        </Badge>
                      </div>

                      <h4 className="text-base font-bold text-foreground truncate">{act.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-3 mt-1.5">{act.description}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Deadline: {new Date(act.deadline).toLocaleDateString()}</span>
                      </span>

                      {!hasJoined && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            setSelectedActivityId(act.id);
                            setIsJoinModalOpen(true);
                          }}
                        >
                          Join Event
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Management Review Section */}
      {isManagement && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Pending Approvals</h3>
          <div className="space-y-4">
            {isLoadingParticipations ? (
              <p className="text-sm text-muted-foreground">Loading reviews...</p>
            ) : participations.filter((p) => p.approvalStatus === 'PENDING').length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending CSR approvals found.</p>
            ) : (
              participations
                .filter((p) => p.approvalStatus === 'PENDING')
                .map((part) => (
                  <Card key={part.id} className="p-4 flex items-center justify-between border-l-4 border-l-amber-500">
                    <div>
                      <h5 className="text-sm font-semibold text-foreground">{part.csrActivity?.title}</h5>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Logged by: {part.user?.firstName} {part.user?.lastName} ({part.user?.email})
                      </p>
                      {part.proofUrl && (
                        <a
                          href={part.proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary font-semibold hover:underline mt-1 block"
                        >
                          View Uploaded Evidence
                        </a>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isReviewing}
                        className="text-emerald-500 hover:bg-emerald-500/10 p-2 rounded-full"
                        onClick={() => handleReview(part.id, 'APPROVED')}
                      >
                        <Check className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isReviewing}
                        className="text-red-500 hover:bg-red-500/10 p-2 rounded-full"
                        onClick={() => handleReview(part.id, 'REJECTED')}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </div>
      )}

      {/* Join Event Evidence Upload Modal */}
      <Modal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} title="Submit Volunteer Verification">
        <form onSubmit={handleJoinSubmit} className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Attach photo proof or documents to verify your participation.
          </p>

          <FileUpload onChange={(url) => setProofUrl(url)} value={proofUrl} label="Volunteer Proof" />

          <div className="flex items-center space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsJoinModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Social;

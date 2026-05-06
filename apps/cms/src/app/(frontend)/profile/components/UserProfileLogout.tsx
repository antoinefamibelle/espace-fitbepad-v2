'use client';

import React from 'react';
import { useClerk, useUser } from '@frontend/lib/auth/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@frontend/components/ui/card';
import { Button } from '@frontend/components/ui/button';
import { Alert, AlertDescription } from '@frontend/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@frontend/components/ui/dialog';
import {
  LogOut,
  User,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export function UserProfileLogout() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setShowConfirmDialog(false);
      toast.info('Déconnexion en cours...');
      
      // Clear any local storage data (optional)
      localStorage.removeItem('booking-form-data');
      
      // Sign out and redirect to home page
      await signOut({ redirectUrl: '/' });
      
      // This will only execute if signOut doesn't redirect immediately
      toast.success('Vous avez été déconnecté avec succès');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Erreur lors de la déconnexion. Veuillez réessayer.');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-noka text-2xl font-bold uppercase tracking-wide">
            <Shield className="h-5 w-5 text-emerald-600" />
            Securite et session
          </CardTitle>
          <CardDescription className="text-slate-600">
            Verifiez votre session actuelle et deconnectez-vous en toute securite.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-noka text-xl font-bold uppercase tracking-wide">
            <User className="h-5 w-5 text-emerald-600" />
            Session actuelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-medium text-emerald-700">Connecte en tant que</p>
              <p className="text-sm text-emerald-700/85">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="text-slate-500">Nom complet</span>
              <span className="font-medium">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-noka text-xl font-bold uppercase tracking-wide">
            <Shield className="h-5 w-5 text-emerald-600" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-slate-200 bg-slate-50 text-slate-700">
            <AlertDescription>
              <strong>Conseil securite:</strong> Deconnectez-vous toujours
              lorsque vous utilisez un ordinateur partage ou public pour
              protéger vos informations personnelles.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
        <CardHeader>
          <CardTitle className="font-noka text-xl font-bold uppercase tracking-wide">Terminer la session</CardTitle>
          <CardDescription className="text-slate-600">
            Vous serez redirige vers la page d&apos;accueil apres la deconnexion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-amber-200 bg-amber-50 text-amber-800">
              <AlertDescription>
                Assurez-vous d&apos;avoir sauvegarde toutes les modifications
                avant de vous déconnecter.
              </AlertDescription>
            </Alert>

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <DialogTrigger asChild>
                <Button
                  disabled={isLoggingOut}
                  size="lg"
                  variant="destructive"
                  className="w-full rounded-[var(--radius-md)] bg-red-600 font-semibold text-white hover:bg-red-700 cursor-pointer"
                  onClick={() => setShowConfirmDialog(true)}
                >
                  {isLoggingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Déconnexion en cours...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Se déconnecter
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="border-black/10 bg-white text-slate-900">
                <DialogHeader>
                  <DialogTitle>Confirmer la déconnexion</DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Etes-vous sur de vouloir vous deconnecter ? Vous devrez vous reconnecter
                    pour accéder à votre profil et vos réservations.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmDialog(false)}
                    disabled={isLoggingOut}
                    className="border-black/15 bg-white text-slate-700 hover:bg-slate-100"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    variant="destructive"
                    className="rounded-[var(--radius-md)] bg-red-600 font-semibold text-white hover:bg-red-700 cursor-pointer"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Déconnexion...
                      </>
                    ) : (
                      <>
                        <LogOut className="h-4 w-4 mr-2" />
                        Se déconnecter
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <p className="text-center text-xs text-slate-500">
              Cette action fermera votre session sur cet appareil.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
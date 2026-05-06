'use client';

import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@frontend/components/ui/card';
import { Input } from '@frontend/components/ui/input';
import { Button } from '@frontend/components/ui/button';
import { Skeleton } from '@frontend/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@frontend/components/ui/form';
import { Badge } from '@frontend/components/ui/badge';
import { Separator } from '@frontend/components/ui/separator';
import { toast } from 'sonner';
import { useUserProfile } from '@frontend/lib/hooks/use-user-profile';
import { internalApi } from '@frontend/lib/api';
import type { User } from 'shared';
import { User as UserIcon, Mail, Phone, MapPin, Save } from 'lucide-react';

const UserProfileSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email().readonly(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
});

type UserProfileFormData = z.infer<typeof UserProfileSchema>;

export function UserProfileInformation() {
  const queryClient = useQueryClient();
  const lightInputClass =
    'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-400/70 focus-visible:ring-emerald-200';

  const {
    data: userProfile,
    isLoading: isLoadingData,
    error: errorLoadingData,
    refetch,
  } = useUserProfile();

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        zipCode: userProfile.zipCode || '',
      });
    }
  }, [userProfile, form]);

  const mutation = useMutation<User, Error, UserProfileFormData>({
    mutationFn: async (data) => {
      const response = await internalApi.patch('/api/profile/me', data);
      return response.data.user;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user-profile'], data);
      toast.success('Profil mis à jour avec succès !');
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    },
  });

  const onSubmit = (values: UserProfileFormData) => {
    mutation.mutate(values);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  if (isLoadingData) {
    return (
      <Card className="border-black/10 bg-white/90 backdrop-blur-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 bg-slate-200" />
              <Skeleton className="h-4 w-48 bg-slate-200" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full bg-slate-200" />
          <Skeleton className="h-10 w-full bg-slate-200" />
          <Skeleton className="h-10 w-full bg-slate-200" />
          <Skeleton className="h-10 w-full bg-slate-200" />
          <Skeleton className="h-10 w-full bg-slate-200" />
          <Skeleton className="h-10 w-full bg-slate-200" />
          <Skeleton className="mt-6 h-12 w-32 bg-slate-200" />
        </CardContent>
      </Card>
    );
  }

  if (errorLoadingData) {
    return (
      <Card className="border-red-200 bg-red-50 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="rounded-xl border border-red-200 bg-white p-4 text-red-700">
            <p className="font-semibold text-red-800">
              Erreur lors du chargement de votre profil :
            </p>
            <p className="text-sm text-red-700/90">{errorLoadingData.message}</p>
            <Button
              onClick={() => refetch()}
              className="mt-3 rounded-[var(--radius-md)] bg-[#1d1d1b] font-semibold text-white hover:bg-black cursor-pointer"
            >
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1d1d1b] text-lg font-semibold text-white">
              <span>
                {getInitials(userProfile.firstName, userProfile.lastName)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="font-noka text-3xl font-bold uppercase tracking-wide">
                {userProfile.firstName} {userProfile.lastName}
              </h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4" />
                {userProfile.email}
              </p>
              {userProfile.phone && (
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="h-4 w-4" />
                  {userProfile.phone}
                </p>
              )}
              {(userProfile.address || userProfile.city) && (
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  {[userProfile.address, userProfile.city, userProfile.zipCode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
            </div>
            <Badge className="w-fit border-black/10 bg-slate-100 text-slate-700 hover:bg-slate-100">
              <UserIcon className="h-3 w-3 mr-1" />
              Client
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
        <CardHeader>
          <CardTitle className="font-noka text-2xl font-bold uppercase tracking-wide">
            Modifier mes informations
          </CardTitle>
          <CardDescription className="text-slate-600">
            Mettez a jour vos informations personnelles et vos coordonnees.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm md:grid-cols-3">
                <div>
                  <p className="text-slate-500">Nom complet</p>
                  <p className="font-medium">
                    {userProfile.firstName} {userProfile.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Email du compte</p>
                  <p className="font-medium">{userProfile.email}</p>
                </div>
                <div>
                  <p className="text-slate-500">Statut</p>
                  <p className="font-medium">Profil actif</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Prénom</FormLabel>
                      <FormControl>
                        <Input className={lightInputClass} placeholder="Votre prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Nom</FormLabel>
                      <FormControl>
                        <Input className={lightInputClass} placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className={`${lightInputClass} cursor-not-allowed bg-slate-100 opacity-80`}
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-slate-500">
                      L&apos;email ne peut pas être modifié.
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Votre numéro de téléphone"
                        className={lightInputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="space-y-4">
                <h3 className="font-noka text-xl font-bold uppercase tracking-wide text-slate-900">Adresse postale</h3>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Adresse</FormLabel>
                      <FormControl>
                        <Input className={lightInputClass} placeholder="Votre adresse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Ville</FormLabel>
                        <FormControl>
                          <Input className={lightInputClass} placeholder="Votre ville" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Code Postal</FormLabel>
                        <FormControl>
                          <Input className={lightInputClass} placeholder="Votre code postal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={mutation.isPending || !form.formState.isDirty}
                  className="min-w-32 rounded-[var(--radius-md)] bg-[#1d1d1b] font-semibold text-white hover:bg-black disabled:opacity-50 cursor-pointer"
                >
                  {mutation.isPending ? (
                    'Enregistrement...'
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

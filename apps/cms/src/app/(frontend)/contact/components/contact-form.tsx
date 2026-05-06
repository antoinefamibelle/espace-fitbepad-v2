'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@frontend/components/ui/input';
import { Textarea } from '@frontend/components/ui/textarea';
import { Alert, AlertDescription } from '@frontend/components/ui/alert';
import { useContactForm } from '@frontend/lib/hooks/use-contact-form';
import type { ContactFormRequest } from 'shared';

const contactSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Veuillez entrer une adresse email valide'),
  phone: z
    .string()
    .regex(/^[0-9\s\-\+\(\)]+$/, 'Numéro invalide')
    .optional()
    .or(z.literal('')),
  question: z.string().min(10, 'Votre message doit contenir au moins 10 caractères'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const fieldClass =
  'w-full bg-transparent border-0 border-b border-black/20 rounded-none px-0 py-3 text-[#1d1d1b] placeholder:text-black/30 focus:border-[#52ad77] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors text-base';

export function ContactForm() {
  const { isSubmitting, submitStatus, errorMessage, submitContactForm } = useContactForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    const contactData: ContactFormRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || undefined,
      question: data.question,
    };
    const success = await submitContactForm(contactData);
    if (success) reset();
  };

  return (
    <div className="bg-white px-8 md:px-14 py-14">
      <h2 className="text-[#1d1d1b] font-bold text-2xl mb-2">
        Envoyez-nous un message
      </h2>
      <p className="text-black/50 text-sm mb-12 leading-relaxed">
        Notre équipe vous répond sous 24h avec des conseils adaptés à vos besoins.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">
              Prénom *
            </label>
            <Input {...register('firstName')} className={fieldClass} placeholder="Votre prénom" />
            {errors.firstName && (
              <p className="mt-1.5 text-red-500 text-xs">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">
              Nom *
            </label>
            <Input {...register('lastName')} className={fieldClass} placeholder="Votre nom" />
            {errors.lastName && (
              <p className="mt-1.5 text-red-500 text-xs">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Contact row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">
              Email *
            </label>
            <Input type="email" {...register('email')} className={fieldClass} placeholder="votre@email.com" />
            {errors.email && (
              <p className="mt-1.5 text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">
              Téléphone
            </label>
            <Input type="tel" {...register('phone')} className={fieldClass} placeholder="06 12 34 56 78" />
            {errors.phone && (
              <p className="mt-1.5 text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">
            Votre message *
          </label>
          <Textarea
            {...register('question')}
            rows={5}
            className={`${fieldClass} resize-none`}
            placeholder="Décrivez votre objectif, votre question ou votre besoin…"
          />
          {errors.question && (
            <p className="mt-1.5 text-red-500 text-xs">{errors.question.message}</p>
          )}
        </div>

        {/* Status alerts */}
        {submitStatus === 'success' && (
          <Alert className="border-[#52ad77]/30 bg-[#52ad77]/10">
            <CheckCircle className="h-4 w-4 text-[#52ad77]" />
            <AlertDescription className="text-[#52ad77]">
              Message envoyé ! Nous vous répondrons dans les plus brefs délais.
            </AlertDescription>
          </Alert>
        )}
        {submitStatus === 'error' && (
          <Alert className="border-red-300 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-[#1d1d1b] text-white px-10 py-4 font-semibold text-base rounded-[var(--radius-md)] hover:bg-[#1d1d1b]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi en cours…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Envoyer le message
            </>
          )}
        </button>

        <p className="text-black/30 text-xs">* Champs obligatoires</p>
      </form>
    </div>
  );
}

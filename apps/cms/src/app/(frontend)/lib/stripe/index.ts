import Stripe from 'stripe';

export const stripeBuilder = (slug: string) => {
  let apiKey = process.env.STRIPE_SECRET_KEY;

  const stripe = new Stripe(apiKey!, {
    apiVersion: '2026-04-22.dahlia',
  });
  return stripe;
};

export const stripe = stripeBuilder('');

interface CreateCheckoutSessionParams {
  centerSlug?: string;
  itemName: string;
  itemDescription?: string;
  amountCents: number;
  currency?: string;
  bookingId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}

export const createCheckoutSession = async ({
  centerSlug,
  itemName,
  itemDescription,
  amountCents,
  currency = 'eur',
  bookingId,
  userId,
  successUrl,
  cancelUrl,
}: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session> => {
  const stripeClient = stripeBuilder(centerSlug || '');

  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      client_reference_id: bookingId,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: itemName,
              description:
                itemDescription ||
                `Reservation de service chez fitbepad: ${itemName}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_intent_data: {
        metadata: {
          bookingId,
          userId,
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookingId,
        userId,
      },
    });
    return session;
  } catch (error) {
    console.error('Stripe Checkout Session creation failed:', error);
    // Re-throw the error to be handled by the calling API route
    // Or handle it more specifically if needed (e.g., return a custom error object/type)
    throw error;
  }
};

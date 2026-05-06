'use client';

import { useState } from 'react';
import { Button } from '@frontend/components/ui/button';
import { Input } from '@frontend/components/ui/input';
import { Card, CardContent } from '@frontend/components/ui/card';
import { Badge } from '@frontend/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Tag, X } from 'lucide-react';
import { CouponValidationResponse } from 'shared';

interface CouponInputProps {
  treatmentId?: string;
  centerId?: string;
  originalAmount: number;
  onCouponApplied: (coupon: {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    discountAmountCents: number;
  }) => void;
  onCouponRemoved: () => void;
  initialCode?: string;
}

export function CouponInput({
  treatmentId,
  centerId,
  originalAmount,
  onCouponApplied,
  onCouponRemoved,
  initialCode = '',
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResponse | null>(null);

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          treatmentId,
          centerId,
          amountCents: originalAmount,
        }),
      });

      const data = await response.json();

      if (response.ok && data.isValid) {
        setAppliedCoupon(data);
        onCouponApplied({
          id: data.coupon.id,
          code: data.coupon.code,
          discountType: data.coupon.discountType,
          discountValue: data.coupon.discountValue,
          discountAmountCents: data.discountAmountCents,
        });
        setCouponCode('');
        setError(null);
      } else {
        setError(data.error || 'Code de coupon invalide');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setError('Erreur lors de la validation du coupon');
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    onCouponRemoved();
    setCouponCode('');
    setError(null);
  };

  const formatCurrency = (cents: number) => {
    return (cents / 100).toFixed(2) + '€';
  };


  // If coupon is applied, show applied coupon info
  if (appliedCoupon) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="flex items-center gap-2">
                  <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">
                    {appliedCoupon.coupon?.code}
                  </code>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    -{formatCurrency(appliedCoupon.discountAmountCents || 0)}
                  </Badge>
                </div>
                {appliedCoupon.coupon?.description && (
                  <p className="text-sm text-green-700 mt-1">
                    {appliedCoupon.coupon.description}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeCoupon}
              className="text-green-700 hover:bg-green-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Code de réduction</span>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Entrez votre code de réduction"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    validateCoupon();
                  }
                }}
                disabled={loading}
              />
            </div>
            <Button
              onClick={validateCoupon}
              disabled={!couponCode.trim() || loading}
              variant="outline"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Appliquer'
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <XCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Saisissez un code de réduction valide pour bénéficier d&apos;une remise sur votre réservation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Export as default as well for compatibility
export default CouponInput;
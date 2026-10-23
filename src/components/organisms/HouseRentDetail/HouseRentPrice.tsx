
interface Props {
  price: string | number;
  discountedPrice: string | number | null;
}

const formatPrice = (value: string | number) =>
  new Intl.NumberFormat("fa-IR").format(Number(value));

export default function HouseRentPrice({
  price,
  discountedPrice,
}: Props) {
  const originalPrice = Number(price);
  const discountPrice =
    discountedPrice !== null ? Number(discountedPrice) : null;

  const hasDiscount =
    discountPrice !== null &&
    Number.isFinite(discountPrice) &&
    discountPrice > 0 &&
    discountPrice < originalPrice;

  return (
    <div dir="rtl" className="space-y-2">
      <h3 className="text-sm font-semibold text-neutral-800">
        قیمت هر شب
      </h3>

      {hasDiscount && (
        <p className="text-sm text-neutral-400 line-through">
          {formatPrice(originalPrice)} تومان
        </p>
      )}

      <p className="text-lg font-bold text-neutral-900">
        {formatPrice(hasDiscount ? discountPrice! : originalPrice)} تومان
      </p>
    </div>
  );
}

import React from "react";

export const serializedCarsData = (car, wishlisted = false) => {
  return {
    ...car,
    price: car.price ? parseFloat(car.price.toString()) : 0,
    createdAt: car.createdAt?.toISOString(),
    updatedAt: car.updatedAt?.toISOString(),
    wishliseted: wishlisted,
  };
};

export const formatSaudiRiyalReact = (amount) => {
  const value = Number(amount) || 0;

  // You can switch to "ar-SA" if you want Arabic digits
  const formattedNumber = new Intl.NumberFormat("en-EN").format(value);

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      {/* Number first */}
      <span>{formattedNumber}</span>

      {/* Icon after */}
      <span className="icon-saudi_riyal" aria-hidden="true">
        &#xea;
      </span>
    </span>
  );
};

export const formatSaudiRiyalText = (amount) => {
  const value = Number(amount) || 0;
  const formattedNumber = new Intl.NumberFormat("en-EN").format(value);
  return `${formattedNumber} ريال سعودي`;
};

import React from "react";

export const serializedCarsData = (car, wishlisted = false) => {
  if (!car) return null;
  return {
    ...car,
    price: car.price ? parseFloat(car.price.toString()) : 0,
    createdAt: car.createdAt?.toISOString ? car.createdAt.toISOString() : car.createdAt,
    updatedAt: car.updatedAt?.toISOString ? car.updatedAt.toISOString() : car.updatedAt,
    wishliseted: wishlisted,
  };
};

export const serializeLoanRequest = (request) => {
  if (!request) return null;
  return {
    ...request,
    loanAmount: request.loanAmount ? parseFloat(request.loanAmount.toString()) : 0,
    downPayment: request.downPayment ? parseFloat(request.downPayment.toString()) : 0,
    monthlyPayment: request.monthlyPayment ? parseFloat(request.monthlyPayment.toString()) : null,
    interestRate: request.interestRate ? parseFloat(request.interestRate.toString()) : null,
    finalPayment: request.finalPayment ? parseFloat(request.finalPayment.toString()) : null,
    netSalary: request.netSalary ? parseFloat(request.netSalary.toString()) : null,
    totalMonthlyObligations: request.totalMonthlyObligations ? parseFloat(request.totalMonthlyObligations.toString()) : null,
    createdAt: request.createdAt?.toISOString ? request.createdAt.toISOString() : request.createdAt,
    updatedAt: request.updatedAt?.toISOString ? request.updatedAt.toISOString() : request.updatedAt,
    car: request.car ? serializedCarsData(request.car) : null,
    salaryTransferBank: request.salaryTransferBank ? {
      ...request.salaryTransferBank,
      interestRate: request.salaryTransferBank.interestRate ? parseFloat(request.salaryTransferBank.interestRate.toString()) : 0,
      createdAt: request.salaryTransferBank.createdAt?.toISOString ? request.salaryTransferBank.createdAt.toISOString() : request.salaryTransferBank.createdAt,
      updatedAt: request.salaryTransferBank.updatedAt?.toISOString ? request.salaryTransferBank.updatedAt.toISOString() : request.salaryTransferBank.updatedAt,
    } : null,
  };
};

export const serializeLoanRequests = (requests) => {
  if (!requests) return [];
  return requests.map(serializeLoanRequest);
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

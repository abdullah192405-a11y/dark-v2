import { NextResponse } from 'next/server';

/**
 * API endpoint for analyzing and comparing loan offers
 * POST /api/analyze-offers
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with analysis results
 */
export async function POST(request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { offers, userData } = body;

    // Validate input data
    const validationError = validateInput(offers, userData);
    if (validationError) {
      return NextResponse.json({
        success: false,
        error: validationError.message,
        code: validationError.code
      }, { status: validationError.status });
    }

    // Perform comprehensive analysis
    const analysis = await performOfferAnalysis(offers, userData);

    return NextResponse.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in analyze-offers API:', error);

    // Return appropriate error response
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ داخلي في الخادم',
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

/**
 * Validates the input data for the analysis request
 * @param {Array} offers - Array of loan offers to analyze
 * @param {Object} userData - User financial data
 * @returns {Object|null} Validation error object or null if valid
 */
function validateInput(offers, userData) {
  // Validate offers array
  if (!offers || !Array.isArray(offers)) {
    return {
      message: 'يجب تقديم قائمة بالعروض للتحليل',
      code: 'INVALID_OFFERS_FORMAT',
      status: 400
    };
  }

  if (offers.length < 2) {
    return {
      message: 'يجب تقديم عرضين على الأقل للمقارنة',
      code: 'INSUFFICIENT_OFFERS',
      status: 400
    };
  }

  // Validate user data
  if (!userData || typeof userData !== 'object') {
    return {
      message: 'بيانات المستخدم مطلوبة',
      code: 'MISSING_USER_DATA',
      status: 400
    };
  }

  // Validate required user data fields
  const requiredFields = ['netSalary', 'totalMonthlyObligations', 'carPrice'];
  for (const field of requiredFields) {
    if (userData[field] === undefined || userData[field] === null) {
      return {
        message: `الحقل ${field} مطلوب في بيانات المستخدم`,
        code: 'MISSING_REQUIRED_FIELD',
        status: 400
      };
    }
  }

  return null; // Valid input
}

/**
 * Performs comprehensive analysis of loan offers
 * @param {Array} offers - Array of loan offers
 * @param {Object} userData - User financial data
 * @returns {Object} Analysis results
 */
async function performOfferAnalysis(offers, userData) {
  // Constants for analysis
  const DEBT_TO_INCOME_RATIO_THRESHOLD = 35; // Standard DTI ratio
  const RISK_LEVELS = {
    LOW: 'منخفض',
    MEDIUM: 'متوسط',
    HIGH: 'عالي'
  };

  // Extract user financial data
  const {
    netSalary = 0,
    totalMonthlyObligations = 0,
    employerSector,
    hasRealEstateFinance,
    hasCreditDefault,
    carPrice
  } = userData;

  // Calculate available income for loan payments
  const availableIncome = parseFloat(netSalary) - parseFloat(totalMonthlyObligations);

  // Perform risk assessment
  const riskAssessment = assessFinancialRisk({
    employerSector,
    hasRealEstateFinance,
    hasCreditDefault,
    netSalary: parseFloat(netSalary),
    availableIncome
  });

  // Analyze each offer
  const analyzedOffers = offers.map((offer, index) => {
    const analyzed = analyzeIndividualOffer(offer, index, availableIncome, carPrice, DEBT_TO_INCOME_RATIO_THRESHOLD);
    // Add title if not present
    if (!analyzed.title) {
      analyzed.title = `${formatCurrency(analyzed.downPayment)} دفعة أولى، ${formatCurrency(analyzed.monthlyPayment)} قسط شهري`;
    }
    return analyzed;
  });

  // Generate recommendations
  const recommendations = generateRecommendations(analyzedOffers, riskAssessment, userData);

  // Structure the comprehensive analysis
  return {
    userProfile: {
      netSalary: parseFloat(netSalary),
      totalMonthlyObligations: parseFloat(totalMonthlyObligations),
      availableIncome: Math.max(0, availableIncome),
      riskLevel: riskAssessment.level,
      riskFactors: riskAssessment.factors
    },
    offers: analyzedOffers,
    recommendations,
    summary: {
      totalOffersAnalyzed: offers.length,
      affordableOffers: analyzedOffers.filter(o => o.isAffordable).map(o => ({
        id: o.id,
        title: o.title,
        downPayment: o.downPayment,
        monthlyPayment: o.monthlyPayment
      })),
      affordableOffersCount: analyzedOffers.filter(o => o.isAffordable).length,
      lowestMonthlyPayment: Math.min(...analyzedOffers.map(o => o.monthlyPayment)),
      lowestTotalCost: Math.min(...analyzedOffers.map(o => o.totalCost)),
      highestLastPaymentOffer: findHighestLastPaymentOffer(analyzedOffers)
    }
  };
}

/**
 * Assesses financial risk based on user data
 * @param {Object} userData - User financial information
 * @returns {Object} Risk assessment results
 */
function assessFinancialRisk(userData) {
  const { employerSector, hasRealEstateFinance, hasCreditDefault, netSalary, availableIncome } = userData;
  let riskScore = 0;
  const riskFactors = [];
  const positiveFactors = [];

  // Income-based risk assessment (highest priority)
  if (netSalary === 0) {
    riskScore += 3; // Very high risk
    riskFactors.push('لا يوجد دخل صافي');
  } else if (netSalary < 3000) {
    riskScore += 2;
    riskFactors.push('دخل صافي منخفض');
  } else if (netSalary < 5000) {
    riskScore += 1;
    riskFactors.push('دخل صافي متوسط');
  } else {
    positiveFactors.push('دخل صافي جيد');
  }

  // Available income assessment
  if (availableIncome < 0) {
    riskScore += 3; // Very high risk
    riskFactors.push('الالتزامات الشهرية تفوق الدخل');
  } else if (availableIncome < 1000) {
    riskScore += 2;
    riskFactors.push('دخل متاح محدود');
  } else if (availableIncome < 2000) {
    riskScore += 1;
    riskFactors.push('دخل متاح متوسط');
  } else {
    positiveFactors.push('دخل متاح جيد');
  }

  // Credit default is highest risk factor
  if (hasCreditDefault === 'yes') {
    riskScore += 2;
    riskFactors.push('سجل ائتماني يحتاج تحسين');
  } else {
    positiveFactors.push('سجل ائتماني جيد');
  }

  // Real estate finance increases risk slightly
  if (hasRealEstateFinance === 'yes') {
    riskScore += 1;
    riskFactors.push('التزامات تمويل عقاري');
  }

  // Government employment is positive
  if (employerSector === 'حكومي مدني' || employerSector === 'حكومي عسكرى') {
    positiveFactors.push('توظيف حكومي مستقر');
  } else if (employerSector === 'خاص') {
    riskScore += 0.5;
    riskFactors.push('قطاع خاص');
  }

  // Determine risk level based on total score
  let riskLevel;
  if (riskScore >= 4) riskLevel = 'عالي';
  else if (riskScore >= 2) riskLevel = 'متوسط';
  else riskLevel = 'منخفض';

  return {
    level: riskLevel,
    score: riskScore,
    factors: riskFactors,
    positiveFactors: positiveFactors
  };
}

/**
 * Analyzes an individual loan offer
 * @param {Object} offer - Loan offer data
 * @param {number} index - Offer index
 * @param {number} availableIncome - User's available income
 * @param {number} carPrice - Car price
 * @param {number} dtiThreshold - Debt-to-income threshold
 * @returns {Object} Analyzed offer data
 */
function analyzeIndividualOffer(offer, index, availableIncome, carPrice, dtiThreshold) {
  const monthlyPayment = parseFloat(offer.monthlyPayment);
  const downPayment = parseFloat(offer.downPayment);
  const termMonths = parseInt(offer.termMonths);
  const interestRate = parseFloat(offer.interestRate);

  // Calculate financial metrics
  const paymentToIncomeRatio = availableIncome > 0 ? (monthlyPayment / availableIncome) * 100 : 100;
  const isAffordable = paymentToIncomeRatio <= dtiThreshold;

  // Calculate total cost
  const totalPayments = monthlyPayment * termMonths;
  const loanAmount = parseFloat(carPrice) - downPayment;
  const interestPaid = totalPayments - loanAmount;
  const totalCost = downPayment + totalPayments;

  return {
    id: offer.id || index + 1,
    monthlyPayment,
    downPayment,
    termMonths,
    interestRate,
    termYears: Math.floor(termMonths / 12),
    paymentToIncomeRatio: parseFloat(paymentToIncomeRatio.toFixed(1)),
    isAffordable,
    totalPayments,
    interestPaid,
    totalCost,
    loanAmount
  };
}

/**
 * Generates deep, intelligent recommendations based on comprehensive analysis
 * @param {Array} analyzedOffers - Array of analyzed offers
 * @param {Object} riskAssessment - Risk assessment results
 * @param {Object} userData - Original user data for context
 * @returns {Object} Comprehensive recommendations object
 */
function generateRecommendations(analyzedOffers, riskAssessment, userData) {
  const affordableOffers = analyzedOffers.filter(offer => offer.isAffordable);
  const allOffers = analyzedOffers;

  const recommendations = {
    primary: [],
    warnings: [],
    suggestions: [],
    strategic: [],
    financial: []
  };

  // Deep analysis of offers
  const analysis = performDeepOfferAnalysis(analyzedOffers, userData, riskAssessment);

  // Primary recommendations based on user profile and risk
  if (affordableOffers.length > 0) {
    const bestOverall = analysis.bestOverallOffer;
    const bestValue = analysis.bestValueOffer;
    const bestCashFlow = analysis.bestCashFlowOffer;

    recommendations.primary.push(
      `العرض الأمثل لملفك المالي: العرض ${bestOverall.id} - يوازن بين التكلفة والقابلية للتحمل`
    );

    if (bestValue.id !== bestOverall.id) {
      recommendations.primary.push(
        `أفضل قيمة طويلة الأمد: العرض ${bestValue.id} (${formatCurrency(bestValue.totalCost)} إجمالي)`
      );
    }

    if (bestCashFlow.id !== bestOverall.id) {
      recommendations.primary.push(
        `أقل ضغط شهري: العرض ${bestCashFlow.id} (${formatCurrency(bestCashFlow.monthlyPayment)} شهرياً)`
      );
    }
  } else {
    recommendations.primary.push(
      'لا توجد عروض مناسبة تماماً لدخلك الحالي. إليك الحلول المقترحة:'
    );

    // Suggest alternatives for high-risk profiles
    if (riskAssessment.level === 'عالي') {
      recommendations.strategic.push(
        'زيادة الدفعة الأولى إلى 30-40% لتقليل المخاطر وتحسين فرص القبول'
      );
      recommendations.strategic.push(
        'البحث عن ضامن إضافي أو دخل إضافي لتحسين الملف المالي'
      );
    } else {
      recommendations.strategic.push(
        'تمديد فترة السداد إلى 7 سنوات لتقليل الأقساط الشهرية'
      );
      recommendations.strategic.push(
        'البحث عن عروض مصرفية متخصصة للدخل المتوسط'
      );
    }
  }

  // Strategic recommendations based on risk level
  if (riskAssessment.level === 'منخفض') {
    recommendations.strategic.push(
      'ملفك المالي قوي - يمكنك التفاوض للحصول على شروط أفضل أو فترات سداد أطول'
    );
    recommendations.strategic.push(
      'فكر في الاستفادة من برامج الولاء المصرفي للحصول على مزايا إضافية'
    );
  } else if (riskAssessment.level === 'متوسط') {
    recommendations.strategic.push(
      'ركز على تحسين الدخل المتاح من خلال تقليل الالتزامات الأخرى'
    );
    recommendations.strategic.push(
      'قارن العروض بعناية مع التركيز على التكلفة الإجمالية'
    );
  } else {
    recommendations.warnings.push(
      'ملفك المالي يحتاج تحسين - ركز على سداد الالتزامات المعلقة قبل التقديم'
    );
    recommendations.strategic.push(
      'ابدأ ببناء تاريخ ائتماني إيجابي من خلال بطاقات الائتمان أو القروض الصغيرة'
    );
  }

  // Financial impact analysis
  const financialAnalysis = analyzeFinancialImpact(analyzedOffers, userData);
  recommendations.financial = financialAnalysis;

  // Personalized suggestions based on user data
  if (userData.employerSector === 'حكومي مدني' || userData.employerSector === 'حكومي عسكرى') {
    recommendations.suggestions.push(
      'كموظف حكومي، يمكنك الاستفادة من برامج التمويل الحكومية الميسرة'
    );
  }

  if (userData.hasRealEstateFinance === 'yes') {
    recommendations.suggestions.push(
      'تأكد من أن إجمالي الالتزامات لا يتجاوز 70% من دخلك الإجمالي'
    );
  }

  // Market insights and timing
  recommendations.suggestions.push(
    'الوقت الحالي مناسب للتقديم مع أسعار الفائدة المستقرة'
  );

  recommendations.suggestions.push(
    'قارن العروض من 3-4 بنوك مختلفة للحصول على أفضل شروط'
  );

  return recommendations;
}

/**
 * Performs deep analysis of offers considering multiple factors
 * @param {Array} offers - Analyzed offers
 * @param {Object} userData - User financial data
 * @param {Object} riskAssessment - Risk assessment
 * @returns {Object} Deep analysis results
 */
function performDeepOfferAnalysis(offers, userData, riskAssessment) {
  const netSalary = parseFloat(userData.netSalary);
  const availableIncome = netSalary - parseFloat(userData.totalMonthlyObligations);

  // Score offers based on multiple criteria
  const scoredOffers = offers.map(offer => {
    let score = 0;
    const reasons = [];

    // Affordability score (40% weight)
    const dtiRatio = offer.paymentToIncomeRatio;
    if (dtiRatio <= 25) {
      score += 40;
      reasons.push('قابلية تحمل ممتازة');
    } else if (dtiRatio <= 35) {
      score += 30;
      reasons.push('قابلية تحمل جيدة');
    } else if (dtiRatio <= 45) {
      score += 20;
      reasons.push('قابلية تحمل متوسطة');
    } else {
      score += 10;
      reasons.push('قابلية تحمل محدودة');
    }

    // Total cost efficiency (30% weight)
    const avgTotalCost = offers.reduce((sum, o) => sum + o.totalCost, 0) / offers.length;
    const costEfficiency = (avgTotalCost - offer.totalCost) / avgTotalCost;
    score += Math.max(0, costEfficiency * 30);
    if (costEfficiency > 0.1) reasons.push('تكلفة إجمالية منخفضة');

    // Risk-adjusted scoring (20% weight)
    if (riskAssessment.level === 'منخفض') {
      // For low risk, favor lower total cost
      score += (30 - (offer.termYears * 2));
    } else if (riskAssessment.level === 'عالي') {
      // For high risk, favor lower monthly payments
      score += Math.min(20, (availableIncome - offer.monthlyPayment) / availableIncome * 20);
      reasons.push('مناسب للمخاطر العالية');
    } else {
      // Medium risk - balanced approach
      score += 15;
    }

    // Down payment consideration (10% weight)
    const downPaymentRatio = offer.downPayment / parseFloat(userData.carPrice);
    if (downPaymentRatio >= 0.2) {
      score += 10;
      reasons.push('دفعة أولى مناسبة');
    } else if (downPaymentRatio >= 0.1) {
      score += 5;
    }

    return {
      ...offer,
      overallScore: score,
      scoringReasons: reasons
    };
  });

  // Find best offers for different criteria
  const bestOverall = scoredOffers.reduce((best, current) =>
    current.overallScore > best.overallScore ? current : best
  );

  const bestValue = scoredOffers.reduce((best, current) =>
    current.totalCost < best.totalCost ? current : best
  );

  const bestCashFlow = scoredOffers.reduce((best, current) =>
    current.monthlyPayment < best.monthlyPayment ? current : best
  );

  return {
    bestOverallOffer: bestOverall,
    bestValueOffer: bestValue,
    bestCashFlowOffer: bestCashFlow,
    scoredOffers: scoredOffers
  };
}

/**
 * Analyzes long-term financial impact of loan choices
 * @param {Array} offers - Analyzed offers
 * @param {Object} userData - User data
 * @returns {Array} Financial impact insights
 */
function analyzeFinancialImpact(offers, userData) {
  const insights = [];
  const netSalary = parseFloat(userData.netSalary);
  const carPrice = parseFloat(userData.carPrice);

  // Calculate opportunity cost
  const avgOffer = offers.reduce((sum, offer) => ({
    monthlyPayment: sum.monthlyPayment + offer.monthlyPayment,
    totalCost: sum.totalCost + offer.totalCost
  }), { monthlyPayment: 0, totalCost: 0 });

  avgOffer.monthlyPayment /= offers.length;
  avgOffer.totalCost /= offers.length;

  const totalInterest = avgOffer.totalCost - carPrice;
  const opportunityCost = totalInterest * 0.05; // Assuming 5% annual return if invested

  insights.push(
    `التكلفة الإجمالية المتوقعة: ${formatCurrency(avgOffer.totalCost)} (فائدة: ${formatCurrency(totalInterest)})`
  );

  insights.push(
    `تكلفة الفرصة البديلة: ${formatCurrency(opportunityCost)} لو استثمرت الفائدة`
  );

  // Savings potential
  const bestOffer = offers.reduce((best, current) =>
    current.totalCost < best.totalCost ? current : best
  );

  const potentialSavings = avgOffer.totalCost - bestOffer.totalCost;
  if (potentialSavings > 0) {
    insights.push(
      `توفير محتمل: ${formatCurrency(potentialSavings)} بالاختيار الأمثل`
    );
  }

  return insights;
}

/**
 * Finds the offer with the highest last payment (monthly payment)
 * @param {Array} analyzedOffers - Array of analyzed offers
 * @returns {Object} Offer with highest last payment
 */
function findHighestLastPaymentOffer(analyzedOffers) {
  if (!analyzedOffers || analyzedOffers.length === 0) return null;

  const highestOffer = analyzedOffers.reduce((highest, current) =>
    current.monthlyPayment > highest.monthlyPayment ? current : highest
  );

  return {
    id: highestOffer.id,
    title: highestOffer.title,
    monthlyPayment: highestOffer.monthlyPayment,
    downPayment: highestOffer.downPayment,
    totalCost: highestOffer.totalCost
  };
}

/**
 * Formats currency values in Saudi Riyals
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  if (!amount || isNaN(amount)) return 'غير محدد';

  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

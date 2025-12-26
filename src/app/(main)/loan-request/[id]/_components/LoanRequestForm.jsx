"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatSaudiRiyalReact } from "@/lib/helper";
import { Currency, User, Mail, Phone, MessageSquare, Calendar, ChevronLeft, ChevronRight, Upload, CheckCircle, Car, File, Key, Lock, Banknote, TrendingUp, AlertTriangle, Shield, Target, Award, BarChart3, DollarSign, Percent, Clock, Star } from "lucide-react";

const LoanRequestForm = ({ car }) => {
  // Car dropdown options from database
  const [carMakes, setCarMakes] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carCategories, setCarCategories] = useState([]);
  const [carYears, setCarYears] = useState([]);
  const [loadingCarData, setLoadingCarData] = useState(true);

  const initialFormData = {
    idNumber: "",
    idImage: null,
    carMake: car.make,
    carModel: car.model,
    carCategory: car.category || "",
    carYear: car.year.toString(),
    mobileNumber: "",
    birthMonth: "",
    birthYear: "",
    gender: "",
    loanAmount: car.price.toString(),
    downPayment: (car.price * 0.2).toString(), // 20% of car price
    loanTerm: "5", // 5 years
    monthlyIncome: "",
    employmentStatus: "",
    additionalInfo: "",
    employerSector: "",
    employer: "",
    salaryTransferBank: "",
    netSalary: "",
    hasRealEstateFinance: "",
    hasCreditDefault: "",
    totalMonthlyObligations: "",
    fullName: "",
    email: "",
    city: "",
    time: "",
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedDetails, setSelectedDetails] = useState(['make', 'model', 'category', 'year']);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [comparisonAnalysis, setComparisonAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);




  const selectOfferAndProceed = (offer) => {
    setFormData(prev => ({
      ...prev,
      downPayment: offer.downPayment.toString(),
      loanTerm: Math.floor(offer.termMonths / 12).toString(),
    }));
    nextStep();
  };

  const addToComparison = (offer) => {
    if (selectedOffers.find(o => o.id === offer.id)) {
      toast.error("هذا العرض موجود بالفعل في المقارنة");
      return;
    }
    setSelectedOffers([...selectedOffers, offer]);
    toast.success("تم إضافة العرض للمقارنة");
  };

  const removeFromComparison = (offerId) => {
    setSelectedOffers(selectedOffers.filter(o => o.id !== offerId));
  };

  const analyzeOffers = async () => {
    if (selectedOffers.length < 2) {
      toast.error("يجب اختيار عرضين على الأقل للمقارنة");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offers: selectedOffers,
          userData: {
            netSalary: formData.netSalary,
            totalMonthlyObligations: formData.totalMonthlyObligations,
            employerSector: formData.employerSector,
            hasRealEstateFinance: formData.hasRealEstateFinance,
            hasCreditDefault: formData.hasCreditDefault,
            carPrice: car.price,
          }
        }),
      });

      const result = await response.json();
      if (result.success) {
        setComparisonAnalysis(result.data);
      } else {
        toast.error("حدث خطأ في تحليل العروض");
      }
    } catch (error) {
      console.error('Error analyzing offers:', error);
      toast.error("حدث خطأ في تحليل العروض");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const steps = [
    { title: "معلومات السيارة ", icon: Car },
    { title: "تفاصيل السيارة والهوية", icon: File },
    { title: "البيانات الشخصية", icon: User },
    { title: "البيانات الإئتمانية", icon: Lock },
    { title: "العروض التمويلية", icon: Banknote },
    { title: "معلومات إضافية", icon: MessageSquare },
  ];

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch('/api/bank');
        const result = await response.json();
        if (result.success) {
          setBanks(result.data);
        }
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };
    fetchBanks();
  }, []);

  // Fetch car data from database
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoadingCarData(true);

        // Fetch makes
        const makesResponse = await fetch('/api/car-makes');
        const makesData = await makesResponse.json();
        setCarMakes(makesData.makes || []);

        // Fetch categories (assuming we have this endpoint)
        // For now, keep the static categories
        setCarCategories([
          "سيدان", "SUV", "هاتشباك", "كوبيه", "كروس أوفر", "بيك أب", "فان", "كونفرتيبل", "أخرى"
        ]);

        // Fetch years
        const yearsResponse = await fetch('/api/car-years');
        const yearsData = await yearsResponse.json();
        setCarYears(yearsData.years || []);

      } catch (error) {
        console.error('Error fetching car data:', error);
      } finally {
        setLoadingCarData(false);
      }
    };

    fetchCarData();
  }, []);



  // Fetch years when make or model changes
  useEffect(() => {
    const fetchYears = async () => {
      try {
        let url = '/api/car-years';
        const params = [];
        if (formData.carMake) {
          params.push(`make=${encodeURIComponent(formData.carMake)}`);
        }
        if (formData.carModel) {
          params.push(`model=${encodeURIComponent(formData.carModel)}`);
        }
        if (params.length > 0) {
          url += '?' + params.join('&');
        }
        const response = await fetch(url);
        const data = await response.json();
        setCarYears(data.years || []);
      } catch (error) {
        console.error('Error fetching car years:', error);
        setCarYears([]);
      }
    };

    fetchYears();
  }, [formData.carMake, formData.carModel]);

  // Fetch models when make changes
  useEffect(() => {
    const fetchModels = async () => {
      if (formData.carMake) {
        try {
          const response = await fetch(`/api/car-models?make=${encodeURIComponent(formData.carMake)}`);
          const data = await response.json();
          setCarModels(data.models || []);
        } catch (error) {
          console.error('Error fetching car models:', error);
          setCarModels([]);
        }
      } else {
        setCarModels([]);
      }
    };

    fetchModels();
  }, [formData.carMake]);

  // Fetch categories when make, model, and year are all selected
  useEffect(() => {
    const fetchCategories = async () => {
      if (formData.carMake && formData.carModel && formData.carYear) {
        try {
          const response = await fetch(`/api/car-categories?make=${encodeURIComponent(formData.carMake)}&model=${encodeURIComponent(formData.carModel)}&year=${encodeURIComponent(formData.carYear)}`);
          const data = await response.json();
          setCarCategories(data.categories || []);
        } catch (error) {
          console.error('Error fetching car categories:', error);
          setCarCategories([]);
        }
      } else {
        setCarCategories([]);
      }
    };

    fetchCategories();
  }, [formData.carMake, formData.carModel, formData.carYear]);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'carMake') {
        newData.carModel = '';
        newData.carYear = '';
        newData.carCategory = '';
      } else if (field === 'carModel') {
        newData.carYear = '';
        newData.carCategory = '';
      } else if (field === 'carYear') {
        newData.carCategory = '';
      }
      return newData;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          idImage: reader.result // base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetailSelection = (detail) => {
    setSelectedDetails(prev =>
      prev.includes(detail)
        ? prev.filter(d => d !== detail)
        : [...prev, detail]
    );
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.idNumber || formData.idNumber.length !== 10 || !/^\d{10}$/.test(formData.idNumber)) {
          toast.error("يرجى ملء جميع الحقول المطلوبة: رقم الهوية الوطنية السعودية (10 أرقام)");
          return false;
        }
        break;
      case 1:
        // Car details are pre-filled and disabled, no validation needed
        break;
      case 2:
        if (!formData.mobileNumber || !formData.birthMonth || !formData.birthYear || !formData.gender) {
          toast.error("يرجى ملء جميع الحقول المطلوبة: رقم الجوال، تاريخ الميلاد، والنوع");
          return false;
        }
        break;
      case 3:
        // Credit data fields are optional, no validation needed
        break;
      case 4:
        // Financing offers step, validation handled separately
        break;
      case 5:
        if (!formData.fullName || !formData.email || !formData.city || !formData.time) {
          toast.error("يرجى ملء جميع الحقول المطلوبة: الاسم الكامل، البريد الإلكتروني، المدينة، والوقت المفضل");
          return false;
        }
        break;
      case 6:
        // Review step, no additional validation needed
        break;
      default:
        return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      if (currentStep === 4) {
        // Clear selected offers and comparison analysis when going back from financing offers step
        setSelectedOffers([]);
        setComparisonAnalysis(null);
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/loan-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          mobileNumber: "+966" + formData.mobileNumber,
          carId: car.id,
          carDetails: {
            year: car.year,
            make: car.make,
            model: car.model,
            price: car.price,
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowSuccessModal(true);
      } else {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error submitting loan request:', error);
      setShowSuccessModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setFormData(initialFormData);
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              معلومات السيارة
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="carMake" className="mb-2">ماركة السيارة *</Label>
                <Select value={formData.carMake} onValueChange={(value) => handleInputChange('carMake', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر ماركة السيارة" />
                  </SelectTrigger>
                  <SelectContent>
                    {carMakes.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="carModel" className="mb-2">موديل السيارة *</Label>
                <Select value={formData.carModel} onValueChange={(value) => handleInputChange('carModel', value)} disabled={!formData.carMake}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر موديل السيارة" />
                  </SelectTrigger>
                  <SelectContent>
                    {carModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="carYear" className="mb-2">سنة صنع السيارة *</Label>
                <Select value={formData.carYear} onValueChange={(value) => handleInputChange('carYear', value)} disabled={!formData.carModel || (formData.carMake === "كيا" && formData.carModel === "k5 أستندر")}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر سنة صنع السيارة" />
                  </SelectTrigger>
                  <SelectContent>
                    {carYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="carCategory" className="mb-2">فئة السيارة</Label>
                <Select value={formData.carCategory} onValueChange={(value) => handleInputChange('carCategory', value)} disabled={!formData.carYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر فئة السيارة" />
                  </SelectTrigger>
                  <SelectContent>
                    {carCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              معلومات السيارة
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="mb-2">اختر التفاصيل المراد عرضها:</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDetails.includes('make')}
                      onChange={() => handleDetailSelection('make')}
                      className="ml-2"
                    />
                    ماركة السيارة
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDetails.includes('model')}
                      onChange={() => handleDetailSelection('model')}
                      className="ml-2"
                    />
                    موديل السيارة
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDetails.includes('category')}
                      onChange={() => handleDetailSelection('category')}
                      className="ml-2"
                    />
                    فئة السيارة
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDetails.includes('year')}
                      onChange={() => handleDetailSelection('year')}
                      className="ml-2"
                    />
                    سنة صنع السيارة
                  </label>
                </div>
              </div>

              {selectedDetails.includes('make') && (
                <div>
                  <Label htmlFor="carMake" className="mb-2">ماركة السيارة *</Label>
                  <Input
                    id="carMake"
                    type="text"
                    value={formData.carMake}
                    onChange={(e) => handleInputChange('carMake', e.target.value)}
                    placeholder="أدخل ماركة السيارة"
                  />
                </div>
              )}

              {selectedDetails.includes('model') && (
                <div>
                  <Label htmlFor="carModel" className="mb-2">موديل السيارة *</Label>
                  <Input
                    id="carModel"
                    type="text"
                    value={formData.carModel}
                    onChange={(e) => handleInputChange('carModel', e.target.value)}
                    placeholder="أدخل موديل السيارة"
                  />
                </div>
              )}

              {selectedDetails.includes('category') && (
                <div>
                  <Label htmlFor="carCategory" className="mb-2">فئة السيارة</Label>
                  <Input
                    id="carCategory"
                    type="text"
                    value={formData.carCategory}
                    onChange={(e) => handleInputChange('carCategory', e.target.value)}
                    placeholder="أدخل فئة السيارة"
                  />
                </div>
              )}

              {selectedDetails.includes('year') && (
                <div>
                  <Label htmlFor="carYear" className="mb-2">سنة صنع السيارة *</Label>
                  <Input
                    id="carYear"
                    type="number"
                    value={formData.carYear}
                    onChange={(e) => handleInputChange('carYear', e.target.value)}
                    placeholder="أدخل سنة صنع السيارة"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              البيانات الشخصية
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="mobileNumber" className="mb-4">رقم الجوال *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-white pointer-events-none">
                    966+
                  </span>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    required
                    placeholder="5xxxxxxxx"
                    className="pl-12"
                    maxLength="9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="birthMonth" className="mb-4">شهر الميلاد (هجري) *</Label>
                  <Select value={formData.birthMonth} onValueChange={(value) => handleInputChange('birthMonth', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر شهر الميلاد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">محرم</SelectItem>
                      <SelectItem value="2">صفر</SelectItem>
                      <SelectItem value="3">ربيع الأول</SelectItem>
                      <SelectItem value="4">ربيع الآخر</SelectItem>
                      <SelectItem value="5">جمادى الأولى</SelectItem>
                      <SelectItem value="6">جمادى الآخرة</SelectItem>
                      <SelectItem value="7">رجب</SelectItem>
                      <SelectItem value="8">شعبان</SelectItem>
                      <SelectItem value="9">رمضان</SelectItem>
                      <SelectItem value="10">شوال</SelectItem>
                      <SelectItem value="11">ذو القعدة</SelectItem>
                      <SelectItem value="12">ذو الحجة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="birthYear" className="mb-4">سنة الميلاد (هجري) *</Label>
                  <Select value={formData.birthYear} onValueChange={(value) => handleInputChange('birthYear', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر سنة الميلاد" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 100 }, (_, i) => {
                        const hijriYear = 1445 - i; // Current Hijri year is approximately 1445 AH
                        return (
                          <SelectItem key={hijriYear} value={hijriYear.toString()}>
                            {hijriYear} هـ
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-4">النوع *</Label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      required
                      className="ml-2"
                    />
                    ذكر
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      required
                      className="ml-2"
                    />
                    أنثى
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5" />
              البيانات الإئتمانية
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="mb-2">جهة العمل (قطاع صاحب العمل)</Label>
                <Select value={formData.employerSector} onValueChange={(value) => handleInputChange('employerSector', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر جهة العمل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="خاص">خاص</SelectItem>
                    <SelectItem value="حكومي مدني">حكومي مدني</SelectItem>
                    <SelectItem value="حكومي عسكرى">حكومي عسكرى</SelectItem>
                    <SelectItem value="متقاعد">متقاعد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="employer" className="mb-2">ادخل جهة العمل</Label>
                <Input
                  id="employer"
                  type="text"
                  value={formData.employer}
                  onChange={(e) => handleInputChange('employer', e.target.value)}
                  placeholder="ادخل جهة العمل"
                />
              </div>

              <div>
                <Label className="mb-2">جهة تحويل الراتب</Label>
                <Select value={formData.salaryTransferBank} onValueChange={(value) => handleInputChange('salaryTransferBank', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر جهة تحويل الراتب" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id.toString()}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="netSalary" className="mb-2">صافي الراتب</Label>
                <Input
                  id="netSalary"
                  type="number"
                  value={formData.netSalary}
                  onChange={(e) => handleInputChange('netSalary', e.target.value)}
                  placeholder="ادخل صافي الراتب"
                />
              </div>

              <div>
                <Label className="mb-2">هل لديك تمويل عقاري ؟</Label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasRealEstateFinance"
                      value="no"
                      checked={formData.hasRealEstateFinance === "no"}
                      onChange={(e) => handleInputChange('hasRealEstateFinance', e.target.value)}
                      className="ml-2"
                    />
                    لا
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasRealEstateFinance"
                      value="yes"
                      checked={formData.hasRealEstateFinance === "yes"}
                      onChange={(e) => handleInputChange('hasRealEstateFinance', e.target.value)}
                      className="ml-2"
                    />
                    نعم
                  </label>
                </div>
              </div>

              <div>
                <Label className="mb-2">هل لديك تعثر في سمة؟</Label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasCreditDefault"
                      value="no"
                      checked={formData.hasCreditDefault === "no"}
                      onChange={(e) => handleInputChange('hasCreditDefault', e.target.value)}
                      className="ml-2"
                    />
                    لا
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasCreditDefault"
                      value="yes"
                      checked={formData.hasCreditDefault === "yes"}
                      onChange={(e) => handleInputChange('hasCreditDefault', e.target.value)}
                      className="ml-2"
                    />
                    نعم
                  </label>
                </div>
              </div>



              <div>
                <Label htmlFor="totalMonthlyObligations" className="mb-2">إجمالي الإلتزامات الشهرية</Label>
                <Input
                  id="totalMonthlyObligations"
                  type="number"
                  value={formData.totalMonthlyObligations}
                  onChange={(e) => handleInputChange('totalMonthlyObligations', e.target.value)}
                  placeholder="ادخل إجمالي الإلتزامات الشهرية"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        // Generate diverse financing offers and select best for each category
        const generateOffers = () => {
          const carPrice = parseFloat(formData.loanAmount) || 0;
          const offers = [];

          // Get selected bank's interest rate
          const selectedBank = banks.find(b => b.id.toString() === formData.salaryTransferBank);
          const baseInterestRate = selectedBank && selectedBank.interestRate ? parseFloat(selectedBank.interestRate) : 4.5; // Default if no bank selected or interestRate is null

          // Generate offers with varied combinations
          for (let i = 0; i < 30; i++) {
            const downPaymentPercent = (i % 6) * 10; // 0%, 10%, 20%, 30%, 40%, 50%
            const downPayment = (carPrice * downPaymentPercent) / 100;
            const loanAmount = carPrice - downPayment;

            // Vary interest rates around the bank's rate
            const interestRateVariations = [-1.0, -0.5, 0, 0.5, 1.0, 1.5];
            const terms = [12, 24, 36, 48, 60]; // months (1 to 5 years)

            const interestRate = Math.max(1, baseInterestRate + interestRateVariations[i % 6]); // Ensure minimum 1%
            const termMonths = terms[Math.floor(i / 6)];

            let monthlyPayment = 0;
            if (loanAmount > 0 && interestRate > 0 && termMonths > 0) {
              const monthlyRate = interestRate / 100 / 12;
              monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                (Math.pow(1 + monthlyRate, termMonths) - 1);
            }

            const totalPayment = monthlyPayment * termMonths;
            const finalPayment = totalPayment; // Total amount paid over the term

            offers.push({
              id: i + 1,
              title: `${formatSaudiRiyalReact(downPayment.toFixed(0))} دفعة أولى، ${formatSaudiRiyalReact(monthlyPayment.toFixed(0))} قسط شهري`,
              downPayment,
              monthlyPayment,
              termMonths,
              interestRate,
              finalPayment,
              bankName: selectedBank ? selectedBank.name : 'بنك افتراضي'
            });
          }

          return offers;
        };

        const allOffers = generateOffers();

        // Group offers by term
        const offersByTerm = {};
        allOffers.forEach(offer => {
          if (!offersByTerm[offer.termMonths]) offersByTerm[offer.termMonths] = [];
          offersByTerm[offer.termMonths].push(offer);
        });

        // Select 5 offers for each category across all years
        const allOffersFlat = allOffers;

        // Lowest down payment - top 5 across all terms
        const lowestDownOffers = [...allOffersFlat].sort((a, b) => a.downPayment - b.downPayment).slice(0, 5);

        // Lowest monthly payment - top 5 across all terms
        const lowestMonthlyOffers = [...allOffersFlat].sort((a, b) => a.monthlyPayment - b.monthlyPayment).slice(0, 5);

        // Highest final payment - top 5 across all terms
        const highestFinalOffers = [...allOffersFlat].sort((a, b) => b.finalPayment - a.finalPayment).slice(0, 5);

        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              العروض التمويلية
            </h3>

            {/* Category: Lowest Initial Payment */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-yellow-700">أقل دفعة اولى</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lowestDownOffers.map((offer) => (
                  <div key={offer.id} className="border-2 rounded-lg p-4 border-yellow-700 bg-black">
                    <div className="text-center mb-4">
                      <p className="text-lg font-bold text-yellow-800">
                        عرض {formatSaudiRiyalReact(offer.downPayment.toFixed(0))} دفعة اولى و قسط {formatSaudiRiyalReact(offer.monthlyPayment.toFixed(0))}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 mb-4 text-center">
                      <div className="bg-black p-2 rounded">
                        <p className="text-xs text-white">قسط شهري</p>
                        <p className="font-semibold">{formatSaudiRiyalReact(offer.monthlyPayment.toFixed(0))}</p>
                      </div>
                      <div className="bg-black p-2 rounded">
                        <p className="text-xs text-white">مدة القسط</p>
                        <p className="font-semibold">{Math.floor(offer.termMonths / 12)} سنة</p>
                      </div>
                      <div className="bg-black p-2 rounded">
                        <p className="text-xs text-white">الدفعة الاولى</p>
                        <p className="font-semibold">{formatSaudiRiyalReact(offer.downPayment.toFixed(0))}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-yellow-700 hover:bg-yellow-800 text-white text-sm"
                        onClick={() => selectOfferAndProceed(offer)}
                      >
                        اختر العرض
                      </Button>
                      {/* <Button
                        variant="outline"
                        className="flex-1 text-sm"
                        onClick={() => addToComparison(offer)}
                      >
                        اضف للمقارنة
                      </Button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: Lowest Monthly Installment */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-yellow-700">أقل قسط شهري</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lowestMonthlyOffers.map((offer) => (
                  <div key={offer.id} className="border-2 rounded-lg p-4 border-yellow-700 bg-black">
                    <div className="text-center mb-4">
                      <p className="text-lg font-bold text-yellow-800">
                        عرض {formatSaudiRiyalReact(offer.downPayment.toFixed(0))} دفعة اولى و قسط {formatSaudiRiyalReact(offer.monthlyPayment.toFixed(0))}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 mb-4 text-center">
                      <div className="bg-black p-2 rounded">
                        <p className="text-xs text-white">قسط شهري</p>
                        <p className="font-semibold">{formatSaudiRiyalReact(offer.monthlyPayment.toFixed(0))}</p>
                      </div>
                      <div className="bg-black p-2 rounded">
                        <p className="text-xs text-white">مدة القسط</p>
                        <p className="font-semibold">{Math.floor(offer.termMonths / 12)} سنة</p>
                      </div>
                      <div className="bg-black p-2 rounded">
                        <p className="text-xs text-white">الدفعة الاولى</p>
                        <p className="font-semibold">{formatSaudiRiyalReact(offer.downPayment.toFixed(0))}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-yellow-700 hover:bg-yellow-800 text-white text-sm"
                        onClick={() => selectOfferAndProceed(offer)}
                      >
                        سجل طلبك
                      </Button>
                      {/* <Button
                        variant="outline"
                        className="flex-1 text-sm"
                        onClick={() => addToComparison(offer)}
                      >
                        اضف للمقارنة
                      </Button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: Highest Final Payment */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-yellow-700">أعلى دفعة اخيرة</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highestFinalOffers.map((offer) => (
                  <div key={offer.id} className="border-2 rounded-lg p-4 border-yellow-700 bg-black">
                    <div className="text-center mb-4">
                      <p className="text-lg font-bold text-yellow-800">
                        عرض قسط {formatSaudiRiyalReact(offer.monthlyPayment.toFixed(0))} و دفعة اخيرة {formatSaudiRiyalReact(offer.finalPayment.toFixed(0))}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 mb-4 text-center">
                      <div className="bg-black p-2 rounded">
                        <p className="text-xs text-white">قسط شهري</p>
                        <p className="font-semibold">{formatSaudiRiyalReact(offer.monthlyPayment.toFixed(0))}</p>
                      </div>
                      <div className="bg-black p-2 rounded">
                        <p className="text-xs text-white">مدة القسط</p>
                        <p className="font-semibold">{Math.floor(offer.termMonths / 12)} سنة</p>
                      </div>
                      <div className="bg-black p-2 rounded">
                        <p className="text-xs text-white">الدفعة الاخيرة</p>
                        <p className="font-semibold">{formatSaudiRiyalReact(offer.finalPayment.toFixed(0))}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-yellow-700 hover:bg-yellow-800 text-white text-sm"
                        onClick={() => selectOfferAndProceed(offer)}
                      >
                        اختر العرض
                      </Button>
                      {/* <Button
                        variant="outline"
                        className="flex-1 text-sm"
                        onClick={() => addToComparison(offer)}
                      >
                        اضف للمقارنة
                      </Button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Offers for Comparison */}
            {selectedOffers.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-yellow-700">العروض المختارة للمقارنة</h4>
                <div className="grid grid-cols-1 gap-4">
                  {selectedOffers.map((offer) => (
                    <div key={offer.id} className="border-2 rounded-lg p-4 border-green-500 bg-white">
                      <div className="text-center mb-4">
                        <p className="text-lg font-bold text-green-800">
                          عرض {formatSaudiRiyalReact(offer.downPayment.toFixed(0))} دفعة اولى و قسط {formatSaudiRiyalReact(offer.monthlyPayment.toFixed(0))}
                        </p>
                      </div>

                    <div className="grid grid-cols-1 gap-2 mb-4 text-center">
                      <div className="bg-black p-2 rounded">
                        <p className="text-xs text-white">قسط شهري</p>
                        <p className="font-semibold">{formatSaudiRiyalReact(offer.monthlyPayment.toFixed(0))}</p>
                      </div>
                      <div className="bg-black p-2 rounded">
                        <p className="text-xs text-white">مدة القسط</p>
                        <p className="font-semibold">{Math.floor(offer.termMonths / 12)} سنة</p>
                      </div>
                      <div className="bg-black p-2 rounded">
                        <p className="text-xs text-white">الدفعة الاولى</p>
                        <p className="font-semibold">{formatSaudiRiyalReact(offer.downPayment.toFixed(0))}</p>
                      </div>
                    </div>

                      <Button
                    
                        className="w-full text-sm border-red-500 text-red-600 bg-red"
                        onClick={() => removeFromComparison(offer.id)}
                      >
                        إزالة من المقارنة
                      </Button>
                    </div>
                  ))}
                </div>

                {/* AI Analysis Button */}
                <div className="text-center">
                  <Button
                    onClick={analyzeOffers}
                    disabled={isAnalyzing || selectedOffers.length < 2}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    {isAnalyzing ? "جاري التحليل..." : "تحليل بالذكاء الاصطناعي"}
                  </Button>
                </div>

                {/* AI Analysis Results */}
                {comparisonAnalysis && (
                  <div className="bg-gradient-to-br from-yellow-50/80 via-yellow-100/80 to-yellow-200/80 border-2 border-yellow-200 rounded-xl p-6 shadow-lg backdrop-blur-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <h5 className="text-xl font-bold text-gray-800">نتائج التحليل بالذكاء الاصطناعي</h5>
                    </div>

                    <div className="space-y-6">
                      {/* User Profile Summary */}
                      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <h6 className="text-lg font-semibold text-gray-800">ملف العميل</h6>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-600">صافي الراتب</span>
                            </div>
                            <p className="text-lg font-bold text-green-700">{formatSaudiRiyalReact(comparisonAnalysis.userProfile?.netSalary || 0)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-gray-600">الإلتزامات الشهرية</span>
                            </div>
                            <p className="text-lg font-bold text-red-700">{formatSaudiRiyalReact(comparisonAnalysis.userProfile?.totalMonthlyObligations || 0)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <BarChart3 className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-600">الدخل المتاح</span>
                            </div>
                            <p className="text-lg font-bold text-blue-700">{formatSaudiRiyalReact(comparisonAnalysis.userProfile?.availableIncome || 0)}</p>
                          </div>

                        </div>
                      </div>

                      {/* Recommendations */}
                      {comparisonAnalysis.recommendations && comparisonAnalysis.recommendations.primary && comparisonAnalysis.recommendations.primary.length > 0 && (
                        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Target className="h-5 w-5 text-green-600" />
                            </div>
                            <h6 className="text-lg font-semibold text-gray-800">التوصيات</h6>
                          </div>
                          <div className="space-y-3">
                            {comparisonAnalysis.recommendations.primary.map((rec, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-green-800 leading-relaxed">{rec}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Warnings */}
                      {comparisonAnalysis.recommendations?.warnings && comparisonAnalysis.recommendations.warnings.length > 0 && (
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-xl shadow-md border border-red-200 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-2 rounded-lg">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <h6 className="text-lg font-semibold text-red-800">تحذيرات مهمة</h6>
                          </div>
                          <div className="space-y-3">
                            {comparisonAnalysis.recommendations.warnings.map((warning, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-red-800 leading-relaxed font-medium">{warning}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {comparisonAnalysis.recommendations?.suggestions && comparisonAnalysis.recommendations.suggestions.length > 0 && (
                        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Award className="h-5 w-5 text-blue-600" />
                            </div>
                            <h6 className="text-lg font-semibold text-gray-800">اقتراحات</h6>
                          </div>
                          <div className="space-y-3">
                            {comparisonAnalysis.recommendations.suggestions.map((suggestion, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <Star className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-blue-800 leading-relaxed">{suggestion}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      {comparisonAnalysis.summary && (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-xl shadow-md border border-purple-200 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-100 p-2 rounded-lg">
                              <BarChart3 className="h-5 w-5 text-purple-600" />
                            </div>
                            <h6 className="text-lg font-semibold text-gray-800">ملخص التحليل</h6>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <File className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-600">العروض المحللة</span>
                              </div>
                              <p className="text-2xl font-bold text-gray-800">{comparisonAnalysis.summary.totalOffersAnalyzed || 0}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-600">العروض المناسبة</span>
                              </div>
                              {comparisonAnalysis.summary.affordableOffers && comparisonAnalysis.summary.affordableOffers.length > 0 ? (
                                <div className="space-y-2">
                                  {comparisonAnalysis.summary.affordableOffers.map((offer, index) => (
                                    <div key={index} className="text-sm text-green-700">
                                      <p className="font-semibold">عرض {formatSaudiRiyalReact(offer.downPayment?.toFixed(0) || 0)} دفعة أولى، {formatSaudiRiyalReact(offer.monthlyPayment?.toFixed(0) || 0)} قسط شهري</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-2xl font-bold text-green-700">{comparisonAnalysis.summary.affordableOffersCount || 0}</p>
                              )}
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-600">أقل قسط شهري</span>
                              </div>
                              <p className="text-xl font-bold text-blue-700">{formatSaudiRiyalReact(comparisonAnalysis.summary.lowestMonthlyPayment || 0)}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Percent className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-gray-600">أقل تكلفة إجمالية</span>
                              </div>
                              <p className="text-xl font-bold text-purple-700">{formatSaudiRiyalReact(comparisonAnalysis.summary.lowestTotalCost || 0)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons for Financing Offers Step */}
            <div className="flex justify-start pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronRight className="h-4 w-4" />
                السابق
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              معلومات إضافية
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="mb-2">الاسم كامل *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                  placeholder="أدخل الاسم كامل"
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-2">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">المدينة *</Label>
                  <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الرياض">الرياض</SelectItem>
                      <SelectItem value="جدة">جدة</SelectItem>
                      <SelectItem value="مكة">مكة</SelectItem>
                      <SelectItem value="المدينة">المدينة</SelectItem>
                      <SelectItem value="الدمام">الدمام</SelectItem>
                      <SelectItem value="الخبر">الخبر</SelectItem>
                      <SelectItem value="الطائف">الطائف</SelectItem>
                      <SelectItem value="تبوك">تبوك</SelectItem>
                      <SelectItem value="أبها">أبها</SelectItem>
                      <SelectItem value="حائل">حائل</SelectItem>
                      <SelectItem value="الجوف">الجوف</SelectItem>
                      <SelectItem value="نجران">نجران</SelectItem>
                      <SelectItem value="جازان">جازان</SelectItem>
                      <SelectItem value="الباحة">الباحة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2">الوقت المفضل *</Label>
                  <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الوقت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8:00 AM">ص 8:00</SelectItem>
                      <SelectItem value="9:00 AM">ص 9:00</SelectItem>
                      <SelectItem value="10:00 AM">ص 10:00</SelectItem>
                      <SelectItem value="11:00 AM">ص 11:00</SelectItem>
                      <SelectItem value="12:00 PM">م 12:00</SelectItem>
                      <SelectItem value="1:00 PM">م 1:00</SelectItem>
                      <SelectItem value="2:00 PM">م 2:00</SelectItem>
                      <SelectItem value="3:00 PM">م 3:00</SelectItem>
                      <SelectItem value="4:00 PM">م 4:00</SelectItem>
                      <SelectItem value="5:00 PM">م 5:00</SelectItem>
                      <SelectItem value="6:00 PM">م 6:00</SelectItem>
                      <SelectItem value="7:00 PM">م 7:00</SelectItem>
                      <SelectItem value="8:00 PM">م 8:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">مراجعة البيانات</h3>

            <div className="space-y-4">
              <div className="bg-black p-4 rounded-lg">
                <h4 className="font-semibold mb-2">تفاصيل السيارة</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">السنة:</span> {car.year}</p>
                  <p><span className="font-medium">الماركة:</span> {car.make}</p>
                  <p><span className="font-medium">الموديل:</span> {car.model}</p>
                  <p><span className="font-medium">السعر:</span> {formatSaudiRiyalReact(car.price)}</p>
                  <p><span className="font-medium">المسافة المقطوعة:</span> {car.mileage?.toLocaleString() || 'غير محدد'} كم</p>
                  <p><span className="font-medium">اللون:</span> {car.color || 'غير محدد'}</p>
                  <p><span className="font-medium">نوع الوقود:</span> {car.fuelType || 'غير محدد'}</p>
                  <p><span className="font-medium">ناقل الحركة:</span> {car.transmission || 'غير محدد'}</p>
                  <p><span className="font-medium">نوع الهيكل:</span> {car.bodyType || 'غير محدد'}</p>
                  <p><span className="font-medium">عدد المقاعد:</span> {car.seats || 'غير محدد'}</p>
                </div>
                {car.description && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <p><span className="font-medium">الوصف:</span> {car.description}</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">معلومات الهوية</h4>
                <p>رقم الهوية: {formData.idNumber}</p>
                <p>صورة الهوية: {formData.idImage ? formData.idImage.name : "لم يتم تحميل الصورة"}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">البيانات الشخصية</h4>
                <p>رقم الجوال: +966 {formData.mobileNumber}</p>
                <p>شهر الميلاد: {formData.birthMonth === "1" ? "محرم" :
                  formData.birthMonth === "2" ? "صفر" :
                  formData.birthMonth === "3" ? "ربيع الأول" :
                  formData.birthMonth === "4" ? "ربيع الآخر" :
                  formData.birthMonth === "5" ? "جمادى الأولى" :
                  formData.birthMonth === "6" ? "جمادى الآخرة" :
                  formData.birthMonth === "7" ? "رجب" :
                  formData.birthMonth === "8" ? "شعبان" :
                  formData.birthMonth === "9" ? "رمضان" :
                  formData.birthMonth === "10" ? "شوال" :
                  formData.birthMonth === "11" ? "ذو القعدة" :
                  formData.birthMonth === "12" ? "ذو الحجة" : ""}</p>
                <p>سنة الميلاد: {formData.birthYear} هـ</p>
                <p>النوع: {formData.gender === "male" ? "ذكر" : formData.gender === "female" ? "أنثى" : ""}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">البيانات الإئتمانية</h4>
                <p>جهة العمل: {formData.employerSector}</p>
                <p>ادخل جهة العمل: {formData.employer}</p>
                <p>جهة تحويل الراتب: {banks.find(b => b.id.toString() === formData.salaryTransferBank)?.name || ''}</p>
                <p>صافي الراتب: {formData.netSalary ? formatSaudiRiyalReact(parseFloat(formData.netSalary)) : ''}</p>
                <p>هل لديك تمويل عقاري: {formData.hasRealEstateFinance === 'yes' ? 'نعم' : 'لا'}</p>
                <p>هل لديك تعثر في سمة: {formData.hasCreditDefault === 'yes' ? 'نعم' : 'لا'}</p>
                <p>إجمالي الإلتزامات الشهرية: {formData.totalMonthlyObligations ? formatSaudiRiyalReact(parseFloat(formData.totalMonthlyObligations)) : ''}</p>
              </div>

              {formData.additionalInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">معلومات إضافية</h4>
                  <p>{formData.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto bg-black text-white">
        <CardHeader>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>التقدم</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-yellow-700 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs mt-1 text-center ${
                    index <= currentStep ? 'text-yellow-700 font-medium' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={currentStep === steps.length - 1 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
            {renderStepContent()}

            {/* Navigation Buttons */}
            {currentStep !== 4 && (
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    className="bg-yellow-700 hover:bg-yellow-800 text-white flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "جاري التسجيل..." : "سجل الطلب"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-yellow-700 hover:bg-yellow-800 text-white flex items-center gap-2"
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={handleCloseModal}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-lg">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">تم إرسال الطلب بنجاح!</h3>
                <p className="text-gray-600 mb-6">سيتم التواصل معك قريباً من قبل فريقنا.</p>
                <Link href="/">
                  <Button
                    onClick={handleCloseModal}
                    className="bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-2"
                  >
                    موافق
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoanRequestForm;

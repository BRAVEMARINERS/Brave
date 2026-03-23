import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";

export interface SeafarerFilterValues {
  query?: string;
  rankId?: number;
  countryId?: number;
  availabilityStatus?: string;
  minExperienceMonths?: number;
}

interface SeafarerFiltersProps {
  values: SeafarerFilterValues;
  onChange: (values: SeafarerFilterValues) => void;
  onReset: () => void;
  resultsCount?: number;
}

export default function SeafarerFilters({ values, onChange, onReset, resultsCount }: SeafarerFiltersProps) {
  const { t, lang } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const { data: ranks } = trpc.public.getRanks.useQuery();
  const { data: countries } = trpc.public.getCountries.useQuery();

  const activeFiltersCount = [
    values.rankId, values.countryId, values.availabilityStatus, values.minExperienceMonths,
  ].filter(Boolean).length;

  const handleChange = (key: keyof SeafarerFilterValues, value: any) => {
    onChange({ ...values, [key]: value || undefined });
  };

  const availabilityOptions = [
    { value: "available", labelAr: "متاح", labelEn: "Available" },
    { value: "onboard", labelAr: "على متن السفينة", labelEn: "On Board" },
    { value: "unavailable", labelAr: "غير متاح", labelEn: "Unavailable" },
  ];

  const experienceOptions = [
    { value: 0, labelAr: "أي خبرة", labelEn: "Any Experience" },
    { value: 12, labelAr: "سنة+", labelEn: "1 Year+" },
    { value: 24, labelAr: "سنتان+", labelEn: "2 Years+" },
    { value: 60, labelAr: "5 سنوات+", labelEn: "5 Years+" },
    { value: 120, labelAr: "10 سنوات+", labelEn: "10 Years+" },
  ];

  return (
    <Card className="border-border/50 rounded-2xl mb-6">
      <CardContent className="p-4">
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={values.query || ""}
            onChange={e => handleChange("query", e.target.value)}
            placeholder={t.seafarers.search}
            className="pr-10 font-sans rounded-xl border-border/50 bg-secondary/30 focus-visible:ring-gold-400/30"
          />
        </div>

        {/* Toggle Advanced Filters */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t.jobs.filter}
            {activeFiltersCount > 0 && (
              <Badge className="bg-gold-400/20 text-gold-600 border-gold-400/30 text-xs px-1.5 py-0">
                {activeFiltersCount}
              </Badge>
            )}
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          <div className="flex items-center gap-2">
            {resultsCount !== undefined && (
              <span className="text-xs text-muted-foreground font-sans">
                {resultsCount} {lang === "ar" ? "بحّار" : "seafarers"}
              </span>
            )}
            {(activeFiltersCount > 0 || values.query) && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-sans transition-colors"
              >
                <X className="h-3 w-3" />
                {lang === "ar" ? "مسح الكل" : "Clear All"}
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {expanded && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/30">
            {/* Rank */}
            <div className="space-y-1.5">
              <Label className="text-xs font-sans text-muted-foreground">{t.jobs.rank}</Label>
              <Select
                value={values.rankId?.toString() || ""}
                onValueChange={v => handleChange("rankId", v ? parseInt(v) : undefined)}
              >
                <SelectTrigger className="font-sans text-sm rounded-xl border-border/50 bg-secondary/30">
                  <SelectValue placeholder={lang === "ar" ? "كل الرتب" : "All Ranks"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="font-sans">{lang === "ar" ? "كل الرتب" : "All Ranks"}</SelectItem>
                  {ranks?.map(r => (
                    <SelectItem key={r.id} value={r.id.toString()} className="font-sans">
                      {lang === "ar" && r.nameAr ? r.nameAr : r.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label className="text-xs font-sans text-muted-foreground">{t.jobs.country}</Label>
              <Select
                value={values.countryId?.toString() || ""}
                onValueChange={v => handleChange("countryId", v ? parseInt(v) : undefined)}
              >
                <SelectTrigger className="font-sans text-sm rounded-xl border-border/50 bg-secondary/30">
                  <SelectValue placeholder={lang === "ar" ? "كل الدول" : "All Countries"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="font-sans">{lang === "ar" ? "كل الدول" : "All Countries"}</SelectItem>
                  {countries?.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()} className="font-sans">
                      {lang === "ar" && c.nameAr ? c.nameAr : c.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Availability */}
            <div className="space-y-1.5">
              <Label className="text-xs font-sans text-muted-foreground">{t.seafarers.available}</Label>
              <Select
                value={values.availabilityStatus || ""}
                onValueChange={v => handleChange("availabilityStatus", v || undefined)}
              >
                <SelectTrigger className="font-sans text-sm rounded-xl border-border/50 bg-secondary/30">
                  <SelectValue placeholder={lang === "ar" ? "أي حالة" : "Any Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="font-sans">{lang === "ar" ? "أي حالة" : "Any Status"}</SelectItem>
                  {availabilityOptions.map(o => (
                    <SelectItem key={o.value} value={o.value} className="font-sans">
                      {lang === "ar" ? o.labelAr : o.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Experience */}
            <div className="space-y-1.5">
              <Label className="text-xs font-sans text-muted-foreground">{t.profile.experience}</Label>
              <Select
                value={values.minExperienceMonths?.toString() || ""}
                onValueChange={v => handleChange("minExperienceMonths", v ? parseInt(v) : undefined)}
              >
                <SelectTrigger className="font-sans text-sm rounded-xl border-border/50 bg-secondary/30">
                  <SelectValue placeholder={lang === "ar" ? "أي خبرة" : "Any Experience"} />
                </SelectTrigger>
                <SelectContent>
                  {experienceOptions.map(o => (
                    <SelectItem key={o.value} value={o.value.toString()} className="font-sans">
                      {lang === "ar" ? o.labelAr : o.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/30">
            {values.rankId && ranks && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 font-sans text-xs cursor-pointer"
                onClick={() => handleChange("rankId", undefined)}
              >
                {ranks.find(r => r.id === values.rankId)?.[lang === "ar" ? "nameAr" : "nameEn"] || ""}
                <X className="h-3 w-3" />
              </Badge>
            )}
            {values.countryId && countries && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 font-sans text-xs cursor-pointer"
                onClick={() => handleChange("countryId", undefined)}
              >
                {countries.find(c => c.id === values.countryId)?.[lang === "ar" ? "nameAr" : "nameEn"] || ""}
                <X className="h-3 w-3" />
              </Badge>
            )}
            {values.availabilityStatus && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 font-sans text-xs cursor-pointer"
                onClick={() => handleChange("availabilityStatus", undefined)}
              >
                {availabilityOptions.find(o => o.value === values.availabilityStatus)?.[lang === "ar" ? "labelAr" : "labelEn"] || ""}
                <X className="h-3 w-3" />
              </Badge>
            )}
            {values.minExperienceMonths && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 font-sans text-xs cursor-pointer"
                onClick={() => handleChange("minExperienceMonths", undefined)}
              >
                {lang === "ar" ? `خبرة ${Math.floor(values.minExperienceMonths / 12)}+ سنة` : `${Math.floor(values.minExperienceMonths / 12)}+ Years`}
                <X className="h-3 w-3" />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

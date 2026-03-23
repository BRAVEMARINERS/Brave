import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";

export interface JobFilterValues {
  query?: string;
  rankId?: number;
  shipTypeId?: number;
  countryId?: number;
  minSalary?: number;
  maxSalary?: number;
}

interface JobFiltersProps {
  values: JobFilterValues;
  onChange: (values: JobFilterValues) => void;
  onReset: () => void;
  resultsCount?: number;
}

export default function JobFilters({ values, onChange, onReset, resultsCount }: JobFiltersProps) {
  const { t, lang } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const { data: ranks } = trpc.public.getRanks.useQuery();
  const { data: shipTypes } = trpc.public.getShipTypes.useQuery();
  const { data: countries } = trpc.public.getCountries.useQuery();

  const activeFiltersCount = [
    values.rankId, values.shipTypeId, values.countryId,
    values.minSalary, values.maxSalary,
  ].filter(Boolean).length;

  const handleChange = (key: keyof JobFilterValues, value: any) => {
    onChange({ ...values, [key]: value || undefined });
  };

  return (
    <Card className="border-border/50 rounded-2xl mb-6">
      <CardContent className="p-4">
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={values.query || ""}
            onChange={e => handleChange("query", e.target.value)}
            placeholder={t.jobs.search}
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
                {resultsCount} {lang === "ar" ? "نتيجة" : "results"}
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
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border/30">
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

            {/* Ship Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-sans text-muted-foreground">{t.jobs.shipType}</Label>
              <Select
                value={values.shipTypeId?.toString() || ""}
                onValueChange={v => handleChange("shipTypeId", v ? parseInt(v) : undefined)}
              >
                <SelectTrigger className="font-sans text-sm rounded-xl border-border/50 bg-secondary/30">
                  <SelectValue placeholder={lang === "ar" ? "كل أنواع السفن" : "All Ship Types"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="font-sans">{lang === "ar" ? "كل أنواع السفن" : "All Ship Types"}</SelectItem>
                  {shipTypes?.map(s => (
                    <SelectItem key={s.id} value={s.id.toString()} className="font-sans">
                      {lang === "ar" && s.nameAr ? s.nameAr : s.nameEn}
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

            {/* Min Salary */}
            <div className="space-y-1.5">
              <Label className="text-xs font-sans text-muted-foreground">{t.jobs.minSalary} (USD)</Label>
              <Input
                type="number"
                min={0}
                value={values.minSalary || ""}
                onChange={e => handleChange("minSalary", e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="0"
                className="font-sans text-sm rounded-xl border-border/50 bg-secondary/30"
              />
            </div>

            {/* Max Salary */}
            <div className="space-y-1.5">
              <Label className="text-xs font-sans text-muted-foreground">{t.jobs.maxSalary} (USD)</Label>
              <Input
                type="number"
                min={0}
                value={values.maxSalary || ""}
                onChange={e => handleChange("maxSalary", e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="99999"
                className="font-sans text-sm rounded-xl border-border/50 bg-secondary/30"
              />
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
            {values.shipTypeId && shipTypes && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 font-sans text-xs cursor-pointer"
                onClick={() => handleChange("shipTypeId", undefined)}
              >
                {shipTypes.find(s => s.id === values.shipTypeId)?.[lang === "ar" ? "nameAr" : "nameEn"] || ""}
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
            {values.minSalary && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 font-sans text-xs cursor-pointer"
                onClick={() => handleChange("minSalary", undefined)}
              >
                {lang === "ar" ? `من $${values.minSalary}` : `From $${values.minSalary}`}
                <X className="h-3 w-3" />
              </Badge>
            )}
            {values.maxSalary && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 font-sans text-xs cursor-pointer"
                onClick={() => handleChange("maxSalary", undefined)}
              >
                {lang === "ar" ? `حتى $${values.maxSalary}` : `Up to $${values.maxSalary}`}
                <X className="h-3 w-3" />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

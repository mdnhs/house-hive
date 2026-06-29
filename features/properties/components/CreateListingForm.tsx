"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Map, MapMarker, MarkerContent, useMap } from "@/components/ui/map";
import { LOCATION_COORDINATES, ZONE_COORDINATES } from "@/lib/mockData";
import { Upload, X, MapPin, Search } from "lucide-react";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";

const getListingSchema = (businessType: "housing" | "interior") =>
  z.object({
    title: z.string().min(1, "Title is required"),
    location: z.string().min(1, "Location is required"),
    price: businessType === "housing"
      ? z.string().min(1, "Price is required")
      : z.string().optional(),
    priceUnit: z.enum(["hazar", "lakh", "crore"]),
    images: z.array(z.instanceof(File)).min(3, "Add at least 3 images"),
    markerPosition: z.tuple([z.number(), z.number()], {
      message: "Select a location on the map",
    }),
  });

type ListingFormValues = z.infer<ReturnType<typeof getListingSchema>>;

interface CreateListingFormProps {
  businessType: "housing" | "interior";
  onSubmit: (data: ListingFormValues) => void;
  defaultValues?: Partial<ListingFormValues>;
  submitLabel?: string;
}

export function CreateListingForm({
  businessType,
  onSubmit,
  defaultValues,
  submitLabel = "Publish Listing",
}: CreateListingFormProps) {
  const {
    register,
    handleSubmit,
    formState,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(getListingSchema(businessType)),
    defaultValues: {
      title: "",
      location: "",
      price: "",
      priceUnit: "lakh" as const,
      images: [] as File[],
      markerPosition: undefined as [number, number] | undefined,
      ...defaultValues,
    },
  });

  const markerPosition = watch("markerPosition");
  const images = watch("images");
  const locationValue = watch("location");

  const [showSuggestions, setShowSuggestions] = React.useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setValue("images", [...images, ...files].slice(0, 10), { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    setValue("images", images.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const handleLocationSelect = (name: string, coords: [number, number]) => {
    setValue("location", name, { shouldValidate: true });
    setValue("markerPosition", coords, { shouldValidate: true });
    setShowSuggestions(false);
  };

  const toError = (name: keyof ListingFormValues) => {
    const error = formState.errors[name];
    return error ? [{ message: error.message }] : undefined;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-8 overflow-y-auto">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
        {businessType === "housing" ? "Create your first property" : "Create your first project"}
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
        Fill in the essential details to publish your listing
      </p>
      <div className="space-y-5 flex-1">
        <Field orientation="vertical">
          <FieldLabel htmlFor="title">
            {businessType === "housing" ? "Property Title" : "Project Title"} <span className="text-[#FF385C]">*</span>
          </FieldLabel>
          <FieldContent>
            <input
              id="title"
              type="text"
              {...register("title")}
              placeholder={businessType === "housing" ? "e.g. 3 Bedroom Apartment in Gulshan" : "e.g. Modern Living Room Design"}
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all"
              autoFocus
            />
            <FieldError errors={toError("title")} />
          </FieldContent>
        </Field>

        <Field orientation="vertical">
          <FieldLabel htmlFor="location">
            Location <span className="text-[#FF385C]">*</span>
          </FieldLabel>
          <FieldContent>
            <div className="relative">
              <input
                id="location"
                type="text"
                {...register("location")}
                placeholder="Search location..."
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all"
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && locationValue?.trim().length > 0 && (
                <LocationSuggestions
                  query={locationValue}
                  onSelect={handleLocationSelect}
                />
              )}
            </div>
            <div className="h-48 sm:h-56 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
              <Map className="size-full" center={markerPosition || [90.4125, 23.8103]} zoom={13}>
                {markerPosition && <MapFlyTo position={markerPosition} />}
                <MapClickHandler onSelect={(pos) => setValue("markerPosition", pos, { shouldValidate: true })} />
                {markerPosition && (
                  <MapMarker longitude={markerPosition[0]} latitude={markerPosition[1]}>
                    <MarkerContent>
                      <div className="bg-[#FF385C] text-white p-2 rounded-full shadow-lg shadow-red-500/30">
                        <MapPin className="size-5 stroke-[2.5]" />
                      </div>
                    </MarkerContent>
                  </MapMarker>
                )}
              </Map>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              {markerPosition
                ? `${locationValue || "Location selected"}`
                : "Type a location or click on the map"}
            </p>
            <FieldError errors={toError("markerPosition")} />
          </FieldContent>
        </Field>

        {businessType === "housing" && (
          <Field orientation="vertical">
            <FieldLabel htmlFor="price">
              Price <span className="text-[#FF385C]">*</span>
            </FieldLabel>
            <FieldContent>
              <div className="flex gap-2">
                <input
                  id="price"
                  type="number"
                  {...register("price")}
                  placeholder="e.g. 75"
                  className="flex-1 h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all"
                />
                <select
                  {...register("priceUnit")}
                  className="h-12 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-sm font-medium outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="lakh">Lakh</option>
                  <option value="crore">Crore</option>
                  <option value="hazar">Hazar</option>
                </select>
              </div>
              <FieldError errors={toError("price")} />
            </FieldContent>
          </Field>
        )}

        <Field orientation="vertical">
          <FieldLabel>
            Images <span className="text-[#FF385C]">*</span>
            <span className="text-zinc-400 font-normal"> (min 3)</span>
          </FieldLabel>
          <FieldContent>
            <div className="grid grid-cols-3 gap-2">
              {images.map((file, index) => (
                <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 size-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="size-3 text-white" />
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <label className="aspect-[4/3] rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors bg-zinc-50 dark:bg-zinc-900/50">
                  <Upload className="size-5 text-zinc-400" />
                  <span className="text-xs text-zinc-400">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              {images.length < 3
                ? `${3 - images.length} more image${3 - images.length !== 1 ? "s" : ""} required`
                : `${images.length} image${images.length !== 1 ? "s" : ""} added`}
            </p>
            <FieldError errors={toError("images")} />
          </FieldContent>
        </Field>
      </div>

      <div className="pt-8">
        <button
          type="submit"
          className="w-full py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function MapFlyTo({ position }: { position: [number, number] }) {
  const { map } = useMap();

  React.useEffect(() => {
    if (!map) return;
    map.flyTo({ center: position, zoom: 15, duration: 1000 });
  }, [map, position[0], position[1]]);

  return null;
}

function MapClickHandler({ onSelect }: { onSelect: (pos: [number, number]) => void }) {
  const { map } = useMap();
  const handlerRef = React.useRef(onSelect);
  handlerRef.current = onSelect;

  React.useEffect(() => {
    if (!map) return;
    const handler = (e: any) => {
      handlerRef.current([e.lngLat.lng, e.lngLat.lat]);
    };
    map.on("click", handler);
    return () => { map.off("click", handler); };
  }, [map]);

  return null;
}

function LocationSuggestions({ query, onSelect }: { query: string; onSelect: (name: string, coords: [number, number]) => void }) {
  const suggestions = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const matches: { name: string; coords: [number, number] }[] = [];

    for (const [name, coords] of Object.entries(LOCATION_COORDINATES)) {
      if (name.toLowerCase().includes(q)) matches.push({ name, coords });
    }
    for (const [name, coords] of Object.entries(ZONE_COORDINATES)) {
      if (name.toLowerCase().includes(q) && !matches.some((m) => m.name === name)) {
        matches.push({ name, coords });
      }
    }

    return matches.slice(0, 8);
  }, [query]);

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-20 overflow-hidden">
      {suggestions.map((s) => (
        <button
          key={s.name}
          type="button"
          onClick={() => onSelect(s.name, s.coords)}
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <Search className="size-4 text-zinc-400 shrink-0" />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">{s.name}</span>
        </button>
      ))}
    </div>
  );
}

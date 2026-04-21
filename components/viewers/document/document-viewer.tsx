"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Maximize2, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";

import "swiper/css";
import "./document-viewer.css";

export type Document = {
  label: string;
  url: string;
};

type DocumentViewerProps = {
  documents: Document[];
  className?: string;
  noDocumentsMessage?: string;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;

export const DocumentViewer = memo(function DocumentViewer({
  documents,
  className,
  noDocumentsMessage,
}: DocumentViewerProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const viewerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const resetInspection = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleFullscreen = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      viewer.requestFullscreen();
    }
  }, []);

  const handleThumbClick = useCallback((index: number) => {
    swiperRef.current?.slideTo(index);
  }, []);

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      setActiveIndex(swiper.activeIndex);
      resetInspection();
    },
    [resetInspection],
  );

  const isTransformed = zoom !== 1 || rotation !== 0;


  if (!documents.length) {
    return (
      <div
        className={cn(
          "w-full h-[600px] flex items-center justify-center shadow-sm",
          className,
        )}
      >
        {noDocumentsMessage ||
          t("global.no_documents", "No documents available.")}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative group flex flex-col h-full items-center justify-center mx-auto gap-4",
        className,
      )}
    >
      <div
        ref={viewerRef}
        className="relative w-full h-[500px] border rounded-xl p-6 max-w-[500px] bg-card overflow-hidden"
      >
        <Toolbar
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onRotate={handleRotate}
          onFullscreen={handleFullscreen}
        />

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={handleSlideChange}
          className="w-full h-full main-viewer-swiper"
          spaceBetween={0}
        >
          {documents.map((doc) => (
            <SwiperSlide
              key={doc.url}
              className="flex items-center justify-center"
            >
              <div className="w-full h-full overflow-hidden flex items-center justify-center">
                <div
                  className="flex items-center justify-center w-full h-full"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: "transform 300ms ease-out",
                    willChange: isTransformed ? "transform" : "auto",
                  }}
                >
                  <img
                    src={doc.url}
                    alt={doc.label}
                    className="max-w-full max-h-[600px] object-contain bg-card"
                    draggable={false}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <ThumbsBar
        documents={documents}
        activeIndex={activeIndex}
        onThumbClick={handleThumbClick}
      />
    </div>
  );
});

const Toolbar = memo(function Toolbar({
  onZoomIn,
  onZoomOut,
  onRotate,
  onFullscreen,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onFullscreen: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={onZoomIn}
        title={t("global.zoom_in", "Zoom in")}
      >
        <ZoomIn className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={onZoomOut}
        title={t("global.zoom_out", "Zoom out")}
      >
        <ZoomOut className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={onRotate}
        title={t("global.rotate", "Rotate")}
      >
        <RotateCw className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={onFullscreen}
        title={t("global.fullscreen", "Fullscreen")}
      >
        <Maximize2 className="size-4" />
      </Button>
    </div>
  );
});

const ThumbsBar = memo(function ThumbsBar({
  documents,
  activeIndex,
  onThumbClick,
}: {
  documents: Document[];
  activeIndex: number;
  onThumbClick: (index: number) => void;
}) {
  return (
    <div className="border rounded-xl p-2 bg-card mx-auto">
      <div className="flex gap-3">
        {documents.map((doc, index) => (
          <button
            key={doc.url}
            type="button"
            onClick={() => onThumbClick(index)}
            className={cn(
              "thumb-button",
              index === activeIndex && "thumb-button-active",
            )}
            aria-label={doc.label}
            aria-current={index === activeIndex}
          >
            <img
              src={doc.url}
              alt={doc.label}
              className="w-16 h-16 rounded-lg object-cover block"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
});

import { useEffect, useRef, type PointerEvent } from "react";

const signatureImagePrefix = "data:image/png;base64,";

export const isSignatureImage = (value: string) =>
  value.startsWith(signatureImagePrefix);

export function SignatureDisplay({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  return isSignatureImage(value) ? (
    <img
      src={value}
      alt="Chữ ký cán bộ"
      className={`h-16 max-w-full object-contain object-left ${className}`}
    />
  ) : (
    <span className={`font-serif text-lg italic ${className}`}>
      {value || "Chưa có chữ ký"}
    </span>
  );
}

export function SignaturePad({
  value,
  onChange,
  label = "Chữ ký điện tử",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!isSignatureImage(value)) return;

    const image = new Image();
    image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.src = value;
  }, [value]);

  const getPoint = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
      y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
    };
  };

  const startDrawing = (event: PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");
    if (!context) return;
    const point = getPoint(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineWidth = 4;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#123d36";
    isDrawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
  };

  const continueDrawing = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    const point = getPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const finishDrawing = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    onChange(event.currentTarget.toDataURL("image/png"));
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold">
        {label}
        <input
          value={isSignatureImage(value) ? "" : value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Nhập tên hoặc ký tay ở khung bên dưới"
          className="focus-ring mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium"
          data-testid="input-electronic-signature"
        />
      </label>
      <div className="overflow-hidden rounded-lg border border-dashed border-primary/35 bg-white">
        <canvas
          ref={canvasRef}
          width={900}
          height={180}
          aria-label="Khung ký tay"
          className="block h-24 w-full touch-none cursor-crosshair"
          onPointerDown={startDrawing}
          onPointerMove={continueDrawing}
          onPointerUp={finishDrawing}
          onPointerCancel={finishDrawing}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-normal text-muted-foreground">
          Ký trong khung hoặc dùng chữ ký đã nhập ở trên.
        </p>
        <button
          type="button"
          onClick={clearSignature}
          className="shrink-0 text-[11px] font-bold text-primary hover:underline"
          data-testid="button-clear-signature"
        >
          Xóa chữ ký
        </button>
      </div>
      {isSignatureImage(value) ? (
        <div className="rounded-lg bg-secondary/40 px-3 py-1">
          <SignatureDisplay value={value} />
        </div>
      ) : value.trim() ? (
        <div className="rounded-lg bg-secondary/40 px-3 py-2">
          <SignatureDisplay value={value} />
        </div>
      ) : null}
    </div>
  );
}
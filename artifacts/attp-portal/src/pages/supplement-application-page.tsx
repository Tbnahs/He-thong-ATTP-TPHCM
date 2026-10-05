import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, FileText, Paperclip, Send } from "lucide-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import {
  getDemoSupplementByToken,
  submitDemoSupplement,
  type DemoSupplementRequest,
} from "@/lib/demo-supplements";
import { applications } from "@/lib/mock-data";
import {
  EVIDENCE_ACCEPT,
  EVIDENCE_MAX_SIZE_LABEL,
  validateEvidenceFiles,
} from "@/lib/file-upload";
import type { Attachment } from "@/lib/mock-data";

const demoSupplementAttachment: Attachment = {
  name: "[DEMO] Giay-chung-nhan-ATTP.pdf",
  kind: "application/pdf",
  size: 0,
  fieldKey: "supplement",
};

export function SupplementApplicationPage() {
  const { token = "" } = useParams<{ token: string }>();
  const [request, setRequest] = useState<DemoSupplementRequest | undefined>(
    () => getDemoSupplementByToken(token),
  );
  const [response, setResponse] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [includeDemoAttachment, setIncludeDemoAttachment] = useState(false);
  const [error, setError] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const application = applications.find(
    (item) => item.id === request?.applicationId,
  );

  const onChooseFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    const validationError = validateEvidenceFiles(selected);
    if (validationError) {
      setError(validationError);
      event.target.value = "";
      return;
    }
    setError("");
    setFiles((current) => [...current, ...selected]);
    setFileInputKey((current) => current + 1);
  };

  const fillDemoResponse = () => {
    setResponse(
      "Đã bổ sung giấy chứng nhận ATTP còn hiệu lực. Kính đề nghị cán bộ kiểm tra.",
    );
    setIncludeDemoAttachment(true);
    setError("");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!request) return;
    if (!response.trim()) {
      setError("Vui lòng mô tả nội dung đã bổ sung.");
      return;
    }

    const attachments: Attachment[] = [
      ...files.map((file) => ({
        name: file.name,
        kind: file.type || "application/octet-stream",
        size: file.size,
        fieldKey: "supplement",
      })),
      ...(includeDemoAttachment ? [demoSupplementAttachment] : []),
    ];

    try {
      const submitted = submitDemoSupplement({
        token,
        response,
        attachments,
      });
      setRequest(submitted);
      setError("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Không thể gửi phần bổ sung.",
      );
    }
  };

  if (!request || !application) {
    return (
      <main className="min-h-screen bg-muted/40 px-4 py-10">
        <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-sm">
          <p className="text-sm font-extrabold uppercase tracking-wide text-primary">
            Cổng thông tin ATTP TP.HCM
          </p>
          <h1 className="mt-3 text-2xl font-extrabold">Không tìm thấy liên kết</h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            Liên kết này không có trong dữ liệu demo của trình duyệt hiện tại.
            Yêu cầu bổ sung chỉ được mô phỏng trên cùng trình duyệt đã tạo liên kết.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <ArrowLeft size={16} /> Về trang chủ
          </Link>
        </section>
      </main>
    );
  }

  const isExpired =
    request.status === "expired" ||
    (request.status === "open" &&
      new Date(request.expiresAt).getTime() <= Date.now());

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Cổng thông tin ATTP TP.HCM
        </Link>

        <section className="mt-5 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="bg-[#123d36] px-6 py-7 text-white sm:px-8">
            <p className="text-xs font-extrabold tracking-[.14em] text-[#f4c95d]">
              BỔ SUNG HỒ SƠ ĐĂNG KÝ
            </p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Cập nhật hồ sơ của bạn
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Mã hồ sơ {application.reference} · {application.applicantName}
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-8">
            <div
              className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
              role="note"
            >
              <strong>Bản demo:</strong> không gửi email thật, không xác minh người
              truy cập và không tải tệp lên máy chủ. Liên kết chỉ hoạt động trên
              trình duyệt đã tạo yêu cầu.
            </div>

            <section className="rounded-2xl border border-border bg-background p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                Yêu cầu từ cán bộ duyệt
              </p>
              <p className="mt-2 text-sm font-semibold leading-7">
                {request.reason}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Gửi đến: {request.recipientEmail}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Liên kết demo có hiệu lực đến{" "}
                {new Intl.DateTimeFormat("vi-VN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(request.expiresAt))}
              </p>
            </section>

            {request.status === "submitted" ? (
              <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
                <div className="flex items-center gap-2 font-extrabold">
                  <CheckCircle2 size={20} /> Đã gửi phần bổ sung
                </div>
                <p className="mt-2 text-sm leading-6">
                  Hồ sơ đã được chuyển về trạng thái chờ duyệt. Cán bộ sẽ xem nội
                  dung và các tệp bạn cung cấp.
                </p>
                {request.response && (
                  <p className="mt-4 rounded-xl bg-white/80 p-3 text-sm leading-6">
                    {request.response}
                  </p>
                )}
                {request.attachments.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {request.attachments.map((attachment, index) => (
                      <li
                        key={`${attachment.name}-${index}`}
                        className="flex items-center gap-2 text-sm font-semibold"
                      >
                        <FileText size={16} /> {attachment.name}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ) : isExpired ? (
              <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-950">
                Liên kết demo đã hết hạn. Vui lòng liên hệ cán bộ tiếp nhận để tạo
                yêu cầu bổ sung mới.
              </section>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <label className="block text-sm font-bold">
                  <span>
                    Nội dung phản hồi <span className="text-rose-600">*</span>
                  </span>
                  <span className="mt-2 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fillDemoResponse}
                      data-testid="button-fill-supplement-demo"
                    >
                      Điền mẫu demo
                    </Button>
                  </span>
                  <textarea
                    required
                    id="supplement-response"
                    value={response}
                    onChange={(event) => setResponse(event.target.value)}
                    rows={5}
                    placeholder="Mô tả giấy tờ hoặc thông tin bạn đã bổ sung..."
                    className="focus-ring mt-2 w-full resize-y rounded-xl border border-input bg-background p-3.5 text-sm font-normal leading-6"
                    data-testid="textarea-supplement-response"
                  />
                </label>

                <div>
                  <label
                    htmlFor={`supplement-files-${fileInputKey}`}
                    className="block text-sm font-bold"
                  >
                    Tệp minh chứng bổ sung
                  </label>
                  <div className="mt-2 rounded-2xl border border-dashed border-border bg-background p-4">
                    <input
                      key={fileInputKey}
                      id={`supplement-files-${fileInputKey}`}
                      type="file"
                      accept={EVIDENCE_ACCEPT}
                      multiple
                      onChange={onChooseFiles}
                      className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:font-bold file:text-primary-foreground"
                      data-testid="input-supplement-files"
                    />
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Chấp nhận PDF, JPG, PNG; tối đa {EVIDENCE_MAX_SIZE_LABEL} mỗi
                      tệp. Trong demo chỉ lưu tên và thông tin tệp.
                    </p>
                    {files.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {files.map((file, index) => (
                          <li
                            key={`${file.name}-${index}`}
                            className="flex items-center gap-2 text-sm font-medium"
                          >
                            <Paperclip size={15} />
                            <span className="break-all">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {includeDemoAttachment && (
                      <p className="mt-3 text-sm font-medium text-muted-foreground">
                        <Paperclip size={15} className="mr-2 inline" />
                        {demoSupplementAttachment.name} — tệp mẫu, không tải lên
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <p
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="min-h-11 w-full rounded-xl font-bold sm:w-auto"
                  data-testid="button-submit-supplement"
                >
                  <Send size={16} /> Gửi phần bổ sung
                </Button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, useParams } from "wouter";
import {
  getDemoSupplementByToken,
  submitDemoSupplement,
  type DemoSupplementRequest,
} from "@/lib/demo-supplements";
import { applications } from "@/lib/mock-data";
import { ApplicationForm } from "@/pages/portal-pages";

const reviewerValue = (value?: string) => value?.trim() || "Chưa cập nhật";

export function SupplementApplicationPage() {
  const { token = "" } = useParams<{ token: string }>();
  const [request, setRequest] = useState<DemoSupplementRequest | undefined>(
    () => getDemoSupplementByToken(token),
  );
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  useEffect(() => {
    setRequest(getDemoSupplementByToken(token));
  }, [token]);

  const application = applications.find(
    (item) => item.id === request?.applicationId,
  );

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
  const isLocked = request.status === "submitted" || isExpired;
  const reviewer = request.reviewer;
  const handleSubmit = (
    updatedData: Record<string, unknown>,
    applicationAttachments: Parameters<
      typeof submitDemoSupplement
    >[0]["applicationAttachments"],
    newAttachments: Parameters<typeof submitDemoSupplement>[0]["attachments"],
  ) => {
    const submitted = submitDemoSupplement({
      token,
      updatedData,
      applicationAttachments,
      attachments: newAttachments,
    });
    setRequest(submitted);
  };

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-7 sm:py-10">
      <div className="mx-auto max-w-5xl">
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
              Hồ sơ đăng ký của bạn
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Mã hồ sơ {application.reference} · {application.applicantName}
            </p>
          </div>

          <div className="space-y-6 p-4 sm:p-8">
            <section>
              <button
                type="button"
                onClick={() => setShowRequestInfo((visible) => !visible)}
                aria-expanded={showRequestInfo}
                aria-controls="supplement-request-info"
                className="focus-ring flex w-full items-center justify-between gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left text-amber-950 transition hover:bg-amber-100 sm:p-5"
                data-testid="button-toggle-supplement-request"
              >
                <span>
                  <span className="block text-xs font-extrabold uppercase tracking-wide text-amber-900">
                    Thông tin cán bộ yêu cầu bổ sung
                  </span>
                  <span className="mt-1 block text-sm text-amber-900/80">
                    {showRequestInfo
                      ? "Ẩn nội dung yêu cầu"
                      : "Nhấn để xem nội dung yêu cầu và thông tin liên hệ"}
                  </span>
                </span>
                <span aria-hidden="true" className="text-xl font-bold">
                  {showRequestInfo ? "−" : "+"}
                </span>
              </button>
              {showRequestInfo && (
                <div
                  id="supplement-request-info"
                  className="rounded-b-2xl border border-t-0 border-amber-300 bg-amber-50/70 p-4 text-amber-950 sm:p-5"
                  role="note"
                  aria-label="Yêu cầu từ cán bộ duyệt"
                >
                  <p className="text-xs font-extrabold uppercase tracking-wide text-amber-900">
                    Nội dung yêu cầu
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-7">
                    {request.reason}
                  </p>
                  <dl className="mt-4 grid gap-x-6 gap-y-3 border-t border-amber-300/70 pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold text-amber-900/70">
                        Cán bộ duyệt
                      </dt>
                      <dd className="mt-1 break-words font-bold">
                        {reviewerValue(reviewer?.name)}
                      </dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold text-amber-900/70">
                        Chức vụ
                      </dt>
                      <dd className="mt-1 break-words font-bold">
                        {reviewerValue(reviewer?.position)}
                      </dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold text-amber-900/70">
                        Số điện thoại
                      </dt>
                      <dd className="mt-1 break-words font-bold">
                        {reviewer?.phone ? (
                          <a
                            href={`tel:${reviewer.phone}`}
                            className="hover:underline"
                          >
                            {reviewer.phone}
                          </a>
                        ) : (
                          "Chưa cập nhật"
                        )}
                      </dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold text-amber-900/70">
                        Email
                      </dt>
                      <dd className="mt-1 break-words font-bold">
                        {reviewer?.email ? (
                          <a
                            href={`mailto:${reviewer.email}`}
                            className="hover:underline"
                          >
                            {reviewer.email}
                          </a>
                        ) : (
                          "Chưa cập nhật"
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </section>

            {request.status === "submitted" && (
              <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
                <div className="flex items-center gap-2 font-extrabold">
                  <CheckCircle2 size={19} /> Đã gửi hồ sơ bổ sung
                </div>
                <p className="mt-1 text-sm leading-6">
                  Các thay đổi đã được lưu vào hồ sơ và hồ sơ đã chuyển về trạng
                  thái chờ duyệt.
                </p>
              </section>
            )}
            {isExpired && request.status !== "submitted" && (
              <section className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
                Liên kết demo đã hết hạn. Vui lòng liên hệ cán bộ duyệt để tạo
                yêu cầu bổ sung mới. Hồ sơ bên dưới chỉ được xem.
              </section>
            )}

            <ApplicationForm
              key={application.id}
              mode="supplement"
              supplementApplication={application}
              readOnly={isLocked}
              onSupplementSubmit={handleSubmit}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

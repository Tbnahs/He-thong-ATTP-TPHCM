import { useState } from "react";
import { ArrowLeft, Building2, CheckCircle2, ChevronDown, ClipboardCheck, FileText, Image, Mail, MapPin, ShieldCheck, UserRound } from "lucide-react";
import {
  AnswerValue,
  applications,
  categoryLabel,
  formatDate,
  formatScalar,
  MockMasthead,
  sortedGroupsFor,
  StatusBadge,
  visibleCriteriaFor,
  type Application,
  type CriteriaDefinition,
} from "./_shared";

const reviewApplication = applications.find((item) => item.id === "sample-app-013") ?? applications.find((item) => item.type === "school")!;

function registrantData(app: Application) {
  const linked = app.data as Record<string, unknown>;
  return {
    name: String(linked.representative ?? linked.contactPerson ?? linked.foodSafetyLeadName ?? app.applicantName ?? linked.applicantName ?? "—"),
    phone: String(linked.representativePhone ?? linked.contact ?? app.contact ?? "—"),
    email: String(linked.email ?? "Chưa cập nhật"),
    username: "Tài khoản hồ sơ",
    linked: false,
  };
}

function criterionFiles(app: Application, key: string) {
  return app.attachments.filter((file) => file.fieldKey === key).map((file) => file.name);
}

function isSchoolFieldVisible(field: Record<string, unknown>, form: Record<string, unknown>, app: Application) {
  const dependency = field.dependsOn as { key: string; equals?: string; notEquals?: string } | undefined;
  if (!dependency) return true;
  const fields = (form.fields as Array<Record<string, unknown>> | undefined) ?? [];
  const matched = fields.find((candidate) => candidate.key === dependency.key);
  const root = app.data as Record<string, unknown>;
  const value = matched?.value ?? (form.id ? root[`schoolModelDetails.${form.id}.${dependency.key}`] : root[dependency.key]);
  const current = Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
  if (dependency.equals !== undefined && current !== dependency.equals) return false;
  return !(dependency.notEquals !== undefined && current === dependency.notEquals);
}

function useToastState() {
  const [notice, setNotice] = useState("");
  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3800);
  };
  return { notice, notify };
}

export function FacilityDetailPage({ redesign = false }: { redesign?: boolean }) {
  const app = reviewApplication;
  const [reviewNote, setReviewNote] = useState(app.reviewNote ?? "");
  const [signer, setSigner] = useState({ name: "", position: "", phone: "", email: "", signature: "" });
  const { notice, notify } = useToastState();
  const data = app.data as Record<string, unknown>;
  const categories = sortedGroupsFor(app);
  const criteria = visibleCriteriaFor(app);
  const person = registrantData(app);
  const date = formatDate(app.submittedAt);
  const registrationFiles = app.attachments;
  const groups = data.schoolModelForms && Array.isArray(data.schoolModelForms) ? data.schoolModelForms as Array<Record<string, unknown>> : [];
  const groupedCriteria = categories.map((group) => ({ group, items: criteria.filter((item) => item.groupId === group.id) })).filter(({ items }) => items.length);
  const attachmentsSize = (size: number) => size > 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`;

  const attachmentForModelField = (field: Record<string, unknown>, form: Record<string, unknown>) => {
    const direct = Array.isArray(field.files) ? field.files.map(String) : [];
    const prefix = form.id ? `schoolModelDetails.${form.id}.${String(field.key)}` : String(field.key);
    return direct.length ? direct : registrationFiles.filter((file) => file.fieldKey === prefix).map((file) => file.name);
  };

  return (
    <main className={`fr-page ${redesign ? "fr-redesign" : "fr-current"}`}>
      <MockMasthead current={!redesign} />
      <div className="fr-wrap">
        <div className="fr-detail-topline">
          <a className="fr-back" href={`/__mockup/preview/facility-review-readability/${redesign ? "ReviewQueueRedesign" : "ReviewQueueCurrent"}`}><ArrowLeft size={16} />Duyệt hồ sơ <span aria-hidden="true">/</span> Chi tiết cơ sở</a>
          <StatusBadge status={app.status} />
        </div>
        <section className="fr-hero" aria-label="Thông tin hồ sơ">
          <div>
            <div className="fr-refline"><span>Mã hồ sơ: {app.reference}</span><span>{categoryLabel(app.type)}</span>{app.published ? <span>Đã công bố</span> : null}</div>
            <h1>{app.applicantName}</h1>
            <div className="fr-hero-meta">
              <span><MapPin size={15} />{app.address}</span>
              <span><ClipboardCheck size={15} />Ngày nộp {date}</span>
            </div>
          </div>
          <div className="fr-hero-facts">
            <div className="fr-hero-fact"><span>Tình trạng hồ sơ</span><strong>{app.status === "needs-more-info" ? "Yêu cầu bổ sung" : app.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}</strong></div>
            <div className="fr-hero-fact"><span>Loại hình</span><strong>{categoryLabel(app.type)}</strong></div>
          </div>
        </section>

        <div className="fr-detail-layout">
          <div className="fr-main-column">
            <section className="fr-panel" aria-labelledby="registration-title">
              <header className="fr-section-heading">
                <span className="fr-section-icon"><Building2 size={19} /></span>
                <div>
                  <p className="fr-eyebrow">HỒ SƠ ĐÃ NỘP</p>
                  <h2 id="registration-title">Thông tin cơ sở đã khai báo</h2>
                  <p>Nội dung được đối chiếu theo loại hồ sơ và các trường đã điền trên portal.</p>
                </div>
                <span className="fr-received"><CheckCircle2 size={14} /> Đã tiếp nhận {date}</span>
              </header>
              <nav className="fr-group-index" aria-label="Đi đến nhóm thông tin">
                {groupedCriteria.map(({ group }, index) => <a key={group.id} href={`#${redesign ? "new" : "old"}-group-${group.id}`} aria-label={`Đến phần ${index + 1}: ${group.name}`}>{String(index + 1).padStart(2, "0")}<span aria-hidden="true">›</span></a>)}
              </nav>
              <div className="fr-registration-groups">
                {groupedCriteria.map(({ group, items }, groupIndex) => (
                  <article key={group.id} className="fr-registration-group" id={`${redesign ? "new" : "old"}-group-${group.id}`}>
                    <header className="fr-group-heading">
                      <span className="fr-group-num">{String(groupIndex + 1).padStart(2, "0")}</span>
                      <div><p className="fr-eyebrow">PHẦN {String(groupIndex + 1).padStart(2, "0")}</p><h3>{group.name}</h3></div>
                      <span className="fr-field-count">{items.length} nội dung kê khai</span>
                    </header>
                    <dl className="fr-registration-list">
                      {items.map((item: CriteriaDefinition) => (
                        <div className="fr-registration-row" key={item.key}>
                          <dt>{item.label}{item.description ? <span className="fr-description">{item.description}</span> : null}</dt>
                          <dd><AnswerValue value={item.answerType === "file" ? undefined : data[item.key]} definition={item} files={criterionFiles(app, item.key)} /></dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                ))}
                {!criteria.length ? <p className="fr-warning">Chưa có cấu hình trường đăng ký cho loại cơ sở này.</p> : null}
              </div>
            </section>

            {app.type === "school" ? (
              <section className="fr-panel fr-model-section fr-anchor-section" id="school-model-forms" aria-labelledby="school-model-title">
                <header className="fr-section-heading">
                  <span className="fr-section-icon"><FileText size={18} /></span>
                  <div><p className="fr-eyebrow">BIỂU MẪU CƠ SỞ GIÁO DỤC</p><h2 id="school-model-title">Khai báo theo mô hình · Mẫu 01–04</h2><p>Hiển thị từng mô hình đã chọn cùng toàn bộ trường lặp và minh chứng.</p></div>
                  <span className="fr-received">{groups.length} mô hình</span>
                </header>
                {!groups.length ? (
                  <p className="fr-warning" style={{ margin: 16 }}>Hồ sơ này chưa lưu dữ liệu mô hình Mẫu 01–04. Không có thông tin để đối chiếu ngoài các nội dung đã kê khai ở phần trên.</p>
                ) : (
                  <div className="fr-model-list">
                    {groups.map((form, formIndex) => {
                      const formFields = Array.isArray(form.fields) ? form.fields as Array<Record<string, unknown>> : [];
                      const visibleFields = formFields.filter((field) => isSchoolFieldVisible(field, form, app));
                      const number = String(form.formNumber ?? "—");
                      return (
                        <details className="fr-model-card" key={`${String(form.id ?? number)}-${formIndex}`} open={formIndex === 0}>
                          <summary className="fr-model-summary">
                            <span className="fr-model-number">MẪU {number}</span>
                            <span><strong>{String(form.model ?? "Mô hình hoạt động")}</strong><small>{[form.siteName, form.siteAddress].filter(Boolean).join(" · ") || (form.providerName ? `Đơn vị liên quan: ${String(form.providerName)}` : "Thông tin mô hình đã chọn")}</small></span>
                            {form.providerName ? <span className="fr-model-provider">{String(form.providerName)}</span> : null}
                            <ChevronDown size={17} aria-hidden="true" />
                          </summary>
                          <div className="fr-model-body">
                            {form.providerName ? <p className="fr-model-intro">Đơn vị liên quan: <strong>{String(form.providerName)}</strong></p> : null}
                            {visibleFields.length ? (
                              <dl className="fr-model-fields">
                                {visibleFields.map((field) => (
                                  <div className="fr-model-field" key={String(field.key)}>
                                    <dt>{String(field.label ?? "Nội dung kê khai")}</dt>
                                    <dd><AnswerValue
                                      value={field.key === "registeredProviderId" && form.providerName ? form.providerName : field.value}
                                      definition={field as unknown as CriteriaDefinition}
                                      files={attachmentForModelField(field, form)}
                                    /></dd>
                                  </div>
                                ))}
                              </dl>
                            ) : <p className="fr-model-intro">Chưa có nội dung kê khai cho mẫu này.</p>}
                            {visibleFields.some((field) => attachmentForModelField(field, form).length) ? (
                              <div className="fr-model-files"><strong>Tệp gắn với mẫu</strong><span className="fr-file-chips">
                                {visibleFields.flatMap((field) => attachmentForModelField(field, form).map((file) => <span className="fr-file-chip" key={`${String(field.key)}-${file}`}><FileText size={14} />{file}</span>))}
                              </span></div>
                            ) : null}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                )}
              </section>
            ) : null}
          </div>

          <aside className="fr-rail" aria-label="Thông tin đăng ký và xử lý hồ sơ">
            <section className="fr-panel fr-rail-card">
              <div className="fr-card-heading"><span className="fr-card-icon"><UserRound size={17} /></span><div><p className="fr-eyebrow">TÀI KHOẢN HỒ SƠ</p><h2>Người đăng ký và liên hệ</h2></div></div>
              <dl className="fr-info-list">
                {[["Người đăng ký", person.name], ["Tên đăng nhập", person.username], ["Email", person.email], ["Số điện thoại", person.phone], ["Ngày nộp hồ sơ", date], ["Hình thức đăng ký", categoryLabel(app.type)]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
            </section>

            <section className="fr-panel fr-rail-card">
              <div className="fr-card-heading"><span className="fr-card-icon"><MapPin size={17} /></span><div><p className="fr-eyebrow">THÔNG TIN LIÊN QUAN</p><h2>Thông tin nhanh</h2></div></div>
              <dl className="fr-info-list">
                {[
                  ["Tỉnh/thành phố", data.addressProvince ?? "TP. Hồ Chí Minh"],
                  ["Xã/phường", data.addressWard ?? "—"],
                  ["Địa chỉ", data.addressDetail ?? app.address],
                  ["Điện thoại", data.contact ?? app.contact],
                  ["Công suất/ngày", data.dailyCapacity ?? "—"],
                  ["Số học sinh", data.studentTotal ?? "—"],
                  ["Nhu cầu suất ăn/ngày", data.mealDemand ?? "—"],
                  ["Cập nhật", date],
                ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{formatScalar(value)}</dd></div>)}
              </dl>
            </section>

            <section className="fr-panel fr-rail-card">
              <div className="fr-card-heading"><span className="fr-card-icon"><FileText size={17} /></span><div><p className="fr-eyebrow">MINH CHỨNG</p><h2>Tệp hồ sơ đính kèm</h2></div><span className="fr-field-count">{registrationFiles.length} tệp</span></div>
              {registrationFiles.length ? <div className="fr-attachments">{registrationFiles.map((file) => {
                const isImage = file.kind.startsWith("image/");
                const Icon = isImage ? Image : FileText;
                return <div className="fr-attachment" key={`${file.fieldKey ?? "attachment"}-${file.name}`}><Icon size={17} /><span><strong>{file.name}</strong><small>{attachmentsSize(file.size)} · {file.fieldKey ?? "Tệp hồ sơ"}</small></span></div>;
              })}</div> : <p className="fr-review-copy">Chưa có tệp minh chứng.</p>}
            </section>

            <section className="fr-panel fr-rail-card fr-review-card">
              <div className="fr-card-heading"><span className="fr-card-icon"><ShieldCheck size={18} /></span><div><p className="fr-eyebrow">XỬ LÝ HỒ SƠ</p><h2>Kết luận xét duyệt</h2></div></div>
              <p className="fr-review-copy">Mọi thao tác bên dưới chỉ mô phỏng trong bản xem trước, không cập nhật hồ sơ thật.</p>
              <StatusBadge status={app.status} />
              {app.reviewNote ? <p className="fr-note-display"><strong>Ghi chú đang lưu</strong><br />{app.reviewNote}</p> : null}
              <div className="fr-review-form" style={{ marginTop: 13 }}>
                <label>Họ tên người duyệt<input value={signer.name} onChange={(event) => setSigner({ ...signer, name: event.target.value })} placeholder="Nhập họ tên người duyệt" /></label>
                <label>Chức vụ<input value={signer.position} onChange={(event) => setSigner({ ...signer, position: event.target.value })} placeholder="Nhập chức vụ" /></label>
                <label>Số điện thoại<input type="tel" value={signer.phone} onChange={(event) => setSigner({ ...signer, phone: event.target.value })} placeholder="Nhập số điện thoại" /></label>
                <label>Email<input type="email" value={signer.email} onChange={(event) => setSigner({ ...signer, email: event.target.value })} placeholder="Nhập email" /></label>
                <label className="fr-signature">Chữ ký điện tử<input value={signer.signature} onChange={(event) => setSigner({ ...signer, signature: event.target.value })} placeholder="Nhập tên người ký để mô phỏng chữ ký" /></label>
                <label>Nội dung yêu cầu bổ sung<textarea value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} placeholder="Nêu rõ trường hoặc minh chứng cơ sở cần bổ sung..." /></label>
              </div>
              <div className="fr-decision-actions">
                <button className="fr-button" type="button" onClick={() => notify("Mô phỏng: yêu cầu bổ sung chưa được gửi và trạng thái hồ sơ thật không thay đổi.")}><Mail size={16} />Tạo email yêu cầu bổ sung</button>
                <button className="fr-button fr-button-primary" type="button" onClick={() => notify("Mô phỏng: chưa duyệt, chưa công bố và không có dữ liệu nào được lưu.")}><CheckCircle2 size={16} />Duyệt và công bố</button>
              </div>
              {!app.reviewer && app.status === "approved" ? <p className="fr-warning">Hồ sơ cũ chưa có đủ thông tin cán bộ ký duyệt. Cần bổ sung thông tin trước khi công nhận kết quả duyệt.</p> : null}
            </section>
          </aside>
        </div>
      </div>
      {notice ? <div className="fr-toast" role="status">{notice}</div> : null}
    </main>
  );
}

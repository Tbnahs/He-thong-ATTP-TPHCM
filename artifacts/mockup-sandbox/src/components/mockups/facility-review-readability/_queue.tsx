import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Eye, FileSpreadsheet, Layers3, Search, Utensils, Building2, FileText } from "lucide-react";
import {
  applications,
  categoryLabel,
  formatDate,
  MockMasthead,
  rowForApplication,
  StatusBadge,
  type ApplicationStatus,
  type ApplicationType,
} from "./_shared";

type TabKey = "all" | "suppliers" | "schools" | "food";
const tabs: Array<{ key: TabKey; label: string; type?: ApplicationType; Icon: typeof Layers3 }> = [
  { key: "all", label: "Tất cả", Icon: Layers3 },
  { key: "suppliers", label: "Cơ sở cung cấp suất ăn", type: "meal-provider", Icon: Utensils },
  { key: "schools", label: "Cơ sở giáo dục", type: "school", Icon: Building2 },
  { key: "food", label: "Cơ sở cung cấp thực phẩm", type: "food-supplier", Icon: FileText },
];
const statuses: Array<{ label: string; value: ApplicationStatus; tone: string }> = [
  { label: "Chờ duyệt", value: "pending", tone: "amber" },
  { label: "Yêu cầu bổ sung", value: "needs-more-info", tone: "blue" },
  { label: "Đã duyệt", value: "approved", tone: "green" },
];

export function ReviewQueuePage({ redesign = false }: { redesign?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [notice, setNotice] = useState("");
  const [exportBusy, setExportBusy] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const rows = useMemo(() => applications.map(rowForApplication), []);
  const activeType = tabs.find((tab) => tab.key === activeTab)?.type;
  const textMatch = (row: ReturnType<typeof rowForApplication>) =>
    `${row.name} ${row.address} ${row.ward} ${row.contact}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
  const typedRows = rows.filter((row) => !activeType || row.application.type === activeType);
  const filteredRows = typedRows.filter((row) => textMatch(row) && (statusFilter === "Tất cả trạng thái" || row.application.status === statuses.find((item) => item.label === statusFilter)?.value));
  const countRows = typedRows.filter(textMatch);
  const counts = Object.fromEntries(statuses.map((item) => [item.value, countRows.filter((row) => row.application.status === item.value).length])) as Record<ApplicationStatus, number>;
  const tabCounts = Object.fromEntries(tabs.map((tab) => [tab.key, tab.type ? rows.filter((row) => row.application.type === tab.type).length : rows.length])) as Record<TabKey, number>;
  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3600);
  };
  const exportRows = () => {
    setExportBusy(true);
    const headings = ["Tên cơ sở", "Loại hình", "Tỉnh/thành phố", "Xã/phường", "Địa chỉ", "Số điện thoại", "Trạng thái", "Công suất/ngày", "Số học sinh", "Nhu cầu suất ăn/ngày", "Ngày cập nhật"];
    const body = filteredRows.map((row) => [row.name, row.category, row.province, row.ward, row.address, row.contact, row.application.status, "", row.students, "", row.updated]);
    const csv = [headings, ...body].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `duyet-co-so-${activeTab}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExportBusy(false);
    showNotice("Đã tải bản CSV mô phỏng từ các bản ghi đang hiển thị.");
  };

  return (
    <main className={`fr-page ${redesign ? "fr-redesign" : "fr-current"}`}>
      <MockMasthead current={!redesign} />
      <div className="fr-wrap">
        <div className="fr-heading">
          <div>
            <p className="fr-eyebrow">DUYỆT HỒ SƠ / CƠ SỞ</p>
            <h1>Tiếp nhận và duyệt hồ sơ cơ sở</h1>
            <p className="fr-subtitle">Danh sách hồ sơ đăng ký cơ sở an toàn thực phẩm. Hồ sơ đã duyệt sẽ được chuyển sang Quản lý hồ sơ.</p>
          </div>
          <div className="fr-actions">
            <button className="fr-button" type="button" onClick={() => showNotice("Bản mẫu Excel được mô phỏng; không có dữ liệu nào được gửi tới hệ thống.")}><FileSpreadsheet size={16} />Tải file mẫu Excel</button>
            <label className="fr-button fr-button-primary">
              <ArrowUpFromLine size={16} />Nhập từ Excel
              <input
                type="file"
                accept=".xls,.xlsx,.csv,text/csv,application/vnd.ms-excel"
                aria-label="Chọn tệp Excel để nhập mô phỏng"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setSelectedFileName(file.name);
                    showNotice(`Đã chọn ${file.name}. Nhập liệu chỉ được mô phỏng trong bản xem trước.`);
                  }
                  event.currentTarget.value = "";
                }}
                hidden
              />
            </label>
            <button className="fr-button" type="button" onClick={exportRows} disabled={exportBusy}><ArrowDownToLine size={16} />Xuất Excel</button>
          </div>
        </div>

        <nav className="fr-tabs" aria-label="Loại hồ sơ">
          {tabs.map(({ key, label, Icon }) => (
            <button className="fr-tab" key={key} type="button" aria-pressed={activeTab === key} onClick={() => { setActiveTab(key); setStatusFilter("Tất cả trạng thái"); }}>
              <strong>{label}</strong><span>{tabCounts[key]}</span><Icon size={16} aria-hidden="true" />
            </button>
          ))}
        </nav>

        <section className="fr-status-grid" aria-label="Lọc nhanh theo trạng thái">
          {statuses.map((item) => {
            const active = statusFilter === item.label;
            return (
              <button key={item.value} className="fr-status-filter" data-tone={item.tone} type="button" aria-pressed={active} onClick={() => setStatusFilter(active ? "Tất cả trạng thái" : item.label)}>
                <span><strong>{item.label}</strong><small>{active ? "Bấm để bỏ lọc" : "Lọc danh sách"}</small></span>
                <span className="fr-status-count">{counts[item.value]}</span>
              </button>
            );
          })}
        </section>

        <section className="fr-panel fr-table-panel" aria-label="Danh sách hồ sơ">
          <div className="fr-table-top">
            <label className="fr-search">
              <Search size={17} aria-hidden="true" />
              <input className="fr-field" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên cơ sở, địa chỉ, số điện thoại..." aria-label="Tìm hồ sơ" />
            </label>
            <label className="fr-toolbar-label" htmlFor={`status-select-${redesign ? "new" : "old"}`}>Trạng thái</label>
            <select id={`status-select-${redesign ? "new" : "old"}`} className="fr-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              {["Tất cả trạng thái", ...statuses.map((item) => item.label)].map((label) => <option key={label}>{label}</option>)}
            </select>
            <span className="fr-row-count">{filteredRows.length} / {countRows.length} bản ghi hiển thị</span>
          </div>
          <div className="fr-table-scroll">
            <table className="fr-table">
              <thead><tr>
                <th>Cơ sở</th>
                {activeTab === "all" ? <><th>Loại cơ sở</th><th>Địa chỉ</th><th>Liên hệ</th></> : <th>Địa chỉ</th>}
                {activeTab === "schools" ? <><th>Cấp học</th><th>Học sinh</th></> : null}
                {activeTab === "food" ? <><th>Nhóm thực phẩm</th><th>Cập nhật</th></> : null}
                <th>Trạng thái</th><th>Thao tác</th>
              </tr></thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id}>
                    <td><span className="fr-facility-name">{row.name}</span><span className="fr-cell-meta">{row.ward} · Cập nhật {row.updated}</span></td>
                    {activeTab === "all" ? <><td>{categoryLabel(row.application.type)}</td><td className="fr-address">{row.address}</td><td>{row.contact}</td></> : <td className="fr-address">{row.address}</td>}
                    {activeTab === "schools" ? <><td>{row.level}</td><td>{row.students}</td></> : null}
                    {activeTab === "food" ? <><td>{row.category}</td><td>{row.updated}</td></> : null}
                    <td><StatusBadge status={row.application.status} /></td>
                    <td><a className="fr-open-link" href={`/__mockup/preview/facility-review-readability/${redesign ? "FacilityDetailRedesign" : "FacilityDetailCurrent"}`} target="_blank" rel="noreferrer"><Eye size={15} />Mở hồ sơ</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fr-mobile-list">
            {filteredRows.map((row) => (
              <article className="fr-mobile-card" key={row.id}>
                <div className="fr-mobile-top"><div><h3>{row.name}</h3><span className="fr-cell-meta">{categoryLabel(row.application.type)}</span></div><StatusBadge status={row.application.status} /></div>
                <dl className="fr-mobile-meta">
                  <div className="fr-span-2"><dt>Địa chỉ</dt><dd>{row.address}</dd></div>
                  <div><dt>Xã / phường</dt><dd>{row.ward}</dd></div>
                  <div><dt>Liên hệ</dt><dd>{row.contact}</dd></div>
                  {activeTab === "schools" ? <><div><dt>Cấp học</dt><dd>{row.level}</dd></div><div><dt>Số học sinh</dt><dd>{row.students}</dd></div></> : null}
                  {activeTab === "food" ? <div className="fr-span-2"><dt>Nhóm thực phẩm</dt><dd>{row.category}</dd></div> : null}
                  <div><dt>Ngày cập nhật</dt><dd>{row.updated}</dd></div>
                  {activeTab === "all" ? <div><dt>Loại cơ sở</dt><dd>{row.category}</dd></div> : null}
                </dl>
                <a className="fr-open-link" href={`/__mockup/preview/facility-review-readability/${redesign ? "FacilityDetailRedesign" : "FacilityDetailCurrent"}`} target="_blank" rel="noreferrer"><Eye size={15} />Mở hồ sơ</a>
              </article>
            ))}
          </div>
          {!filteredRows.length ? <div className="fr-empty"><div><Search size={23} /><p>Không tìm thấy dữ liệu phù hợp.</p></div></div> : null}
        </section>
        <p className="fr-footnote">File mẫu dùng định dạng Excel tương thích .xls. Giữ nguyên hàng tiêu đề khi nhập; dữ liệu mới sẽ được thêm vào danh sách hiện tại.</p>
        {selectedFileName ? <span className="sr-only">Tệp đã chọn: {selectedFileName}</span> : null}
      </div>
      {notice ? <div className="fr-toast" role="status">{notice}</div> : null}
    </main>
  );
}

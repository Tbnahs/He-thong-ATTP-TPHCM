import "./_group.css";
import "./Redesign.css";
import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileImage,
  FileText,
  Landmark,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

const groups = [
  {
    name: "Thông tin chung cơ sở giáo dục",
    fields: [
      ["Tên cơ sở giáo dục", "Trường Mầm non Hoa Sen"],
      ["Địa chỉ điểm chính", "35 Nguyễn Du, phường Sài Gòn, TP. Hồ Chí Minh"],
      ["Cấp học", "Mầm non"],
      ["Tổng số học sinh", "420"],
      ["Số học sinh bán trú", "286"],
      ["Hiệu trưởng", "Nguyễn Thị Thanh Hà"],
    ],
  },
  {
    name: "Mô hình và quy mô hoạt động bếp ăn",
    fields: [
      ["Mô hình hoạt động", "BATT tự tổ chức · BATT hợp đồng · Nhận suất ăn sẵn · Căng tin"],
      ["Quy mô kê khai", "Tách riêng theo từng địa điểm và mô hình"],
      ["Đơn vị thực hiện / cung cấp", "Kê khai riêng trong Mẫu 02, 03 và 04"],
    ],
  },
  {
    name: "Hồ sơ pháp lý và người phụ trách ATTP",
    fields: [
      ["Mã số thuế", "0309123456"],
      ["Giấy chứng nhận ATTP", "ATTP-HCM-2026-0084"],
      ["Ngày hết hạn", "12/08/2027"],
      ["Người phụ trách ATTP", "Trần Minh Ngọc · 0908 456 321"],
    ],
  },
  {
    name: "Nhân sự, điều kiện cơ sở và trang thiết bị",
    fields: [
      ["Nhân sự bếp ăn", "12 người"],
      ["Bếp một chiều", "Có"],
      ["Tủ lưu mẫu thức ăn", "Có · 02 tủ"],
    ],
  },
  {
    name: "Thực hành ATTP, kiểm thực và lưu mẫu",
    fields: [
      ["Thực hiện kiểm thực ba bước", "Có"],
      ["Thời gian lưu mẫu", "24 giờ"],
      ["Quy trình vệ sinh dụng cụ", "Có quy trình, cập nhật 08/2026"],
    ],
  },
  {
    name: "Khu vực ăn uống",
    fields: [
      ["Khu vực ăn riêng", "Có"],
      ["Số chỗ ngồi", "210"],
    ],
  },
  {
    name: "Nguồn nước, nguyên liệu và nước uống",
    fields: [
      ["Nguồn nước sử dụng", "Nước máy thành phố"],
      ["Nhà cung cấp thực phẩm", "Công ty TNHH Nông sản An Phú"],
      ["Hồ sơ truy xuất nguồn gốc", "Đã kê khai"],
    ],
  },
  {
    name: "Nội dung khác và xác nhận",
    fields: [
      ["Ghi chú của cơ sở", "Bếp ăn vận hành theo hợp đồng với đơn vị cung cấp suất ăn."],
      ["Người xác nhận", "Nguyễn Thị Thanh Hà · Hiệu trưởng"],
    ],
  },
];

type ModelFormField = {
  label: string;
  value: string;
};

type SchoolModelForm = {
  number: string;
  model: string;
  title: string;
  description: string;
  site: string;
  provider: string;
  fields: ModelFormField[];
  files: string[];
};

const schoolModelForms: SchoolModelForm[] = [
  {
    number: "01",
    model: "BATT tự tổ chức",
    title: "Bếp ăn tập thể do cơ sở giáo dục tự tổ chức",
    description: "Phần nội dung khai báo của cơ sở giáo dục về bếp ăn tự tổ chức.",
    site: "Trường Mầm non Hoa Sen · 35 Nguyễn Du, phường Sài Gòn",
    provider: "Cơ sở giáo dục tự tổ chức",
    fields: [
      { label: "Người trực tiếp phụ trách ATTP", value: "Trần Minh Ngọc · Phụ trách ATTP · 0908 456 321 · ngoc.tran@hoasen.edu.vn" },
      { label: "Tổng số nhân sự tham gia chế biến", value: "12 người · 9 người trực tiếp" },
      { label: "Số người đã tập huấn ATTP", value: "12/12 người" },
      { label: "Tổng diện tích khu bếp", value: "64 m²" },
      { label: "Khu vực sơ chế / chế biến / chia suất", value: "18 m² / 22 m² / 14 m²" },
      { label: "Phòng sơ chế, chế biến và chia suất riêng biệt", value: "Có / Có / Có" },
      { label: "Quy trình và phân bố khu vực chế biến", value: "Tiếp nhận → sơ chế → chế biến → chia suất một chiều" },
      { label: "Tường, nền, trần", value: "Tường ốp gạch sáng màu; nền chống trượt, thoát nước tốt" },
      { label: "Thiết bị bảo quản nguyên liệu", value: "Tủ mát inox riêng cho nguyên liệu sống" },
      { label: "Thiết bị bảo quản thực phẩm", value: "Tủ mát riêng cho thực phẩm đã chế biến" },
      { label: "Bồn rửa và phân loại bồn rửa", value: "03 bồn inox riêng cho nguyên liệu, dụng cụ và tay" },
      { label: "Bàn sơ chế và chế biến", value: "06 bàn inox" },
      { label: "Dụng cụ chế biến", value: "Dao, thớt phân màu theo nhóm thực phẩm" },
      { label: "Dụng cụ ăn uống và chứa đựng thức ăn", value: "Khay inox và hộp có nắp, vệ sinh sau mỗi ca" },
      { label: "Dụng cụ lưu mẫu", value: "Tủ chuyên dụng 2–8°C · lưu mẫu tối thiểu 24 giờ" },
      { label: "Thiết bị phòng chống côn trùng", value: "Lưới chắn côn trùng và đèn bắt côn trùng" },
      { label: "Dụng cụ thu gom rác thải", value: "Thùng có nắp đậy, phân loại và chuyển hằng ngày" },
      { label: "Thiết bị nấu nướng", value: "Bếp gas công nghiệp · 04 họng" },
      { label: "Bảo hộ lao động và thực hành ATTP", value: "Tạp dề, mũ, khẩu trang · kiểm tra đầu mỗi ca" },
      { label: "Kiểm thực 03 bước", value: "Thực hiện trước, trong và sau chế biến" },
      { label: "Lấy mẫu thức ăn và bảo quản mẫu", value: "Lấy riêng từng món · ghi nhãn, lưu tối thiểu 24 giờ" },
      { label: "Biện pháp kiểm soát nội bộ", value: "Kiểm soát đầu vào, nhiệt độ chế biến và vệ sinh dụng cụ" },
      { label: "Khu vực ăn uống", value: "Nhà ăn riêng biệt · 210 m² · 3 ca phục vụ" },
      { label: "Nguồn nước và kiểm nghiệm định kỳ", value: "Nước máy · kiểm nghiệm 06 tháng/lần" },
      { label: "Nước uống tại cơ sở giáo dục", value: "Nước uống đóng bình · Công ty Nước sạch Thành Đạt" },
      { label: "Nhà cung cấp nguyên liệu", value: "Công ty TNHH Nông sản An Phú · có hồ sơ truy xuất" },
    ],
    files: ["quyet-dinh-thanh-lap.pdf", "giay-chung-nhan-attp.pdf"],
  },
  {
    number: "02",
    model: "BATT hợp đồng",
    title: "Bếp ăn tập thể hợp đồng",
    description: "Nội dung khai báo của đơn vị thực hiện nấu ăn tại trường và xác nhận của cơ sở giáo dục.",
    site: "Trường Mầm non Hoa Sen · 35 Nguyễn Du, phường Sài Gòn",
    provider: "Công ty Suất ăn Minh Tâm",
    fields: [
      { label: "Đơn vị thực hiện nấu ăn đã đăng ký trên hệ thống", value: "Đã liên kết · HS-DV-2026-0018" },
      { label: "Tên tổ chức / cá nhân / đơn vị thực hiện (trụ sở chính)", value: "Công ty Suất ăn Minh Tâm" },
      { label: "Địa chỉ trụ sở chính", value: "12 Đường số 5, phường Tân Bình, TP. Hồ Chí Minh" },
      { label: "Mã số doanh nghiệp / mã số thuế", value: "0314567890" },
      { label: "Ngày cấp · nơi cấp", value: "15/03/2019 · Sở Kế hoạch và Đầu tư TP.HCM" },
      { label: "Ngày đăng ký lần đầu", value: "15/03/2019" },
      { label: "Ngày đăng ký thay đổi gần nhất · lần thay đổi", value: "08/02/2025 · lần 3" },
      { label: "Người đại diện theo pháp luật · chức danh", value: "Lê Hoàng Minh · Giám đốc" },
      { label: "Tên cơ sở / địa điểm tổ chức nấu ăn", value: "Bếp ăn Trường Mầm non Hoa Sen" },
      { label: "Địa chỉ địa điểm thực hiện", value: "35 Nguyễn Du, phường Sài Gòn, TP. Hồ Chí Minh" },
      { label: "Mã số chi nhánh / mã số địa điểm kinh doanh", value: "0314567890-001" },
      { label: "Ngày cấp địa điểm · nơi cấp", value: "20/09/2021 · Sở Kế hoạch và Đầu tư TP.HCM" },
      { label: "Ngày đăng ký lần đầu tại địa điểm", value: "20/09/2021" },
      { label: "Ngày đăng ký thay đổi gần nhất tại địa điểm · lần thay đổi", value: "08/02/2025 · lần 2" },
      { label: "Người đại diện tại địa điểm · chức danh", value: "Lê Hoàng Minh · Người đại diện chi nhánh" },
      { label: "Thông tin người phụ trách ATTP của đơn vị thực hiện", value: "Đỗ Gia Huy · Quản lý ATTP · 0905 221 468 · huy.do@minhtam.vn" },
      { label: "Hợp đồng thuê nấu · số hợp đồng", value: "MT-HS/2026/018" },
      { label: "Hợp đồng thuê nấu · ngày ký", value: "01/08/2026" },
      { label: "Giấy chứng nhận quản lý chất lượng của đơn vị", value: "HACCP · HACCP-MT-2026-014 · cấp 01/08/2026, hết hạn 01/08/2027 · Chi cục ATTP TP.HCM · áp dụng tại bếp Hoa Sen · chế biến suất ăn trường học" },
    ],
    files: ["hop-dong-suat-an.pdf", "giay-chung-nhan-attp.pdf"],
  },
  {
    number: "03",
    model: "Nhận suất ăn sẵn",
    title: "Cơ sở giáo dục nhận suất ăn sẵn",
    description: "Nội dung khai báo của đơn vị cung cấp suất ăn và xác nhận của cơ sở giáo dục.",
    site: "Trường Mầm non Hoa Sen · 35 Nguyễn Du, phường Sài Gòn",
    provider: "Công ty Suất ăn Việt An",
    fields: [
      { label: "Đơn vị cung cấp suất ăn đã đăng ký trên hệ thống", value: "Đã liên kết · HS-DV-2026-0026" },
      { label: "Tên đơn vị cung cấp (trụ sở chính)", value: "Công ty Suất ăn Việt An" },
      { label: "Địa chỉ trụ sở chính", value: "68 Nguyễn Văn Trỗi, phường Phú Nhuận, TP. Hồ Chí Minh" },
      { label: "Mã số doanh nghiệp / mã số thuế", value: "0317826401" },
      { label: "Ngày cấp · nơi cấp", value: "24/09/2020 · Sở Kế hoạch và Đầu tư TP.HCM" },
      { label: "Ngày đăng ký lần đầu · thay đổi gần nhất · lần thay đổi", value: "24/09/2020 · 11/04/2025 · lần 2" },
      { label: "Người đại diện theo pháp luật · chức danh", value: "Phạm Thị Thu An · Giám đốc" },
      { label: "Tên cơ sở / địa điểm nấu ăn", value: "Bếp trung tâm Việt An" },
      { label: "Địa chỉ địa điểm nấu ăn", value: "68 Nguyễn Văn Trỗi, phường Phú Nhuận, TP. Hồ Chí Minh" },
      { label: "Mã số chi nhánh / mã số địa điểm kinh doanh", value: "0317826401-001" },
      { label: "Ngày cấp địa điểm · nơi cấp", value: "05/10/2020 · Sở Kế hoạch và Đầu tư TP.HCM" },
      { label: "Ngày đăng ký lần đầu tại địa điểm", value: "05/10/2020" },
      { label: "Ngày đăng ký thay đổi gần nhất tại địa điểm · lần thay đổi", value: "11/04/2025 · lần 1" },
      { label: "Người đại diện tại địa điểm · chức danh", value: "Phạm Thị Thu An · Người đại diện chi nhánh" },
      { label: "Thông tin người phụ trách ATTP của đơn vị cung cấp suất ăn", value: "Nguyễn Hoàng Phúc · Phụ trách ATTP · 0903 115 520 · phuc.nguyen@vietan.vn" },
      { label: "Giấy chứng nhận quản lý chất lượng của đơn vị", value: "ISO 22000:2018 · ISO-VA-2025-024 · cấp 24/09/2025, hết hạn 24/09/2027 · Bureau Veritas · áp dụng tại bếp trung tâm Việt An · cung cấp suất ăn sẵn" },
      { label: "Hợp đồng cung cấp suất ăn · số hợp đồng", value: "VA-HS/2026/004" },
      { label: "Hợp đồng cung cấp suất ăn · ngày ký", value: "05/08/2026" },
      { label: "Địa điểm cơ sở giáo dục nhận suất", value: "Trường Mầm non Hoa Sen · 286 suất/ngày" },
      { label: "Ca sáng · thời điểm giao/nhận · số suất", value: "06:15 · 48 suất" },
      { label: "Ca trưa · thời điểm giao/nhận · số suất", value: "10:15 · 286 suất" },
      { label: "Ca xế · thời điểm giao/nhận · số suất", value: "14:00 · 190 suất" },
      { label: "Ca chiều · thời điểm giao/nhận · số suất", value: "16:30 · 48 suất" },
      { label: "Địa điểm tập kết, giao / nhận suất ăn", value: "Cửa nhận hàng phía sau khu bếp · bàn giao có ký nhận" },
    ],
    files: ["hop-dong-viet-an.pdf", "lich-giao-nhan-suat-an.pdf"],
  },
  {
    number: "04",
    model: "Căng tin trường học",
    title: "Căng tin trong cơ sở giáo dục",
    description: "Phần nội dung khai báo của đơn vị căng tin và xác nhận của cơ sở giáo dục.",
    site: "Trường Mầm non Hoa Sen · 35 Nguyễn Du, phường Sài Gòn",
    provider: "Căng tin Trường học An Phú",
    fields: [
      { label: "Đơn vị kinh doanh căng tin đã đăng ký trên hệ thống", value: "Đã liên kết · HS-DV-2026-0031" },
      { label: "Tên tổ chức / cá nhân / đơn vị kinh doanh căng tin", value: "Căng tin Trường học An Phú" },
      { label: "Địa chỉ", value: "35 Nguyễn Du, phường Sài Gòn, TP. Hồ Chí Minh" },
      { label: "Mã số chi nhánh / mã số địa điểm / mã số thuế", value: "0319872460-001" },
      { label: "Ngày cấp · nơi cấp", value: "12/06/2023 · UBND phường Sài Gòn" },
      { label: "Ngày đăng ký lần đầu", value: "12/06/2023" },
      { label: "Ngày đăng ký thay đổi gần nhất · lần thay đổi", value: "10/01/2026 · lần 2" },
      { label: "Người đại diện theo pháp luật / chủ cơ sở", value: "Vũ Thị Thu Trang" },
      { label: "Chức danh", value: "Chủ hộ kinh doanh" },
      { label: "Thông tin người phụ trách ATTP của đơn vị kinh doanh căng tin", value: "Nguyễn Thị Lệ · Phụ trách ATTP · 0912 450 660 · le.nguyen@anphu.vn" },
      { label: "Hợp đồng căng tin · số hợp đồng", value: "HS-CT/2026/07" },
      { label: "Hợp đồng căng tin · ngày ký", value: "01/07/2026" },
      { label: "Giấy chứng nhận / hồ sơ chất lượng của đơn vị kinh doanh căng tin", value: "Giấy chứng nhận cơ sở đủ điều kiện ATTP · CN-ATTP-AP-2026-031 · cấp 15/05/2026, hết hạn 15/05/2027 · Chi cục ATTP TP.HCM · địa điểm căng tin Trường học An Phú · kinh doanh thực phẩm đóng gói và đồ uống" },
      { label: "Các hồ sơ pháp lý khác", value: "Danh sách thực phẩm kinh doanh và nguồn gốc nhà cung cấp" },
      { label: "Thông tin khác", value: "Phục vụ học sinh và nhân sự trong giờ học" },
    ],
    files: ["giay-dang-ky-cang-tin.pdf", "khu-bep-hoa-sen.jpg"],
  },
];

const registrant = [
  ["Người đại diện", "Nguyễn Thị Thanh Hà"],
  ["Tên đăng nhập", "hoasen.admin"],
  ["Email", "vanthu@hoasen.edu.vn"],
  ["Số điện thoại", "028 3822 4567"],
  ["Ngày nộp hồ sơ", "12/08/2026"],
  ["Hình thức đăng ký", "Cơ sở giáo dục"],
];

const files = [
  { name: "quyet-dinh-thanh-lap.pdf", size: "0,5 MB", kind: "pdf" },
  { name: "giay-chung-nhan-attp.pdf", size: "0,8 MB", kind: "pdf" },
  { name: "hop-dong-suat-an.pdf", size: "0,6 MB", kind: "pdf" },
  { name: "khu-bep-hoa-sen.jpg", size: "1,8 MB", kind: "image" },
  { name: "lich-giao-nhan-suat-an.pdf", size: "0,4 MB", kind: "pdf" },
  { name: "hop-dong-viet-an.pdf", size: "0,5 MB", kind: "pdf" },
  { name: "giay-dang-ky-cang-tin.pdf", size: "0,6 MB", kind: "pdf" },
];

type ReviewAction = "approve" | "cancel";

export function Redesign() {
  const [selectedFile, setSelectedFile] = useState<(typeof files)[number] | null>(null);
  const [pendingAction, setPendingAction] = useState<ReviewAction | null>(null);
  const [result, setResult] = useState<ReviewAction | null>(null);

  const closeDialog = () => {
    setSelectedFile(null);
    setPendingAction(null);
  };

  const completeAction = () => {
    if (pendingAction) setResult(pendingAction);
    setPendingAction(null);
  };

  const openFile = (name: string) => {
    const file = files.find((item) => item.name === name);
    if (file) setSelectedFile(file);
  };

  return (
    <main className="review-shell">
      <header className="review-topbar">
        <div className="review-brand">
          <span className="review-seal" aria-hidden="true"><Landmark size={19} /></span>
          <span className="review-brand-copy">
            <strong>CỔNG AN TOÀN THỰC PHẨM</strong>
            <span>THÀNH PHỐ HỒ CHÍ MINH</span>
          </span>
        </div>
        <a className="review-back" href="#danh-sach-ho-so">
          <ArrowLeft size={15} aria-hidden="true" /> Quay lại Duyệt hồ sơ
        </a>
      </header>

      <div className="review-page">
        <div className="review-page-heading">
          <div>
            <p className="review-eyebrow">THÔNG TIN CHI TIẾT CƠ SỞ</p>
            <h1>Trường Mầm non Hoa Sen</h1>
            <p className="review-subtitle">Cơ sở giáo dục <span aria-hidden="true">·</span> Cập nhật 12/08/2026</p>
          </div>
          <span className={`review-status ${result ? "is-resolved" : ""}`} aria-live="polite">
            <i aria-hidden="true" /> {result === "approve" ? "Đã duyệt" : result === "cancel" ? "Đã hủy bỏ" : "Cần bổ sung"}
          </span>
        </div>

        <section className="review-summary" aria-label="Tóm tắt hồ sơ">
          <div className="review-summary-main">
            <div className="review-reference">
              <span>HS-2026-0037</span><b aria-hidden="true">/</b>
              <span>Cơ sở giáo dục</span><b aria-hidden="true">/</b>
              <span>Hồ sơ đăng ký</span>
            </div>
            <h2>Trường Mầm non Hoa Sen</h2>
            <div className="review-contact-line">
              <span><MapPin size={14} aria-hidden="true" />35 Nguyễn Du, phường Sài Gòn, TP. Hồ Chí Minh</span>
              <span><Phone size={14} aria-hidden="true" />028 3822 4567</span>
            </div>
          </div>
          <div className="review-summary-facts">
            <div className="summary-fact">
              <span>Ngày nộp</span>
              <strong>12/08/2026</strong>
            </div>
            <div className="summary-fact summary-rating">
              <span>Đánh giá</span>
              <strong>Cần bổ sung <i>·</i> 82/100</strong>
            </div>
          </div>
        </section>

        <div className="review-layout">
          <section className="dossier-column" aria-labelledby="dossier-title">
            <div className="section-heading dossier-heading">
              <div className="section-symbol"><Building2 size={17} aria-hidden="true" /></div>
              <div>
                <p className="review-eyebrow">HỒ SƠ CƠ SỞ</p>
                <h2 id="dossier-title">Thông tin cơ sở đã khai báo</h2>
                <p>Hiển thị đầy đủ theo đúng các nhóm và trường trong form đăng ký.</p>
              </div>
              <span className="received-mark"><CheckCircle2 size={14} aria-hidden="true" /> Đã tiếp nhận 12/08/2026</span>
            </div>

            <nav className="group-index" aria-label="Đi đến nhóm thông tin">
              {groups.map((group, index) => (
                <a key={group.name} href={`#group-${index + 1}`} aria-label={`Đến phần ${index + 1}: ${group.name}`}>
                  {String(index + 1).padStart(2, "0")}<ChevronRight size={11} aria-hidden="true" />
                </a>
              ))}
            </nav>

            <div className="group-grid">
              {groups.map((group, index) => (
                <article className={`data-group ${index === 0 || index === 7 ? "data-group-wide" : ""}`} key={group.name} id={`group-${index + 1}`}>
                  <header className="data-group-header">
                    <span className="group-number">{String(index + 1).padStart(2, "0")}</span>
                    <div className="group-title">
                      <span>PHẦN {String(index + 1).padStart(2, "0")}</span>
                      <h3>{group.name}</h3>
                    </div>
                    <span className="field-count">{group.fields.length} nội dung kê khai</span>
                  </header>
                  <dl className="field-grid">
                    {group.fields.map(([label, value]) => (
                      <div className="field-row" key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>

            <section className="model-forms-section" id="school-model-forms" aria-labelledby="model-forms-title">
              <div className="model-forms-heading">
                <span className="section-symbol"><FileText size={17} aria-hidden="true" /></span>
                <div>
                  <p className="review-eyebrow">MẪU PHIẾU TỪ FORM ĐĂNG KÝ</p>
                  <h2 id="model-forms-title">Kê khai theo mô hình hoạt động · Mẫu 01–04</h2>
                  <p>
                    Mỗi địa điểm và mô hình có một phiếu riêng. Chỉ các mô hình đã chọn tại cổng đăng ký mới xuất hiện trong hồ sơ.
                  </p>
                </div>
                <span className="model-form-total">{schoolModelForms.length} phiếu</span>
              </div>

              <nav className="model-form-index" aria-label="Đi đến mẫu phiếu theo mô hình">
                {schoolModelForms.map((form) => (
                  <a key={form.number} href={`#model-form-${form.number}`}>
                    <span>Mẫu {form.number}</span>
                    <small>{form.model}</small>
                  </a>
                ))}
              </nav>

              <div className="model-form-list">
                {schoolModelForms.map((form, index) => (
                  <details
                    className="model-form-card"
                    id={`model-form-${form.number}`}
                    key={form.number}
                    open={index === 0}
                  >
                    <summary className="model-form-summary">
                      <span className="model-form-number">MẪU {form.number}</span>
                      <span className="model-form-summary-copy">
                        <strong>{form.title}</strong>
                        <span>{form.model} · {form.site}</span>
                      </span>
                      <span className="model-form-provider">{form.provider}</span>
                      <ChevronRight className="model-form-chevron" size={17} aria-hidden="true" />
                    </summary>
                    <div className="model-form-content">
                      <p className="model-form-description">{form.description}</p>
                      <div className="model-form-context">
                        <span><MapPin size={14} aria-hidden="true" /> {form.site}</span>
                        <span><Building2 size={14} aria-hidden="true" /> {form.provider}</span>
                      </div>
                      <dl className="model-form-fields">
                        {form.fields.map((field) => (
                          <div className="model-form-field" key={field.label}>
                            <dt>{field.label}</dt>
                            <dd>{field.value}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="model-form-files">
                        <span className="model-files-label">Tệp gắn với mẫu</span>
                        <div>
                          {form.files.map((fileName) => (
                            <button
                              key={fileName}
                              type="button"
                              onClick={() => openFile(fileName)}
                              aria-label={`Xem tệp ${fileName} thuộc Mẫu ${form.number}`}
                            >
                              <FileText size={13} aria-hidden="true" /> {fileName} <Eye size={12} aria-hidden="true" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </section>

          <aside className="review-rail" aria-label="Thông tin đăng ký và xử lý hồ sơ">
            <section className="rail-card registrant-card">
              <div className="rail-heading">
                <span className="rail-icon"><UserRound size={17} aria-hidden="true" /></span>
                <div>
                  <p className="review-eyebrow">TÀI KHOẢN HỒ SƠ</p>
                  <h2>Người đăng ký và liên hệ</h2>
                </div>
              </div>
              <dl className="registrant-list">
                {registrant.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rail-card evidence-card">
              <div className="rail-section-title">
                <div>
                  <p className="review-eyebrow">MINH CHỨNG</p>
                  <h2>Tệp hồ sơ đính kèm</h2>
                </div>
                <span className="file-total">{files.length} tệp</span>
              </div>
              <div className="evidence-list">
                {files.map((file) => {
                  const Icon = file.kind === "image" ? FileImage : FileText;
                  return (
                    <button
                      type="button"
                      className="evidence-file"
                      key={file.name}
                      onClick={() => setSelectedFile(file)}
                      aria-label={`Xem tệp ${file.name}, ${file.size}`}
                    >
                      <span className={`file-icon ${file.kind}`}><Icon size={18} aria-hidden="true" /></span>
                      <span className="file-copy">
                        <strong>{file.name}</strong>
                        <span><Eye size={12} aria-hidden="true" />{file.size} <i>·</i> Xem</span>
                      </span>
                      <ChevronRight className="file-chevron" size={15} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rail-card review-note-card" aria-label="Ghi chú thẩm định">
              <p className="review-eyebrow">GHI CHÚ ĐANG LƯU</p>
              <p>Cần đối chiếu thông tin đơn vị và mô hình hoạt động theo Mẫu 01–04.</p>
              <a href="#school-model-forms">Xem các mẫu phiếu <ChevronRight size={13} aria-hidden="true" /></a>
            </section>

            <section className="rail-card decision-card">
              <div className="decision-heading">
                <span className="decision-icon"><ShieldCheck size={17} aria-hidden="true" /></span>
                <div>
                  <p className="review-eyebrow">XỬ LÝ HỒ SƠ</p>
                  <h2>Cập nhật kết quả xét duyệt</h2>
                </div>
              </div>
              <p className="decision-description">Cán bộ có thể duyệt hồ sơ hoặc hủy bỏ hồ sơ ngay tại trang này.</p>
              <span className={`review-status decision-status ${result ? "is-resolved" : ""}`} aria-live="polite">
                <i aria-hidden="true" /> {result === "approve" ? "Đã duyệt" : result === "cancel" ? "Đã hủy bỏ" : "Cần bổ sung"}
              </span>
              <div className="decision-actions">
                <button className="button-cancel" type="button" onClick={() => setPendingAction("cancel")} disabled={result !== null}>
                  <X size={15} aria-hidden="true" /> Hủy bỏ
                </button>
                <button className="button-approve" type="button" onClick={() => setPendingAction("approve")} disabled={result !== null}>
                  <CheckCircle2 size={15} aria-hidden="true" /> Duyệt hồ sơ
                </button>
              </div>
            </section>

          </aside>
        </div>
      </div>

      {(selectedFile || pendingAction) && (
        <div className="review-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
          <section
            className="review-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            onKeyDown={(event) => { if (event.key === "Escape") closeDialog(); }}
          >
            <button className="dialog-close" type="button" onClick={closeDialog} aria-label="Đóng hộp thoại" autoFocus><X size={18} /></button>
            {selectedFile ? (
              <>
                <span className={`dialog-file-icon ${selectedFile.kind === "image" ? "image" : ""}`}>
                  {selectedFile.kind === "image" ? <FileImage size={22} aria-hidden="true" /> : <FileText size={22} aria-hidden="true" />}
                </span>
                <p className="review-eyebrow">MINH CHỨNG HỒ SƠ</p>
                <h2 id="dialog-title">Xem tệp đính kèm</h2>
                <p className="dialog-file-name">{selectedFile.name}</p>
                <p className="dialog-file-size">{selectedFile.size}</p>
                <button className="dialog-primary" type="button" onClick={closeDialog}>Đóng</button>
              </>
            ) : (
              <>
                <span className={`dialog-file-icon ${pendingAction === "cancel" ? "cancel" : ""}`}>
                  {pendingAction === "approve" ? <Check size={22} aria-hidden="true" /> : <X size={22} aria-hidden="true" />}
                </span>
                <p className="review-eyebrow">XỬ LÝ HỒ SƠ</p>
                <h2 id="dialog-title">{pendingAction === "approve" ? "Duyệt hồ sơ này?" : "Hủy bỏ hồ sơ này?"}</h2>
                <p className="dialog-copy">Trường Mầm non Hoa Sen <span>·</span> HS-2026-0037</p>
                <div className="dialog-actions">
                  <button className="dialog-secondary" type="button" onClick={closeDialog}>Quay lại</button>
                  <button className="dialog-primary" type="button" onClick={completeAction}>
                    {pendingAction === "approve" ? "Duyệt hồ sơ" : "Hủy bỏ"}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
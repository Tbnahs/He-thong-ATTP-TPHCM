import { Router, type IRouter } from "express";
import {
  CreateApplicationBody,
  GetAdminSummaryResponse,
  GetApplicationParams,
  GetApplicationResponse,
  GetPublicRecordParams,
  GetPublicRecordResponse,
  GetPublicSummaryResponse,
  ListApplicationsQueryParams,
  ListApplicationsResponse,
  ListApprovedSuppliersResponse,
  ListPublicRecordsQueryParams,
  ListPublicRecordsResponse,
  ReviewApplicationBody,
  ReviewApplicationParams,
  ReviewApplicationResponse,
  GetCriteriaQueryParams,
  GetCriteriaResponse,
  UpdateCriteriaParams,
  UpdateCriteriaBody,
  UpdateCriteriaResponse,
  ListCriteriaHistoryParams,
  ListCriteriaHistoryResponse,
} from "@workspace/api-zod";
import {
  createApplication,
  getApplications,
  getPublicRecords,
  reviewApplication,
} from "../lib/attp-data";
import { getCriteria, listCriteriaHistory, updateCriteria } from "../lib/criteria-data";

const router: IRouter = Router();

router.get("/public/summary", (_req, res) => {
  const records = getPublicRecords();
  const count = (category: string) =>
    records.filter((record) => record.category === category).length + 24;
  res.json(
    GetPublicSummaryResponse.parse({
      eligibleFacilities: count("eligible-facilities") + 120,
      selfDeclaredProducts: count("self-declared-products") + 380,
      registeredProducts: count("registered-products") + 64,
      licensedAdvertising: count("licensed-advertising") + 42,
      testingFacilities: count("testing-facilities") + 18,
    }),
  );
});

router.get("/public/records", (req, res) => {
  const params = ListPublicRecordsQueryParams.parse(req.query);
  const search = params.search?.toLowerCase();
  const filtered = getPublicRecords().filter((record) => {
    const categoryMatches =
      !params.category || record.category === params.category;
    const text = `${record.title} ${record.subtitle} ${record.location}`.toLowerCase();
    return categoryMatches && (!search || text.includes(search));
  });
  const start = (params.page - 1) * params.pageSize;
  res.json(
    ListPublicRecordsResponse.parse({
      items: filtered.slice(start, start + params.pageSize),
      total: filtered.length,
      page: params.page,
      pageSize: params.pageSize,
    }),
  );
});

router.get("/public/records/:id", (req, res) => {
  const { id } = GetPublicRecordParams.parse(req.params);
  const record = getPublicRecords().find((item) => item.id === id);
  if (!record) {
    res.status(404).json({ error: "Không tìm thấy bản ghi" });
    return;
  }
  res.json(GetPublicRecordResponse.parse(record));
});

router.get("/applications", (req, res) => {
  const params = ListApplicationsQueryParams.parse(req.query);
  const search = params.search?.toLowerCase();
  const result = getApplications().filter((app) => {
    const matchesStatus = !params.status || app.status === params.status;
    const matchesType = !params.type || app.type === params.type;
    const text = `${app.reference} ${app.applicantName} ${app.address}`.toLowerCase();
    return matchesStatus && matchesType && (!search || text.includes(search));
  });
  res.json(ListApplicationsResponse.parse(result));
});

router.post("/applications", (req, res) => {
  const input = CreateApplicationBody.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "Thông tin hồ sơ chưa hợp lệ", details: input.error.flatten() });
    return;
  }
  const created = createApplication(input.data);
  res.status(201).json(created);
});

router.get("/applications/:id", (req, res) => {
  const { id } = GetApplicationParams.parse(req.params);
  const application = getApplications().find((item) => item.id === id);
  if (!application) {
    res.status(404).json({ error: "Không tìm thấy hồ sơ" });
    return;
  }
  res.json(GetApplicationResponse.parse(application));
});

router.patch("/applications/:id/review", (req, res) => {
  const { id } = ReviewApplicationParams.parse(req.params);
  const input = ReviewApplicationBody.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "Thông tin xét duyệt chưa hợp lệ", details: input.error.flatten() });
    return;
  }
  const application = reviewApplication(id, input.data);
  if (!application) {
    res.status(404).json({ error: "Không tìm thấy hồ sơ" });
    return;
  }
  res.json(ReviewApplicationResponse.parse(application));
});

router.get("/criteria", (req, res) => {
  const params = GetCriteriaQueryParams.parse(req.query);
  res.json(GetCriteriaResponse.parse(getCriteria(params.type, params.version)));
});

router.patch("/criteria/:type", (req, res) => {
  const params = UpdateCriteriaParams.parse(req.params);
  const input = UpdateCriteriaBody.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "Bộ tiêu chí chưa hợp lệ", details: input.error.flatten() });
    return;
  }
  try {
    res.json(UpdateCriteriaResponse.parse(updateCriteria(params.type, input.data)));
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Không thể lưu bộ tiêu chí" });
  }
});

router.get("/criteria/:type/history", (req, res) => {
  const params = ListCriteriaHistoryParams.parse(req.params);
  res.json(ListCriteriaHistoryResponse.parse(listCriteriaHistory(params.type)));
});

router.get("/admin/summary", (_req, res) => {
  const apps = getApplications();
  const byType = apps.reduce<Record<string, number>>((counts, app) => {
    counts[app.type] = (counts[app.type] ?? 0) + 1;
    return counts;
  }, {});
  res.json(
    GetAdminSummaryResponse.parse({
      pending: apps.filter((app) => app.status === "pending").length,
      needsMoreInfo: apps.filter((app) => app.status === "needs-more-info").length,
       approved: apps.filter((app) => app.status === "approved").length,
       warning: apps.filter((app) => app.status === "warning").length,
       stopped: apps.filter((app) => app.status === "stopped").length,
      rejected: apps.filter((app) => app.status === "rejected").length,
      total: apps.length,
      byType,
    }),
  );
});

router.get("/suppliers", (_req, res) => {
  const suppliers = getApplications()
    .filter(
      (app) =>
        app.type === "food-supplier" || app.type === "meal-provider",
    )
    .map((app) => ({
      id: app.id,
      name: app.applicantName,
      taxCode: String(app.data.taxCode ?? ""),
      phone: app.contact,
      verified: app.status === "approved",
    }));
  res.json(ListApprovedSuppliersResponse.parse(suppliers));
});

export default router;

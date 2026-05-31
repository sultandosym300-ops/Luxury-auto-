import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";

// Admin
import adminAuthRouter from "./admin/auth";
import adminBookingsRouter from "./admin/bookings";
import adminServicesRouter from "./admin/services";
import adminTechniciansRouter from "./admin/technicians";
import adminCustomersRouter from "./admin/customers";
import adminAnalyticsRouter from "./admin/analytics";
import adminPortfolioRouter from "./admin/portfolio";
import adminSettingsRouter from "./admin/settings";

// Portal (authenticated customers)
import portalBookingsRouter from "./portal/bookings";
import portalVehiclesRouter from "./portal/vehicles";
import portalNotificationsRouter from "./portal/notifications";

// Public
import publicServicesRouter from "./public/services";
import publicTechniciansRouter from "./public/technicians";
import publicPortfolioRouter from "./public/portfolio";
import publicBookingsRouter from "./public/bookings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);

router.use(adminAuthRouter);
router.use(adminBookingsRouter);
router.use(adminServicesRouter);
router.use(adminTechniciansRouter);
router.use(adminCustomersRouter);
router.use(adminAnalyticsRouter);
router.use(adminPortfolioRouter);
router.use(adminSettingsRouter);

router.use(portalBookingsRouter);
router.use(portalVehiclesRouter);
router.use(portalNotificationsRouter);

router.use(publicServicesRouter);
router.use(publicTechniciansRouter);
router.use(publicPortfolioRouter);
router.use(publicBookingsRouter);

export default router;

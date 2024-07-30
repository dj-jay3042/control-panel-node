const MySQL = require('../utils/db/Mysql');
const tables = require('../config/tables');
const Logger = require('../utils/logs/Logger');

/**
 * @class RoutesController
 * @description Controller class for handling route fetching and menu hierarchy building.
 */
class RoutesController {
    static async getRoutes(req, res) {
        const db = new MySQL();

        try {
            await db.connect();
            const routesDetails = await db.table(tables.TBL_ROUTES).select('*').get();
            const routes = routesDetails.map(route => ({
                path: route.routeUrl,
                element: route.routeComponentName,
                layout: route.routeTarget == "1" ? "blank" : "",
                componentLocation: route.routeComponentLocation,
                isPrivate: route.routeIsPrivate == "1",
            }));
            res.status(200).json(routes);
        } catch (error) {
            const logger = new Logger();
            logger.write("Error in fetching routes: " + error, "routes/error");
            res.status(500).json({ message: 'Oops! Something went wrong!' });
        } finally {
            await db.disconnect();
        }
    }

    static async getMenuItems(req, res) {
        try {
            const menuItems = await RoutesController.buildMenuHierarchy();
            res.status(200).json(menuItems);
        } catch (error) {
            const logger = new Logger();
            logger.write("Error in fetching menu: " + error, "routes/error");
            res.status(500).json({ message: 'Oops! Something went wrong!' });
        }
    }

    static async buildMenuHierarchy() {
        const db = new MySQL();
        let result = [];

        try {
            await db.connect();
            const menuDetails = await db.table(tables.TBL_MENU_ITEMS + ' m')
                .join(tables.TBL_ROUTES + ' r', 'r.routeId=m.menuRouteId')
                .select('m.menuId', 'm.menuTitle', 'm.menuSvg', 'm.menuType', 'r.routeUrl', 'm.menuParentId', 'm.menuIsActive')
                .where('m.menuIsActive', 1)
                .get();

            const menuMap = {};
            const rootMenus = [];

            menuDetails.forEach(menu => {
                menuMap[menu.menuId] = {
                    menuTitle: menu.menuTitle,
                    menuSvg: menu.menuSvg,
                    menuType: menu.menuType,
                    menuRoute: menu.routeUrl,
                    menuParentId: menu.menuParentId,
                    menuIsActive: menu.menuIsActive,
                    children: []
                };
            });

            menuDetails.forEach(menu => {
                if (menu.menuParentId === null) {
                    rootMenus.push(menuMap[menu.menuId]);
                } else {
                    if (menuMap[menu.menuParentId]) {
                        menuMap[menu.menuParentId].children.push(menuMap[menu.menuId]);
                    }
                }
            });

            result = rootMenus;
        } catch (error) {
            const logger = new Logger();
            logger.write("Error in fetching menu: " + error, "routes/error");
            result = false;
        } finally {
            await db.disconnect();
        }
        return result;
    }
}

module.exports = RoutesController;

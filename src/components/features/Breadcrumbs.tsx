import { Link, useLocation } from "react-router-dom";

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-3 text-slate-400"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.5 3l5 5-5 5" />
    </svg>
  );
}

/**
 * Route definition (intent-based, not raw URL parsing)
 */
export interface BreadcrumbRoute {
  label: string;
  path: string; // can include :params
  parent?: string; // key of parent route
}

/**
 * Override per resolved path
 */
interface RouteOverride {
  label?: string;
  href?: string;
}

interface BreadcrumbsProps {
  routes: Record<string, BreadcrumbRoute>;
  overrides?: Record<string, RouteOverride>;
  className?: string;
}

/**
 * Find which route matches current pathname
 */
function matchRoute(
  routes: Record<string, BreadcrumbRoute>,
  pathname: string,
): string | null {
  for (const [key, route] of Object.entries(routes)) {
    const regex = new RegExp("^" + route.path.replace(/:\w+/g, "[^/]+") + "$");

    if (regex.test(pathname)) {
      return key; // IMPORTANT: return KEY
    }
  }
  return null;
}
/**
 * Build chain using parent pointers
 */

// function buildChain(
//   routes: Record<string, BreadcrumbRoute>,
//   key: string,
// ): BreadcrumbRoute[] {
//   const chain: BreadcrumbRoute[] = [];

//   let currentKey: string | undefined = key;

//   while (currentKey) {
//     const node: BreadcrumbRoute | undefined = routes[currentKey];
//     if (!node) break;

//     chain.unshift(node);
//     currentKey = node.parent;
//   }

//   return chain;
// }

function buildChain(
  routes: Record<string, BreadcrumbRoute>,
  key: string,
): BreadcrumbRoute[] {
  const chain: BreadcrumbRoute[] = [];
  let currentKey: string | undefined = key;

  while (currentKey) {
    const node: BreadcrumbRoute | undefined = routes[currentKey];
    if (!node) break;
    chain.unshift(node);
    currentKey = node.parent;
  }

  // Auto-prepend root if chain doesn't already start there
  const rootRoute = Object.values(routes).find(
    (r) => r.path === "/" && !r.parent,
  );
  if (rootRoute && chain[0] !== rootRoute) {
    chain.unshift(rootRoute);
  }

  return chain;
}

export function Breadcrumbs({
  routes,
  overrides = {},
  className,
}: BreadcrumbsProps) {
  const { pathname } = useLocation();

  const matchedKey = matchRoute(routes, pathname);
  if (!matchedKey) return null;

  const chain = buildChain(routes, matchedKey);

  const crumbs = chain.map((node, index) => {
    const isLast = index === chain.length - 1;

    const override = overrides[node.path];

    const href = override?.href ?? node.path;

    return {
      label: override?.label ?? node.label,
      href: isLast ? undefined : href,
      isCurrentPage: isLast,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center text-sm gap-1">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;

          return (
            <li key={i} className="flex items-center gap-1">
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  className="text-slate-500 hover:text-slate-900"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-900">
                  {crumb.label}
                </span>
              )}

              {!isLast && <ChevronIcon />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

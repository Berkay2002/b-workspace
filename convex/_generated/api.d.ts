/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as blocks from "../blocks.js";
import type * as calendar_actions from "../calendar/actions.js";
import type * as calendar_index from "../calendar/index.js";
import type * as calendar_internal from "../calendar/internal.js";
import type * as calendar_mutations from "../calendar/mutations.js";
import type * as calendar_queries from "../calendar/queries.js";
import type * as calendar from "../calendar.js";
import type * as files from "../files.js";
import type * as pages from "../pages.js";
import type * as pageVisits from "../pageVisits.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  blocks: typeof blocks;
  "calendar/actions": typeof calendar_actions;
  "calendar/index": typeof calendar_index;
  "calendar/internal": typeof calendar_internal;
  "calendar/mutations": typeof calendar_mutations;
  "calendar/queries": typeof calendar_queries;
  calendar: typeof calendar;
  files: typeof files;
  pages: typeof pages;
  pageVisits: typeof pageVisits;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

// import React from "react";
// import { useMemo } from "react";
// import {
//   assetsCardData,
//   jobsCardData,
//   actionCardData,
// } from "@/data/dashboardCardData";
// import { TrendingDown, TrendingUp } from "lucide-react";

// import type {
//   JobAPIResponse,
//   AssetAPIResponse,
//   ActionAPIResponse,
// } from "@/schemas";
// import { useGetAll } from "@/utils/api";
// import { getJobsCardValues } from "@/utils/getJobsCardValues";
// import { getAssetCardValues } from "@/utils/getAssetCardValues";
// import { getActionCardValues } from "@/utils/getActionCardValues";

// const CardItem = () => {
//   // $ Jobs Data
//   const { data: requests = [], isPending } = useGetAll<JobAPIResponse[]>(
//     "maintenance-requests-list",
//     ["maintenanceRequests"],
//   );

//   // const location = requests[0].location;
//   // $ Assets Data
//   const { data: assets = [] } = useGetAll<AssetAPIResponse[]>("assets-list", [
//     "assetRequests",
//   ]);

//   // $ Actions Data
//   const { data: actions = [] } = useGetAll<ActionAPIResponse[]>(
//     "maintenance-actions-list",
//     ["actionRequests"],
//   );

//   // $ Get the job metrics from the data returned from the database
//   const jobMetrics = useMemo(() => getJobsCardValues(requests), [requests]);

//   // $ Get the asset metrics from the data returned from the database
//   const assetsMetrics = useMemo(() => getAssetCardValues(assets), [assets]);

//   // $ Get the action metrics from the data returned from the database
//   const actionMetrics = useMemo(() => getActionCardValues(actions), [actions]);

//   if (isPending) return <div>Loading...</div>;

//   return (
//     <>
//     </>
//   );
// };

// export default CardItem;

// {/* {jobsCardData.map((card) => {
//   const metric = jobMetrics[card.id];
//   return (
//     <div key={card.id} className="w-full relative">
//       <div
//         className="
//         flex flex-col justify-between
//         gap-2 xl:gap-3 w-full
//         rounded-md shadow-md
//         bg-white dark:bg-[#1d2739]
//         text-gray-600 dark:text-white
//         p-[0.325rem] xl:p-2
//         bordee border-white dark:border-[rgba(55,65,81,0.5)]
//       "
//       >
//         {/* Card Title & Value */}
//         <div className="p-1">
//           <p className="capitalize text-sm xl:text-md">{card.title}</p>
//           <p className="text-[2rem] md:text-[2.5rem]">{metric.value}</p>
//         </div>

//         {/* Card Trend Indicator */}
//         <div
//           className={`
//           flex items-center gap-2 self-end w-full
//           text-[0.725rem] xl:text-[0.825rem]
//           ${metric.valueChange > 0 ? "text-green-500" : "text-red-500"}
//         `}
//         >
//           {metric.valueChange > 0 ? (
//             <TrendingUp size={16} />
//           ) : (
//             <TrendingDown size={16} />
//           )}
//           <span>
//             {metric.valueChange}%{" "}
//             <span className="opacity-80">from last month</span>
//           </span>
//         </div>
//       </div>
//       {/* Card Icon */}
//       <div
//         className={`flex items-center justify-center absolute size-18 top-1/2 right-[5%] -translate-y-1/2 rounded-full p-2 xl:p-3`}
//         style={{
//           color: card.color,
//           backgroundColor: card.bgColor,
//         }}
//       >
//         {React.createElement(card.icon, { size: 32 })}
//       </div>
//     </div>
//   );
// })}

// {/* // $ ================================== Action =============================== */}
// {actionCardData.map((action) => {
//   const actionMetric = actionMetrics[action.id];
//   return (
//     <div key={action.id} className="w-full relative">
//       <div
//         className="
//         flex flex-col justify-between
//         gap-2 xl:gap-3 w-full
//         rounded-md shadow-md
//         bg-white dark:bg-[#1d2739]
//         text-gray-600 dark:text-white
//         p-[0.325rem] xl:p-2
//         bordee border-white dark:border-[rgba(55,65,81,0.5)]
//       "
//       >
//         {/* Card Title & Value */}
//         <div className="p-1">
//           <p className="capitalize text-sm lg:text-md">{action.title}</p>
//           <p className="text-[2rem] md:text-[2.5rem]">
//             {actionMetric.value}
//           </p>
//         </div>

//         {/* Card Trend Indicator */}
//         <div
//           className={`
//           flex items-center gap-2 self-end w-full
//           text-[0.625rem] xl:text-[0.825rem]
//           ${actionMetric.valueChange > 0 ? "text-green-500" : "text-red-500"}
//         `}
//         >
//           {actionMetric.valueChange > 0 ? (
//             <TrendingUp size={16} />
//           ) : (
//             <TrendingDown size={16} />
//           )}
//           <span>
//             {actionMetric.valueChange}%{" "}
//             <span className="opacity-80">from last month</span>
//           </span>
//         </div>
//       </div>
//       {/* Card Icon */}
//       <div
//         className={`flex items-center justify-center absolute size-18 top-1/2 right-[5%] -translate-y-1/2 rounded-full p-2 xl:p-3 border border-white`}
//         style={{
//           color: action.color,
//           backgroundColor: action.bgColor,
//         }}
//       >
//         {React.createElement(action.icon, { size: 32 })}
//       </div>
//     </div>
//   );
// })}

// {/* // $ ================================== Assets ==================================== */}
// {assetsCardData.map((asset) => {
//   const metric = assetsMetrics[asset.id];
//   console.log("asset metric:", metric);
//   return (
//     <div key={asset.id} className="w-full relative">
//       <div
//         className="
//         flex flex-col justify-between
//         gap-2 xl:gap-3 w-full
//         rounded-md shadow-md
//         bg-white dark:bg-[#1d2739]
//         text-gray-600 dark:text-white
//         p-[0.325rem] xl:p-2
//         bordee border-white dark:border-[rgba(55,65,81,0.5)]
//       "
//       >
//         {/* Card Title & Value */}
//         <div className="p-1">
//           <p className="capitalize text-sm lg:text-md">{asset.title}</p>
//           <p className="text-[2rem] md:text-[2.5rem]">{metric.value}</p>
//         </div>

//         {/* Card Trend Indicator */}
//         <div
//           className={`
//           flex items-center gap-2 self-end w-full
//           text-[0.625rem] xl:text-[0.825rem]
//           ${metric.valueChange > 0 ? "text-green-500" : "text-red-500"}
//         `}
//         >
//           {metric.valueChange > 0 ? (
//             <TrendingUp size={16} />
//           ) : (
//             <TrendingDown size={16} />
//           )}
//           <span>
//             {metric.valueChange}%{" "}
//             <span className="opacity-80">from last month</span>
//           </span>
//         </div>
//       </div>
//       {/* Card Icon */}
//       <div
//         className={`flex items-center justify-center absolute size-18 top-1/2 right-[5%] -translate-y-1/2 rounded-full p-2 xl:p-3 border border-white`}
//         style={{
//           color: asset.color,
//           backgroundColor: asset.bgColor,
//         }}
//       >
//         {React.createElement(asset.icon, { size: 32 })}
//       </div>
//     </div>
//   );
// })} */}

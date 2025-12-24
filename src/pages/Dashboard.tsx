// import RevenueExpenseChart from "../charts/RevenueExpenseChart";
// // import ProjectSummaryTable from "../charts/ProjectSummaryTable";
// import Cards from "../dashboardCards/Cards";
// import TaskContainer from "../tasks/TasksContainer";
// import NotificationSidebar from "../notifications/NotificationBar";

import Sidebar from "@/components/dashboardSidebar/Sidebar";

const Dashboard = () => {
  return (
    <main className="w-full text-gray-700 dark:text-gray-100 h-screen">
      {/* <NotificationSidebar /> */}
      <Sidebar />

      {/* <section
        className="
        grid grid-cols-2 gap-4
        lg:grid-cols-3
        xl:grid-cols-4
        overflow-x-hidden
        h-full
        "
      > */}
      {/* Cards */}
      {/* <section className="col-span-2 lg:col-span-3 xl:col-span-4">
          {/* <Cards /> 
          </section> 
          */}

      {/* Revenue & Expense Chart */}
      {/* 
        <section
          className="
          col-span-2 xl:col-span-3
          h-[300px]
          rounded-md
          bg-white dark:bg-[#1d2739]
          border border-white dark:border-gray-700/50
            p-2
            shadow-sm
            text-gray-600 dark:text-gray-100
          "
        >
          {/* <RevenueExpenseChart />
        </section> 
        */}

      {/* Tasks
        <aside
          className="
            row-span-2
            col-span-2 lg:col-span-1
            self-start
            h-full
            overflow-y-auto
            rounded-md
            bg-white dark:bg-[#1d2739]
            border border-white dark:border-gray-700/50
            p-4
            shadow-sm
          "
        >
          {/* <TaskContainer />
        </aside>

        {/* Projects Table
        <section
          className="
            col-span-2 lg:col-span-2 xl:col-span-3
            self-start
            w-full min-w-0
            h-full
            overflow-y-auto
            rounded-md
            bg-white dark:bg-[#1d2739]
            border border-white dark:border-gray-700/50
            p-4
            shadow-sm
          "
        >
          {/* <ProjectSummaryTable /> 
        </section>
      </section>
          */}
    </main>
  );
};

export default Dashboard;

import useGlobalContext from "@/context/useGlobalContext";

const ChatSidebar = () => {
  const { openChatSidebar, setOpenChatSidebar } = useGlobalContext();

  console.log("from chat-sidebar:", openChatSidebar);
  return (
    <div
      className={`right-0 z-1000 w-80 fixed top-16 lg:top-(--lg-navbarHeight) h-(--sm-sidebarHeight) lg:h-(--lg-sidebarHeight) border-l border-l-gray-200 dark:border-r-[rgba(55,65,81,0.5)]
      bg-gray-200 dark:bg-bgdark transform transition-transform duration-200 ease-in lg:translate-x-0
    ${openChatSidebar ? "translate-x-0" : "translate-x-full ease-out"}`}
    >
      <div className="flex flex-col h-full gap-2 mt-6">
        <button
          className="hover:cursor-pointer absolute top-5 right-5 z-2000"
          type="button"
          onClick={() => setOpenChatSidebar(false)}
        >
          X
        </button>
        {/* Content */}
      </div>
    </div>
  );
};

export default ChatSidebar;

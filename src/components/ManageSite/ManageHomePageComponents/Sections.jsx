import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { getHomePageSections } from "../../../util/http";
import SectionItem from "./SectionItem";
import NyanLoader from "../../UI/NyanLoader";
import { HOME_PAGE_SECTIONS_PAGE_LIMIT } from "../../../util/constants";

function Sections() {
  const {
    data,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["homepagesections"],
    queryFn: ({ signal, pageParam }) =>
      getHomePageSections({
        page: pageParam,
        limit: HOME_PAGE_SECTIONS_PAGE_LIMIT,
        populate: "content.anime",
        selectPopulate: "names,thumbnail",
        signal,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.results === 0 ? null : pages.length + 1;
    },
    staleTime: 60000 * 5,
  });

  if (isError) console.log(error); // handle this error

  return (
    <div className="w-full flex flex-col space-y-10">
      {isPending && (
        <div className="flex items-center justify-center w-full py-10">
          <NyanLoader className="h-28 md:h-32" />
        </div>
      )}

      {data &&
        data.pages.map((page, pageIndex) => (
          <Fragment key={pageIndex}>
            {page.data.sections.map((section, index) => (
              <SectionItem
                section={section}
                key={section._id}
                index={index}
                pageIndex={pageIndex}
              />
            ))}
          </Fragment>
        ))}

      {hasNextPage && !isFetching && !isFetchingNextPage && (
        <div className="flex justify-center px-4 py-10 w-full">
          <button
            className="bg-[#007bff] hover:bg-[#1385ff] text-white px-10 py-3 text-lg font-bold rounded-lg active:scale-95 transition-all ease-in-out outline-none"
            onClick={fetchNextPage}
          >
            Load More Sections
          </button>
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center px-4 py-10 w-full">
          <NyanLoader className="h-16" />
        </div>
      )}

      {!isError && !isFetching && !isFetchingNextPage && !hasNextPage && (
        <div className="flex justify-center px-4 py-10 w-full">
          <p className="text-gray-300 text-sm md:text-base text-center">
            It looks like you have gone through all the sections 🙃
          </p>
        </div>
      )}
    </div>
  );
}

export default Sections;

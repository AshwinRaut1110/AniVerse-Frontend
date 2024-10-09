import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Fragment, useCallback, useRef } from "react";
import { getHomePageSections } from "../util/http";
import { HOME_PAGE_SECTIONS_PAGE_LIMIT } from "../util/constants";

function HomePage() {
  const {
    data,
    isLoading,
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
  });

  const observer = useRef(null);

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  // callback to attach an IntersectionObserver to the last section in the list
  const lastItemRef = useCallback(
    (node) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        const [lastSection] = entries;

        if (
          lastSection.isIntersecting &&
          !isLoading &&
          !isFetching &&
          !isFetchingNextPage &&
          hasNextPage &&
          !isError
        ) {
          fetchNextPage();
        }
      }, observerOptions);

      if (node) observer.current.observe(node);
    },
    [
      isLoading,
      isFetching,
      isFetchingNextPage,
      hasNextPage,
      isError,
      fetchNextPage,
    ]
  );

  if (isLoading) return <></>;

  if (error) {
    console.error(error);
    return <></>;
  }

  console.log(data);

  return (
    <div className="py-20 w-full">
      {data.pages.map((page, pageIndex) => (
        <Fragment key={pageIndex}>
          {page.data.sections.map((section, sectionIndex) => (
            <div
              className="h-96 w-[80%] my-5 mx-auto bg-red-400 border-2 border-white text-white"
              ref={
                pageIndex === data.pages.length - 1 &&
                sectionIndex === page.data.sections.length - 1
                  ? lastItemRef
                  : null
              }
              key={section._id}
            >
              {section.title}
            </div>
          ))}
        </Fragment>
      ))}
      {isFetchingNextPage && <p>Loading more sections...</p>}
    </div>
  );
}

export default HomePage;

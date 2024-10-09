import { HOME_PAGE_SECTIONS_PAGE_LIMIT } from "../../../util/constants";

export function swipeDownDataSetter(oldData, pageIndex, index) {
  // don't swap down the very last element in the list
  if (
    (pageIndex === oldData.pages.length - 1 &&
      index === oldData.pages[pageIndex].data.sections.length - 1) ||
    (pageIndex === oldData.pages.length - 2 &&
      oldData.pages[oldData.pages.length - 1].results === 0 &&
      index === oldData.pages[pageIndex].data.sections.length - 1)
  )
    return { updatedData: oldData, otherSectionId: null };

  let thisPageIndex = pageIndex,
    otherPageIndex = pageIndex;
  let thisSectionIndex = index,
    otherSectionIndex = index + 1;

  if (index === HOME_PAGE_SECTIONS_PAGE_LIMIT - 1) {
    otherPageIndex++;
    otherSectionIndex = 0;
  }

  const updatedData = JSON.parse(JSON.stringify(oldData));

  let temp = updatedData.pages[thisPageIndex].data.sections[thisSectionIndex];

  const otherSectionId =
    updatedData.pages[otherPageIndex].data.sections[otherSectionIndex]._id;

  updatedData.pages[thisPageIndex].data.sections[thisSectionIndex] =
    updatedData.pages[otherPageIndex].data.sections[otherSectionIndex];

  updatedData.pages[otherPageIndex].data.sections[otherSectionIndex] = temp;

  return { updatedData, otherSectionId };
}

export function swipeUpDataSetter(oldData, pageIndex, index) {
  let thisPageIndex = pageIndex,
    otherPageIndex = pageIndex;
  let thisSectionIndex = index,
    otherSectionIndex = index - 1;

  if (index === 0) {
    otherPageIndex--;
    otherSectionIndex = HOME_PAGE_SECTIONS_PAGE_LIMIT - 1;
  }

  const updatedData = JSON.parse(JSON.stringify(oldData));

  let temp = updatedData.pages[thisPageIndex].data.sections[thisSectionIndex];

  const otherSectionId =
    updatedData.pages[otherPageIndex].data.sections[otherSectionIndex]._id;

  updatedData.pages[thisPageIndex].data.sections[thisSectionIndex] =
    updatedData.pages[otherPageIndex].data.sections[otherSectionIndex];

  updatedData.pages[otherPageIndex].data.sections[otherSectionIndex] = temp;

  return { updatedData, otherSectionId };
}

export function deleteSectionDataSetter(oldData, pageIndex, index) {
  const combinedSectionsList = oldData.pages.flatMap(
    (page) => page.data.sections
  );

  const sectionIndex = pageIndex * HOME_PAGE_SECTIONS_PAGE_LIMIT + index;

  combinedSectionsList.splice(sectionIndex, 1);

  // if the last element is deleted
  if (combinedSectionsList.length === 0)
    return {
      pageParams: [1],
      pages: [
        {
          status: "success",
          results: 0,
          data: {
            sections: [],
          },
        },
      ],
    };

  const updatedData = {
    pageParams: [],
    pages: [],
  };

  // initialize the updatedData section
  const numberOfPages = Math.ceil(
    combinedSectionsList.length / HOME_PAGE_SECTIONS_PAGE_LIMIT
  );

  for (let i = 0; i < numberOfPages; i++) {
    updatedData.pages.push({
      status: "success",
      results: 0,
      data: {
        sections: [],
      },
    });

    updatedData.pageParams.push(i + 1);
  }

  // create the updated data object
  for (let i = 0; i < combinedSectionsList.length; i++) {
    const newPageIndex = parseInt(i / HOME_PAGE_SECTIONS_PAGE_LIMIT);

    updatedData.pages[newPageIndex].data.sections.push(combinedSectionsList[i]);

    updatedData.pages[newPageIndex].results++;
  }

  return updatedData;
}
